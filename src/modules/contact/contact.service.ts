import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
    constructor(private prisma: PrismaService) { }

    async submit(dto: CreateContactDto) {
        const contact = await this.prisma.contactMessage.create({
            data: dto,
        });
        // Here logic to send email to admin would go
        return { message: 'Inquiry received. We will contact you soon.', data: contact };
    }

    async findAll(page: number = 1, limit: number = 20) {
        const [messages, total] = await Promise.all([
            this.prisma.contactMessage.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.contactMessage.count(),
        ]);
        return { message: 'Messages fetched', data: { messages, total, page, limit } };
    }

    async markAsRead(id: string) {
        const message = await this.prisma.contactMessage.update({
            where: { id },
            data: { isRead: true },
        });
        return { message: 'Marked as read', data: message };
    }
}
