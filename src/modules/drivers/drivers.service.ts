import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateDriverProfileDto } from './dto/driver.dto';

@Injectable()
export class DriversService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        const driver = await this.prisma.driver.findUnique({
            where: { userId },
            include: { user: { select: { name: true, phone: true, email: true, avatar: true } }, trucks: true },
        });
        if (!driver) throw new NotFoundException('Driver profile not found');
        return { message: 'Driver profile fetched', data: driver };
    }

    async updateProfile(userId: string, dto: UpdateDriverProfileDto) {
        const driver = await this.prisma.driver.update({
            where: { userId },
            data: dto,
        });
        return { message: 'Driver profile updated', data: driver };
    }

    async uploadDocument(userId: string, type: string, url: string) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver) throw new NotFoundException('Driver not found');
        const data: any = {};
        if (type === 'nid_front') data.nidFront = url;
        else if (type === 'nid_back') data.nidBack = url;
        else if (type === 'license_front') data.licenseFront = url;
        else if (type === 'license_back') data.licenseBack = url;
        const updated = await this.prisma.driver.update({ where: { userId }, data });
        return { message: 'Document uploaded', data: updated };
    }

    async setAvailability(userId: string, isAvailable: boolean, lat?: number, lng?: number) {
        const driver = await this.prisma.driver.update({
            where: { userId },
            data: { isAvailable, currentLat: lat, currentLng: lng },
        });
        return { message: 'Availability updated', data: { isAvailable: driver.isAvailable } };
    }

    async getEarnings(userId: string) {
        const driver = await this.prisma.driver.findUnique({ where: { userId }, select: { totalEarnings: true, totalTrips: true, rating: true } });
        if (!driver) throw new NotFoundException('Driver not found');
        const recentBookings = await this.prisma.booking.findMany({
            where: { driver: { userId }, status: 'COMPLETED' },
            select: { id: true, bookingNumber: true, finalFare: true, createdAt: true },
            take: 10,
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Earnings fetched', data: { ...driver, recentBookings } };
    }

    async getDriverBookings(userId: string) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver) throw new NotFoundException('Driver not found');
        const bookings = await this.prisma.booking.findMany({
            where: { driverId: driver.id },
            include: { user: { select: { name: true, phone: true } }, truck: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Driver bookings fetched', data: bookings };
    }

    // Admin: get all drivers
    async findAll(query: { status?: string; page?: number; limit?: number }) {
        const { status, page = 1, limit = 20 } = query;
        const where: any = {};
        if (status) where.status = status;
        const [drivers, total] = await Promise.all([
            this.prisma.driver.findMany({
                where,
                include: { user: { select: { name: true, phone: true, email: true } }, trucks: { select: { id: true, name: true, status: true } } },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.driver.count({ where }),
        ]);
        return { message: 'Drivers fetched', data: { drivers, total, page, limit } };
    }

    async verifyDriver(driverId: string, status: string, note?: string) {
        const driver = await this.prisma.driver.update({
            where: { id: driverId },
            data: { status: status as any, verificationNote: note },
        });
        return { message: 'Driver status updated', data: driver };
    }
}
