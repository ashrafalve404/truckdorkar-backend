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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            select: { userId: true, driverId: true, status: true, review: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.userId !== userId)
            throw new common_1.BadRequestException('You can only review your own bookings');
        if (booking.status !== 'COMPLETED')
            throw new common_1.BadRequestException('You can only review completed bookings');
        if (booking.review)
            throw new common_1.BadRequestException('You have already reviewed this booking');
        if (!booking.driverId)
            throw new common_1.BadRequestException('No driver assigned to this booking');
        const driverProfile = await this.prisma.driver.findUnique({
            where: { id: booking.driverId },
            select: { userId: true },
        });
        const review = await this.prisma.review.create({
            data: {
                bookingId: dto.bookingId,
                reviewerId: userId,
                driverUserId: driverProfile.userId,
                rating: dto.rating,
                comment: dto.comment,
            },
        });
        const aggregate = await this.prisma.review.aggregate({
            where: { driverUserId: driverProfile.userId },
            _avg: { rating: true },
        });
        await this.prisma.driver.update({
            where: { id: booking.driverId },
            data: { rating: aggregate._avg.rating || 0 },
        });
        return { message: 'Review submitted successfully', data: review };
    }
    async findForDriver(driverUserId) {
        const reviews = await this.prisma.review.findMany({
            where: { driverUserId, isVisible: true },
            include: {
                reviewer: { select: { name: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Reviews fetched', data: reviews };
    }
    async moderate(reviewId, isVisible) {
        const review = await this.prisma.review.update({
            where: { id: reviewId },
            data: { isVisible },
        });
        return { message: `Review ${isVisible ? 'published' : 'hidden'}`, data: review };
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map