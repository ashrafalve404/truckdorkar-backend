import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
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
        };
    }>;
    getAllUsers(page?: number, limit?: number): Promise<{
        message: string;
        data: {
            users: {
                name: string | null;
                email: string | null;
                phone: string | null;
                role: import("@prisma/client").$Enums.Role;
                id: string;
                isActive: boolean;
                createdAt: Date;
            }[];
            total: number;
            page: number;
            limit: number;
        };
    }>;
    toggleUser(id: string, isActive: boolean): Promise<{
        message: string;
        data: {
            id: string;
            isActive: boolean;
        };
    }>;
}
