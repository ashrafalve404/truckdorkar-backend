import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        message: string;
        data: {
            driver: {
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
            } | null;
            employee: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                employeeId: string | null;
                department: string | null;
                designation: string | null;
                userId: string;
            } | null;
            name: string | null;
            email: string | null;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            id: string;
            avatar: string | null;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            createdAt: Date;
            addresses: {
                address: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
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
            name: string | null;
            email: string | null;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            id: string;
            avatar: string | null;
        };
    }>;
    updateAvatar(userId: string, avatarUrl: string): Promise<{
        message: string;
        data: {
            id: string;
            avatar: string | null;
        };
    }>;
    getAddresses(userId: string): Promise<{
        message: string;
        data: {
            address: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
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
            address: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            label: string;
            city: string;
            district: string | null;
            latitude: number | null;
            longitude: number | null;
            isDefault: boolean;
        };
    }>;
    updateAddress(userId: string, addressId: string, dto: Partial<CreateAddressDto>): Promise<{
        message: string;
        data: {
            address: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            label: string;
            city: string;
            district: string | null;
            latitude: number | null;
            longitude: number | null;
            isDefault: boolean;
        };
    }>;
    deleteAddress(userId: string, addressId: string): Promise<{
        message: string;
    }>;
    getActivityHistory(userId: string): Promise<{
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
