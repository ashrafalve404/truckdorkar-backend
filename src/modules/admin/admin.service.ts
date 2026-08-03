import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BookingStatus, DriverStatus, TicketStatus, Role, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService
    ) { }

    async getDashboardStats() {
        const [totalUsers, totalDrivers, totalTrucks, totalAgents, totalBookings, pendingDrivers, pendingTrucks, openTickets, receivedCommission, completedBookings] = await Promise.all([
            this.prisma.user.count({ where: { role: 'USER' } }),
            this.prisma.driver.count(),
            this.prisma.truck.count(),
            this.prisma.user.count({ where: { role: 'AGENT' } }),
            this.prisma.booking.count(),
            this.prisma.driver.count({ where: { status: DriverStatus.PENDING } }),
            this.prisma.truck.count({ where: { status: 'PENDING' } }),
            this.prisma.supportTicket.count({ where: { status: TicketStatus.OPEN } }),
            this.prisma.driver.aggregate({
                _sum: { paidCommission: true }
            }),
            this.prisma.booking.findMany({
                where: { status: BookingStatus.COMPLETED },
                select: { finalFare: true, estimatedFare: true, companyCommission: true },
            }),
        ]);

        const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.finalFare || b.estimatedFare || 0), 0);
        const companyRevenue = completedBookings.reduce((sum, b) => sum + (b.companyCommission || 0), 0);

        const bookingStats = await this.prisma.booking.groupBy({
            by: ['status'],
            _count: { _all: true },
        });

        const recentBookings = await this.prisma.booking.findMany({
            include: { user: { select: { name: true } }, driver: { select: { user: { select: { name: true } } } } },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });

        return {
            message: 'Dashboard stats fetched',
            data: {
                summary: {
                    totalUsers,
                    totalDrivers,
                    totalTrucks,
                    totalAgents,
                    totalBookings,
                    totalRevenue,
                    companyRevenue,
                    receivedCommission: (receivedCommission as any)._sum?.paidCommission || 0,
                    pendingDrivers,
                    pendingTrucks,
                    openTickets
                },
                bookingStats,
                recentBookings,
            },
        };
    }

    async getAllUsers(page: number = 1, limit: number = 20) {
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true,
                    avatar: true,
                    role: true,
                    createdAt: true,
                    isActive: true,
                    isPhoneVerified: true,
                    driver: { select: { nidNumber: true } },
                    agent: { select: { nidNumber: true } }
                },
            }),
            this.prisma.user.count(),
        ]);
        return { message: 'Users fetched', data: { users, total, page, limit } };
    }

    async createUser(dto: any) {
        const { name, phone, email, password, role } = dto;

        const phoneExists = await this.prisma.user.findUnique({ where: { phone } });
        if (phoneExists) throw new ConflictException('Phone number is already registered.');

        if (email && email.trim() !== '') {
            const emailExists = await this.prisma.user.findUnique({ where: { email } });
            if (emailExists) throw new ConflictException('Email is already registered.');
        }

        const hashed = await bcrypt.hash(password, 12);
        const targetRole = (role as Role) || Role.USER;

        const user = await this.prisma.user.create({
            data: {
                name,
                phone,
                email: (email && email.trim() !== '') ? email : null,
                password: hashed,
                role: targetRole,
                isPhoneVerified: true, // Direct creation by Admin: NO OTP NEEDED!
                isActive: true,
                ...(targetRole === Role.DRIVER && {
                    driver: {
                        create: {
                            status: DriverStatus.VERIFIED,
                        }
                    }
                }),
                ...(targetRole === Role.AGENT && {
                    agent: {
                        create: {
                            agentId: `TDL-AGENT-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`
                        }
                    }
                })
            },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                isPhoneVerified: true,
                createdAt: true,
            }
        });

        return { message: 'User created successfully from Admin Panel', data: user };
    }

    async toggleUserStatus(id: string, isActive: boolean) {
        const user = await this.prisma.user.update({
            where: { id },
            data: { isActive },
        });
        return { message: `User ${isActive ? 'activated' : 'deactivated'}`, data: { id: user.id, isActive: user.isActive } };
    }

    async getAllBookings(page: number = 1, limit: number = 20) {
        const [bookings, total] = await Promise.all([
            this.prisma.booking.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, phone: true } } },
            }),
            this.prisma.booking.count(),
        ]);
        return { message: 'Bookings fetched', data: { bookings, total, page, limit } };
    }

    async getAllDrivers(page: number = 1, limit: number = 20) {
        const [drivers, total] = await Promise.all([
            this.prisma.driver.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, name: true, phone: true, email: true, avatar: true, isActive: true } },
                    trucks: { select: { id: true, name: true, registrationNo: true, category: true, status: true, capacityTon: true, lengthFt: true } },
                    bookings: {
                        select: {
                            id: true,
                            bookingNumber: true,
                            pickupAddress: true,
                            dropAddress: true,
                            estimatedFare: true,
                            finalFare: true,
                            companyCommission: true,
                            status: true,
                            createdAt: true
                        },
                        orderBy: { createdAt: 'desc' }
                    }
                },
            }),
            this.prisma.driver.count(),
        ]);

        const driversWithBalance = (drivers as any[]).map(d => {
            const completedBookings = (d.bookings || []).filter((b: any) => b.status === BookingStatus.COMPLETED);
            const totalDue = completedBookings.reduce((sum: number, b: any) => sum + (b.companyCommission || 0), 0);
            return {
                ...d,
                totalDue,
                dueAmount: totalDue - d.paidCommission,
            };
        });

        return { message: 'Drivers fetched', data: { drivers: driversWithBalance, total, page, limit } };
    }

    async getPendingCommissionPayments() {
        return this.prisma.commissionPayment.findMany({
            where: { status: 'PENDING' },
            include: { driver: { include: { user: { select: { name: true, phone: true } } } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async approveCommissionPayment(id: string, adminNote?: string) {
        const result = await this.prisma.$transaction(async (tx) => {
            const payment = await tx.commissionPayment.findUnique({
                where: { id },
                include: { driver: true }
            });
            if (!payment) throw new Error('Payment record not found');
            if (payment.status !== 'PENDING') throw new Error('Payment is already processed');

            const updatedPayment = await tx.commissionPayment.update({
                where: { id },
                data: { status: 'APPROVED', adminNote }
            });

            await tx.driver.update({
                where: { id: payment.driverId },
                data: { paidCommission: { increment: payment.amount } }
            });

            return { updatedPayment, driverUserId: payment.driver.userId, amount: payment.amount, trxId: payment.transactionId };
        });

        // Notify Driver that their commission payment was approved
        if (result.driverUserId) {
            await this.notificationsService.create(
                result.driverUserId,
                NotificationType.SYSTEM,
                'Commission Payment Approved! 💰',
                `Your commission payment of ৳${result.amount.toLocaleString()} (TrxID: ${result.trxId}) has been approved by Admin.`,
                { paymentId: id, amount: result.amount }
            );
        }

        return result.updatedPayment;
    }

    async rejectCommissionPayment(id: string, adminNote?: string) {
        const payment = await this.prisma.commissionPayment.findUnique({
            where: { id },
            include: { driver: true }
        });
        if (!payment) throw new NotFoundException('Payment record not found');

        const updatedPayment = await this.prisma.commissionPayment.update({
            where: { id },
            data: { status: 'REJECTED', adminNote }
        });

        // Notify Driver that their commission payment was rejected
        if (payment.driver?.userId) {
            await this.notificationsService.create(
                payment.driver.userId,
                NotificationType.SYSTEM,
                'Commission Payment Rejected ❌',
                `Your commission payment request of ৳${payment.amount.toLocaleString()} (TrxID: ${payment.transactionId}) was rejected. ${adminNote ? `Note: ${adminNote}` : ''}`,
                { paymentId: id, amount: payment.amount }
            );
        }

        return updatedPayment;
    }

    async verifyDriver(id: string, status: string, note?: string) {
        const driver = await this.prisma.driver.update({
            where: { id },
            data: { status: status as DriverStatus, verificationNote: note },
        });
        return { message: 'Driver status updated', data: driver };
    }


    async getAllTrucks(page: number = 1, limit: number = 20, status?: string) {
        const where: any = { deletedAt: null };
        if (status) where.status = status;

        const [trucks, total] = await Promise.all([
            this.prisma.truck.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    driver: { include: { user: { select: { name: true, phone: true } } } },
                    registeredByAgent: { include: { user: { select: { name: true } } } },
                    images: { where: { isPrimary: true }, take: 1 },
                },
            }),
            this.prisma.truck.count({ where }),
        ]);
        return { message: 'Trucks fetched', data: { trucks, total, page, limit } };
    }

    async deleteUser(id: string) {
        // Due to Cascade in schema, this deletes driver/agent/addresses too
        await this.prisma.user.delete({ where: { id } });
        return { message: 'User and all related data permanently deleted' };
    }

    async deleteDriver(id: string) {
        // Find user linked to driver
        const driver = await this.prisma.driver.findUnique({ where: { id }, select: { userId: true } });
        if (driver) {
            await this.prisma.user.delete({ where: { id: driver.userId } });
        } else {
            await this.prisma.driver.delete({ where: { id } });
        }
        return { message: 'Driver and associated user permanently deleted' };
    }

    async deleteAgent(id: string) {
        const agent = await this.prisma.agent.findUnique({ where: { id }, select: { userId: true } });
        if (agent) {
            await this.prisma.user.delete({ where: { id: agent.userId } });
        } else {
            await this.prisma.agent.delete({ where: { id } });
        }
        return { message: 'Agent and associated user permanently deleted' };
    }

    async deleteTruck(id: string) {
        await this.prisma.truck.delete({ where: { id } });
        return { message: 'Truck permanently deleted' };
    }

    async getSettings() {
        const record = await this.prisma.cmsContent.findUnique({
            where: { key: 'SYSTEM_SETTINGS' }
        });
        const meta = record?.metaJson && typeof record.metaJson === 'object'
            ? record.metaJson as Record<string, any>
            : {};

        const defaultFares = [
            { id: "T1_OPEN_7_9FT", nameEn: "1 Ton Open 7/9 Ft Truck", nameBn: "১ টন খোলা ৭/৯ ফিট ট্রাক", minFare10km: 1000, capacityTon: 1.0, lengthFt: 9.0, farePerKm: 50, isActive: true },
            { id: "T1_COVER_7_9FT", nameEn: "1 Ton Cover 7/9 Ft Truck", nameBn: "১ টন কাভার ৭/৯ ফিট ট্রাক", minFare10km: 1000, capacityTon: 1.0, lengthFt: 9.0, farePerKm: 50, isActive: true },
            { id: "T1_5_OPEN_10_12FT", nameEn: "1.5 Ton Open 10/12 Ft Truck", nameBn: "১.৫ টন খোলা ১০/১২ ফিট ট্রাক", minFare10km: 1500, capacityTon: 1.5, lengthFt: 12.0, farePerKm: 60, isActive: true },
            { id: "T1_5_COVER_10_12FT", nameEn: "1.5 Ton Cover 10/12 Ft Truck", nameBn: "১.৫ টন কাভার ১০/১২ ফিট ট্রাক", minFare10km: 1500, capacityTon: 1.5, lengthFt: 12.0, farePerKm: 60, isActive: true },
            { id: "T3_OPEN_16_14FT", nameEn: "3 Ton Open 14/16 Ft Truck", nameBn: "৩ টন খোলা ১৪/১৬ ফিট ট্রাক", minFare10km: 3000, capacityTon: 3.0, lengthFt: 16.0, farePerKm: 75, isActive: true },
            { id: "T3_COVER_16_14FT", nameEn: "3 Ton Cover 14/16 Ft Truck", nameBn: "৩ টন কাভার ১৪/১৬ ফিট ট্রাক", minFare10km: 3000, capacityTon: 3.0, lengthFt: 16.0, farePerKm: 75, isActive: true }
        ];

        const fares = (meta.truckFares && Array.isArray(meta.truckFares)) ? meta.truckFares : defaultFares;

        // Return with sensible defaults if not yet configured
        return {
            message: 'Settings fetched',
            data: {
                platformName: meta.platformName || 'TruckDorkar',
                adminEmail: meta.adminEmail || 'admin@truckdorkar.com',
                baseFarePerKm: meta.baseFarePerKm || 500,
                truckFares: fares,
            }
        };
    }

    async updateSettings(settingsData: any) {
        // Spread into a plain object so Prisma's Json field serialises correctly
        // (passing a class-validator DTO instance directly can cause issues)
        const plainData = { ...settingsData };

        // Fetch existing settings to merge (preserve keys not in this update)
        const existing = await this.prisma.cmsContent.findUnique({
            where: { key: 'SYSTEM_SETTINGS' }
        });
        const existingData = existing?.metaJson && typeof existing.metaJson === 'object'
            ? existing.metaJson as Record<string, any>
            : {};

        const merged = { ...existingData, ...plainData };

        const settings = await this.prisma.cmsContent.upsert({
            where: { key: 'SYSTEM_SETTINGS' },
            update: { metaJson: merged },
            create: {
                key: 'SYSTEM_SETTINGS',
                metaJson: merged,
                titleEn: 'System Settings'
            }
        });
        return { message: 'Settings updated', data: settings.metaJson };
    }

    async createAdmin(dto: any) {
        const { name, email, phone, password } = dto;

        const emailExists = await this.prisma.user.findFirst({
            where: { email: email.toLowerCase() }
        });
        if (emailExists) throw new ConflictException('Email already registered');

        const phoneExists = await this.prisma.user.findUnique({
            where: { phone }
        });
        if (phoneExists) throw new ConflictException('Phone number already registered');

        const hashed = await bcrypt.hash(password, 12);

        const newAdmin = await this.prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                phone,
                password: hashed,
                role: Role.ADMIN,
                isActive: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        return { message: 'Admin created successfully', data: newAdmin };
    }

    async changeAdminPassword(adminId: string, dto: any) {
        const user = await this.prisma.user.findUnique({ where: { id: adminId } });
        if (!user || user.role !== Role.ADMIN) throw new NotFoundException('Admin user not found');

        const passwordMatches = await bcrypt.compare(dto.currentPassword, user.password || '');
        if (!passwordMatches) throw new BadRequestException('Current password is incorrect');

        const hashed = await bcrypt.hash(dto.newPassword, 12);

        await this.prisma.user.update({
            where: { id: adminId },
            data: {
                password: hashed,
                refreshToken: null
            }
        });

        return { message: 'Admin password changed successfully' };
    }

    // ── Admin Agent Withdrawal Operations ──────────────────────────────────

    async getAgentWithdrawals(status?: string) {
        const where: any = {};
        if (status) where.status = status;

        const withdrawals = await this.prisma.agentWithdrawal.findMany({
            where,
            include: {
                agent: {
                    include: {
                        user: { select: { name: true, phone: true, email: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return { message: 'Agent withdrawals fetched', data: withdrawals };
    }

    async approveAgentWithdrawal(id: string, adminNote?: string) {
        return this.prisma.$transaction(async (tx) => {
            const withdrawal = await tx.agentWithdrawal.findUnique({
                where: { id },
                include: { agent: true }
            });
            if (!withdrawal) throw new NotFoundException('Withdrawal request not found');
            if (withdrawal.status !== 'PENDING') throw new BadRequestException('Withdrawal request has already been processed');

            if ((withdrawal.agent.totalEarnings || 0) < withdrawal.amount) {
                throw new BadRequestException('Agent does not have sufficient total earnings');
            }

            // Deduct amount from agent's total earnings
            await tx.agent.update({
                where: { id: withdrawal.agentId },
                data: { totalEarnings: { decrement: withdrawal.amount } }
            });

            // Mark withdrawal status as APPROVED
            const updated = await tx.agentWithdrawal.update({
                where: { id },
                data: { status: 'APPROVED', adminNote }
            });

            // Send Notification to Agent
            await tx.notification.create({
                data: {
                    userId: withdrawal.agent.userId,
                    type: 'SYSTEM',
                    title: 'Money Withdrawal Request Approved! 💸',
                    body: `Your withdrawal request of ৳${withdrawal.amount.toLocaleString()} to bKash (${withdrawal.bkashNumber}) has been approved and disbursed.`,
                    data: { withdrawalId: id, amount: withdrawal.amount, bkashNumber: withdrawal.bkashNumber }
                }
            });

            return { message: 'Withdrawal request approved successfully', data: updated };
        });
    }

    async rejectAgentWithdrawal(id: string, adminNote?: string) {
        const withdrawal = await this.prisma.agentWithdrawal.findUnique({
            where: { id },
            include: { agent: true }
        });
        if (!withdrawal) throw new NotFoundException('Withdrawal request not found');

        const updated = await this.prisma.agentWithdrawal.update({
            where: { id },
            data: { status: 'REJECTED', adminNote }
        });

        // Send Notification to Agent
        await this.prisma.notification.create({
            data: {
                userId: withdrawal.agent.userId,
                type: 'SYSTEM',
                title: 'Money Withdrawal Request Rejected ❌',
                body: `Your withdrawal request of ৳${withdrawal.amount.toLocaleString()} to bKash (${withdrawal.bkashNumber}) was rejected. ${adminNote ? `Note: ${adminNote}` : ''}`,
                data: { withdrawalId: id, amount: withdrawal.amount }
            }
        });

        return { message: 'Withdrawal request rejected', data: updated };
    }
}
