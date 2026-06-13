import { DriversService } from './drivers.service';
import { UpdateDriverProfileDto, SetAvailabilityDto, VerifyDriverDto } from './dto/driver.dto';
import { StorageService } from '../storage/storage.service';
export declare class DriversController {
    private readonly driversService;
    private readonly storageService;
    constructor(driversService: DriversService, storageService: StorageService);
    getProfile(userId: string): Promise<{
        message: string;
        data: {
            user: {
                name: string | null;
                email: string | null;
                phone: string | null;
                avatar: string | null;
            };
            trucks: {
                id: string;
                status: import("@prisma/client").$Enums.TruckStatus;
                isAvailable: boolean;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
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
                year: number | null;
                color: string | null;
                description: string | null;
                approvalNote: string | null;
                registeredByAgentId: string | null;
            }[];
        } & {
            id: string;
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
            status: import("@prisma/client").$Enums.DriverStatus;
            isAvailable: boolean;
            currentLat: number | null;
            currentLng: number | null;
            verificationNote: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    }>;
    updateProfile(userId: string, dto: UpdateDriverProfileDto): Promise<{
        message: string;
        data: {
            id: string;
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
            status: import("@prisma/client").$Enums.DriverStatus;
            isAvailable: boolean;
            currentLat: number | null;
            currentLng: number | null;
            verificationNote: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    }>;
    uploadDocument(userId: string, file: Express.Multer.File, type: string): Promise<{
        message: string;
        data: {
            id: string;
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
            status: import("@prisma/client").$Enums.DriverStatus;
            isAvailable: boolean;
            currentLat: number | null;
            currentLng: number | null;
            verificationNote: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    }>;
    setAvailability(userId: string, dto: SetAvailabilityDto): Promise<{
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
    getBookings(userId: string): Promise<{
        message: string;
        data: ({
            user: {
                name: string | null;
                phone: string | null;
            };
            truck: {
                name: string;
            } | null;
        } & {
            id: string;
            userId: string;
            status: import("@prisma/client").$Enums.BookingStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            driverId: string | null;
            bookingNumber: string;
            truckId: string | null;
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
                    name: string | null;
                    email: string | null;
                    phone: string | null;
                };
                trucks: {
                    id: string;
                    status: import("@prisma/client").$Enums.TruckStatus;
                    name: string;
                }[];
            } & {
                id: string;
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
                status: import("@prisma/client").$Enums.DriverStatus;
                isAvailable: boolean;
                currentLat: number | null;
                currentLng: number | null;
                verificationNote: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            })[];
            total: number;
            page: number;
            limit: number;
        };
    }>;
    verify(id: string, dto: VerifyDriverDto): Promise<{
        message: string;
        data: {
            id: string;
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
            status: import("@prisma/client").$Enums.DriverStatus;
            isAvailable: boolean;
            currentLat: number | null;
            currentLng: number | null;
            verificationNote: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    }>;
}
