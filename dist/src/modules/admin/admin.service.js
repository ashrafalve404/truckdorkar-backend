"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
let AdminService = class AdminService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async getDashboardStats() {
        const [totalUsers, totalDrivers, totalTrucks, totalAgents, totalBookings, pendingDrivers, pendingTrucks, openTickets, receivedCommission, completedBookings] = await Promise.all([
            this.prisma.user.count({ where: { role: 'USER' } }),
            this.prisma.driver.count(),
            this.prisma.truck.count(),
            this.prisma.user.count({ where: { role: 'AGENT' } }),
            this.prisma.booking.count(),
            this.prisma.driver.count({ where: { status: client_1.DriverStatus.PENDING } }),
            this.prisma.truck.count({ where: { status: 'PENDING' } }),
            this.prisma.supportTicket.count({ where: { status: client_1.TicketStatus.OPEN } }),
            this.prisma.driver.aggregate({
                _sum: { paidCommission: true }
            }),
            this.prisma.booking.findMany({
                where: { status: client_1.BookingStatus.COMPLETED },
                select: { finalFare: true, estimatedFare: true, companyCommission: true },
            }),
        ]);
        const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.finalFare || b.estimatedFare || 0), 0);
        const companyRevenue = completedBookings.reduce((sum, b) => sum + (b.companyCommission || 0), 0);
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
                    totalAgents,
                    totalBookings,
                    totalRevenue,
                    companyRevenue,
                    receivedCommission: receivedCommission._sum?.paidCommission || 0,
                    pendingDrivers,
                    pendingTrucks,
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
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true,
                    avatar: true,
                    role: true,
                    createdAt: true,
                    isActive: true,
                    isPhoneVerified: true,
                    driver: {
                        select: {
                            id: true,
                            nidNumber: true,
                            nidFront: true,
                            nidBack: true,
                            licenseNumber: true,
                            licenseFront: true,
                            licenseBack: true,
                            licenseExpiry: true,
                            experience: true,
                            totalTrips: true,
                            rating: true,
                            totalEarnings: true,
                            paidCommission: true,
                            status: true,
                            isAvailable: true,
                            trucks: { select: { id: true, registrationNo: true, category: true, capacityTon: true, status: true } }
                        }
                    },
                    agent: {
                        select: {
                            id: true,
                            agentId: true,
                            nidNumber: true,
                            nidFrontUrl: true,
                            nidBackUrl: true,
                            verificationStatus: true,
                            department: true,
                            designation: true,
                            walletBalance: true,
                            totalEarnings: true
                        }
                    },
                    bookings: {
                        take: 10,
                        orderBy: { createdAt: 'desc' },
                        select: {
                            id: true,
                            bookingNumber: true,
                            pickupAddress: true,
                            dropAddress: true,
                            status: true,
                            estimatedFare: true,
                            createdAt: true
                        }
                    }
                },
            }),
            this.prisma.user.count(),
        ]);
        return { message: 'Users fetched', data: { users, total, page, limit } };
    }
    async createUser(dto) {
        const { name, phone, email, password, role } = dto;
        const phoneExists = await this.prisma.user.findUnique({ where: { phone } });
        if (phoneExists)
            throw new common_1.ConflictException('Phone number is already registered.');
        if (email && email.trim() !== '') {
            const emailExists = await this.prisma.user.findUnique({ where: { email } });
            if (emailExists)
                throw new common_1.ConflictException('Email is already registered.');
        }
        const hashed = await bcrypt.hash(password, 12);
        const targetRole = role || client_1.Role.USER;
        const user = await this.prisma.user.create({
            data: {
                name,
                phone,
                email: (email && email.trim() !== '') ? email : null,
                password: hashed,
                role: targetRole,
                isPhoneVerified: true,
                isActive: true,
                ...(targetRole === client_1.Role.DRIVER && {
                    driver: {
                        create: {
                            status: client_1.DriverStatus.VERIFIED,
                        }
                    }
                }),
                ...(targetRole === client_1.Role.AGENT && {
                    agent: {
                        create: {
                            agentId: `TDL-AGENT-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`
                        }
                    }
                })
            },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
                isPhoneVerified: true,
                createdAt: true,
            }
        });
        return { message: 'User created successfully from Admin Panel', data: user };
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
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, name: true, phone: true, email: true, avatar: true, isActive: true } },
                    trucks: { select: { id: true, name: true, registrationNo: true, category: true, status: true, capacityTon: true, lengthFt: true } },
                    referredBy: { select: { id: true, referralCode: true, user: { select: { name: true, phone: true } } } },
                    _count: { select: { referrals: true } },
                    bookings: {
                        select: {
                            id: true,
                            bookingNumber: true,
                            pickupAddress: true,
                            dropAddress: true,
                            estimatedFare: true,
                            finalFare: true,
                            companyCommission: true,
                            status: true,
                            createdAt: true
                        },
                        orderBy: { createdAt: 'desc' }
                    }
                },
            }),
            this.prisma.driver.count(),
        ]);
        const driversWithBalance = drivers.map(d => {
            const completedBookings = (d.bookings || []).filter((b) => b.status === client_1.BookingStatus.COMPLETED);
            const totalDue = completedBookings.reduce((sum, b) => sum + (b.companyCommission || 0), 0);
            return {
                ...d,
                totalDue,
                dueAmount: totalDue - d.paidCommission,
            };
        });
        return { message: 'Drivers fetched', data: { drivers: driversWithBalance, total, page, limit } };
    }
    async getReferralAnalytics(page = 1, limit = 20, search) {
        const [totalReferralPayoutsAgg, totalReferredDrivers, totalReferrers, topReferrer] = await Promise.all([
            this.prisma.driverReferralLog.aggregate({
                _sum: { commissionAmount: true }
            }),
            this.prisma.driver.count({
                where: { referredById: { not: null } }
            }),
            this.prisma.driver.count({
                where: { referralEarnings: { gt: 0 } }
            }),
            this.prisma.driver.findFirst({
                where: { referralEarnings: { gt: 0 } },
                orderBy: { referralEarnings: 'desc' },
                include: { user: { select: { name: true, phone: true } } }
            })
        ]);
        const totalPayouts = totalReferralPayoutsAgg._sum?.commissionAmount || 0;
        const topReferrers = await this.prisma.driver.findMany({
            where: { referrals: { some: {} } },
            include: {
                user: { select: { name: true, phone: true } },
                _count: { select: { referrals: true } }
            },
            orderBy: { referralEarnings: 'desc' },
            take: 50
        });
        const logWhere = {};
        if (search && search.trim() !== '') {
            const query = search.trim();
            logWhere.OR = [
                { bookingId: { contains: query, mode: 'insensitive' } },
                { referrer: { user: { name: { contains: query, mode: 'insensitive' } } } },
                { referrer: { user: { phone: { contains: query, mode: 'insensitive' } } } },
                { referredDriver: { user: { name: { contains: query, mode: 'insensitive' } } } },
                { referredDriver: { user: { phone: { contains: query, mode: 'insensitive' } } } },
            ];
        }
        const [logs, totalLogs] = await Promise.all([
            this.prisma.driverReferralLog.findMany({
                where: logWhere,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    referrer: { include: { user: { select: { name: true, phone: true } } } },
                    referredDriver: { include: { user: { select: { name: true, phone: true } } } }
                }
            }),
            this.prisma.driverReferralLog.count({ where: logWhere })
        ]);
        return {
            message: 'Referral analytics fetched',
            data: {
                summary: {
                    totalPayouts,
                    totalReferredDrivers,
                    totalReferrers,
                    topReferrer: topReferrer ? {
                        name: topReferrer.user?.name || 'Driver',
                        phone: topReferrer.user?.phone || '',
                        referralCode: topReferrer.referralCode,
                        referralEarnings: topReferrer.referralEarnings
                    } : null
                },
                topReferrers: topReferrers.map(d => ({
                    id: d.id,
                    name: d.user?.name || 'Driver',
                    phone: d.user?.phone || '',
                    referralCode: d.referralCode,
                    totalReferred: d._count?.referrals || 0,
                    referralEarnings: d.referralEarnings || 0
                })),
                logs: logs.map(log => ({
                    id: log.id,
                    bookingId: log.bookingId,
                    tripFare: log.tripFare,
                    commissionAmount: log.commissionAmount,
                    createdAt: log.createdAt,
                    referrerName: log.referrer?.user?.name || 'Referrer',
                    referrerPhone: log.referrer?.user?.phone || '',
                    referredDriverName: log.referredDriver?.user?.name || 'Referred Driver',
                    referredDriverPhone: log.referredDriver?.user?.phone || ''
                })),
                totalLogs,
                page,
                limit
            }
        };
    }
    async getPendingCommissionPayments() {
        return this.prisma.commissionPayment.findMany({
            where: { status: 'PENDING' },
            include: { driver: { include: { user: { select: { name: true, phone: true } } } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async approveCommissionPayment(id, adminNote) {
        const result = await this.prisma.$transaction(async (tx) => {
            const payment = await tx.commissionPayment.findUnique({
                where: { id },
                include: { driver: true }
            });
            if (!payment)
                throw new Error('Payment record not found');
            if (payment.status !== 'PENDING')
                throw new Error('Payment is already processed');
            const updatedPayment = await tx.commissionPayment.update({
                where: { id },
                data: { status: 'APPROVED', adminNote }
            });
            await tx.driver.update({
                where: { id: payment.driverId },
                data: { paidCommission: { increment: payment.amount } }
            });
            return { updatedPayment, driverUserId: payment.driver.userId, amount: payment.amount, trxId: payment.transactionId };
        });
        if (result.driverUserId) {
            await this.notificationsService.create(result.driverUserId, client_1.NotificationType.SYSTEM, 'Commission Payment Approved! 💰', `Your commission payment of ৳${result.amount.toLocaleString()} (TrxID: ${result.trxId}) has been approved by Admin.`, { paymentId: id, amount: result.amount });
        }
        return result.updatedPayment;
    }
    async rejectCommissionPayment(id, adminNote) {
        const payment = await this.prisma.commissionPayment.findUnique({
            where: { id },
            include: { driver: true }
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment record not found');
        const updatedPayment = await this.prisma.commissionPayment.update({
            where: { id },
            data: { status: 'REJECTED', adminNote }
        });
        if (payment.driver?.userId) {
            await this.notificationsService.create(payment.driver.userId, client_1.NotificationType.SYSTEM, 'Commission Payment Rejected ❌', `Your commission payment request of ৳${payment.amount.toLocaleString()} (TrxID: ${payment.transactionId}) was rejected. ${adminNote ? `Note: ${adminNote}` : ''}`, { paymentId: id, amount: payment.amount });
        }
        return updatedPayment;
    }
    async verifyDriver(id, status, note) {
        const driver = await this.prisma.driver.update({
            where: { id },
            data: { status: status, verificationNote: note },
        });
        return { message: 'Driver status updated', data: driver };
    }
    async getAllTrucks(page = 1, limit = 20, status) {
        const where = { deletedAt: null };
        if (status)
            where.status = status;
        const [trucks, total] = await Promise.all([
            this.prisma.truck.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    driver: { include: { user: { select: { name: true, phone: true } } } },
                    registeredByAgent: { include: { user: { select: { name: true } } } },
                    images: { where: { isPrimary: true }, take: 1 },
                },
            }),
            this.prisma.truck.count({ where }),
        ]);
        return { message: 'Trucks fetched', data: { trucks, total, page, limit } };
    }
    async deleteUser(id) {
        await this.prisma.user.delete({ where: { id } });
        return { message: 'User and all related data permanently deleted' };
    }
    async deleteDriver(id) {
        const driver = await this.prisma.driver.findUnique({ where: { id }, select: { userId: true } });
        if (driver) {
            await this.prisma.user.delete({ where: { id: driver.userId } });
        }
        else {
            await this.prisma.driver.delete({ where: { id } });
        }
        return { message: 'Driver and associated user permanently deleted' };
    }
    async deleteAgent(id) {
        const agent = await this.prisma.agent.findUnique({ where: { id }, select: { userId: true } });
        if (agent) {
            await this.prisma.user.delete({ where: { id: agent.userId } });
        }
        else {
            await this.prisma.agent.delete({ where: { id } });
        }
        return { message: 'Agent and associated user permanently deleted' };
    }
    async deleteTruck(id) {
        await this.prisma.truck.delete({ where: { id } });
        return { message: 'Truck permanently deleted' };
    }
    async getSettings() {
        const record = await this.prisma.cmsContent.findUnique({
            where: { key: 'SYSTEM_SETTINGS' }
        });
        const meta = record?.metaJson && typeof record.metaJson === 'object'
            ? record.metaJson
            : {};
        const defaultFares = [
            { id: "T1_OPEN_7_9FT", nameEn: "1 Ton Open 7/9 Ft Truck", nameBn: "১ টন খোলা ৭/৯ ফিট ট্রাক", minFare10km: 1000, capacityTon: 1.0, lengthFt: 9.0, farePerKm: 50, isActive: true },
            { id: "T1_COVER_7_9FT", nameEn: "1 Ton Cover 7/9 Ft Truck", nameBn: "১ টন কাভার ৭/৯ ফিট ট্রাক", minFare10km: 1000, capacityTon: 1.0, lengthFt: 9.0, farePerKm: 50, isActive: true },
            { id: "T1_5_OPEN_10_12FT", nameEn: "1.5 Ton Open 10/12 Ft Truck", nameBn: "১.৫ টন খোলা ১০/১২ ফিট ট্রাক", minFare10km: 1500, capacityTon: 1.5, lengthFt: 12.0, farePerKm: 60, isActive: true },
            { id: "T1_5_COVER_10_12FT", nameEn: "1.5 Ton Cover 10/12 Ft Truck", nameBn: "১.৫ টন কাভার ১০/১২ ফিট ট্রাক", minFare10km: 1500, capacityTon: 1.5, lengthFt: 12.0, farePerKm: 60, isActive: true },
            { id: "T3_OPEN_16_14FT", nameEn: "3 Ton Open 14/16 Ft Truck", nameBn: "৩ টন খোলা ১৪/১৬ ফিট ট্রাক", minFare10km: 3000, capacityTon: 3.0, lengthFt: 16.0, farePerKm: 75, isActive: true },
            { id: "T3_COVER_16_14FT", nameEn: "3 Ton Cover 14/16 Ft Truck", nameBn: "৩ টন কাভার ১৪/১৬ ফিট ট্রাক", minFare10km: 3000, capacityTon: 3.0, lengthFt: 16.0, farePerKm: 75, isActive: true }
        ];
        const fares = (meta.truckFares && Array.isArray(meta.truckFares)) ? meta.truckFares : defaultFares;
        return {
            message: 'Settings fetched',
            data: {
                platformName: meta.platformName || 'TruckDorkar',
                adminEmail: meta.adminEmail || 'admin@truckdorkar.com',
                baseFarePerKm: meta.baseFarePerKm || 500,
                truckFares: fares,
            }
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
    async createAdmin(dto) {
        const { name, email, phone, password } = dto;
        const emailExists = await this.prisma.user.findFirst({
            where: { email: email.toLowerCase() }
        });
        if (emailExists)
            throw new common_1.ConflictException('Email already registered');
        const phoneExists = await this.prisma.user.findUnique({
            where: { phone }
        });
        if (phoneExists)
            throw new common_1.ConflictException('Phone number already registered');
        const hashed = await bcrypt.hash(password, 12);
        const newAdmin = await this.prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                phone,
                password: hashed,
                role: client_1.Role.ADMIN,
                isActive: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });
        return { message: 'Admin created successfully', data: newAdmin };
    }
    async changeAdminPassword(adminId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: adminId } });
        if (!user || user.role !== client_1.Role.ADMIN)
            throw new common_1.NotFoundException('Admin user not found');
        const passwordMatches = await bcrypt.compare(dto.currentPassword, user.password || '');
        if (!passwordMatches)
            throw new common_1.BadRequestException('Current password is incorrect');
        const hashed = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.user.update({
            where: { id: adminId },
            data: {
                password: hashed,
                refreshToken: null
            }
        });
        return { message: 'Admin password changed successfully' };
    }
    async getAgentWithdrawals(status) {
        const where = {};
        if (status)
            where.status = status;
        const withdrawals = await this.prisma.agentWithdrawal.findMany({
            where,
            include: {
                agent: {
                    include: {
                        user: { select: { name: true, phone: true, email: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { message: 'Agent withdrawals fetched', data: withdrawals };
    }
    async approveAgentWithdrawal(id, adminNote) {
        return this.prisma.$transaction(async (tx) => {
            const withdrawal = await tx.agentWithdrawal.findUnique({
                where: { id },
                include: { agent: true }
            });
            if (!withdrawal)
                throw new common_1.NotFoundException('Withdrawal request not found');
            if (withdrawal.status !== 'PENDING')
                throw new common_1.BadRequestException('Withdrawal request has already been processed');
            if ((withdrawal.agent.totalEarnings || 0) < withdrawal.amount) {
                throw new common_1.BadRequestException('Agent does not have sufficient total earnings');
            }
            await tx.agent.update({
                where: { id: withdrawal.agentId },
                data: { totalEarnings: { decrement: withdrawal.amount } }
            });
            const updated = await tx.agentWithdrawal.update({
                where: { id },
                data: { status: 'APPROVED', adminNote }
            });
            await tx.notification.create({
                data: {
                    userId: withdrawal.agent.userId,
                    type: 'SYSTEM',
                    title: 'Money Withdrawal Request Approved! 💸',
                    body: `Your withdrawal request of ৳${withdrawal.amount.toLocaleString()} to bKash (${withdrawal.bkashNumber}) has been approved and disbursed.`,
                    data: { withdrawalId: id, amount: withdrawal.amount, bkashNumber: withdrawal.bkashNumber }
                }
            });
            return { message: 'Withdrawal request approved successfully', data: updated };
        });
    }
    async rejectAgentWithdrawal(id, adminNote) {
        const withdrawal = await this.prisma.agentWithdrawal.findUnique({
            where: { id },
            include: { agent: true }
        });
        if (!withdrawal)
            throw new common_1.NotFoundException('Withdrawal request not found');
        const updated = await this.prisma.agentWithdrawal.update({
            where: { id },
            data: { status: 'REJECTED', adminNote }
        });
        await this.prisma.notification.create({
            data: {
                userId: withdrawal.agent.userId,
                type: 'SYSTEM',
                title: 'Money Withdrawal Request Rejected ❌',
                body: `Your withdrawal request of ৳${withdrawal.amount.toLocaleString()} to bKash (${withdrawal.bkashNumber}) was rejected. ${adminNote ? `Note: ${adminNote}` : ''}`,
                data: { withdrawalId: id, amount: withdrawal.amount }
            }
        });
        return { message: 'Withdrawal request rejected', data: updated };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], AdminService);
//# sourceMappingURL=admin.service.js.map