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

    // ── Admin Operations ──────────────────────────────────────────────────

    async getAdminOverview() {
        const agents = await this.prisma.agent.findMany({
            include: {
                user: { select: { id: true, name: true, phone: true, email: true, isActive: true } },
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
}