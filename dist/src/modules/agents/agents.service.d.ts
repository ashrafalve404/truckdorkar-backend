import { PrismaService } from '../../prisma/prisma.service';
export declare class AgentsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(userId: string): Promise<{
        message: string;
        data: {
            counts: {
                myTrucksCount: number;
                pendingTrucks: number;
                totalCommission: number;
                todayBookings: number;
                totalTrips: number;
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
            createdAt: Date;
            updatedAt: Date;
            nidNumber: string | null;
            totalEarnings: number;
            agentId: string | null;
            dateOfBirth: Date | null;
            department: string | null;
            designation: string | null;
            userId: string;
        })[];
    }>;
    registerTruck(userId: string, data: any): Promise<{
        message: string;
        data: {
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
    getAdminOverview(): Promise<{
        message: string;
        data: {
            id: any;
            agentId: any;
            user: any;
            nidNumber: any;
            dateOfBirth: any;
            department: any;
            designation: any;
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
        })[];
    }>;
    approveTruck(truckId: string, status: string, note?: string): Promise<{
        message: string;
        data: {
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
        };
    }>;
    remove(agentId: string): Promise<{
        message: string;
    }>;
}
