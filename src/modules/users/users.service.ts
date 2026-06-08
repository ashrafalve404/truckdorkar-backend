import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, name: true, email: true, phone: true, avatar: true,
                role: true, isEmailVerified: true, isPhoneVerified: true, createdAt: true,
                driver: true, employee: true, addresses: true,
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return { message: 'Profile fetched', data: user };
    }

    async updateProfile(userId: string, dto: UpdateUserDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: dto,
            select: { id: true, name: true, email: true, phone: true, avatar: true, role: true },
        });
        return { message: 'Profile updated', data: user };
    }

    async updateAvatar(userId: string, avatarUrl: string) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarUrl },
            select: { id: true, avatar: true },
        });
        return { message: 'Avatar updated', data: user };
    }

    async getAddresses(userId: string) {
        const addresses = await this.prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' },
        });
        return { message: 'Addresses fetched', data: addresses };
    }

    async createAddress(userId: string, dto: CreateAddressDto) {
        if (dto.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        const address = await this.prisma.address.create({ data: { ...dto, userId } });
        return { message: 'Address created', data: address };
    }

    async updateAddress(userId: string, addressId: string, dto: Partial<CreateAddressDto>) {
        const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
        if (!address) throw new NotFoundException('Address not found');
        if (dto.isDefault) {
            await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
        }
        const updated = await this.prisma.address.update({ where: { id: addressId }, data: dto });
        return { message: 'Address updated', data: updated };
    }

    async deleteAddress(userId: string, addressId: string) {
        const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
        if (!address) throw new NotFoundException('Address not found');
        await this.prisma.address.delete({ where: { id: addressId } });
        return { message: 'Address deleted' };
    }

    async getActivityHistory(userId: string) {
        const logs = await this.prisma.activityLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        return { message: 'Activity fetched', data: logs };
    }
}
