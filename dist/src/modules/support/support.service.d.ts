import { PrismaService } from '../../prisma/prisma.service';
import { CreateTicketDto, CreateReplyDto } from './dto/support.dto';
import { Role, TicketStatus } from '@prisma/client';
export declare class SupportService {
    private prisma;
    constructor(prisma: PrismaService);
    createTicket(userId: string, dto: CreateTicketDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.TicketStatus;
            description: string;
            userId: string;
            subject: string;
            priority: import("@prisma/client").$Enums.TicketPriority;
        };
    }>;
    findAll(userId: string, role: Role): Promise<{
        message: string;
        data: ({
            user: {
                phone: string | null;
                name: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.TicketStatus;
            description: string;
            userId: string;
            subject: string;
            priority: import("@prisma/client").$Enums.TicketPriority;
        })[];
    }>;
    findOne(id: string, userId: string, role: Role): Promise<{
        message: string;
        data: {
            user: {
                phone: string | null;
                name: string | null;
            };
            replies: ({
                user: {
                    name: string | null;
                    avatar: string | null;
                    role: import("@prisma/client").$Enums.Role;
                };
            } & {
                id: string;
                createdAt: Date;
                userId: string;
                message: string;
                ticketId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.TicketStatus;
            description: string;
            userId: string;
            subject: string;
            priority: import("@prisma/client").$Enums.TicketPriority;
        };
    }>;
    reply(id: string, userId: string, dto: CreateReplyDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            message: string;
            ticketId: string;
        };
    }>;
    updateStatus(id: string, status: TicketStatus): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.TicketStatus;
            description: string;
            userId: string;
            subject: string;
            priority: import("@prisma/client").$Enums.TicketPriority;
        };
    }>;
}
