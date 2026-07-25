import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingStatus, DriverStatus, TicketStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

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
                    driver: { select: { nidNumber: true } },
                    agent: { select: { nidNumber: true } }
                },
            }),
            this.prisma.user.count(),
        ]);
        return { message: 'Users fetched', data: { users, total, page, limit } };
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
                include: {
                    user: { select: { id: true, name: true, phone: true, email: true, isActive: true } },
                    bookings: {
                        where: { status: BookingStatus.COMPLETED },
                        select: { companyCommission: true }
                    }
                },
            }),
            this.prisma.driver.count(),
        ]);

        const driversWithBalance = (drivers as any[]).map(d => {
            const totalDue = d.bookings.reduce((sum: number, b: any) => sum + (b.companyCommission || 0), 0);
            return {
                ...d,
                totalDue,
                dueAmount: totalDue - d.paidCommission,
                bookings: undefined
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
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.commissionPayment.findUnique({ where: { id } });
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

            return updatedPayment;
        });
    }

    async rejectCommissionPayment(id: string, adminNote?: string) {
        return this.prisma.commissionPayment.update({
            where: { id },
            data: { status: 'REJECTED', adminNote }
        });
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
}
