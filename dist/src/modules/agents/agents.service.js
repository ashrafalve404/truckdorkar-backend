"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AgentsService = class AgentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [pendingDrivers, pendingTrucks, openTickets, todayBookings, recentTickets] = await Promise.all([
            this.prisma.driver.count({ where: { status: 'PENDING' } }),
            this.prisma.truck.count({ where: { status: 'PENDING' } }),
            this.prisma.supportTicket.count({ where: { status: client_1.TicketStatus.OPEN } }),
            this.prisma.booking.count({ where: { createdAt: { gte: today } } }),
            this.prisma.supportTicket.findMany({
                where: { status: { in: [client_1.TicketStatus.OPEN, client_1.TicketStatus.IN_PROGRESS] } },
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
    async registerTruck(userId, data) {
        const agent = await this.prisma.agent.findUnique({ where: { userId } });
        if (!agent)
            throw new common_1.NotFoundException('Agent profile not found');
        let driver = null;
        let driverExisted = false;
        if (data.driverUserId) {
            driver = await this.prisma.driver.findFirst({ where: { userId: data.driverUserId } });
            if (driver)
                driverExisted = true;
        }
        else if (data.driverPhone) {
            let driverUser = await this.prisma.user.findFirst({ where: { phone: data.driverPhone } });
            if (driverUser) {
                driverExisted = true;
                driver = await this.prisma.driver.findFirst({ where: { userId: driverUser.id } });
                if (!driver) {
                    driver = await this.prisma.driver.create({
                        data: {
                            userId: driverUser.id,
                            status: client_1.DriverStatus.VERIFIED,
                        }
                    });
                }
            }
            else {
                const newDriverUser = await this.prisma.user.create({
                    data: {
                        phone: data.driverPhone,
                        name: data.name.split(' ')[0] + "'s Driver",
                        role: 'DRIVER',
                        password: '$2b$10$placeholderhashedpassword',
                        isActive: true,
                    }
                });
                driver = await this.prisma.driver.create({
                    data: {
                        userId: newDriverUser.id,
                        status: client_1.DriverStatus.VERIFIED,
                    }
                });
            }
        }
        if (!driver) {
            throw new common_1.NotFoundException('Could not identify or create a driver for this truck.');
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
                status: client_1.TruckStatus.PENDING,
            },
        });
        return {
            message: driverExisted
                ? 'Truck registered and linked to existing driver'
                : 'Truck registered and new driver account created',
            data: truck,
            info: driverExisted ? 'This driver phone is already registered in our system.' : undefined
        };
    }
    async getTrucksByAgent(userId) {
        const agent = await this.prisma.agent.findUnique({ where: { userId } });
        if (!agent)
            throw new common_1.NotFoundException('Agent profile not found');
        const trucks = await this.prisma.truck.findMany({
            where: { registeredByAgentId: agent.id },
            include: {
                driver: { include: { user: { select: { name: true, phone: true } } } },
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Agent trucks fetched', data: trucks };
    }
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
            },
            orderBy: { createdAt: 'desc' },
        });
        const overview = agents.map((agt) => ({
            id: agt.id,
            agentId: agt.agentId,
            user: agt.user,
            department: agt.department,
            designation: agt.designation,
            trucksTotal: agt.trucks ? agt.trucks.length : 0,
            trucksPending: agt.trucks ? agt.trucks.filter((t) => t.status === 'PENDING').length : 0,
            trucksApproved: agt.trucks ? agt.trucks.filter((t) => t.status === 'APPROVED').length : 0,
            trucksRejected: agt.trucks ? agt.trucks.filter((t) => t.status === 'REJECTED').length : 0,
            recentTrucks: agt.trucks ? agt.trucks.slice(0, 3) : [],
        }));
        return { message: 'Admin agent overview fetched', data: overview };
    }
    async getTrucksByAgentId(agentId) {
        const trucks = await this.prisma.truck.findMany({
            where: { registeredByAgentId: agentId },
            include: {
                driver: { include: { user: { select: { name: true, phone: true } } } },
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Agent trucks fetched', data: trucks };
    }
    async approveTruck(truckId, status, note) {
        const truck = await this.prisma.truck.update({
            where: { id: truckId },
            data: { status: status, approvalNote: note, isAvailable: status === 'APPROVED' },
        });
        return { message: `Truck ${status.toLowerCase()}`, data: truck };
    }
    async remove(agentId) {
        const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        await this.prisma.user.update({
            where: { id: agent.userId },
            data: { isActive: false, deletedAt: new Date() }
        });
        return { message: 'Agent removed successfully' };
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgentsService);
//# sourceMappingURL=agents.service.js.map