import { PrismaService } from '../../prisma/prisma.service';
import { CreateTruckDto, UpdateTruckDto } from './dto/truck.dto';
import { Role } from '@prisma/client';
export declare class TrucksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateTruckDto): Promise<{
        message: string;
        data: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.TruckStatus;
            isAvailable: boolean;
            year: number | null;
            driverId: string;
            registrationNo: string;
            category: import("@prisma/client").$Enums.TruckCategory;
            capacityTon: number;
            lengthFt: number;
            make: string | null;
            model: string | null;
            color: string | null;
            approvalNote: string | null;
        };
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
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                status: import("@prisma/client").$Enums.TruckStatus;
                isAvailable: boolean;
                year: number | null;
                driverId: string;
                registrationNo: string;
                category: import("@prisma/client").$Enums.TruckCategory;
                capacityTon: number;
                lengthFt: number;
                make: string | null;
                model: string | null;
                color: string | null;
                approvalNote: string | null;
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
            documents: {
                type: string;
                id: string;
                createdAt: Date;
                truckId: string;
                url: string;
                expiry: Date | null;
            }[];
        } & {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.TruckStatus;
            isAvailable: boolean;
            year: number | null;
            driverId: string;
            registrationNo: string;
            category: import("@prisma/client").$Enums.TruckCategory;
            capacityTon: number;
            lengthFt: number;
            make: string | null;
            model: string | null;
            color: string | null;
            approvalNote: string | null;
        };
    }>;
    update(id: string, userId: string, role: Role, dto: UpdateTruckDto): Promise<{
        message: string;
        data: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.TruckStatus;
            isAvailable: boolean;
            year: number | null;
            driverId: string;
            registrationNo: string;
            category: import("@prisma/client").$Enums.TruckCategory;
            capacityTon: number;
            lengthFt: number;
            make: string | null;
            model: string | null;
            color: string | null;
            approvalNote: string | null;
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
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: import("@prisma/client").$Enums.TruckStatus;
            isAvailable: boolean;
            year: number | null;
            driverId: string;
            registrationNo: string;
            category: import("@prisma/client").$Enums.TruckCategory;
            capacityTon: number;
            lengthFt: number;
            make: string | null;
            model: string | null;
            color: string | null;
            approvalNote: string | null;
        };
    }>;
}
