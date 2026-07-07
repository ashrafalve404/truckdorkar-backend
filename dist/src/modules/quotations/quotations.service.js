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
exports.QuotationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let QuotationsService = class QuotationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submit(userId, dto) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver)
            throw new common_1.NotFoundException('Driver not found');
        const completedTrips = await this.prisma.booking.findMany({
            where: { driverId: driver.id, status: 'COMPLETED' },
            select: { companyCommission: true },
        });
        const totalDue = completedTrips.reduce((sum, b) => sum + (b.companyCommission || 0), 0);
        const currentBalance = totalDue - driver.paidCommission;
        if (currentBalance > 0) {
            throw new common_1.ForbiddenException(`You have an unpaid commission balance of ৳${currentBalance.toFixed(2)}. Please pay your commission and wait for admin approval before bidding on trips.`);
        }
        const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const existing = await this.prisma.quotation.findFirst({ where: { bookingId: dto.bookingId, driverId: driver.id } });
        if (existing)
            throw new common_1.BadRequestException('You already submitted a quotation for this booking');
        const quotation = await this.prisma.quotation.create({
            data: { bookingId: dto.bookingId, driverId: driver.id, amount: dto.amount, note: dto.note, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined },
        });
        return { message: 'Quotation submitted', data: quotation };
    }
    async findForBooking(bookingId) {
        const quotations = await this.prisma.quotation.findMany({
            where: { bookingId },
            include: { driver: { include: { user: { select: { name: true, phone: true, avatar: true } } } } },
            orderBy: { amount: 'asc' },
        });
        return { message: 'Quotations fetched', data: quotations };
    }
    async accept(quotationId, userId) {
        const quotation = await this.prisma.quotation.findUnique({ where: { id: quotationId }, include: { booking: true } });
        if (!quotation)
            throw new common_1.NotFoundException('Quotation not found');
        if (quotation.booking.userId !== userId)
            throw new common_1.ForbiddenException();
        if (quotation.status !== client_1.QuotationStatus.PENDING)
            throw new common_1.BadRequestException('Quotation is no longer pending');
        await this.prisma.$transaction([
            this.prisma.quotation.update({ where: { id: quotationId }, data: { status: client_1.QuotationStatus.ACCEPTED } }),
            this.prisma.quotation.updateMany({
                where: { bookingId: quotation.bookingId, id: { not: quotationId } },
                data: { status: client_1.QuotationStatus.REJECTED },
            }),
            this.prisma.booking.update({
                where: { id: quotation.bookingId },
                data: { driverId: quotation.driverId, status: 'ACCEPTED', finalFare: quotation.amount },
            }),
        ]);
        return { message: 'Quotation accepted and booking assigned' };
    }
    async reject(quotationId, userId) {
        const quotation = await this.prisma.quotation.findUnique({ where: { id: quotationId }, include: { booking: true } });
        if (!quotation)
            throw new common_1.NotFoundException('Quotation not found');
        if (quotation.booking.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.quotation.update({ where: { id: quotationId }, data: { status: client_1.QuotationStatus.REJECTED } });
        return { message: 'Quotation rejected' };
    }
};
exports.QuotationsService = QuotationsService;
exports.QuotationsService = QuotationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuotationsService);
//# sourceMappingURL=quotations.service.js.map