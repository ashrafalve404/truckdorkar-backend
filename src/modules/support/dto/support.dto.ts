import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketPriority } from '@prisma/client';

export class CreateTicketDto {
    @ApiProperty({ example: 'Payment issue' })
    @IsString()
    subject: string;

    @ApiProperty({ example: 'I was charged twice for booking TD-1234.' })
    @IsString()
    description: string;

    @ApiPropertyOptional({ enum: TicketPriority, default: TicketPriority.MEDIUM })
    @IsOptional()
    @IsEnum(TicketPriority)
    priority?: TicketPriority;
}

export class CreateReplyDto {
    @ApiProperty({ example: 'We are looking into it.' })
    @IsString()
    message: string;
}
