import { TruckCategory } from '@prisma/client';
export declare class CreateTruckDto {
    name: string;
    registrationNo: string;
    category: TruckCategory;
    capacityTon: number;
    lengthFt: number;
    make?: string;
    model?: string;
    year?: number;
    color?: string;
    description?: string;
}
export declare class UpdateTruckDto {
    name?: string;
    capacityTon?: number;
    description?: string;
    isAvailable?: boolean;
}
export declare class ApproveTruckDto {
    status: string;
    note?: string;
}
