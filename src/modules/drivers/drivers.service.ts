import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';
import { UpdateDriverProfileDto } from './dto/driver.dto';

@Injectable()
export class DriversService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService
    ) { }

    async getProfile(userId: string) {
        const driver = await this.prisma.driver.findUnique({
            where: { userId },
            include: { user: { select: { name: true, phone: true, email: true, avatar: true } }, trucks: true },
        });
        if (!driver) throw new NotFoundException('Driver profile not found');
        return { message: 'Driver profile fetched', data: driver };
    }

    async updateProfile(userId: string, dto: UpdateDriverProfileDto) {
        const { name, email, ...driverData } = dto;
        const driver = await this.prisma.driver.update({
            where: { userId },
            data: {
                ...driverData,
                user: {
                    update: {
                        name,
                        email,
                    }
                }
            },
            include: { user: { select: { name: true, phone: true, email: true, avatar: true } } },
        });
        return { message: 'Driver profile updated', data: driver };
    }

    async uploadDocument(userId: string, type: string, url: string) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver) throw new NotFoundException('Driver not found');
        const data: any = {};
        if (type === 'nid_front' || type === 'nidFront') data.nidFront = url;
        else if (type === 'nid_back' || type === 'nidBack') data.nidBack = url;
        else if (type === 'license_front' || type === 'licenseFront') data.licenseFront = url;
        else if (type === 'license_back' || type === 'licenseBack') data.licenseBack = url;
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
        const driver = await this.prisma.driver.findUnique({ where: { userId }, select: { totalEarnings: true, totalTrips: true, rating: true, referralEarnings: true } as any });
        if (!driver) throw new NotFoundException('Driver not found');
        const recentBookings = await this.prisma.booking.findMany({
            where: { driver: { userId }, status: 'COMPLETED' },
            select: { id: true, bookingNumber: true, finalFare: true, estimatedFare: true, distance: true, createdAt: true },
            take: 50,
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Earnings fetched', data: { ...driver, recentBookings } };
    }

    async getReferralStats(userId: string) {
        let driver: any = await this.prisma.driver.findUnique({
            where: { userId },
            include: { user: { select: { name: true, phone: true } } },
        });
        if (!driver) throw new NotFoundException('Driver not found');

        const driverId = driver.id;

        // Auto-generate referralCode if driver didn't have one
        if (!driver.referralCode) {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let randomStr = '';
            for (let i = 0; i < 6; i++) {
                randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            const referralCode = `DRV-${randomStr}`;
            driver = await this.prisma.driver.update({
                where: { id: driverId },
                data: { referralCode } as any,
                include: { user: { select: { name: true, phone: true } } },
            });
        }

        const [referredDrivers, referralLogs] = await Promise.all([
            this.prisma.driver.findMany({
                where: { referredById: driverId } as any,
                include: {
                    user: { select: { name: true, phone: true, createdAt: true } },
                    trucks: { select: { registrationNo: true } }
                },
                orderBy: { createdAt: 'desc' }
            }),
            (this.prisma as any).driverReferralLog.findMany({
                where: { referrerId: driverId },
                include: {
                    referredDriver: {
                        include: { user: { select: { name: true, phone: true } } }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 100
            })
        ]);

        return {
            message: 'Referral stats fetched',
            data: {
                referralCode: driver.referralCode || '',
                referralEarnings: driver.referralEarnings || 0,
                totalReferredCount: (referredDrivers as any[]).length,
                referredDrivers: (referredDrivers as any[]).map(d => ({
                    id: d.id,
                    name: d.user?.name || 'Driver',
                    phone: d.user?.phone || '',
                    totalTrips: d.totalTrips,
                    status: d.status,
                    createdAt: d.user?.createdAt || d.createdAt,
                })),
                referralLogs: (referralLogs as any[]).map(log => ({
                    id: log.id,
                    bookingId: log.bookingId,
                    tripFare: log.tripFare,
                    commissionAmount: log.commissionAmount,
                    referredDriverName: log.referredDriver?.user?.name || 'Driver',
                    referredDriverPhone: log.referredDriver?.user?.phone || '',
                    createdAt: log.createdAt,
                }))
            }
        };
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

    async submitCommissionPayment(userId: string, amount: number, transactionId: string) {
        const driver = await this.prisma.driver.findUnique({
            where: { userId },
            include: { user: { select: { name: true, phone: true } } }
        });
        if (!driver) throw new NotFoundException('Driver profile not found');

        const payment = await this.prisma.commissionPayment.create({
            data: {
                driverId: driver.id,
                amount,
                transactionId,
                status: 'PENDING'
            }
        });

        // Notify Admins about the new Commission Payment Request
        await this.notificationsService.notifyAdmins(
            NotificationType.SYSTEM,
            'New Commission Payment Submitted 💳',
            `Driver ${driver.user?.name || 'Driver'} (${driver.user?.phone || ''}) submitted a commission payment request of ৳${amount.toLocaleString()} (TrxID: ${transactionId}).`,
            { paymentId: payment.id, driverId: driver.id, amount, transactionId }
        );

        return { message: 'Commission payment submitted for approval', data: payment };
    }

    async getMyCommissionPayments(userId: string) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver) throw new NotFoundException('Driver profile not found');

        const payments = await this.prisma.commissionPayment.findMany({
            where: { driverId: driver.id },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate totals
        const completedTrips = await this.prisma.booking.findMany({
            where: { driverId: driver.id, status: 'COMPLETED' },
            select: { companyCommission: true }
        });
        const totalDue = completedTrips.reduce((sum, b) => sum + (b.companyCommission || 0), 0);

        return {
            message: 'Commission payments fetched',
            data: {
                payments,
                totalDue,
                paidAlready: driver.paidCommission,
                currentBalance: totalDue - driver.paidCommission
            }
        };
    }
}
