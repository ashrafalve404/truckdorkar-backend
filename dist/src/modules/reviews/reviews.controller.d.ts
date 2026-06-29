import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(userId: string, dto: CreateReviewDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            bookingId: string;
            reviewerId: string;
            driverUserId: string;
            comment: string | null;
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
            reviewerId: string;
            driverUserId: string;
            comment: string | null;
            isVisible: boolean;
        })[];
    }>;
    moderate(id: string, isVisible: boolean): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            bookingId: string;
            reviewerId: string;
            driverUserId: string;
            comment: string | null;
            isVisible: boolean;
        };
    }>;
}
