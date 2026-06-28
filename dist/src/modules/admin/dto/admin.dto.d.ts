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
