import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, type: NotificationType, title: string, body: string, data?: any) {
        const notification = await this.prisma.notification.create({
            data: { userId, type, title, body, data },
        });
        return notification;
    }

    async notifyAdmins(type: NotificationType, title: string, body: string, data?: any) {
        const admins = await this.prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true }
        });
        if (admins.length > 0) {
            await this.prisma.notification.createMany({
                data: admins.map((admin) => ({
                    userId: admin.id,
                    type,
                    title,
                    body,
                    data
                }))
            });
        }
    }

    async findAll(userId: string) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }

    async markAsRead(id: string, userId: string) {
        return this.prisma.notification.update({
            where: { id, userId },
            data: { isRead: true },
        });
    }

    async markAllAsRead(userId: string) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
}
