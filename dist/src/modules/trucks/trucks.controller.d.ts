import { TrucksService } from './trucks.service';
import { CreateTruckDto, UpdateTruckDto, ApproveTruckDto } from './dto/truck.dto';
import { StorageService } from '../storage/storage.service';
export declare class TrucksController {
    private readonly trucksService;
    private readonly storageService;
    constructor(trucksService: TrucksService, storageService: StorageService);
    findAll(query: any): Promise<{
        message: string;
        data: {
            trucks: ({
                driver: {
                    user: {
                        name: string | null;
                        phone: string | null;
                    };
                } & {
                    licenseNumber: string | null;
                    experience: number | null;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    nidNumber: string | null;
                    nidFront: string | null;
                    nidBack: string | null;
                    licenseFront: string | null;
                    licenseBack: string | null;
                    licenseExpiry: Date | null;
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
                licenseNumber: string | null;
                experience: number | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                nidNumber: string | null;
                nidFront: string | null;
                nidBack: string | null;
                licenseFront: string | null;
                licenseBack: string | null;
                licenseExpiry: Date | null;
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
    update(id: string, user: any, dto: UpdateTruckDto): Promise<{
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
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    addImage(truckId: string, userId: string, file: Express.Multer.File, isPrimary?: string): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            truckId: string;
            url: string;
            isPrimary: boolean;
        };
    }>;
    approve(id: string, dto: ApproveTruckDto): Promise<{
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
