export declare class UpdateDriverProfileDto {
    name?: string;
    email?: string;
    nidNumber?: string;
    licenseNumber?: string;
    licenseExpiry?: string;
    experience?: number;
}
export declare class SetAvailabilityDto {
    isAvailable: boolean;
    lat?: number;
    lng?: number;
}
export declare class VerifyDriverDto {
    status: string;
    note?: string;
}
