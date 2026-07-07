import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuotationDto } from './dto/quotation.dto';
import { QuotationStatus } from '@prisma/client';

@Injectable()
export class QuotationsService {
    constructor(private prisma: PrismaService) { }

    async submit(userId: string, dto: CreateQuotationDto) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver) throw new NotFoundException('Driver not found');

        // ── Commission check ──────────────────────────────────────────────────
        const completedTrips = await this.prisma.booking.findMany({
            where: { driverId: driver.id, status: 'COMPLETED' },
            select: { companyCommission: true },
        });
        const totalDue = completedTrips.reduce((sum: number, b: { companyCommission: number | null }) => sum + (b.companyCommission || 0), 0);
        const currentBalance = totalDue - driver.paidCommission;
        if (currentBalance > 0) {
            throw new ForbiddenException(
                `You have an unpaid commission balance of ৳${currentBalance.toFixed(2)}. Please pay your commission and wait for admin approval before bidding on trips.`
            );
        }
        // ─────────────────────────────────────────────────────────────────────

        const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });
        if (!booking) throw new NotFoundException('Booking not found');
        const existing = await this.prisma.quotation.findFirst({ where: { bookingId: dto.bookingId, driverId: driver.id } });
        if (existing) throw new BadRequestException('You already submitted a quotation for this booking');
        const quotation = await this.prisma.quotation.create({
            data: { bookingId: dto.bookingId, driverId: driver.id, amount: dto.amount, note: dto.note, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined },
        });
        return { message: 'Quotation submitted', data: quotation };
    }

    async findForBooking(bookingId: string) {
        const quotations = await this.prisma.quotation.findMany({
            where: { bookingId },
            include: { driver: { include: { user: { select: { name: true, phone: true, avatar: true } } } } },
            orderBy: { amount: 'asc' },
        });
        return { message: 'Quotations fetched', data: quotations };
    }

    async accept(quotationId: string, userId: string) {
        const quotation = await this.prisma.quotation.findUnique({ where: { id: quotationId }, include: { booking: true } });
        if (!quotation) throw new NotFoundException('Quotation not found');
        if (quotation.booking.userId !== userId) throw new ForbiddenException();
        if (quotation.status !== QuotationStatus.PENDING) throw new BadRequestException('Quotation is no longer pending');
        await this.prisma.$transaction([
            this.prisma.quotation.update({ where: { id: quotationId }, data: { status: QuotationStatus.ACCEPTED } }),
            this.prisma.quotation.updateMany({
                where: { bookingId: quotation.bookingId, id: { not: quotationId } },
                data: { status: QuotationStatus.REJECTED },
            }),
            this.prisma.booking.update({
                where: { id: quotation.bookingId },
                data: { driverId: quotation.driverId, status: 'ACCEPTED', finalFare: quotation.amount },
            }),
        ]);
        return { message: 'Quotation accepted and booking assigned' };
    }

    async reject(quotationId: string, userId: string) {
        const quotation = await this.prisma.quotation.findUnique({ where: { id: quotationId }, include: { booking: true } });
        if (!quotation) throw new NotFoundException('Quotation not found');
        if (quotation.booking.userId !== userId) throw new ForbiddenException();
        await this.prisma.quotation.update({ where: { id: quotationId }, data: { status: QuotationStatus.REJECTED } });
        return { message: 'Quotation rejected' };
    }
}
