import { PrismaService } from '../../prisma/prisma.service';
import { UpdateDriverProfileDto } from './dto/driver.dto';
export declare class DriversService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        message: string;
        data: {
            user: {
                email: string | null;
                phone: string | null;
                name: string | null;
                avatar: string | null;
            };
            trucks: {
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
            }[];
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
    }>;
    updateProfile(userId: string, dto: UpdateDriverProfileDto): Promise<{
        message: string;
        data: {
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
    }>;
    uploadDocument(userId: string, type: string, url: string): Promise<{
        message: string;
        data: {
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
    }>;
    setAvailability(userId: string, isAvailable: boolean, lat?: number, lng?: number): Promise<{
        message: string;
        data: {
            isAvailable: boolean;
        };
    }>;
    getEarnings(userId: string): Promise<{
        message: string;
        data: {
            recentBookings: {
                id: string;
                createdAt: Date;
                bookingNumber: string;
                finalFare: number | null;
            }[];
            totalTrips: number;
            rating: number;
            totalEarnings: number;
        };
    }>;
    getDriverBookings(userId: string): Promise<{
        message: string;
        data: ({
            user: {
                phone: string | null;
                name: string | null;
            };
            truck: {
                name: string;
            } | null;
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
            scheduledAt: Date | null;
            goodsType: string | null;
            goodsWeight: number | null;
            specialNote: string | null;
            estimatedFare: number | null;
            finalFare: number | null;
            cancelReason: string | null;
        })[];
    }>;
    findAll(query: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        message: string;
        data: {
            drivers: ({
                user: {
                    email: string | null;
                    phone: string | null;
                    name: string | null;
                };
                trucks: {
                    id: string;
                    name: string;
                    status: import("@prisma/client").$Enums.TruckStatus;
                }[];
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
            })[];
            total: number;
            page: number;
            limit: number;
        };
    }>;
    verifyDriver(driverId: string, status: string, note?: string): Promise<{
        message: string;
        data: {
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
    }>;
}
