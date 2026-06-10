import { Controller, Get, Post, Patch, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, CancelBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { BookingStatus, Role } from '@prisma/client';

@ApiTags('bookings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'bookings', version: '1' })
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new booking' })
    create(@CurrentUser('id') userId: string, @Body() dto: CreateBookingDto) {
        return this.bookingsService.create(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all bookings (filtered by role)' })
    findAll(@CurrentUser() user: { id: string; role: Role }) {
        return this.bookingsService.findAll(user.id, user.role);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get booking details' })
    findOne(@Param('id') id: string, @CurrentUser() user: { id: string; role: Role }) {
        return this.bookingsService.findOne(id, user.id, user.role);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel a booking' })
    cancel(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: CancelBookingDto) {
        return this.bookingsService.cancel(id, userId, dto);
    }

    @Patch(':id/accept')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: 'Driver accepts a booking' })
    accept(@Param('id') bookingId: string, @CurrentUser('id') userId: string) {
        return this.bookingsService.driverAccept(bookingId, userId);
    }

    @Patch(':id/status')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: 'Driver updates booking status' })
    updateStatus(
        @Param('id') bookingId: string,
        @CurrentUser('id') userId: string,
        @Body() dto: UpdateBookingStatusDto,
    ) {
        return this.bookingsService.updateStatus(bookingId, userId, dto.status as BookingStatus, dto.note);
    }

    @Get(':id/tracking')
    @ApiOperation({ summary: 'Get booking tracking info' })
    getTracking(@Param('id') bookingId: string) {
        return this.bookingsService.getTracking(bookingId);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Admin deletes a booking' })
    remove(@Param('id') id: string) {
        return this.bookingsService.remove(id);
    }
}
