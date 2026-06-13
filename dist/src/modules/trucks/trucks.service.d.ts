import { PrismaService } from '../../prisma/prisma.service';
import { UpdateTruckDto } from './dto/truck.dto';
import { Role } from '@prisma/client';
export declare class TrucksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: any): Promise<{
        message: string;
        data: {
            name: string;
            registrationNo: string;
            description: string | null;
            category: import("@prisma/client").$Enums.TruckCategory;
            capacityTon: number;
            lengthFt: number;
            make: string | null;
            model: string | null;
            year: number | null;
            color: string | null;
            numberPlateText: string | null;
            roadPermitUrl: string | null;
            taxTokenUrl: string | null;
            blueBookUrl: string | null;
            numberPlateImageUrl: string | null;
            registeredByAgentId: string | null;
            isAvailable: boolean;
            status: import("@prisma/client").$Enums.TruckStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            drivingLicenseUrl: string | null;
            approvalNote: string | null;
            driverId: string;
        };
    }>;
    findMyTrucks(userId: string): Promise<{
        message: string;
        data: ({
            images: {
                id: string;
                createdAt: Date;
                truckId: string;
                url: string;
                isPrimary: boolean;
            }[];
            documents: {
                type: string;
                id: string;
                createdAt: Date;
                truckId: string;
                url: string;
                expiry: Date | null;
            }[];
        } & {
            name: string;
            registrationNo: string;
            description: string | null;
            category: import("@prisma/client").$Enums.TruckCategory;
            capacityTon: number;
            lengthFt: number;
            make: string | null;
            model: string | null;
            year: number | null;
            color: string | null;
            numberPlateText: string | null;
            roadPermitUrl: string | null;
            taxTokenUrl: string | null;
            blueBookUrl: string | null;
            numberPlateImageUrl: string | null;
            registeredByAgentId: string | null;
            isAvailable: boolean;
            status: import("@prisma/client").$Enums.TruckStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            drivingLicenseUrl: string | null;
            approvalNote: string | null;
            driverId: string;
        })[];
    }>;
    findAll(query: {
        category?: string;
        isAvailable?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        message: string;
        data: {
            trucks: ({
                driver: {
                    user: {
                        name: string | null;
                        phone: string | null;
                    };
                } & {
                    isAvailable: boolean;
                    status: import("@prisma/client").$Enums.DriverStatus;
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
                    currentLat: number | null;
                    currentLng: number | null;
                    verificationNote: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    truckId: string;
                    url: string;
                    isPrimary: boolean;
                }[];
            } & {
                name: string;
                registrationNo: string;
                description: string | null;
                category: import("@prisma/client").$Enums.TruckCategory;
                capacityTon: number;
                lengthFt: number;
                make: string | null;
                model: string | null;
                year: number | null;
                color: string | null;
                numberPlateText: string | null;
                roadPermitUrl: string | null;
                taxTokenUrl: string | null;
                blueBookUrl: string | null;
                numberPlateImageUrl: string | null;
                registeredByAgentId: string | null;
                isAvailable: boolean;
                status: import("@prisma/client").$Enums.TruckStatus;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                drivingLicenseUrl: string | null;
                approvalNote: string | null;
                driverId: string;
            })[];
            total: number;
            page: number;
            limit: number;
        };
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: {
            driver: {
                user: {
                    name: string | null;
                    phone: string | null;
                    avatar: string | null;
                };
            } & {
                isAvailable: boolean;
                status: import("@prisma/client").$Enums.DriverStatus;
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
                currentLat: number | null;
                currentLng: number | null;
                verificationNote: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
            images: {
                id: string;
                createdAt: Date;
                truckId: string;
                url: string;
                isPrimary: boolean;
            }[];
            documents: {
                type: string;
                id: string;
                createdAt: Date;
                truckId: string;
                url: string;
                expiry: Date | null;
            }[];
        } & {
            name: string;
            registrationNo: string;
            description: string | null;
            category: import("@prisma/client").$Enums.TruckCategory;
            capacityTon: number;
            lengthFt: number;
            make: string | null;
            model: string | null;
            year: number | null;
            color: string | null;
            numberPlateText: string | null;
            roadPermitUrl: string | null;
            taxTokenUrl: string | null;
            blueBookUrl: string | null;
            numberPlateImageUrl: string | null;
            registeredByAgentId: string | null;
            isAvailable: boolean;
            status: import("@prisma/client").$Enums.TruckStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            drivingLicenseUrl: string | null;
            approvalNote: string | null;
            driverId: string;
        };
    }>;
    update(id: string, userId: string, role: Role, dto: UpdateTruckDto): Promise<{
        message: string;
        data: {
            name: string;
            registrationNo: string;
            description: string | null;
            category: import("@prisma/client").$Enums.TruckCategory;
            capacityTon: number;
            lengthFt: number;
            make: string | null;
            model: string | null;
            year: number | null;
            color: string | null;
            numberPlateText: string | null;
            roadPermitUrl: string | null;
            taxTokenUrl: string | null;
            blueBookUrl: string | null;
            numberPlateImageUrl: string | null;
            registeredByAgentId: string | null;
            isAvailable: boolean;
            status: import("@prisma/client").$Enums.TruckStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            drivingLicenseUrl: string | null;
            approvalNote: string | null;
            driverId: string;
        };
    }>;
    remove(id: string, userId: string, role: Role): Promise<{
        message: string;
    }>;
    addImage(truckId: string, userId: string, imageUrl: string, isPrimary?: boolean): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            truckId: string;
            url: string;
            isPrimary: boolean;
        };
    }>;
    approveTruck(truckId: string, status: string, note?: string): Promise<{
        message: string;
        data: {
            name: string;
            registrationNo: string;
            description: string | null;
            category: import("@prisma/client").$Enums.TruckCategory;
            capacityTon: number;
            lengthFt: number;
            make: string | null;
            model: string | null;
            year: number | null;
            color: string | null;
            numberPlateText: string | null;
            roadPermitUrl: string | null;
            taxTokenUrl: string | null;
            blueBookUrl: string | null;
            numberPlateImageUrl: string | null;
            registeredByAgentId: string | null;
            isAvailable: boolean;
            status: import("@prisma/client").$Enums.TruckStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            drivingLicenseUrl: string | null;
            approvalNote: string | null;
            driverId: string;
        };
    }>;
}
