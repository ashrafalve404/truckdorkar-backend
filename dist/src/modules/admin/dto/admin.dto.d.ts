import { Role } from '@prisma/client';
export declare class TruckFareDto {
    id: string;
    nameEn: string;
    nameBn: string;
    minFare10km: number;
    capacityTon?: number;
    lengthFt?: number;
    farePerKm?: number;
    isActive?: boolean;
}
export declare class UpdateSettingsDto {
    platformName?: string;
    adminEmail?: string;
    baseFarePerKm?: number;
    truckFares?: TruckFareDto[];
}
export declare class CreateAdminDto {
    name: string;
    phone: string;
    email: string;
    password: string;
}
export declare class AdminChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class CreateUserByAdminDto {
    name: string;
    phone: string;
    email?: string;
    password: string;
    role: Role;
}
