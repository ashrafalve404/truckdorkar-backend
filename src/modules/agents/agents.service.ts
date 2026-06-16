import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingStatus, TicketStatus, TruckStatus, DriverStatus } from '@prisma/client';

@Injectable()
export class AgentsService {
    constructor(private prisma: PrismaService) { }

    async getDashboard(userId: string) {
        const agent = await this.prisma.agent.findUnique({ where: { userId } });
        if (!agent) throw new NotFoundException('Agent profile not found');

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

        const totalCommission = completedBookings.reduce((sum, b) => sum + (b.agentCommission || 0), 0);

        return {
            message: 'Agent dashboard summary',
            data: {
                counts: {
                    myTrucksCount,
                    pendingTrucks,
                    totalCommission,
                    todayBookings,
                    totalTrips: completedBookings.length,
                },
            },
        };
    }

    async findAll() {
        const agents = await this.prisma.agent.findMany({
            include: { user: { select: { name: true, phone: true, email: true, isActive: true } } },
        });
        return { message: 'Agents fetched', data: agents };
    }

    // ── Truck Registration by Agent ─────────────────────────────────────

    async registerTruck(userId: string, data: any) {
        // Find the agent record
        const agent = await this.prisma.agent.findUnique({ where: { userId } });
        if (!agent) throw new NotFoundException('Agent profile not found');

        // Find or create a driver placeholder linked to a "fleet driver" user
        let driver: any = null;
        let driverExisted = false;

        if (data.driverUserId) {
            driver = await this.prisma.driver.findFirst({ where: { userId: data.driverUserId } });
            if (driver) driverExisted = true;
        } else if (data.driverPhone) {
            let driverUser = await this.prisma.user.findFirst({ where: { phone: data.driverPhone } });

            if (driverUser) {
                driverExisted = true;
                // User exists, find their driver profile
                driver = await this.prisma.driver.findFirst({ where: { userId: driverUser.id } });

                // If user exists but has no driver profile, create one
                if (!driver) {
                    driver = await this.prisma.driver.create({
                        data: {
                            userId: driverUser.id,
                            status: DriverStatus.VERIFIED, // Auto-verify if agent is adding them
                        }
                    });
                }
            } else {
                // User doesn't exist, create both User (Driver role) and Driver profile
                const newDriverUser = await this.prisma.user.create({
                    data: {
                        phone: data.driverPhone,
                        name: data.name.split(' ')[0] + "'s Driver", // Placeholder name
                        role: 'DRIVER',
                        password: '$2b$10$placeholderhashedpassword', // Should be a random or default password
                        isActive: true,
                    }
                });

                driver = await this.prisma.driver.create({
                    data: {
                        userId: newDriverUser.id,
                        status: DriverStatus.VERIFIED,
                    }
                });
            }
        }

        if (!driver) {
            throw new NotFoundException('Could not identify or create a driver for this truck.');
        }

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
                truckType: `${data.capacityTon}_ton_${data.category.toLowerCase().replace('_truck', '')}_${data.lengthFt}ft`,
                status: TruckStatus.PENDING,
            } as any,
        });

        return {
            message: driverExisted
                ? 'Truck registered and linked to existing driver'
                : 'Truck registered and new driver account created',
            data: truck,
            info: driverExisted ? 'This driver phone is already registered in our system.' : undefined
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

    // ── Admin Operations ──────────────────────────────────────────────────

    async getAdminOverview() {
        const agents = await this.prisma.agent.findMany({
            include: {
                user: { select: { name: true, phone: true, email: true, isActive: true } },
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
}