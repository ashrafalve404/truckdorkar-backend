import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateReviewDto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            select: { userId: true, driverId: true, status: true, review: true },
        });

        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.userId !== userId) throw new BadRequestException('You can only review your own bookings');
        if (booking.status !== 'COMPLETED') throw new BadRequestException('You can only review completed bookings');
        if (booking.review) throw new BadRequestException('You have already reviewed this booking');
        if (!booking.driverId) throw new BadRequestException('No driver assigned to this booking');

        const driverProfile = await this.prisma.driver.findUnique({
            where: { id: booking.driverId },
            select: { userId: true },
        });

        const review = await this.prisma.review.create({
            data: {
                bookingId: dto.bookingId,
                reviewerId: userId,
                driverUserId: driverProfile!.userId,
                rating: dto.rating,
                comment: dto.comment,
            },
        });

        // Update driver rating
        const aggregate = await this.prisma.review.aggregate({
            where: { driverUserId: driverProfile!.userId },
            _avg: { rating: true },
        });

        await this.prisma.driver.update({
            where: { id: booking.driverId },
            data: { rating: aggregate._avg.rating || 0 },
        });

        return { message: 'Review submitted successfully', data: review };
    }

    async findForDriver(driverUserId: string) {
        const reviews = await this.prisma.review.findMany({
            where: { driverUserId, isVisible: true },
            include: {
                reviewer: { select: { name: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Reviews fetched', data: reviews };
    }

    async moderate(reviewId: string, isVisible: boolean) {
        const review = await this.prisma.review.update({
            where: { id: reviewId },
            data: { isVisible },
        });
        return { message: `Review ${isVisible ? 'published' : 'hidden'}`, data: review };
    }
}
