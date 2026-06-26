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
            id: string;
            createdAt: Date;
            email: string | null;
            phone: string | null;
            name: string | null;
            avatar: string | null;
            role: import("@prisma/client").$Enums.Role;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            driver: {
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
            } | null;
            addresses: {
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
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
            userId: string | null;
            createdAt: Date;
            action: string;
            entity: string | null;
            entityId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
        }[];
    }>;
}
