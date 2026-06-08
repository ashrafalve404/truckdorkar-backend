import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, type: NotificationType, title: string, body: string, data?: any): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        body: string;
        isRead: boolean;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        body: string;
        isRead: boolean;
    }[]>;
    markAsRead(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        body: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
