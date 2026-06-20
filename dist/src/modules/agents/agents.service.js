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
    async getDashboard(userId) {
        const agent = await this.prisma.agent.findUnique({ where: { userId } });
        if (!agent)
            throw new common_1.NotFoundException('Agent profile not found');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [myTrucksCount, pendingTrucks, completedBookings, todayBookings] = await Promise.all([
            this.prisma.truck.count({ where: { registeredByAgentId: agent.id } }),
            this.prisma.truck.count({ where: { registeredByAgentId: agent.id, status: client_1.TruckStatus.PENDING } }),
            this.prisma.booking.findMany({
                where: { truck: { registeredByAgentId: agent.id }, status: client_1.BookingStatus.COMPLETED },
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
    async registerTruck(userId, data) {
        const agent = await this.prisma.agent.findUnique({ where: { userId } });
        if (!agent)
            throw new common_1.NotFoundException('Agent profile not found');
        if (!data.driverPhone)
            throw new common_1.NotFoundException('Driver phone number is required');
        const driverUser = await this.prisma.user.findFirst({
            where: { phone: data.driverPhone, role: 'DRIVER' }
        });
        if (!driverUser) {
            throw new common_1.NotFoundException('The provided phone number is not registered as a driver. Please ask the driver to register first.');
        }
        const driver = await this.prisma.driver.findFirst({ where: { userId: driverUser.id } });
        if (!driver) {
            throw new common_1.NotFoundException('Driver profile not found. Please ask the driver to complete their profile registration.');
        }
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
                status: client_1.TruckStatus.PENDING,
            },
        });
        const admins = await this.prisma.user.findMany({ where: { role: 'ADMIN' } });
        await Promise.all(admins.map(admin => this.prisma.notification.create({
            data: {
                userId: admin.id,
                type: 'SYSTEM',
                title: 'New Truck Registered',
                body: `Agent ${agent.agentId} has registered a new truck (${data.registrationNo}). Approval required.`,
                data: { truckId: truck.id, agentId: agent.id }
            }
        })));
        return {
            message: 'Truck registered and linked to driver',
            data: truck,
        };
    }
    async getAgentTrucks(userId) {
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
    async getAgentEarnings(userId) {
        const agent = await this.prisma.agent.findUnique({ where: { userId } });
        if (!agent)
            throw new common_1.NotFoundException('Agent profile not found');
        const completedBookings = await this.prisma.booking.findMany({
            where: {
                truck: { registeredByAgentId: agent.id },
                status: client_1.BookingStatus.COMPLETED,
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
            },
            orderBy: { createdAt: 'desc' },
        });
        const overview = agents.map((agt) => ({
            id: agt.id,
            agentId: agt.agentId,
            user: agt.user,
            nidNumber: agt.nidNumber,
            dateOfBirth: agt.dateOfBirth,
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