import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { StorageService } from '../storage/storage.service';
export declare class UsersController {
    private readonly usersService;
    private readonly storageService;
    constructor(usersService: UsersService, storageService: StorageService);
    getProfile(userId: string): Promise<{
        message: string;
        data: {
            id: string;
            email: string | null;
            phone: string | null;
            name: string | null;
            avatar: string | null;
            role: import("@prisma/client").$Enums.Role;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            createdAt: Date;
            driver: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
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
                status: import("@prisma/client").$Enums.DriverStatus;
                isAvailable: boolean;
                currentLat: number | null;
                currentLng: number | null;
                verificationNote: string | null;
            } | null;
            agent: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                nidNumber: string | null;
                agentId: string | null;
                dateOfBirth: Date | null;
                department: string | null;
                designation: string | null;
            } | null;
            addresses: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                address: string;
                label: string;
                city: string;
                district: string | null;
                latitude: number | null;
                longitude: number | null;
                isDefault: boolean;
            }[];
        };
    }>;
    updateProfile(userId: string, dto: UpdateUserDto): Promise<{
        message: string;
        data: {
            id: string;
            email: string | null;
            phone: string | null;
            name: string | null;
            avatar: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    uploadAvatar(userId: string, file: Express.Multer.File): Promise<{
        message: string;
        data: {
            id: string;
            avatar: string | null;
        };
    }>;
    getAddresses(userId: string): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            address: string;
            label: string;
            city: string;
            district: string | null;
            latitude: number | null;
            longitude: number | null;
            isDefault: boolean;
        }[];
    }>;
    createAddress(userId: string, dto: CreateAddressDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            address: string;
            label: string;
            city: string;
            district: string | null;
            latitude: number | null;
            longitude: number | null;
            isDefault: boolean;
        };
    }>;
    updateAddress(userId: string, id: string, dto: Partial<CreateAddressDto>): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            address: string;
            label: string;
            city: string;
            district: string | null;
            latitude: number | null;
            longitude: number | null;
            isDefault: boolean;
        };
    }>;
    deleteAddress(userId: string, id: string): Promise<{
        message: string;
    }>;
    getActivity(userId: string): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            userId: string | null;
            action: string;
            entity: string | null;
            entityId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
        }[];
    }>;
}
