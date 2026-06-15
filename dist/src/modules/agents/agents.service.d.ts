import { PrismaService } from '../../prisma/prisma.service';
export declare class AgentsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        message: string;
        data: {
            counts: {
                pendingDrivers: number;
                pendingTrucks: number;
                openTickets: number;
                todayBookings: number;
            };
            recentTickets: ({
                user: {
                    name: string | null;
                    phone: string | null;
                };
            } & {
                status: import("@prisma/client").$Enums.TicketStatus;
                id: string;
                userId: string;
                subject: string;
                description: string;
                priority: import("@prisma/client").$Enums.TicketPriority;
                createdAt: Date;
                updatedAt: Date;
            })[];
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: ({
            user: {
                name: string | null;
                email: string | null;
                phone: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            agentId: string | null;
            nidNumber: string | null;
            dateOfBirth: Date | null;
            department: string | null;
            designation: string | null;
        })[];
    }>;
    registerTruck(userId: string, data: any): Promise<{
        message: string;
        data: {
            status: import("@prisma/client").$Enums.TruckStatus;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            deletedAt: Date | null;
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
            isAvailable: boolean;
            approvalNote: string | null;
            driverId: string;
            registeredByAgentId: string | null;
        };
        info: string | undefined;
    }>;
    getTrucksByAgent(userId: string): Promise<{
        message: string;
        data: ({
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
                isAvailable: boolean;
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
        } & {
            status: import("@prisma/client").$Enums.TruckStatus;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            deletedAt: Date | null;
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
            isAvailable: boolean;
            approvalNote: string | null;
            driverId: string;
            registeredByAgentId: string | null;
        })[];
    }>;
    getAdminOverview(): Promise<{
        message: string;
        data: {
            id: any;
            agentId: any;
            user: any;
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
                isAvailable: boolean;
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
        } & {
            status: import("@prisma/client").$Enums.TruckStatus;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            deletedAt: Date | null;
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
            isAvailable: boolean;
            approvalNote: string | null;
            driverId: string;
            registeredByAgentId: string | null;
        })[];
    }>;
    approveTruck(truckId: string, status: string, note?: string): Promise<{
        message: string;
        data: {
            status: import("@prisma/client").$Enums.TruckStatus;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            deletedAt: Date | null;
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
            isAvailable: boolean;
            approvalNote: string | null;
            driverId: string;
            registeredByAgentId: string | null;
        };
    }>;
    remove(agentId: string): Promise<{
        message: string;
    }>;
}
