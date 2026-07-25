import { AdminService } from './admin.service';
import { UpdateSettingsDto, CreateAdminDto, AdminChangePasswordDto } from './dto/admin.dto';
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
                totalAgents: number;
                totalBookings: number;
                totalRevenue: number;
                companyRevenue: number;
                receivedCommission: any;
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
        };
    }>;
    getAllUsers(page?: number, limit?: number): Promise<{
        message: string;
        data: {
            users: {
                agent: {
                    nidNumber: string | null;
                } | null;
                id: string;
                createdAt: Date;
                email: string | null;
                phone: string | null;
                name: string | null;
                avatar: string | null;
                role: import("@prisma/client").$Enums.Role;
                isActive: boolean;
                driver: {
                    nidNumber: string | null;
                } | null;
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
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getAllDrivers(page?: number, limit?: number): Promise<{
        message: string;
        data: {
            drivers: any[];
            total: number;
            page: number;
            limit: number;
        };
    }>;
    verifyDriver(id: string, status: string, note?: string): Promise<{
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
    getAllTrucks(page?: number, limit?: number, status?: string): Promise<{
        message: string;
        data: {
            trucks: ({
                driver: {
                    user: {
                        phone: string | null;
                        name: string | null;
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
                images: {
                    id: string;
                    createdAt: Date;
                    truckId: string;
                    url: string;
                    isPrimary: boolean;
                }[];
                registeredByAgent: ({
                    user: {
                        name: string | null;
                    };
                } & {
                    id: string;
                    userId: string;
                    agentId: string | null;
                    nidNumber: string | null;
                    nidFrontUrl: string | null;
                    nidBackUrl: string | null;
                    verificationStatus: string;
                    dateOfBirth: Date | null;
                    department: string | null;
                    designation: string | null;
                    walletBalance: number;
                    totalEarnings: number;
                    lastDailyBonusAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                }) | null;
            } & {
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
            })[];
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getSettings(): Promise<{
        message: string;
        data: {
            platformName: any;
            adminEmail: any;
            baseFarePerKm: any;
            truckFares: any[];
        };
    }>;
    updateSettings(dto: UpdateSettingsDto): Promise<{
        message: string;
        data: import("@prisma/client/runtime/library").JsonValue;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    deleteDriver(id: string): Promise<{
        message: string;
    }>;
    deleteTruck(id: string): Promise<{
        message: string;
    }>;
    deleteAgent(id: string): Promise<{
        message: string;
    }>;
    getPendingPayments(): Promise<({
        driver: {
            user: {
                phone: string | null;
                name: string | null;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        driverId: string;
        amount: number;
        transactionId: string;
        method: string;
        adminNote: string | null;
    })[]>;
    approvePayment(id: string, note?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        driverId: string;
        amount: number;
        transactionId: string;
        method: string;
        adminNote: string | null;
    }>;
    rejectPayment(id: string, note?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        driverId: string;
        amount: number;
        transactionId: string;
        method: string;
        adminNote: string | null;
    }>;
    createAdmin(dto: CreateAdminDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            email: string | null;
            phone: string | null;
            name: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    changePassword(adminId: string, dto: AdminChangePasswordDto): Promise<{
        message: string;
    }>;
}
