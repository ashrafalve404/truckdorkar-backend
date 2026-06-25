import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuotationDto } from './dto/quotation.dto';
export declare class QuotationsService {
    private prisma;
    constructor(prisma: PrismaService);
    submit(userId: string, dto: CreateQuotationDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.QuotationStatus;
            note: string | null;
            driverId: string;
            amount: number;
            bookingId: string;
            expiresAt: Date | null;
        };
    }>;
    findForBooking(bookingId: string): Promise<{
        message: string;
        data: ({
            driver: {
                user: {
                    phone: string | null;
                    name: string | null;
                    avatar: string | null;
                };
            } & {
                id: string;
                userId: string;
                nidNumber: string | null;
                totalEarnings: number;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                nidFront: string | null;
                nidBack: string | null;
                licenseNumber: string | null;
                licenseFront: string | null;
                licenseBack: string | null;
                licenseExpiry: Date | null;
                experience: number | null;
                totalTrips: number;
                rating: number;
                paidCommission: number;
                status: import("@prisma/client").$Enums.DriverStatus;
                isAvailable: boolean;
                currentLat: number | null;
                currentLng: number | null;
                verificationNote: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.QuotationStatus;
            note: string | null;
            driverId: string;
            amount: number;
            bookingId: string;
            expiresAt: Date | null;
        })[];
    }>;
    accept(quotationId: string, userId: string): Promise<{
        message: string;
    }>;
    reject(quotationId: string, userId: string): Promise<{
        message: string;
    }>;
}
