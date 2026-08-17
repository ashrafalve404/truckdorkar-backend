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
exports.DriversService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let DriversService = class DriversService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async getProfile(userId) {
        const driver = await this.prisma.driver.findUnique({
            where: { userId },
            include: { user: { select: { name: true, phone: true, email: true, avatar: true } }, trucks: true },
        });
        if (!driver)
            throw new common_1.NotFoundException('Driver profile not found');
        return { message: 'Driver profile fetched', data: driver };
    }
    async updateProfile(userId, dto) {
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
    async uploadDocument(userId, type, url) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver)
            throw new common_1.NotFoundException('Driver not found');
        const data = {};
        if (type === 'nid_front' || type === 'nidFront')
            data.nidFront = url;
        else if (type === 'nid_back' || type === 'nidBack')
            data.nidBack = url;
        else if (type === 'license_front' || type === 'licenseFront')
            data.licenseFront = url;
        else if (type === 'license_back' || type === 'licenseBack')
            data.licenseBack = url;
        const updated = await this.prisma.driver.update({ where: { userId }, data });
        return { message: 'Document uploaded', data: updated };
    }
    async setAvailability(userId, isAvailable, lat, lng) {
        const driver = await this.prisma.driver.update({
            where: { userId },
            data: { isAvailable, currentLat: lat, currentLng: lng },
        });
        return { message: 'Availability updated', data: { isAvailable: driver.isAvailable } };
    }
    async getEarnings(userId) {
        const driver = await this.prisma.driver.findUnique({ where: { userId }, select: { totalEarnings: true, totalTrips: true, rating: true, referralEarnings: true } });
        if (!driver)
            throw new common_1.NotFoundException('Driver not found');
        const recentBookings = await this.prisma.booking.findMany({
            where: { driver: { userId }, status: 'COMPLETED' },
            select: { id: true, bookingNumber: true, finalFare: true, estimatedFare: true, distance: true, createdAt: true },
            take: 50,
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Earnings fetched', data: { ...driver, recentBookings } };
    }
    async getReferralStats(userId) {
        let driver = await this.prisma.driver.findUnique({
            where: { userId },
            include: { user: { select: { name: true, phone: true } } },
        });
        if (!driver)
            throw new common_1.NotFoundException('Driver not found');
        const driverId = driver.id;
        if (!driver.referralCode) {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let randomStr = '';
            for (let i = 0; i < 6; i++) {
                randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            const referralCode = `DRV-${randomStr}`;
            driver = await this.prisma.driver.update({
                where: { id: driverId },
                data: { referralCode },
                include: { user: { select: { name: true, phone: true } } },
            });
        }
        const [referredDrivers, referralLogs] = await Promise.all([
            this.prisma.driver.findMany({
                where: { referredById: driverId },
                include: {
                    user: { select: { name: true, phone: true, createdAt: true } },
                    trucks: { select: { registrationNo: true } }
                },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.driverReferralLog.findMany({
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
                totalReferredCount: referredDrivers.length,
                referredDrivers: referredDrivers.map(d => ({
                    id: d.id,
                    name: d.user?.name || 'Driver',
                    phone: d.user?.phone || '',
                    totalTrips: d.totalTrips,
                    status: d.status,
                    createdAt: d.user?.createdAt || d.createdAt,
                })),
                referralLogs: referralLogs.map(log => ({
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
    async getDriverBookings(userId) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver)
            throw new common_1.NotFoundException('Driver not found');
        const bookings = await this.prisma.booking.findMany({
            where: { driverId: driver.id },
            include: { user: { select: { name: true, phone: true } }, truck: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Driver bookings fetched', data: bookings };
    }
    async findAll(query) {
        const { status, page = 1, limit = 20 } = query;
        const where = {};
        if (status)
            where.status = status;
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
    async verifyDriver(driverId, status, note) {
        const driver = await this.prisma.driver.update({
            where: { id: driverId },
            data: { status: status, verificationNote: note },
        });
        return { message: 'Driver status updated', data: driver };
    }
    async submitCommissionPayment(userId, amount, transactionId) {
        const driver = await this.prisma.driver.findUnique({
            where: { userId },
            include: { user: { select: { name: true, phone: true } } }
        });
        if (!driver)
            throw new common_1.NotFoundException('Driver profile not found');
        const payment = await this.prisma.commissionPayment.create({
            data: {
                driverId: driver.id,
                amount,
                transactionId,
                status: 'PENDING'
            }
        });
        await this.notificationsService.notifyAdmins(client_1.NotificationType.SYSTEM, 'New Commission Payment Submitted 💳', `Driver ${driver.user?.name || 'Driver'} (${driver.user?.phone || ''}) submitted a commission payment request of ৳${amount.toLocaleString()} (TrxID: ${transactionId}).`, { paymentId: payment.id, driverId: driver.id, amount, transactionId });
        return { message: 'Commission payment submitted for approval', data: payment };
    }
    async getMyCommissionPayments(userId) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver)
            throw new common_1.NotFoundException('Driver profile not found');
        const payments = await this.prisma.commissionPayment.findMany({
            where: { driverId: driver.id },
            orderBy: { createdAt: 'desc' }
        });
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
};
exports.DriversService = DriversService;
exports.DriversService = DriversService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], DriversService);
//# sourceMappingURL=drivers.service.js.map