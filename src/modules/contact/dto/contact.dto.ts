import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
    @ApiProperty({ example: 'Ashikur Rahman' })
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: '01826-110036' })
    @IsString()
    phone: string;

    @ApiPropertyOptional({ example: 'ashik@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ example: 'I want to partner with you for a corporate project.' })
    @IsString()
    @MaxLength(1000)
    message: string;
}
