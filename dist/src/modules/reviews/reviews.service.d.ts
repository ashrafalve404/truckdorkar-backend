import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateReviewDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            bookingId: string;
            comment: string | null;
            reviewerId: string;
            driverUserId: string;
            isVisible: boolean;
        };
    }>;
    findForDriver(driverUserId: string): Promise<{
        message: string;
        data: ({
            reviewer: {
                name: string | null;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            bookingId: string;
            comment: string | null;
            reviewerId: string;
            driverUserId: string;
            isVisible: boolean;
        })[];
    }>;
    moderate(reviewId: string, isVisible: boolean): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            bookingId: string;
            comment: string | null;
            reviewerId: string;
            driverUserId: string;
            isVisible: boolean;
        };
    }>;
}
