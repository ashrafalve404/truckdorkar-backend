import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { Role } from '@prisma/client';

import { UpdateSettingsDto } from './dto/admin.dto';

@ApiTags('admin')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller({ path: 'admin', version: '1' })
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('dashboard/stats')
    @ApiOperation({ summary: 'Get high-level dashboard statistics' })
    getStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('users')
    @ApiOperation({ summary: 'List all users in the system' })
    getAllUsers(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.adminService.getAllUsers(page, limit);
    }

    @Patch('users/:id/status')
    @ApiOperation({ summary: 'Activate or deactivate a user' })
    toggleUser(@Param('id') id: string, @Body('isActive') isActive: boolean) {
        return this.adminService.toggleUserStatus(id, isActive);
    }

    @Get('bookings')
    @ApiOperation({ summary: 'List all bookings in the system' })
    getAllBookings(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.adminService.getAllBookings(page, limit);
    }

    @Get('drivers')
    @ApiOperation({ summary: 'List all drivers in the system' })
    getAllDrivers(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.adminService.getAllDrivers(page, limit);
    }

    @Patch('drivers/:id/verify')
    @ApiOperation({ summary: 'Verify or reject a driver' })
    verifyDriver(@Param('id') id: string, @Body('status') status: string, @Body('note') note?: string) {
        return this.adminService.verifyDriver(id, status, note);
    }

    @Get('trucks')
    @ApiOperation({ summary: 'List all trucks in the system' })
    getAllTrucks(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('status') status?: string,
    ) {
        return this.adminService.getAllTrucks(page, limit, status);
    }

    @Get('settings')
    @ApiOperation({ summary: 'Get system settings' })
    getSettings() {
        return this.adminService.getSettings();
    }

    @Patch('settings')
    @ApiOperation({ summary: 'Update system settings' })
    updateSettings(@Body() dto: UpdateSettingsDto) {
        return this.adminService.updateSettings(dto);
    }

    @Delete('users/:id')
    @ApiOperation({ summary: 'Permanently delete a user' })
    deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(id);
    }

    @Delete('drivers/:id')
    @ApiOperation({ summary: 'Permanently delete a driver' })
    deleteDriver(@Param('id') id: string) {
        return this.adminService.deleteDriver(id);
    }

    @Delete('trucks/:id')
    @ApiOperation({ summary: 'Permanently delete a truck' })
    deleteTruck(@Param('id') id: string) {
        return this.adminService.deleteTruck(id);
    }

    @Delete('agents/:id')
    @ApiOperation({ summary: 'Permanently delete an agent' })
    deleteAgent(@Param('id') id: string) {
        return this.adminService.deleteAgent(id);
    }

    @Get('commission-payments')
    @ApiOperation({ summary: 'List all pending commission payments' })
    getPendingPayments() {
        return this.adminService.getPendingCommissionPayments();
    }

    @Patch('commission-payments/:id/approve')
    @ApiOperation({ summary: 'Approve a commission payment' })
    approvePayment(@Param('id') id: string, @Body('adminNote') note?: string) {
        return this.adminService.approveCommissionPayment(id, note);
    }

    @Patch('commission-payments/:id/reject')
    @ApiOperation({ summary: 'Reject a commission payment' })
    rejectPayment(@Param('id') id: string, @Body('adminNote') note?: string) {
        return this.adminService.rejectCommissionPayment(id, note);
    }
}
