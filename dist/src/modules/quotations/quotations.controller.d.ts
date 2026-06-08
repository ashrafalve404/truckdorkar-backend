import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './dto/quotation.dto';
export declare class QuotationsController {
    private readonly quotationsService;
    constructor(quotationsService: QuotationsService);
    submit(userId: string, dto: CreateQuotationDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.QuotationStatus;
            note: string | null;
            driverId: string;
            bookingId: string;
            amount: number;
            expiresAt: Date | null;
        };
    }>;
    findForBooking(bookingId: string): Promise<{
        message: string;
        data: ({
            driver: {
                user: {
                    name: string | null;
                    phone: string | null;
                    avatar: string | null;
                };
            } & {
                licenseNumber: string | null;
                experience: number | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                nidNumber: string | null;
                nidFront: string | null;
                nidBack: string | null;
                licenseFront: string | null;
                licenseBack: string | null;
                licenseExpiry: Date | null;
                totalTrips: number;
                rating: number;
                totalEarnings: number;
                status: import("@prisma/client").$Enums.DriverStatus;
                isAvailable: boolean;
                currentLat: number | null;
                currentLng: number | null;
                verificationNote: string | null;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.QuotationStatus;
            note: string | null;
            driverId: string;
            bookingId: string;
            amount: number;
            expiresAt: Date | null;
        })[];
    }>;
    accept(id: string, userId: string): Promise<{
        message: string;
    }>;
    reject(id: string, userId: string): Promise<{
        message: string;
    }>;
}
