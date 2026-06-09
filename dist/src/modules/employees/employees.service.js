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
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map