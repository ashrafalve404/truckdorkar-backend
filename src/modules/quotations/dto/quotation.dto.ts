import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuotationDto {
    @ApiProperty({ example: 'clxq9y8z00000abc123456789' })
    @IsString()
    bookingId: string;

    @ApiProperty({ example: 4500.50 })
    @IsNumber()
    amount: number;

    @ApiPropertyOptional({ example: 'I can deliver within 2 hours' })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiPropertyOptional({ example: '2024-12-25T10:00:00Z' })
    @IsOptional()
    @IsDateString()
    expiresAt?: string;
}
