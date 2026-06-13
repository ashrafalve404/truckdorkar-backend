import { TrucksService } from './trucks.service';
import { UpdateTruckDto, ApproveTruckDto } from './dto/truck.dto';
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
    getMyTrucks(userId: string): Promise<{
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
    create(userId: string, body: any, files: {
        taxTokenFile?: Express.Multer.File[];
        blueBookFile?: Express.Multer.File[];
        numberPlateFile?: Express.Multer.File[];
        roadPermitFile?: Express.Multer.File[];
        drivingLicenseFile?: Express.Multer.File[];
    }): Promise<{
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
    update(id: string, user: any, dto: UpdateTruckDto): Promise<{
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
