import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { StorageService } from '../storage/storage.service';

@ApiTags('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly storageService: StorageService,
    ) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    getProfile(@CurrentUser('id') userId: string) {
        return this.usersService.getProfile(userId);
    }

    @Patch('profile')
    @ApiOperation({ summary: 'Update user profile' })
    updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateUserDto) {
        return this.usersService.updateProfile(userId, dto);
    }

    @Post('profile/avatar')
    @ApiOperation({ summary: 'Upload profile avatar' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('avatar'))
    async uploadAvatar(@CurrentUser('id') userId: string, @UploadedFile() file: Express.Multer.File) {
        const url = await this.storageService.save(file, 'avatars');
        return this.usersService.updateAvatar(userId, url);
    }

    @Get('addresses')
    @ApiOperation({ summary: 'List saved addresses' })
    getAddresses(@CurrentUser('id') userId: string) {
        return this.usersService.getAddresses(userId);
    }

    @Post('addresses')
    @ApiOperation({ summary: 'Add a new address' })
    createAddress(@CurrentUser('id') userId: string, @Body() dto: CreateAddressDto) {
        return this.usersService.createAddress(userId, dto);
    }

    @Patch('addresses/:id')
    @ApiOperation({ summary: 'Update an address' })
    updateAddress(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: Partial<CreateAddressDto>) {
        return this.usersService.updateAddress(userId, id, dto);
    }

    @Delete('addresses/:id')
    @ApiOperation({ summary: 'Delete an address' })
    deleteAddress(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.usersService.deleteAddress(userId, id);
    }

    @Get('activity')
    @ApiOperation({ summary: 'Get user activity history' })
    getActivity(@CurrentUser('id') userId: string) {
        return this.usersService.getActivityHistory(userId);
    }
}
