import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTicketDto, CreateReplyDto } from './dto/support.dto';
import { Role, TicketStatus } from '@prisma/client';

@Injectable()
export class SupportService {
    constructor(private prisma: PrismaService) { }

    async createTicket(userId: string, dto: CreateTicketDto) {
        const ticket = await this.prisma.supportTicket.create({
            data: { userId, ...dto },
        });
        return { message: 'Support ticket created', data: ticket };
    }

    async findAll(userId: string, role: Role) {
        const where = role === Role.ADMIN || role === Role.EMPLOYEE ? {} : { userId };
        const tickets = await this.prisma.supportTicket.findMany({
            where,
            include: { user: { select: { name: true, phone: true } } },
            orderBy: { updatedAt: 'desc' },
        });
        return { message: 'Tickets fetched', data: tickets };
    }

    async findOne(id: string, userId: string, role: Role) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, phone: true } },
                replies: { include: { user: { select: { name: true, role: true, avatar: true } } }, orderBy: { createdAt: 'asc' } },
            },
        });
        if (!ticket) throw new NotFoundException('Ticket not found');
        if (role === Role.USER && ticket.userId !== userId) throw new ForbiddenException();
        return { message: 'Ticket fetched', data: ticket };
    }

    async reply(id: string, userId: string, dto: CreateReplyDto) {
        const ticket = await this.prisma.supportTicket.findUnique({ where: { id } });
        if (!ticket) throw new NotFoundException('Ticket not found');

        const reply = await this.prisma.ticketReply.create({
            data: { ticketId: id, userId, message: dto.message },
        });

        // Auto update status if employee replies
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (user?.role === Role.ADMIN || user?.role === Role.EMPLOYEE) {
            await this.prisma.supportTicket.update({ where: { id }, data: { status: TicketStatus.IN_PROGRESS } });
        }

        return { message: 'Reply added', data: reply };
    }

    async updateStatus(id: string, status: TicketStatus) {
        const ticket = await this.prisma.supportTicket.update({
            where: { id },
            data: { status },
        });
        return { message: 'Status updated', data: ticket };
    }
}
