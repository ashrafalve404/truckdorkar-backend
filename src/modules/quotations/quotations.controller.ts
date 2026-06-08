import { Controller, Post, Get, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './dto/quotation.dto';
import { Role } from '@prisma/client';

@ApiTags('quotations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'quotations', version: '1' })
export class QuotationsController {
    constructor(private readonly quotationsService: QuotationsService) { }

    @Post()
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: 'Submit a quotation for a booking' })
    submit(@CurrentUser('id') userId: string, @Body() dto: CreateQuotationDto) {
        return this.quotationsService.submit(userId, dto);
    }

    @Get('booking/:bookingId')
    @ApiOperation({ summary: 'Get all quotations for a specific booking' })
    findForBooking(@Param('bookingId') bookingId: string) {
        return this.quotationsService.findForBooking(bookingId);
    }

    @Post(':id/accept')
    @Roles(Role.USER)
    @ApiOperation({ summary: 'Accept a quotation and assign the driver' })
    accept(@Param('id') id: string, @CurrentUser('id') userId: string) {
        return this.quotationsService.accept(id, userId);
    }

    @Post(':id/reject')
    @Roles(Role.USER)
    @ApiOperation({ summary: 'Reject a quotation' })
    reject(@Param('id') id: string, @CurrentUser('id') userId: string) {
        return this.quotationsService.reject(id, userId);
    }
}
