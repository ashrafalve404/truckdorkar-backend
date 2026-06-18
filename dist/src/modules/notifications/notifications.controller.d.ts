import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(userId: string): Promise<{
        id: string;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        body: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        isRead: boolean;
        createdAt: Date;
    }[]>;
    markAsRead(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        body: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        isRead: boolean;
        createdAt: Date;
    }>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
