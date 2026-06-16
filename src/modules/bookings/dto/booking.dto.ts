import { IsString, IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingType } from '@prisma/client';

export class CreateBookingDto {
    @ApiProperty({ enum: BookingType, default: BookingType.INTER_CITY })
    @IsEnum(BookingType)
    type: BookingType;

    @ApiProperty({ example: 'Gulshan, Dhaka' })
    @IsString()
    pickupAddress: string;

    @ApiPropertyOptional() @IsOptional() @IsNumber() pickupLat?: number;
    @ApiPropertyOptional() @IsOptional() @IsNumber() pickupLng?: number;

    @ApiProperty({ example: 'Chittagong Port, Chittagong' })
    @IsString()
    dropAddress: string;

    @ApiPropertyOptional() @IsOptional() @IsNumber() dropLat?: number;
    @ApiPropertyOptional() @IsOptional() @IsNumber() dropLng?: number;

    @ApiPropertyOptional({ example: '1_ton_open_7ft' })
    @IsOptional()
    @IsString()
    truckType?: string;

    @ApiPropertyOptional({ example: '2024-12-25T10:00:00Z' })
    @IsOptional()
    @IsDateString()
    scheduledAt?: string;

    @ApiPropertyOptional({ example: 'Electronics' })
    @IsOptional()
    @IsString()
    goodsType?: string;

    @ApiPropertyOptional({ example: 2.5 })
    @IsOptional()
    @IsNumber()
    goodsWeight?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    specialNote?: string;

    @ApiPropertyOptional({ example: 4500 })
    @IsOptional()
    @IsNumber()
    estimatedFare?: number;

    @ApiPropertyOptional({ example: 15.5 })
    @IsOptional()
    @IsNumber()
    distance?: number;
}

export class UpdateBookingStatusDto {
    @ApiProperty()
    @IsString()
    status: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    note?: string;
}

export class CancelBookingDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    reason?: string;
}
