import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/contact.dto';
import { Role } from '@prisma/client';

@ApiTags('contact')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'contact', version: '1' })
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Public()
    @Post('submit')
    @ApiOperation({ summary: 'Submit contact inquiry (public)' })
    submit(@Body() dto: CreateContactDto) {
        return this.contactService.submit(dto);
    }

    @Get()
    @ApiBearerAuth('access-token')
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @ApiOperation({ summary: '[Admin] List all inquiries' })
    findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.contactService.findAll(page, limit);
    }

    @Patch(':id/read')
    @ApiBearerAuth('access-token')
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @ApiOperation({ summary: '[Admin] Mark inquiry as read' })
    markAsRead(@Param('id') id: string) {
        return this.contactService.markAsRead(id);
    }
}
