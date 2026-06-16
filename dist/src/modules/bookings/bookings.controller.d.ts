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
                createdAt: Date;
                status: import("@prisma/client").$Enums.BookingStatus;
                note: string | null;
                bookingId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            type: import("@prisma/client").$Enums.BookingType;
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
            truckType: string | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            distance: number | null;
            agentCommission: number | null;
            cancelReason: string | null;
        };
    }>;
    findAll(user: {
        id: string;
        role: Role;
    }): Promise<{
        message: string;
        data: ({
            driver: {
                id: string;
                user: {
                    phone: string | null;
                    name: string | null;
                };
            } | null;
            user: {
                id: string;
                phone: string | null;
                name: string | null;
            };
            truck: {
                id: string;
                name: string;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            type: import("@prisma/client").$Enums.BookingType;
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
            truckType: string | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            distance: number | null;
            agentCommission: number | null;
            cancelReason: string | null;
        })[];
    }>;
    findOne(id: string, user: {
        id: string;
        role: Role;
    }): Promise<{
        message: string;
        data: {
            driver: ({
                user: {
                    phone: string | null;
                    name: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
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
                status: import("@prisma/client").$Enums.DriverStatus;
                isAvailable: boolean;
                currentLat: number | null;
                currentLng: number | null;
                verificationNote: string | null;
                userId: string;
            }) | null;
            user: {
                id: string;
                email: string | null;
                phone: string | null;
                name: string | null;
            };
            quotations: ({
                driver: {
                    user: {
                        phone: string | null;
                        name: string | null;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
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
                name: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                status: import("@prisma/client").$Enums.TruckStatus;
                isAvailable: boolean;
                description: string | null;
                year: number | null;
                driverId: string;
                truckType: string | null;
                registrationNo: string;
                numberPlateText: string | null;
                roadPermitUrl: string | null;
                taxTokenUrl: string | null;
                blueBookUrl: string | null;
                numberPlateImageUrl: string | null;
                drivingLicenseUrl: string | null;
                category: import("@prisma/client").$Enums.TruckCategory;
                capacityTon: number;
                lengthFt: number;
                make: string | null;
                model: string | null;
                color: string | null;
                approvalNote: string | null;
                registeredByAgentId: string | null;
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
            statusLogs: {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.BookingStatus;
                note: string | null;
                bookingId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            type: import("@prisma/client").$Enums.BookingType;
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
            truckType: string | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            distance: number | null;
            agentCommission: number | null;
            cancelReason: string | null;
        };
    }>;
    cancel(id: string, userId: string, dto: CancelBookingDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            type: import("@prisma/client").$Enums.BookingType;
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
            truckType: string | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            distance: number | null;
            agentCommission: number | null;
            cancelReason: string | null;
        };
    }>;
    updateFare(id: string, userId: string, fare: number): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            type: import("@prisma/client").$Enums.BookingType;
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
            truckType: string | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            distance: number | null;
            agentCommission: number | null;
            cancelReason: string | null;
        };
    }>;
    accept(bookingId: string, userId: string): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            type: import("@prisma/client").$Enums.BookingType;
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
            truckType: string | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            distance: number | null;
            agentCommission: number | null;
            cancelReason: string | null;
        };
    }>;
    updateStatus(bookingId: string, userId: string, dto: UpdateBookingStatusDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            type: import("@prisma/client").$Enums.BookingType;
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
            truckType: string | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            distance: number | null;
            agentCommission: number | null;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            type: import("@prisma/client").$Enums.BookingType;
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
            truckType: string | null;
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            distance: number | null;
            agentCommission: number | null;
            cancelReason: string | null;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
