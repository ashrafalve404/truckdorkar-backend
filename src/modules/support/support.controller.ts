import { Controller, Post, Get, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SupportService } from './support.service';
import { CreateTicketDto, CreateReplyDto } from './dto/support.dto';
import { Role, TicketStatus } from '@prisma/client';

@ApiTags('support')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'support', version: '1' })
export class SupportController {
    constructor(private readonly supportService: SupportService) { }

    @Post('tickets')
    @ApiOperation({ summary: 'Create a new support ticket' })
    create(@CurrentUser('id') userId: string, @Body() dto: CreateTicketDto) {
        return this.supportService.createTicket(userId, dto);
    }

    @Get('tickets')
    @ApiOperation({ summary: 'List tickets (filtered by role)' })
    findAll(@CurrentUser() user: { id: string; role: Role }) {
        return this.supportService.findAll(user.id, user.role);
    }

    @Get('tickets/:id')
    @ApiOperation({ summary: 'Get ticket details and conversation' })
    findOne(@Param('id') id: string, @CurrentUser() user: { id: string; role: Role }) {
        return this.supportService.findOne(id, user.id, user.role);
    }

    @Post('tickets/:id/replies')
    @ApiOperation({ summary: 'Add a reply to a ticket' })
    reply(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: CreateReplyDto) {
        return this.supportService.reply(id, userId, dto);
    }

    @Patch('tickets/:id/status')
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @ApiOperation({ summary: '[Admin] Update ticket status' })
    updateStatus(@Param('id') id: string, @Body('status') status: TicketStatus) {
        return this.supportService.updateStatus(id, status);
    }
}
