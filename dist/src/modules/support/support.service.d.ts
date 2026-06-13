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
            subject: string;
            description: string;
            status: import("@prisma/client").$Enums.TicketStatus;
            priority: import("@prisma/client").$Enums.TicketPriority;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
    }>;
    findAll(userId: string, role: Role): Promise<{
        message: string;
        data: ({
            user: {
                name: string | null;
                phone: string | null;
            };
        } & {
            id: string;
            subject: string;
            description: string;
            status: import("@prisma/client").$Enums.TicketStatus;
            priority: import("@prisma/client").$Enums.TicketPriority;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        })[];
    }>;
    findOne(id: string, userId: string, role: Role): Promise<{
        message: string;
        data: {
            user: {
                name: string | null;
                phone: string | null;
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
                ticketId: string;
                message: string;
            })[];
        } & {
            id: string;
            subject: string;
            description: string;
            status: import("@prisma/client").$Enums.TicketStatus;
            priority: import("@prisma/client").$Enums.TicketPriority;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
    }>;
    reply(id: string, userId: string, dto: CreateReplyDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            ticketId: string;
            message: string;
        };
    }>;
    updateStatus(id: string, status: TicketStatus): Promise<{
        message: string;
        data: {
            id: string;
            subject: string;
            description: string;
            status: import("@prisma/client").$Enums.TicketStatus;
            priority: import("@prisma/client").$Enums.TicketPriority;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
    }>;
}
