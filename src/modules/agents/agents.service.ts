import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingStatus, TicketStatus, TruckStatus } from '@prisma/client';

@Injectable()
export class AgentsService {
    constructor(private prisma: PrismaService) { }

    async getDashboard() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [pendingDrivers, pendingTrucks, openTickets, todayBookings, recentTickets] = await Promise.all([
            this.prisma.driver.count({ where: { status: 'PENDING' } }),
            this.prisma.truck.count({ where: { status: 'PENDING' } }),
            this.prisma.supportTicket.count({ where: { status: TicketStatus.OPEN } }),
            this.prisma.booking.count({ where: { createdAt: { gte: today } } }),
            this.prisma.supportTicket.findMany({
                where: { status: { in: [TicketStatus.OPEN, TicketStatus.IN_PROGRESS] } },
                include: { user: { select: { name: true, phone: true } } },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
        ]);

        return {
            message: 'Agent dashboard summary',
            data: {
                counts: {
                    pendingDrivers,
                    pendingTrucks,
                    openTickets,
                    todayBookings,
                },
                recentTickets,
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
        if (data.driverUserId) {
            driver = await this.prisma.driver.findFirst({ where: { userId: data.driverUserId } });
        } else if (data.driverPhone) {
            const driverUser = await this.prisma.user.findFirst({ where: { phone: data.driverPhone } });
            if (driverUser) {
                driver = await this.prisma.driver.findFirst({ where: { userId: driverUser.id } });
            }
        }

        if (!driver) {
            throw new NotFoundException('Driver not found. Please provide a valid driver phone number or user ID.');
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
                status: TruckStatus.PENDING,
            } as any,
        });

        return { message: 'Truck registered for review', data: truck };
    }

    async getTrucksByAgent(userId: string) {
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
}