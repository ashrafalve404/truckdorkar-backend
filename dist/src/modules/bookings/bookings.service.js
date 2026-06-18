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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
const uuid_1 = require("uuid");
let BookingsService = class BookingsService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async create(userId, dto) {
        const distanceKm = dto.distance || 0;
        const minFare = distanceKm <= 10 ? 1000 : 1000 + Math.ceil(distanceKm - 10) * 50;
        if ((dto.estimatedFare || 0) < minFare) {
            throw new common_1.BadRequestException(`Minimum fare for this trip distance is ${minFare} TK`);
        }
        const booking = await this.prisma.booking.create({
            data: {
                bookingNumber: `TD-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`,
                userId,
                type: dto.type,
                pickupAddress: dto.pickupAddress,
                pickupLat: dto.pickupLat,
                pickupLng: dto.pickupLng,
                dropAddress: dto.dropAddress,
                dropLat: dto.dropLat,
                dropLng: dto.dropLng,
                truckType: dto.truckType,
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
                goodsType: dto.goodsType,
                goodsWeight: dto.goodsWeight,
                specialNote: dto.specialNote,
                estimatedFare: dto.estimatedFare,
                distance: dto.distance,
                contactPhone: dto.contactPhone,
                statusLogs: {
                    create: { status: client_1.BookingStatus.PENDING, note: 'Booking created' },
                },
            },
            include: { statusLogs: true },
        });
        return { message: 'Booking created successfully', data: booking };
    }
    async findAll(userId, role) {
        let where = {};
        if (role === client_1.Role.USER) {
            where = { userId };
        }
        else if (role === client_1.Role.DRIVER) {
            const driver = await this.prisma.driver.findUnique({
                where: { userId },
                include: { trucks: { where: { status: client_1.TruckStatus.APPROVED } } }
            });
            if (driver) {
                const driverTruckTypes = driver.trucks.map(t => t.truckType).filter(Boolean);
                where = {
                    OR: [
                        { driverId: driver.id },
                        {
                            status: client_1.BookingStatus.PENDING,
                            truckType: { in: driverTruckTypes }
                        }
                    ]
                };
            }
            else {
                where = { userId };
            }
        }
        else if (role === client_1.Role.AGENT) {
            const agent = await this.prisma.agent.findUnique({ where: { userId } });
            if (agent) {
                where = {
                    truck: {
                        registeredByAgentId: agent.id
                    }
                };
            }
            else {
                where = { id: 'none' };
            }
        }
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
    async findOne(id, userId, role) {
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
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (role === client_1.Role.USER && booking.userId !== userId)
            throw new common_1.ForbiddenException();
        return { message: 'Booking fetched', data: booking };
    }
    async cancel(id, userId, dto) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.userId !== userId)
            throw new common_1.ForbiddenException();
        if ([client_1.BookingStatus.DELIVERED, client_1.BookingStatus.COMPLETED, client_1.BookingStatus.CANCELLED].includes(booking.status)) {
            throw new common_1.BadRequestException('This booking cannot be cancelled');
        }
        const updated = await this.prisma.booking.update({
            where: { id },
            data: {
                status: client_1.BookingStatus.CANCELLED,
                cancelReason: dto.reason,
                statusLogs: { create: { status: client_1.BookingStatus.CANCELLED, note: dto.reason || 'Cancelled by user' } },
            },
        });
        return { message: 'Booking cancelled', data: updated };
    }
    async driverAccept(bookingId, userId) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver)
            throw new common_1.BadRequestException('Driver profile not found');
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.status !== client_1.BookingStatus.PENDING)
            throw new common_1.BadRequestException('Booking is not in pending state');
        const matchingTruck = await this.prisma.truck.findFirst({
            where: {
                driverId: driver.id,
                truckType: booking.truckType,
                status: client_1.TruckStatus.APPROVED,
            }
        });
        if (!matchingTruck) {
            throw new common_1.BadRequestException('You do not have an approved truck that matches the required type.');
        }
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                driverId: driver.id,
                truckId: matchingTruck.id,
                status: client_1.BookingStatus.ACCEPTED,
                statusLogs: { create: { status: client_1.BookingStatus.ACCEPTED, note: `Driver accepted the booking with truck ${matchingTruck.name}` } },
            },
        });
        await this.notifications.create(booking.userId, client_1.NotificationType.BOOKING, 'Booking Accepted', `Your booking #${booking.bookingNumber} has been accepted by driver ${driver.id.slice(0, 5)}.`, { bookingId: booking.id });
        return { message: 'Booking accepted', data: updated };
    }
    async updateFare(id, userId, fare) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.userId !== userId)
            throw new common_1.ForbiddenException();
        if (booking.status !== client_1.BookingStatus.PENDING)
            throw new common_1.BadRequestException('Fare can only be updated for pending bookings');
        if (booking.distance !== null && booking.distance <= 10 && fare < 1000) {
            throw new common_1.BadRequestException('Minimum fare for trips up to 10km is 1000 TK');
        }
        const updated = await this.prisma.booking.update({
            where: { id },
            data: {
                estimatedFare: fare,
                statusLogs: { create: { status: booking.status, note: `User updated fare offer to ${fare} TK` } },
            },
        });
        return { message: 'Fare updated successfully', data: updated };
    }
    async updateStatus(bookingId, userId, status, note) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver)
            throw new common_1.BadRequestException('Driver profile not found');
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { truck: true }
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.driverId !== driver.id)
            throw new common_1.ForbiddenException();
        let agentCommission = undefined;
        if (status === client_1.BookingStatus.COMPLETED) {
            if (booking.truck?.registeredByAgentId) {
                const fare = booking.finalFare || booking.estimatedFare || 0;
                agentCommission = fare * 0.20;
            }
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            const currentBooking = await tx.booking.update({
                where: { id: bookingId },
                data: {
                    status,
                    agentCommission,
                    statusLogs: { create: { status, note } },
                },
                include: { truck: true }
            });
            if (status === client_1.BookingStatus.COMPLETED) {
                const fare = currentBooking.finalFare || currentBooking.estimatedFare || 0;
                const commissionVal = agentCommission || 0;
                const driverEarnings = fare - commissionVal;
                await tx.driver.update({
                    where: { id: driver.id },
                    data: {
                        totalTrips: { increment: 1 },
                        totalEarnings: { increment: driverEarnings }
                    }
                });
                if (commissionVal > 0 && currentBooking.truck?.registeredByAgentId) {
                    await tx.agent.update({
                        where: { id: currentBooking.truck.registeredByAgentId },
                        data: { totalEarnings: { increment: commissionVal } }
                    });
                }
            }
            return currentBooking;
        });
        return { message: 'Status updated', data: updated };
    }
    async getTracking(bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                statusLogs: { orderBy: { createdAt: 'asc' } },
                driver: { select: { currentLat: true, currentLng: true, isAvailable: true } },
            },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return { message: 'Tracking info fetched', data: booking };
    }
    async remove(id) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        await this.prisma.booking.delete({ where: { id } });
        return { message: 'Booking deleted successfully' };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map