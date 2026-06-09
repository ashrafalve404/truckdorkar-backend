import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        message: string;
        data: {
            summary: {
                totalUsers: number;
                totalDrivers: number;
                totalTrucks: number;
                totalBookings: number;
                totalRevenue: number;
                pendingDrivers: number;
                openTickets: number;
            };
            bookingStats: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.BookingGroupByOutputType, "status"[]> & {
                _count: {
                    _all: number;
                };
            })[];
            recentBookings: ({
                driver: {
                    user: {
                        name: string | null;
                    };
                } | null;
                user: {
                    name: string | null;
                };
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
        };
    }>;
    getAllUsers(page?: number, limit?: number): Promise<{
        message: string;
        data: {
            users: {
                id: string;
                email: string | null;
                phone: string | null;
                name: string | null;
                role: import("@prisma/client").$Enums.Role;
                isActive: boolean;
                createdAt: Date;
            }[];
            total: number;
            page: number;
            limit: number;
        };
    }>;
    toggleUserStatus(id: string, isActive: boolean): Promise<{
        message: string;
        data: {
            id: string;
            isActive: boolean;
        };
    }>;
    getAllBookings(page?: number, limit?: number): Promise<{
        message: string;
        data: {
            bookings: ({
                user: {
                    phone: string | null;
                    name: string | null;
                };
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
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getAllDrivers(page?: number, limit?: number): Promise<{
        message: string;
        data: {
            drivers: ({
                user: {
                    id: string;
                    email: string | null;
                    phone: string | null;
                    name: string | null;
                    isActive: boolean;
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
            })[];
            total: number;
            page: number;
            limit: number;
        };
    }>;
    verifyDriver(id: string, status: string, note?: string): Promise<{
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
    getSettings(): Promise<{
        message: string;
        data: {
            platformName: string;
            adminEmail: string;
            baseFarePerKm: number;
        };
    }>;
    updateSettings(settingsData: any): Promise<{
        message: string;
        data: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
