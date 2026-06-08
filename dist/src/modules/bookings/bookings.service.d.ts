import { PrismaService } from '../../prisma/prisma.service';
import { BookingStatus, Role } from '@prisma/client';
import { CreateBookingDto, CancelBookingDto } from './dto/booking.dto';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateBookingDto): Promise<{
        message: string;
        data: {
            statusLogs: {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.BookingStatus;
                note: string | null;
                bookingId: string;
            }[];
        } & {
            type: import("@prisma/client").$Enums.BookingType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            userId: string;
            bookingNumber: string;
            driverId: string | null;
            truckId: string | null;
            pickupAddress: string;
            pickupLat: number | null;
            pickupLng: number | null;
            dropAddress: string;
            dropLat: number | null;
            dropLng: number | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            cancelReason: string | null;
        };
    }>;
    findAll(userId: string, role: Role): Promise<{
        message: string;
        data: ({
            user: {
                name: string | null;
                phone: string | null;
                id: string;
            };
            driver: {
                user: {
                    name: string | null;
                    phone: string | null;
                };
                id: string;
            } | null;
            truck: {
                name: string;
                id: string;
                category: import("@prisma/client").$Enums.TruckCategory;
            } | null;
            statusLogs: {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.BookingStatus;
                note: string | null;
                bookingId: string;
            }[];
        } & {
            type: import("@prisma/client").$Enums.BookingType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            userId: string;
            bookingNumber: string;
            driverId: string | null;
            truckId: string | null;
            pickupAddress: string;
            pickupLat: number | null;
            pickupLng: number | null;
            dropAddress: string;
            dropLat: number | null;
            dropLng: number | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            cancelReason: string | null;
        })[];
    }>;
    findOne(id: string, userId: string, role: Role): Promise<{
        message: string;
        data: {
            user: {
                name: string | null;
                email: string | null;
                phone: string | null;
                id: string;
            };
            driver: ({
                user: {
                    name: string | null;
                    phone: string | null;
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
            }) | null;
            truck: ({
                images: {
                    id: string;
                    createdAt: Date;
                    truckId: string;
                    url: string;
                    isPrimary: boolean;
                }[];
            } & {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                status: import("@prisma/client").$Enums.TruckStatus;
                isAvailable: boolean;
                year: number | null;
                driverId: string;
                registrationNo: string;
                category: import("@prisma/client").$Enums.TruckCategory;
                capacityTon: number;
                lengthFt: number;
                make: string | null;
                model: string | null;
                color: string | null;
                approvalNote: string | null;
            }) | null;
            review: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                rating: number;
                bookingId: string;
                comment: string | null;
                reviewerId: string;
                driverUserId: string;
                isVisible: boolean;
            } | null;
            quotations: ({
                driver: {
                    user: {
                        name: string | null;
                        phone: string | null;
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
            statusLogs: {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.BookingStatus;
                note: string | null;
                bookingId: string;
            }[];
        } & {
            type: import("@prisma/client").$Enums.BookingType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            userId: string;
            bookingNumber: string;
            driverId: string | null;
            truckId: string | null;
            pickupAddress: string;
            pickupLat: number | null;
            pickupLng: number | null;
            dropAddress: string;
            dropLat: number | null;
            dropLng: number | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            cancelReason: string | null;
        };
    }>;
    cancel(id: string, userId: string, dto: CancelBookingDto): Promise<{
        message: string;
        data: {
            type: import("@prisma/client").$Enums.BookingType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            userId: string;
            bookingNumber: string;
            driverId: string | null;
            truckId: string | null;
            pickupAddress: string;
            pickupLat: number | null;
            pickupLng: number | null;
            dropAddress: string;
            dropLat: number | null;
            dropLng: number | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            cancelReason: string | null;
        };
    }>;
    driverAccept(bookingId: string, driverId: string): Promise<{
        message: string;
        data: {
            type: import("@prisma/client").$Enums.BookingType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            userId: string;
            bookingNumber: string;
            driverId: string | null;
            truckId: string | null;
            pickupAddress: string;
            pickupLat: number | null;
            pickupLng: number | null;
            dropAddress: string;
            dropLat: number | null;
            dropLng: number | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            cancelReason: string | null;
        };
    }>;
    updateStatus(bookingId: string, driverId: string, status: BookingStatus, note?: string): Promise<{
        message: string;
        data: {
            type: import("@prisma/client").$Enums.BookingType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            userId: string;
            bookingNumber: string;
            driverId: string | null;
            truckId: string | null;
            pickupAddress: string;
            pickupLat: number | null;
            pickupLng: number | null;
            dropAddress: string;
            dropLat: number | null;
            dropLng: number | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            cancelReason: string | null;
        };
    }>;
    getTracking(bookingId: string): Promise<{
        message: string;
        data: {
            driver: {
                isAvailable: boolean;
                currentLat: number | null;
                currentLng: number | null;
            } | null;
            statusLogs: {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.BookingStatus;
                note: string | null;
                bookingId: string;
            }[];
        } & {
            type: import("@prisma/client").$Enums.BookingType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            userId: string;
            bookingNumber: string;
            driverId: string | null;
            truckId: string | null;
            pickupAddress: string;
            pickupLat: number | null;
            pickupLng: number | null;
            dropAddress: string;
            dropLat: number | null;
            dropLng: number | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            cancelReason: string | null;
        };
    }>;
}
