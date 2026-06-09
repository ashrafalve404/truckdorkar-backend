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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, totalDrivers, totalTrucks, totalBookings, revenue, pendingDrivers, openTickets] = await Promise.all([
            this.prisma.user.count({ where: { role: 'USER' } }),
            this.prisma.driver.count(),
            this.prisma.truck.count(),
            this.prisma.booking.count(),
            this.prisma.booking.aggregate({
                where: { status: client_1.BookingStatus.COMPLETED },
                _sum: { finalFare: true },
            }),
            this.prisma.driver.count({ where: { status: client_1.DriverStatus.PENDING } }),
            this.prisma.supportTicket.count({ where: { status: client_1.TicketStatus.OPEN } }),
        ]);
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
                    totalBookings,
                    totalRevenue: revenue._sum.finalFare || 0,
                    pendingDrivers,
                    openTickets
                },
                bookingStats,
                recentBookings,
            },
        };
    }
    async getAllUsers(page = 1, limit = 20) {
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, phone: true, email: true, role: true, createdAt: true, isActive: true },
            }),
            this.prisma.user.count(),
        ]);
        return { message: 'Users fetched', data: { users, total, page, limit } };
    }
    async toggleUserStatus(id, isActive) {
        const user = await this.prisma.user.update({
            where: { id },
            data: { isActive },
        });
        return { message: `User ${isActive ? 'activated' : 'deactivated'}`, data: { id: user.id, isActive: user.isActive } };
    }
    async getAllBookings(page = 1, limit = 20) {
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
    async getAllDrivers(page = 1, limit = 20) {
        const [drivers, total] = await Promise.all([
            this.prisma.driver.findMany({
                skip: (page - 1) * limit,
                take: limit,
                include: { user: { select: { id: true, name: true, phone: true, email: true, isActive: true } } },
            }),
            this.prisma.driver.count(),
        ]);
        return { message: 'Drivers fetched', data: { drivers, total, page, limit } };
    }
    async verifyDriver(id, status, note) {
        const driver = await this.prisma.driver.update({
            where: { id },
            data: { status: status, verificationNote: note },
        });
        return { message: 'Driver status updated', data: driver };
    }
    async getSettings() {
        const settings = await this.prisma.cmsContent.findUnique({
            where: { key: 'SYSTEM_SETTINGS' }
        });
        const defaultSettings = {
            platformName: 'TruckDorkar',
            adminEmail: 'admin@truckdorkar.com',
            baseFarePerKm: 500
        };
        const stored = settings?.metaJson && typeof settings.metaJson === 'object'
            ? settings.metaJson
            : {};
        return {
            message: 'Settings fetched',
            data: { ...defaultSettings, ...stored }
        };
    }
    async updateSettings(settingsData) {
        const plainData = { ...settingsData };
        const existing = await this.prisma.cmsContent.findUnique({
            where: { key: 'SYSTEM_SETTINGS' }
        });
        const existingData = existing?.metaJson && typeof existing.metaJson === 'object'
            ? existing.metaJson
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map