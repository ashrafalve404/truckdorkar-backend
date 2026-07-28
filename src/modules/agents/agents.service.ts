import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BookingStatus, TicketStatus, TruckStatus, DriverStatus, Role, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AgentsService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService
    ) { }

    async getDashboard(userId: string) {
        let agent = await this.prisma.agent.findUnique({ where: { userId } });
        if (!agent) throw new NotFoundException('Agent profile not found');

        // ── Daily Bonus Logic ──
        const now = new Date();
        const lastBonus = agent.lastDailyBonusAt;
        const isToday = (date: Date) => {
            const today = new Date();
            return (
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
            );
        };

        if (!lastBonus || !isToday(lastBonus)) {
            agent = await this.prisma.agent.update({
                where: { id: agent.id },
                data: {
                    walletBalance: { increment: 25 },
                    totalEarnings: { increment: 25 },
                    lastDailyBonusAt: now,
                }
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [myTrucksCount, pendingTrucks, completedBookings, todayBookings] = await Promise.all([
            this.prisma.truck.count({ where: { registeredByAgentId: agent.id } }),
            this.prisma.truck.count({ where: { registeredByAgentId: agent.id, status: TruckStatus.PENDING } }),
            this.prisma.booking.findMany({
                where: { truck: { registeredByAgentId: agent.id }, status: BookingStatus.COMPLETED },
                select: { agentCommission: true }
            }),
            this.prisma.booking.count({ where: { createdAt: { gte: today } } }),
        ]);

        const tripCommission = completedBookings.reduce((sum, b) => sum + (b.agentCommission || 0), 0);

        return {
            message: 'Agent dashboard summary',
            data: {
                counts: {
                    myTrucksCount,
                    pendingTrucks,
                    todayBookings,
                    totalTrips: completedBookings.length,
                    walletBalance: agent.walletBalance,
                    tripCommission: tripCommission,
                    totalEarnings: agent.totalEarnings,
                },
            },
        };
    }

    async findAll() {
        const agents = await this.prisma.agent.findMany({
            include: { user: { select: { id: true, name: true, phone: true, email: true, isActive: true } } },
        });
        return { message: 'Agents fetched', data: agents };
    }

    // ── Truck Registration by Agent ─────────────────────────────────────

    async registerTruck(userId: string, data: any) {
        // Find the agent record
        const agent = await this.prisma.agent.findUnique({ where: { userId } });
        if (!agent) throw new NotFoundException('Agent profile not found');

        // Find existing driver by phone - MUST ALREADY EXIST
        if (!data.driverPhone) throw new NotFoundException('Driver phone number is required');

        const driverUser = await this.prisma.user.findFirst({
            where: { phone: data.driverPhone, role: 'DRIVER' }
        });

        if (!driverUser) {
            throw new NotFoundException('The provided phone number is not registered as a driver. Please ask the driver to register first.');
        }

        const driver = await this.prisma.driver.findFirst({ where: { userId: driverUser.id } });
        if (!driver) {
            throw new NotFoundException('Driver profile not found. Please ask the driver to complete their profile registration.');
        }

        // Standardized Truck Type Mapping
        // data.category here will be the selected value from the new dropdown list (e.g. "T1_OPEN_7FT")
        const truckType = data.category;

        const truck = await this.prisma.truck.create({
            data: {
                driverId: driver.id,
                registeredByAgentId: agent.id,
                name: data.name,
                registrationNo: data.registrationNo,
                numberPlateText: data.numberPlateText,
                category: data.category,
                capacityTon: Number(data.capacityTon),
                lengthFt: Number(data.lengthFt),
                make: data.make,
                model: data.model,
                year: data.year ? Number(data.year) : undefined,
                color: data.color,
                description: data.description,
                roadPermitUrl: data.roadPermitUrl,
                taxTokenUrl: data.taxTokenUrl,
                blueBookUrl: data.blueBookUrl,
                numberPlateImageUrl: data.numberPlateImageUrl,
                drivingLicenseUrl: data.drivingLicenseUrl,
                truckType: truckType,
                status: TruckStatus.PENDING,
            } as any,
        });

        // Notify Admins for new truck registration
        const admins = await this.prisma.user.findMany({ where: { role: 'ADMIN' } });
        await Promise.all(admins.map(admin =>
            this.prisma.notification.create({
                data: {
                    userId: admin.id,
                    type: 'SYSTEM',
                    title: 'New Truck Registered',
                    body: `Agent ${agent.agentId} has registered a new truck (${data.registrationNo}). Approval required.`,
                    data: { truckId: truck.id, agentId: agent.id }
                }
            })
        ));

        return {
            message: 'Truck registered and linked to driver',
            data: truck,
        };
    }

    async getAgentTrucks(userId: string) {
        const agent = await this.prisma.agent.findUnique({ where: { userId } });
        if (!agent) throw new NotFoundException('Agent profile not found');

        const trucks = await this.prisma.truck.findMany({
            where: { registeredByAgentId: agent.id } as any,
            include: {
                driver: { include: { user: { select: { name: true, phone: true } } } },
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return { message: 'Agent trucks fetched', data: trucks };
    }

    async getAgentEarnings(userId: string) {
        const agent = await this.prisma.agent.findUnique({ where: { userId } });
        if (!agent) throw new NotFoundException('Agent profile not found');

        // Fetch bookings for trucks registered by this agent that are COMPLETED
        const completedBookings = await this.prisma.booking.findMany({
            where: {
                truck: { registeredByAgentId: agent.id },
                status: BookingStatus.COMPLETED,
            },
            include: {
                truck: { select: { name: true, registrationNo: true } },
                driver: { include: { user: { select: { name: true, phone: true } } } },
            },
            orderBy: { updatedAt: 'desc' },
        });

        const totalCommissions = completedBookings.reduce((sum, b) => sum + (b.agentCommission || 0), 0);

        return {
            message: 'Agent earnings fetched',
            data: {
                totalCommissions,
                totalTrips: completedBookings.length,
                trips: completedBookings.map(b => ({
                    id: b.id,
                    bookingNumber: b.bookingNumber,
                    truckName: b.truck?.name,
                    truckReg: b.truck?.registrationNo,
                    driverName: b.driver?.user?.name,
                    driverPhone: b.driver?.user?.phone,
                    fare: b.finalFare || b.estimatedFare || 0,
                    commission: b.agentCommission || 0,
                    completedAt: b.updatedAt,
                    distance: b.distance,
                }))
            }
        };
    }

    // ── Agent Withdrawal Requests ───────────────────────────────────────────

    async requestWithdrawal(userId: string, amount: number, bkashNumber: string) {
        if (!amount || amount < 5000) {
            throw new BadRequestException('Minimum withdrawal amount is ৳5,000');
        }

        if (!bkashNumber || bkashNumber.trim().length < 11) {
            throw new BadRequestException('Please provide a valid 11-digit bKash number');
        }

        const agent = await this.prisma.agent.findUnique({
            where: { userId },
            include: { user: { select: { name: true, phone: true } } }
        });
        if (!agent) throw new NotFoundException('Agent profile not found');

        const availableEarnings = agent.totalEarnings || 0;
        if (amount > availableEarnings) {
            throw new BadRequestException(`Insufficient total earnings. Available total earnings: ৳${availableEarnings.toLocaleString()}`);
        }

        const withdrawal = await this.prisma.agentWithdrawal.create({
            data: {
                agentId: agent.id,
                amount,
                bkashNumber: bkashNumber.trim(),
                method: 'bKash',
                status: 'PENDING'
            }
        });

        // Notify All Admins about the New Agent Withdrawal Request
        await this.notificationsService.notifyAdmins(
            NotificationType.PAYMENT,
            'New Agent Money Withdrawal Request 💸',
            `Agent ${agent.user?.name || 'Agent'} (${agent.user?.phone}) requested a withdrawal of ৳${amount.toLocaleString()} to bKash (${bkashNumber}).`,
            { withdrawalId: withdrawal.id, agentId: agent.id, amount, bkashNumber }
        );

        return { message: 'Withdrawal request submitted successfully', data: withdrawal };
    }

    async getMyWithdrawals(userId: string) {
        const agent = await this.prisma.agent.findUnique({ where: { userId } });
        if (!agent) throw new NotFoundException('Agent profile not found');

        const withdrawals = await this.prisma.agentWithdrawal.findMany({
            where: { agentId: agent.id },
            orderBy: { createdAt: 'desc' }
        });

        return { message: 'Withdrawal history fetched', data: withdrawals };
    }

    // ── Admin Operations ──────────────────────────────────────────────────

    async getAdminOverview() {
        const agents = await this.prisma.agent.findMany({
            include: {
                user: { select: { id: true, name: true, phone: true, email: true, avatar: true, isActive: true } },
                trucks: {
                    select: {
                        id: true,
                        name: true,
                        registrationNo: true,
                        status: true,
                        createdAt: true,
                    },
                },
            } as any,
            orderBy: { createdAt: 'desc' },
        });

        const overview = agents.map((agt: any) => ({
            id: agt.id,
            agentId: agt.agentId,
            user: agt.user,
            nidNumber: agt.nidNumber,
            nidFrontUrl: agt.nidFrontUrl,
            nidBackUrl: agt.nidBackUrl,
            verificationStatus: agt.verificationStatus,
            dateOfBirth: agt.dateOfBirth,
            department: agt.department,
            designation: agt.designation,
            trucksTotal: agt.trucks ? agt.trucks.length : 0,
            trucksPending: agt.trucks ? agt.trucks.filter((t: any) => t.status === 'PENDING').length : 0,
            trucksApproved: agt.trucks ? agt.trucks.filter((t: any) => t.status === 'APPROVED').length : 0,
            trucksRejected: agt.trucks ? agt.trucks.filter((t: any) => t.status === 'REJECTED').length : 0,
            recentTrucks: agt.trucks ? agt.trucks.slice(0, 3) : [],
        }));

        return { message: 'Admin agent overview fetched', data: overview };
    }

    async getTrucksByAgentId(agentId: string) {
        const trucks = await this.prisma.truck.findMany({
            where: { registeredByAgentId: agentId } as any,
            include: {
                driver: { include: { user: { select: { name: true, phone: true } } } },
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return { message: 'Agent trucks fetched', data: trucks };
    }

    async approveTruck(truckId: string, status: string, note?: string) {
        const truck = await this.prisma.truck.update({
            where: { id: truckId },
            data: { status: status as TruckStatus, approvalNote: note, isAvailable: status === 'APPROVED' },
        });
        return { message: `Truck ${status.toLowerCase()}`, data: truck };
    }

    async remove(agentId: string) {
        const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
        if (!agent) throw new NotFoundException('Agent not found');

        await this.prisma.user.update({
            where: { id: agent.userId },
            data: { isActive: false, deletedAt: new Date() }
        });

        return { message: 'Agent removed successfully' };
    }

    async getAgentProfile(userId: string) {
        const agent = await this.prisma.agent.findUnique({
            where: { userId },
            include: { user: { select: { name: true, phone: true, email: true, role: true } } }
        });
        if (!agent) throw new NotFoundException('Agent profile not found');
        return { message: 'Agent profile fetched', data: agent };
    }

    async updateNid(userId: string, data: { nidNumber: string, nidFrontUrl: string, nidBackUrl: string }) {
        const agent = await this.prisma.agent.findUnique({ where: { userId } });
        if (!agent) throw new NotFoundException('Agent profile not found');

        const updated = await this.prisma.agent.update({
            where: { id: agent.id },
            data: {
                nidNumber: data.nidNumber,
                nidFrontUrl: data.nidFrontUrl,
                nidBackUrl: data.nidBackUrl,
                verificationStatus: 'PENDING'
            }
        });

        // Notify Admins
        const admins = await this.prisma.user.findMany({ where: { role: 'ADMIN' } });
        await Promise.all(admins.map(admin =>
            this.prisma.notification.create({
                data: {
                    userId: admin.id,
                    type: 'SYSTEM',
                    title: 'Agent Verification Request',
                    body: `Agent ${agent.agentId || agent.nidNumber} has submitted NID documents for verification.`,
                    data: { agentId: agent.id }
                }
            })
        ));

        return { message: 'NID submitted for verification', data: updated };
    }

    async verifyAgent(agentId: string, status: string) {
        const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
        if (!agent) throw new NotFoundException('Agent profile not found');

        const updated = await this.prisma.agent.update({
            where: { id: agentId },
            data: { verificationStatus: status }
        });

        // Notify Agent
        await this.prisma.notification.create({
            data: {
                userId: agent.userId,
                type: 'SYSTEM',
                title: status === 'APPROVED' ? 'Verification Successful' : 'Verification Rejected',
                body: status === 'APPROVED'
                    ? 'Your NID has been verified. Welcome to our platform!'
                    : 'Your NID verification was rejected. Please re-upload correct documents.',
                data: { status }
            }
        });

        return { message: `Agent status updated to ${status}`, data: updated };
    }

    async createAgent(data: any) {
        const hashedPassword = await bcrypt.hash(data.password || 'TDAGENT123', 12);
        const agentId = `TDL-AG-${Math.floor(1000 + Math.random() * 9000)}`;

        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email,
                avatar: data.avatar || undefined,
                password: hashedPassword,
                role: Role.AGENT,
                isActive: true,
                agent: {
                    create: {
                        agentId: agentId,
                        designation: data.designation || 'Staff',
                        department: data.department || 'Truck Dorkar Limited',
                        nidNumber: data.nidNumber,
                        nidFrontUrl: data.nidFrontUrl || undefined,
                        nidBackUrl: data.nidBackUrl || undefined,
                        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                        verificationStatus: 'APPROVED'
                    }
                }
            },
            include: { agent: true }
        });

        return { message: 'Agent created successfully', data: user };
    }
}