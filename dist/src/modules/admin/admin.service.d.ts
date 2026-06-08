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
            };
            bookingStats: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.BookingGroupByOutputType, "status"[]> & {
                _count: {
                    _all: number;
                };
            })[];
            recentBookings: ({
                user: {
                    name: string | null;
                };
                driver: {
                    user: {
                        name: string | null;
                    };
                } | null;
            } & {
                status: import("@prisma/client").$Enums.BookingStatus;
                finalFare: number | null;
                pickupLat: number | null;
                pickupLng: number | null;
                dropLat: number | null;
                dropLng: number | null;
                goodsWeight: number | null;
                estimatedFare: number | null;
                id: string;
                bookingNumber: string;
                userId: string;
                driverId: string | null;
                truckId: string | null;
                type: import("@prisma/client").$Enums.BookingType;
                pickupAddress: string;
                dropAddress: string;
                scheduledAt: Date | null;
                goodsType: string | null;
                specialNote: string | null;
                cancelReason: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            })[];
        };
    }>;
    getAllUsers(page?: number, limit?: number): Promise<{
        message: string;
        data: {
            users: {
                role: import("@prisma/client").$Enums.Role;
                id: string;
                createdAt: Date;
                name: string | null;
                email: string | null;
                phone: string | null;
                isActive: boolean;
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
                    name: string | null;
                    phone: string | null;
                };
            } & {
                status: import("@prisma/client").$Enums.BookingStatus;
                finalFare: number | null;
                pickupLat: number | null;
                pickupLng: number | null;
                dropLat: number | null;
                dropLng: number | null;
                goodsWeight: number | null;
                estimatedFare: number | null;
                id: string;
                bookingNumber: string;
                userId: string;
                driverId: string | null;
                truckId: string | null;
                type: import("@prisma/client").$Enums.BookingType;
                pickupAddress: string;
                dropAddress: string;
                scheduledAt: Date | null;
                goodsType: string | null;
                specialNote: string | null;
                cancelReason: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
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
                    name: string | null;
                    email: string | null;
                    phone: string | null;
                    isActive: boolean;
                };
            } & {
                status: import("@prisma/client").$Enums.DriverStatus;
                id: string;
                userId: string;
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
}
