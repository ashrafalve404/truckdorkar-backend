import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTruckDto, UpdateTruckDto } from './dto/truck.dto';
import { Role, TruckCategory } from '@prisma/client';

function getEnumCategory(categoryStr: string): TruckCategory {
    const upper = (categoryStr || '').toUpperCase();
    if (Object.values(TruckCategory).includes(upper as TruckCategory)) {
        return upper as TruckCategory;
    }
    if (upper.includes('COVER')) {
        if (upper.includes('1.5') || upper.includes('1_5')) return TruckCategory.T1_5_COVER_10_12FT;
        if (upper.includes('3') || upper.includes('3TON')) return TruckCategory.T3_COVER_16_14FT;
        return TruckCategory.T1_COVER_7_9FT;
    } else {
        if (upper.includes('1.5') || upper.includes('1_5')) return TruckCategory.T1_5_OPEN_10_12FT;
        if (upper.includes('3') || upper.includes('3TON')) return TruckCategory.T3_OPEN_16_14FT;
        return TruckCategory.T1_OPEN_7_9FT;
    }
}

@Injectable()
export class TrucksService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, data: any) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver) throw new NotFoundException('Driver profile not found');

        const resolvedCategory = getEnumCategory(data.category);

        const truck = await this.prisma.truck.create({
            data: {
                driverId: driver.id,
                name: data.name,
                registrationNo: data.registrationNo,
                category: resolvedCategory,
                capacityTon: Number(data.capacityTon),
                lengthFt: Number(data.lengthFt),
                make: data.make,
                model: data.model,
                year: data.year ? Number(data.year) : undefined,
                color: data.color,
                description: data.description,
                numberPlateText: data.numberPlateText,
                roadPermitUrl: data.roadPermitUrl,
                taxTokenUrl: data.taxTokenUrl,
                blueBookUrl: data.blueBookUrl,
                numberPlateImageUrl: data.numberPlateImageUrl,
                drivingLicenseUrl: data.drivingLicenseUrl,
                truckType: data.category,
                status: 'PENDING',
            } as any,
        });
        return { message: 'Truck added successfully for review', data: truck };
    }

    async findMyTrucks(userId: string) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver) throw new NotFoundException('Driver profile not found');

        const trucks = await this.prisma.truck.findMany({
            where: { driverId: driver.id, deletedAt: null },
            include: { images: true, documents: true },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Your trucks fetched', data: trucks };
    }

    async findAll(query: { category?: string; isAvailable?: boolean; page?: number; limit?: number }) {
        const { category, isAvailable, page = 1, limit = 20 } = query;
        const where: any = { status: 'APPROVED', deletedAt: null };
        if (category) where.category = category;
        if (isAvailable !== undefined) where.isAvailable = isAvailable;
        const [trucks, total] = await Promise.all([
            this.prisma.truck.findMany({
                where,
                include: {
                    images: true,
                    driver: { include: { user: { select: { name: true, phone: true } } } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.truck.count({ where }),
        ]);
        return { message: 'Trucks fetched', data: { trucks, total, page, limit } };
    }

    async findOne(id: string) {
        const truck = await this.prisma.truck.findUnique({
            where: { id },
            include: { images: true, documents: true, driver: { include: { user: { select: { name: true, phone: true, avatar: true } } } } },
        });
        if (!truck) throw new NotFoundException('Truck not found');
        return { message: 'Truck fetched', data: truck };
    }

    async update(id: string, userId: string, role: Role, dto: UpdateTruckDto) {
        const truck = await this.prisma.truck.findUnique({ where: { id }, include: { driver: true } });
        if (!truck) throw new NotFoundException('Truck not found');
        if (role === Role.DRIVER && truck.driver.userId !== userId) throw new ForbiddenException();
        const updated = await this.prisma.truck.update({ where: { id }, data: dto });
        return { message: 'Truck updated', data: updated };
    }

    async remove(id: string, userId: string, role: Role) {
        const truck = await this.prisma.truck.findUnique({ where: { id }, include: { driver: true } });
        if (!truck) throw new NotFoundException('Truck not found');
        if (role === Role.DRIVER && truck.driver.userId !== userId) throw new ForbiddenException();
        await this.prisma.truck.update({ where: { id }, data: { deletedAt: new Date() } });
        return { message: 'Truck removed' };
    }

    async addImage(truckId: string, userId: string, imageUrl: string, isPrimary = false) {
        const truck = await this.prisma.truck.findUnique({ where: { id: truckId }, include: { driver: true } });
        if (!truck || truck.driver.userId !== userId) throw new ForbiddenException();
        if (isPrimary) await this.prisma.truckImage.updateMany({ where: { truckId }, data: { isPrimary: false } });
        const image = await this.prisma.truckImage.create({ data: { truckId, url: imageUrl, isPrimary } });
        return { message: 'Image added', data: image };
    }

    async approveTruck(truckId: string, status: string, note?: string) {
        const truck = await this.prisma.truck.update({
            where: { id: truckId },
            data: { status: status as any, approvalNote: note },
        });
        return { message: 'Truck status updated', data: truck };
    }
}
