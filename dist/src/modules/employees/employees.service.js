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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let EmployeesService = class EmployeesService {
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
            message: 'Employee dashboard summary',
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
        const employees = await this.prisma.employee.findMany({
            include: { user: { select: { name: true, phone: true, email: true, isActive: true } } },
        });
        return { message: 'Employees fetched', data: employees };
    }
    async registerTruck(userId, data) {
        const employee = await this.prisma.employee.findUnique({ where: { userId } });
        if (!employee)
            throw new common_1.NotFoundException('Employee profile not found');
        let driver = null;
        if (data.driverUserId) {
            driver = await this.prisma.driver.findFirst({ where: { userId: data.driverUserId } });
        }
        else if (data.driverPhone) {
            const driverUser = await this.prisma.user.findFirst({ where: { phone: data.driverPhone } });
            if (driverUser) {
                driver = await this.prisma.driver.findFirst({ where: { userId: driverUser.id } });
            }
        }
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found. Please provide a valid driver phone number or user ID.');
        }
        const truck = await this.prisma.truck.create({
            data: {
                driverId: driver.id,
                registeredByEmployeeId: employee.id,
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
        return { message: 'Truck registered for review', data: truck };
    }
    async getTrucksByEmployee(userId) {
        const employee = await this.prisma.employee.findUnique({ where: { userId } });
        if (!employee)
            throw new common_1.NotFoundException('Employee profile not found');
        const trucks = await this.prisma.truck.findMany({
            where: { registeredByEmployeeId: employee.id },
            include: {
                driver: { include: { user: { select: { name: true, phone: true } } } },
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Employee trucks fetched', data: trucks };
    }
    async getAdminOverview() {
        const employees = await this.prisma.employee.findMany({
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
        const overview = employees.map((emp) => ({
            id: emp.id,
            employeeId: emp.employeeId,
            user: emp.user,
            department: emp.department,
            designation: emp.designation,
            trucksTotal: emp.trucks ? emp.trucks.length : 0,
            trucksPending: emp.trucks ? emp.trucks.filter((t) => t.status === 'PENDING').length : 0,
            trucksApproved: emp.trucks ? emp.trucks.filter((t) => t.status === 'APPROVED').length : 0,
            trucksRejected: emp.trucks ? emp.trucks.filter((t) => t.status === 'REJECTED').length : 0,
            recentTrucks: emp.trucks ? emp.trucks.slice(0, 3) : [],
        }));
        return { message: 'Admin employee overview fetched', data: overview };
    }
    async getTrucksByEmployeeId(employeeId) {
        const trucks = await this.prisma.truck.findMany({
            where: { registeredByEmployeeId: employeeId },
            include: {
                driver: { include: { user: { select: { name: true, phone: true } } } },
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Employee trucks fetched', data: trucks };
    }
    async approveTruck(truckId, status, note) {
        const truck = await this.prisma.truck.update({
            where: { id: truckId },
            data: { status: status, approvalNote: note, isAvailable: status === 'APPROVED' },
        });
        return { message: `Truck ${status.toLowerCase()}`, data: truck };
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map