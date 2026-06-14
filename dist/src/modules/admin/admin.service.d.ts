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
                pendingTrucks: number;
                openTickets: number;
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
                    id: string;
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
    verifyDriver(id: string, status: string, note?: string): Promise<{
        message: string;
        data: {
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
    getAllTrucks(page?: number, limit?: number, status?: string): Promise<{
        message: string;
        data: {
            trucks: ({
                driver: {
                    user: {
                        name: string | null;
                        phone: string | null;
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
                };
                images: {
                    id: string;
                    truckId: string;
                    createdAt: Date;
                    isPrimary: boolean;
                    url: string;
                }[];
                registeredByAgent: ({
                    user: {
                        name: string | null;
                    };
                } & {
                    id: string;
                    userId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    nidNumber: string | null;
                    agentId: string | null;
                    dateOfBirth: Date | null;
                    department: string | null;
                    designation: string | null;
                }) | null;
            } & {
                status: import("@prisma/client").$Enums.TruckStatus;
                description: string | null;
                id: string;
                driverId: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                isAvailable: boolean;
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
                approvalNote: string | null;
                registeredByAgentId: string | null;
            })[];
            total: number;
            page: number;
            limit: number;
        };
    }>;
    updateSettings(settingsData: any): Promise<{
        message: string;
        data: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
