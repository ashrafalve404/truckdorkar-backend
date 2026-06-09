import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingStatus, DriverStatus, TicketStatus } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const [totalUsers, totalDrivers, totalTrucks, totalBookings, revenue, pendingDrivers, openTickets] = await Promise.all([
            this.prisma.user.count({ where: { role: 'USER' } }),
            this.prisma.driver.count(),
            this.prisma.truck.count(),
            this.prisma.booking.count(),
            this.prisma.booking.aggregate({
                where: { status: BookingStatus.COMPLETED },
                _sum: { finalFare: true },
            }),
            this.prisma.driver.count({ where: { status: DriverStatus.PENDING } }),
            this.prisma.supportTicket.count({ where: { status: TicketStatus.OPEN } }),
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

    async getAllUsers(page: number = 1, limit: number = 20) {
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
                include: { user: { select: { id: true, name: true, phone: true, email: true, isActive: true } } },
            }),
            this.prisma.driver.count(),
        ]);
        return { message: 'Drivers fetched', data: { drivers, total, page, limit } };
    }

    async verifyDriver(id: string, status: string, note?: string) {
        const driver = await this.prisma.driver.update({
            where: { id },
            data: { status: status as DriverStatus, verificationNote: note },
        });
        return { message: 'Driver status updated', data: driver };
    }

    async getSettings() {
        const settings = await this.prisma.cmsContent.findUnique({
            where: { key: 'SYSTEM_SETTINGS' }
        });

        // Default settings if not found
        const defaultSettings = {
            platformName: 'TruckDorkar',
            adminEmail: 'admin@truckdorkar.com',
            baseFarePerKm: 500
        };

        // Merge stored settings over defaults so new fields always have a value
        const stored = settings?.metaJson && typeof settings.metaJson === 'object'
            ? settings.metaJson as Record<string, any>
            : {};

        return {
            message: 'Settings fetched',
            data: { ...defaultSettings, ...stored }
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
}
