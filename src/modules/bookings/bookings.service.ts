import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingStatus, Role, TruckStatus, NotificationType } from '@prisma/client';
import { CreateBookingDto, CancelBookingDto } from './dto/booking.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingsService {
    constructor(
        private prisma: PrismaService,
        private notifications: NotificationsService
    ) { }
    async calculateMinFare(truckType: string | null | undefined, distanceKm: number): Promise<number> {
        const fallbacks = [
            { id: "T1_OPEN_7FT", minFare10km: 1000, farePerKm: 50 },
            { id: "T1_COVER_7FT", minFare10km: 1000, farePerKm: 50 },
            { id: "T1_OPEN_9FT", minFare10km: 1200, farePerKm: 55 },
            { id: "T1_COVER_9FT", minFare10km: 1200, farePerKm: 55 },
            { id: "T1_5_OPEN_12FT", minFare10km: 1500, farePerKm: 60 },
            { id: "T1_5_COVER_12FT", minFare10km: 1500, farePerKm: 60 }
        ];

        const settings = await this.prisma.cmsContent.findUnique({
            where: { key: 'SYSTEM_SETTINGS' }
        });
        const meta = settings?.metaJson && typeof settings.metaJson === 'object'
            ? settings.metaJson as Record<string, any>
            : {};
        const dbTruckFares = Array.isArray(meta.truckFares) ? meta.truckFares : [];

        const typeStr = truckType || "";

        let matched = dbTruckFares.find(tf => tf.id === typeStr);
        if (!matched) {
            matched = fallbacks.find(f => f.id === typeStr);
        }

        let minFare10km = 1000;
        let farePerKm = 50;

        if (matched) {
            minFare10km = matched.minFare10km;
            farePerKm = matched.farePerKm || Math.ceil(minFare10km * 0.05);
        } else {
            if (typeStr.startsWith('T1_5')) {
                minFare10km = 1500;
                farePerKm = 60;
            } else if (typeStr.startsWith('T3')) {
                minFare10km = 3000;
                farePerKm = 75;
            } else {
                minFare10km = 1000;
                farePerKm = 50;
            }
        }

        const baseFare = minFare10km;
        const extraPerKm = farePerKm;

        return distanceKm <= 10 ? baseFare : baseFare + Math.ceil(distanceKm - 10) * extraPerKm;
    }

    async create(userId: string, dto: CreateBookingDto) {
        const distanceKm = dto.distance || 0;
        const minFare = await this.calculateMinFare(dto.truckType, distanceKm);

        if ((dto.estimatedFare || 0) < minFare) {
            throw new BadRequestException(`Minimum fare for this trip distance and truck type is ${minFare} TK`);
        }

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
                truckType: dto.truckType,
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
                goodsType: dto.goodsType,
                goodsWeight: dto.goodsWeight,
                specialNote: dto.specialNote,
                estimatedFare: dto.estimatedFare,
                distance: dto.distance,
                contactPhone: dto.contactPhone,
                statusLogs: {
                    create: { status: BookingStatus.PENDING, note: 'Booking created' },
                },
            },
            include: { statusLogs: true },
        });

        // ── Notify drivers who have an approved truck matching this truckType ──────
        try {
            const matchingDrivers = await this.prisma.driver.findMany({
                where: {
                    trucks: {
                        some: {
                            truckType: dto.truckType,
                            status: TruckStatus.APPROVED,
                        }
                    }
                },
                include: {
                    user: { select: { id: true } },
                    bookings: {
                        where: { status: BookingStatus.COMPLETED },
                        select: { companyCommission: true }
                    }
                }
            });

            for (const driver of matchingDrivers) {
                if (!driver.user?.id) continue;

                const totalDue = driver.bookings.reduce((sum, b) => sum + (b.companyCommission || 0), 0);
                const unpaidCommission = totalDue - driver.paidCommission;

                let title = 'New Trip Available!';
                let body = `A new trip #${booking.bookingNumber} is available for your truck (${dto.truckType || 'Truck'}). Pickup: ${dto.pickupAddress}. Estimated Fare: ৳${dto.estimatedFare || minFare}.`;

                if (unpaidCommission > 0) {
                    body += ` Note: You have ৳${unpaidCommission.toFixed(2)} unpaid commission. Please clear your payment to accept this trip.`;
                }

                await this.notifications.create(
                    driver.user.id,
                    NotificationType.BOOKING,
                    title,
                    body,
                    { bookingId: booking.id, bookingNumber: booking.bookingNumber, unpaidCommission }
                );
            }
        } catch (err) {
            console.error("Failed to send new booking notifications to drivers:", err);
        }

        return { message: 'Booking created successfully', data: booking };
    }

    async findAll(userId: string, role: Role) {
        let where: any = {};

        if (role === Role.USER) {
            where = { userId };
        } else if (role === Role.DRIVER) {
            // Find driver profile first
            const driver = await this.prisma.driver.findUnique({
                where: { userId },
                include: { trucks: { where: { status: TruckStatus.APPROVED } } }
            });
            if (driver) {
                const driverTruckTypes = driver.trucks.map(t => (t as any).truckType).filter(Boolean) as string[];
                where = {
                    OR: [
                        { driverId: driver.id },
                        {
                            status: BookingStatus.PENDING,
                            truckType: { in: driverTruckTypes }
                        }
                    ]
                };
            } else {
                where = { userId }; // Fallback
            }
        } else if (role === Role.AGENT) {
            const agent = await this.prisma.agent.findUnique({ where: { userId } });
            if (agent) {
                where = {
                    truck: {
                        registeredByAgentId: agent.id
                    }
                };
            } else {
                where = { id: 'none' }; // Hide everything if no profile
            }
        }
        // ADMIN sees everything (where = {})

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
        if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestException('You can only cancel a booking that has not been accepted by a driver yet.');
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
        const driver = await this.prisma.driver.findUnique({
            where: { userId },
            include: { user: { select: { name: true } } }
        });
        if (!driver) throw new BadRequestException('Driver profile not found');

        // ── Commission check ──────────────────────────────────────────────────
        // Calculate total commission owed from completed trips
        const completedTrips = await this.prisma.booking.findMany({
            where: { driverId: driver.id, status: BookingStatus.COMPLETED },
            select: { companyCommission: true },
        });
        const totalDue = completedTrips.reduce((sum, b) => sum + (b.companyCommission || 0), 0);
        const currentBalance = totalDue - driver.paidCommission;

        if (currentBalance > 0) {
            throw new ForbiddenException(
                `You have an unpaid commission balance of ৳${currentBalance.toFixed(2)}. Please pay your commission and wait for admin approval before accepting new trips.`
            );
        }
        // ─────────────────────────────────────────────────────────────────────

        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.status !== BookingStatus.PENDING) throw new BadRequestException('Booking is not in pending state');

        // Find a matching approved truck for this driver
        const matchingTruck = await (this.prisma.truck as any).findFirst({
            where: {
                driverId: driver.id,
                truckType: booking.truckType,
                status: TruckStatus.APPROVED,
            }
        });

        if (!matchingTruck) {
            throw new BadRequestException('You do not have an approved truck that matches the required type.');
        }

        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                driverId: driver.id,
                truckId: matchingTruck.id,
                status: BookingStatus.ACCEPTED,
                statusLogs: { create: { status: BookingStatus.ACCEPTED, note: `Driver accepted the booking with truck ${matchingTruck.name}` } },
            },
        });

        // Send notification to user
        await this.notifications.create(
            booking.userId,
            NotificationType.BOOKING,
            'Booking Accepted',
            `Your booking #${booking.bookingNumber} has been accepted by driver ${driver.user?.name || 'Driver'}.`,
            { bookingId: booking.id }
        );

        return { message: 'Booking accepted', data: updated };
    }

    async updateFare(id: string, userId: string, fare: number) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.userId !== userId) throw new ForbiddenException();
        if (booking.status !== BookingStatus.PENDING) throw new BadRequestException('Fare can only be updated for pending bookings');

        const distanceKm = booking.distance || 0;
        const minFare = await this.calculateMinFare(booking.truckType, distanceKm);

        // Enforce min fare rule
        if (fare < minFare) {
            throw new BadRequestException(`Minimum fare for this trip is ${minFare} TK`);
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

    async updateStatus(bookingId: string, userId: string, status: BookingStatus, note?: string) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver) throw new BadRequestException('Driver profile not found');

        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { truck: true }
        });
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.driverId !== driver.id) throw new ForbiddenException();

        let agentCommission: number | undefined = undefined;
        let companyCommission: number | undefined = undefined;
        let driverEarnings: number | undefined = undefined;
        let referralCommission = 0;

        if (status === BookingStatus.COMPLETED) {
            const fare = booking.finalFare || booking.estimatedFare || 0;

            // Company always takes 10% of the fare as platform fee
            companyCommission = Math.round(fare * 0.10 * 100) / 100;

            // Driver always gets 90% of the fare (company's 10% cut never affects driver's share)
            driverEarnings = Math.round((fare - companyCommission) * 100) / 100;

            // Agent gets 20% of the company's 10% cut — ONLY if truck was registered by an agent
            if (booking.truck?.registeredByAgentId) {
                agentCommission = Math.round(companyCommission * 0.20 * 100) / 100;
            }

            // Referrer Driver gets 5% of trip fare (paid out of Company's 10% cut)
            if (driver.referredById) {
                referralCommission = Math.round(fare * 0.05 * 100) / 100;
            }
        }

        const updated = await this.prisma.$transaction(async (tx) => {
            const currentBooking = await tx.booking.update({
                where: { id: bookingId },
                data: {
                    status,
                    agentCommission,
                    companyCommission,
                    driverEarnings,
                    statusLogs: { create: { status, note } },
                } as any,
                include: { truck: true }
            });

            if (status === BookingStatus.COMPLETED) {
                // 1. Update Driver Profile (earnings and trip count)
                await tx.driver.update({
                    where: { id: driver.id },
                    data: {
                        totalTrips: { increment: 1 },
                        totalEarnings: { increment: driverEarnings || 0 }
                    }
                });

                // 2. Update Agent earnings if the truck belongs to an agent
                if (agentCommission && agentCommission > 0 && currentBooking.truck?.registeredByAgentId) {
                    await tx.agent.update({
                        where: { id: currentBooking.truck.registeredByAgentId },
                        data: { totalEarnings: { increment: agentCommission } }
                    });
                }

                // 3. Update Referrer Driver earnings if driver was referred by another driver
                if (referralCommission > 0 && driver.referredById) {
                    await tx.driver.update({
                        where: { id: driver.referredById },
                        data: {
                            referralEarnings: { increment: referralCommission },
                            totalEarnings: { increment: referralCommission }
                        }
                    });

                    // Create Referral Log
                    await tx.driverReferralLog.create({
                        data: {
                            referrerId: driver.referredById,
                            referredDriverId: driver.id,
                            bookingId,
                            tripFare: booking.finalFare || booking.estimatedFare || 0,
                            commissionAmount: referralCommission,
                        }
                    });

                    // Send Notification to Referrer
                    const referrerDriver = await tx.driver.findUnique({
                        where: { id: driver.referredById },
                        select: { userId: true }
                    });
                    if (referrerDriver) {
                        await tx.notification.create({
                            data: {
                                userId: referrerDriver.userId,
                                type: 'PAYMENT',
                                title: '🎉 Referral Bonus Received!',
                                body: `You earned ৳${referralCommission} (5% referral bonus) from a completed trip by a driver you referred!`,
                                data: { bookingId, fare: booking.finalFare || booking.estimatedFare || 0, referralCommission }
                            }
                        });
                    }
                }
            }
            return currentBooking;
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

    async remove(id: string) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking) throw new NotFoundException('Booking not found');
        await this.prisma.booking.delete({ where: { id } });
        return { message: 'Booking deleted successfully' };
    }
}
