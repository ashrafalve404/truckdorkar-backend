import { BookingType } from '@prisma/client';
export declare class CreateBookingDto {
    type: BookingType;
    pickupAddress: string;
    pickupLat?: number;
    pickupLng?: number;
    dropAddress: string;
    dropLat?: number;
    dropLng?: number;
    truckType?: string;
    scheduledAt?: string;
    goodsType?: string;
    goodsWeight?: number;
    specialNote?: string;
    estimatedFare?: number;
    distance?: number;
    contactPhone: string;
}
export declare class UpdateBookingStatusDto {
    status: string;
    note?: string;
}
export declare class CancelBookingDto {
    reason?: string;
}
