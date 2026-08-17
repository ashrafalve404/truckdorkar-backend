import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class AgentsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    getDashboard(userId: string): Promise<{
        message: string;
        data: {
            counts: {
                myTrucksCount: number;
                pendingTrucks: number;
                todayBookings: number;
                totalTrips: number;
                walletBalance: number;
                tripCommission: number;
                totalEarnings: number;
            };
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: ({
            user: {
                id: string;
                email: string | null;
                phone: string | null;
                name: string | null;
                isActive: boolean;
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
        })[];
    }>;
    registerTruck(userId: string, data: any): Promise<{
        message: string;
        data: {
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
            truckType: string | null;
            approvalNote: string | null;
            registeredByAgentId: string | null;
        };
    }>;
    getAgentTrucks(userId: string): Promise<{
        message: string;
        data: ({
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
                referralCode: string | null;
                referralEarnings: number;
                status: import("@prisma/client").$Enums.DriverStatus;
                isAvailable: boolean;
                currentLat: number | null;
                currentLng: number | null;
                verificationNote: string | null;
                referredById: string | null;
            };
            images: {
                id: string;
                createdAt: Date;
                truckId: string;
                url: string;
                isPrimary: boolean;
            }[];
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
            truckType: string | null;
            approvalNote: string | null;
            registeredByAgentId: string | null;
        })[];
    }>;
    getAgentEarnings(userId: string): Promise<{
        message: string;
        data: {
            totalCommissions: number;
            totalTrips: number;
            trips: {
                id: string;
                bookingNumber: string;
                truckName: string | undefined;
                truckReg: string | undefined;
                driverName: string | null | undefined;
                driverPhone: string | null | undefined;
                fare: number;
                commission: number;
                completedAt: Date;
                distance: number | null;
            }[];
        };
    }>;
    requestWithdrawal(userId: string, amount: number, bkashNumber: string): Promise<{
        message: string;
        data: {
            id: string;
            agentId: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            method: string;
            amount: number;
            adminNote: string | null;
            bkashNumber: string;
        };
    }>;
    getMyWithdrawals(userId: string): Promise<{
        message: string;
        data: {
            id: string;
            agentId: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            method: string;
            amount: number;
            adminNote: string | null;
            bkashNumber: string;
        }[];
    }>;
    getAdminOverview(): Promise<{
        message: string;
        data: {
            id: any;
            agentId: any;
            user: any;
            nidNumber: any;
            nidFrontUrl: any;
            nidBackUrl: any;
            verificationStatus: any;
            dateOfBirth: any;
            department: any;
            designation: any;
            totalEarnings: any;
            walletBalance: any;
            trucksTotal: any;
            trucksPending: any;
            trucksApproved: any;
            trucksRejected: any;
            recentTrucks: any;
        }[];
    }>;
    getTrucksByAgentId(agentId: string): Promise<{
        message: string;
        data: ({
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
                referralCode: string | null;
                referralEarnings: number;
                status: import("@prisma/client").$Enums.DriverStatus;
                isAvailable: boolean;
                currentLat: number | null;
                currentLng: number | null;
                verificationNote: string | null;
                referredById: string | null;
            };
            images: {
                id: string;
                createdAt: Date;
                truckId: string;
                url: string;
                isPrimary: boolean;
            }[];
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
            truckType: string | null;
            approvalNote: string | null;
            registeredByAgentId: string | null;
        })[];
    }>;
    approveTruck(truckId: string, status: string, note?: string): Promise<{
        message: string;
        data: {
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
            truckType: string | null;
            approvalNote: string | null;
            registeredByAgentId: string | null;
        };
    }>;
    remove(agentId: string): Promise<{
        message: string;
    }>;
    getAgentProfile(userId: string): Promise<{
        message: string;
        data: {
            user: {
                email: string | null;
                phone: string | null;
                name: string | null;
                role: import("@prisma/client").$Enums.Role;
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
        };
    }>;
    updateNid(userId: string, data: {
        nidNumber: string;
        nidFrontUrl: string;
        nidBackUrl: string;
    }): Promise<{
        message: string;
        data: {
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
        };
    }>;
    verifyAgent(agentId: string, status: string): Promise<{
        message: string;
        data: {
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
        };
    }>;
    createAgent(data: any): Promise<{
        message: string;
        data: {
            agent: {
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            phone: string | null;
            name: string | null;
            password: string | null;
            avatar: string | null;
            role: import("@prisma/client").$Enums.Role;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            isActive: boolean;
            refreshToken: string | null;
            emailVerifyToken: string | null;
            phoneOtp: string | null;
            phoneOtpExpiry: Date | null;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            deletedAt: Date | null;
        };
    }>;
}
