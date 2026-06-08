import { BookingsService } from './bookings.service';
import { CreateBookingDto, CancelBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { Role } from '@prisma/client';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(userId: string, dto: CreateBookingDto): Promise<{
        message: string;
        data: {
            statusLogs: {
                id: string;
                status: import("@prisma/client").$Enums.BookingStatus;
                createdAt: Date;
                note: string | null;
                bookingId: string;
            }[];
        } & {
            id: string;
            bookingNumber: string;
            type: import("@prisma/client").$Enums.BookingType;
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
            status: import("@prisma/client").$Enums.BookingStatus;
            cancelReason: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            driverId: string | null;
            truckId: string | null;
        };
    }>;
    findAll(user: {
        id: string;
        role: Role;
    }): Promise<{
        message: string;
        data: ({
            user: {
                id: string;
                name: string | null;
                phone: string | null;
            };
            driver: {
                id: string;
                user: {
                    name: string | null;
                    phone: string | null;
                };
            } | null;
            truck: {
                id: string;
                name: string;
                category: import("@prisma/client").$Enums.TruckCategory;
            } | null;
            statusLogs: {
                id: string;
                status: import("@prisma/client").$Enums.BookingStatus;
                createdAt: Date;
                note: string | null;
                bookingId: string;
            }[];
        } & {
            id: string;
            bookingNumber: string;
            type: import("@prisma/client").$Enums.BookingType;
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
            status: import("@prisma/client").$Enums.BookingStatus;
            cancelReason: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            driverId: string | null;
            truckId: string | null;
        })[];
    }>;
    findOne(id: string, user: {
        id: string;
        role: Role;
    }): Promise<{
        message: string;
        data: {
            user: {
                id: string;
                name: string | null;
                email: string | null;
                phone: string | null;
            };
            driver: ({
                user: {
                    name: string | null;
                    phone: string | null;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.DriverStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                userId: string;
                nidNumber: string | null;
                nidFront: string | null;
                nidBack: string | null;
                licenseNumber: string | null;
                licenseFront: string | null;
                licenseBack: string | null;
                licenseExpiry: Date | null;
                experience: number | null;
                totalTrips: number;
                rating: number;
                totalEarnings: number;
                isAvailable: boolean;
                currentLat: number | null;
                currentLng: number | null;
                verificationNote: string | null;
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
                id: string;
                status: import("@prisma/client").$Enums.TruckStatus;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                driverId: string;
                name: string;
                isAvailable: boolean;
                registrationNo: string;
                category: import("@prisma/client").$Enums.TruckCategory;
                capacityTon: number;
                lengthFt: number;
                make: string | null;
                model: string | null;
                year: number | null;
                color: string | null;
                description: string | null;
                approvalNote: string | null;
            }) | null;
            statusLogs: {
                id: string;
                status: import("@prisma/client").$Enums.BookingStatus;
                createdAt: Date;
                note: string | null;
                bookingId: string;
            }[];
            quotations: ({
                driver: {
                    user: {
                        name: string | null;
                        phone: string | null;
                    };
                } & {
                    id: string;
                    status: import("@prisma/client").$Enums.DriverStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    userId: string;
                    nidNumber: string | null;
                    nidFront: string | null;
                    nidBack: string | null;
                    licenseNumber: string | null;
                    licenseFront: string | null;
                    licenseBack: string | null;
                    licenseExpiry: Date | null;
                    experience: number | null;
                    totalTrips: number;
                    rating: number;
                    totalEarnings: number;
                    isAvailable: boolean;
                    currentLat: number | null;
                    currentLng: number | null;
                    verificationNote: string | null;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.QuotationStatus;
                createdAt: Date;
                updatedAt: Date;
                driverId: string;
                note: string | null;
                bookingId: string;
                amount: number;
                expiresAt: Date | null;
            })[];
            review: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                bookingId: string;
                rating: number;
                reviewerId: string;
                driverUserId: string;
                comment: string | null;
                isVisible: boolean;
            } | null;
        } & {
            id: string;
            bookingNumber: string;
            type: import("@prisma/client").$Enums.BookingType;
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
            status: import("@prisma/client").$Enums.BookingStatus;
            cancelReason: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            driverId: string | null;
            truckId: string | null;
        };
    }>;
    cancel(id: string, userId: string, dto: CancelBookingDto): Promise<{
        message: string;
        data: {
            id: string;
            bookingNumber: string;
            type: import("@prisma/client").$Enums.BookingType;
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
            status: import("@prisma/client").$Enums.BookingStatus;
            cancelReason: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            driverId: string | null;
            truckId: string | null;
        };
    }>;
    accept(bookingId: string, userId: string): Promise<{
        message: string;
        data: {
            id: string;
            bookingNumber: string;
            type: import("@prisma/client").$Enums.BookingType;
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
            status: import("@prisma/client").$Enums.BookingStatus;
            cancelReason: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            driverId: string | null;
            truckId: string | null;
        };
    }>;
    updateStatus(bookingId: string, userId: string, dto: UpdateBookingStatusDto): Promise<{
        message: string;
        data: {
            id: string;
            bookingNumber: string;
            type: import("@prisma/client").$Enums.BookingType;
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
            status: import("@prisma/client").$Enums.BookingStatus;
            cancelReason: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            driverId: string | null;
            truckId: string | null;
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
                status: import("@prisma/client").$Enums.BookingStatus;
                createdAt: Date;
                note: string | null;
                bookingId: string;
            }[];
        } & {
            id: string;
            bookingNumber: string;
            type: import("@prisma/client").$Enums.BookingType;
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
            status: import("@prisma/client").$Enums.BookingStatus;
            cancelReason: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            driverId: string | null;
            truckId: string | null;
        };
    }>;
}
