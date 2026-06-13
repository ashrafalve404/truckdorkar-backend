"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SupportService = class SupportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTicket(userId, dto) {
        const ticket = await this.prisma.supportTicket.create({
            data: { userId, ...dto },
        });
        return { message: 'Support ticket created', data: ticket };
    }
    async findAll(userId, role) {
        const where = role === client_1.Role.ADMIN || role === client_1.Role.AGENT ? {} : { userId };
        const tickets = await this.prisma.supportTicket.findMany({
            where,
            include: { user: { select: { name: true, phone: true } } },
            orderBy: { updatedAt: 'desc' },
        });
        return { message: 'Tickets fetched', data: tickets };
    }
    async findOne(id, userId, role) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, phone: true } },
                replies: { include: { user: { select: { name: true, role: true, avatar: true } } }, orderBy: { createdAt: 'asc' } },
            },
        });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        if (role === client_1.Role.USER && ticket.userId !== userId)
            throw new common_1.ForbiddenException();
        return { message: 'Ticket fetched', data: ticket };
    }
    async reply(id, userId, dto) {
        const ticket = await this.prisma.supportTicket.findUnique({ where: { id } });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        const reply = await this.prisma.ticketReply.create({
            data: { ticketId: id, userId, message: dto.message },
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (user?.role === client_1.Role.ADMIN || user?.role === client_1.Role.AGENT) {
            await this.prisma.supportTicket.update({ where: { id }, data: { status: client_1.TicketStatus.IN_PROGRESS } });
        }
        return { message: 'Reply added', data: reply };
    }
    async updateStatus(id, status) {
        const ticket = await this.prisma.supportTicket.update({
            where: { id },
            data: { status },
        });
        return { message: 'Status updated', data: ticket };
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupportService);
//# sourceMappingURL=support.service.js.map