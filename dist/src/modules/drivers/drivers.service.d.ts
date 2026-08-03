import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateDriverProfileDto } from './dto/driver.dto';
export declare class DriversService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
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
                createdAt: Date;
                updatedAt: Date;
                name: string;
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
            }[];
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
    }>;
    updateProfile(userId: string, dto: UpdateDriverProfileDto): Promise<{
        message: string;
        data: {
            user: {
                email: string | null;
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
    }>;
    uploadDocument(userId: string, type: string, url: string): Promise<{
        message: string;
        data: {
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
                estimatedFare: number | null;
                finalFare: number | null;
                distance: number | null;
            }[];
            totalEarnings: number;
            totalTrips: number;
            rating: number;
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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.BookingStatus;
            type: import("@prisma/client").$Enums.BookingType;
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
            contactPhone: string | null;
            agentCommission: number | null;
            companyCommission: number | null;
            driverEarnings: number | null;
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
    }>;
    submitCommissionPayment(userId: string, amount: number, transactionId: string): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            method: string;
            driverId: string;
            amount: number;
            transactionId: string;
            adminNote: string | null;
        };
    }>;
    getMyCommissionPayments(userId: string): Promise<{
        message: string;
        data: {
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.PaymentStatus;
                method: string;
                driverId: string;
                amount: number;
                transactionId: string;
                adminNote: string | null;
            }[];
            totalDue: number;
            paidAlready: number;
            currentBalance: number;
        };
    }>;
}
