import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingStatus, Role } from '@prisma/client';
import { CreateBookingDto, CancelBookingDto } from './dto/booking.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateBookingDto) {
        const booking = await this.prisma.booking.create({
            data: {
                bookingNumber: `TD-${uuidv4().slice(0, 8).toUpperCase()}`,
                userId,
                type: dto.type,
                pickupAddress: dto.pickupAddress,
                pickupLat: dto.pickupLat,
                pickupLng: dto.pickupLng,
                dropAddress: dto.dropAddress,
                dropLat: dto.dropLat,
                dropLng: dto.dropLng,
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
                goodsType: dto.goodsType,
                goodsWeight: dto.goodsWeight,
                specialNote: dto.specialNote,
                statusLogs: {
                    create: { status: BookingStatus.PENDING, note: 'Booking created' },
                },
            },
            include: { statusLogs: true },
        });
        return { message: 'Booking created successfully', data: booking };
    }

    async findAll(userId: string, role: Role) {
        let where: any = {};

        if (role === Role.USER) {
            where = { userId };
        } else if (role === Role.DRIVER) {
            // Find driver profile first
            const driver = await this.prisma.driver.findUnique({ where: { userId } });
            if (driver) {
                where = {
                    OR: [
                        { status: BookingStatus.PENDING },
                        { driverId: driver.id }
                    ]
                };
            } else {
                where = { userId }; // Fallback
            }
        }
        // ADMIN and EMPLOYEE see everything (where = {})

        const bookings = await this.prisma.booking.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, phone: true } },
                driver: { select: { id: true, user: { select: { name: true, phone: true } } } },
                truck: { select: { id: true, name: true, category: true } },
                statusLogs: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Bookings fetched', data: bookings };
    }

    async findOne(id: string, userId: string, role: Role) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, phone: true, email: true } },
                driver: { include: { user: { select: { name: true, phone: true } } } },
                truck: { include: { images: true } },
                statusLogs: { orderBy: { createdAt: 'asc' } },
                quotations: { include: { driver: { include: { user: { select: { name: true, phone: true } } } } } },
                review: true,
            },
        });
        if (!booking) throw new NotFoundException('Booking not found');
        if (role === Role.USER && booking.userId !== userId) throw new ForbiddenException();
        return { message: 'Booking fetched', data: booking };
    }

    async cancel(id: string, userId: string, dto: CancelBookingDto) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.userId !== userId) throw new ForbiddenException();
        if (([BookingStatus.DELIVERED, BookingStatus.COMPLETED, BookingStatus.CANCELLED] as BookingStatus[]).includes(booking.status)) {
            throw new BadRequestException('This booking cannot be cancelled');
        }

        const updated = await this.prisma.booking.update({
            where: { id },
            data: {
                status: BookingStatus.CANCELLED,
                cancelReason: dto.reason,
                statusLogs: { create: { status: BookingStatus.CANCELLED, note: dto.reason || 'Cancelled by user' } },
            },
        });
        return { message: 'Booking cancelled', data: updated };
    }

    async driverAccept(bookingId: string, userId: string) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver) throw new BadRequestException('Driver profile not found');

        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.status !== BookingStatus.PENDING) throw new BadRequestException('Booking is not in pending state');

        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                driverId: driver.id,
                status: BookingStatus.ACCEPTED,
                statusLogs: { create: { status: BookingStatus.ACCEPTED, note: 'Driver accepted the booking' } },
            },
        });
        return { message: 'Booking accepted', data: updated };
    }

    async updateStatus(bookingId: string, userId: string, status: BookingStatus, note?: string) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver) throw new BadRequestException('Driver profile not found');

        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.driverId !== driver.id) throw new ForbiddenException();

        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status,
                statusLogs: { create: { status, note } },
            },
        });
        return { message: 'Status updated', data: updated };
    }

    async getTracking(bookingId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                statusLogs: { orderBy: { createdAt: 'asc' } },
                driver: { select: { currentLat: true, currentLng: true, isAvailable: true } },
            },
        });
        if (!booking) throw new NotFoundException('Booking not found');
        return { message: 'Tracking info fetched', data: booking };
    }
}
