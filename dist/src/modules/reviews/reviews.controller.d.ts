import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(userId: string, dto: CreateReviewDto): Promise<{
        message: string;
        data: {
            id: string;
            rating: number;
            comment: string | null;
            isVisible: boolean;
            createdAt: Date;
            updatedAt: Date;
            bookingId: string;
            reviewerId: string;
            driverUserId: string;
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
            rating: number;
            comment: string | null;
            isVisible: boolean;
            createdAt: Date;
            updatedAt: Date;
            bookingId: string;
            reviewerId: string;
            driverUserId: string;
        })[];
    }>;
    moderate(id: string, isVisible: boolean): Promise<{
        message: string;
        data: {
            id: string;
            rating: number;
            comment: string | null;
            isVisible: boolean;
            createdAt: Date;
            updatedAt: Date;
            bookingId: string;
            reviewerId: string;
            driverUserId: string;
        };
    }>;
}
