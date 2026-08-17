import { Controller, Get, Patch, Post, Body, Param, UseGuards, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DriversService } from './drivers.service';
import { UpdateDriverProfileDto, SetAvailabilityDto, VerifyDriverDto } from './dto/driver.dto';
import { StorageService } from '../storage/storage.service';
import { Role } from '@prisma/client';

@ApiTags('drivers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'drivers', version: '1' })
export class DriversController {
    constructor(
        private readonly driversService: DriversService,
        private readonly storageService: StorageService,
    ) { }

    @Get('profile')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: "Get driver's own profile" })
    getProfile(@CurrentUser('id') userId: string) {
        return this.driversService.getProfile(userId);
    }

    @Patch('profile')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: 'Update driver profile' })
    updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateDriverProfileDto) {
        return this.driversService.updateProfile(userId, dto);
    }

    @Post('documents')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: 'Upload driver document (nid_front/nid_back/license_front/license_back)' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadDocument(
        @CurrentUser('id') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body('type') type: string,
    ) {
        const url = await this.storageService.save(file, 'documents');
        return this.driversService.uploadDocument(userId, type, url);
    }

    @Patch('availability')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: 'Set online/offline availability' })
    setAvailability(@CurrentUser('id') userId: string, @Body() dto: SetAvailabilityDto) {
        return this.driversService.setAvailability(userId, dto.isAvailable, dto.lat, dto.lng);
    }

    @Get('earnings')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: 'Get earnings summary' })
    getEarnings(@CurrentUser('id') userId: string) {
        return this.driversService.getEarnings(userId);
    }

    @Get('referral-stats')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: 'Get driver referral statistics and 5% commission logs' })
    getReferralStats(@CurrentUser('id') userId: string) {
        return this.driversService.getReferralStats(userId);
    }

    @Get('bookings')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: "Get driver's bookings" })
    getBookings(@CurrentUser('id') userId: string) {
        return this.driversService.getDriverBookings(userId);
    }

    @Get('commission-payments')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: 'Get driver commission payment history and balance' })
    getMyCommissionPayments(@CurrentUser('id') userId: string) {
        return this.driversService.getMyCommissionPayments(userId);
    }

    @Post('commission-payments')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: 'Submit a commission payment for approval' })
    submitCommissionPayment(
        @CurrentUser('id') userId: string,
        @Body() dto: { amount: number; transactionId: string }
    ) {
        return this.driversService.submitCommissionPayment(userId, dto.amount, dto.transactionId);
    }

    // Admin endpoints
    @Get()
    @Roles(Role.ADMIN, Role.AGENT)
    @ApiOperation({ summary: '[Admin] List all drivers' })
    findAll(@Query() query: { status?: string; page?: number; limit?: number }) {
        return this.driversService.findAll(query);
    }

    @Patch(':id/verify')
    @Roles(Role.ADMIN, Role.AGENT)
    @ApiOperation({ summary: '[Admin] Verify or reject a driver' })
    verify(@Param('id') id: string, @Body() dto: VerifyDriverDto) {
        return this.driversService.verifyDriver(id, dto.status, dto.note);
    }
}
