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
exports.TrucksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TrucksService = class TrucksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver)
            throw new common_1.NotFoundException('Driver profile not found');
        const truck = await this.prisma.truck.create({
            data: {
                driverId: driver.id,
                name: data.name,
                registrationNo: data.registrationNo,
                category: data.category,
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
            },
        });
        return { message: 'Truck added successfully for review', data: truck };
    }
    async findMyTrucks(userId) {
        const driver = await this.prisma.driver.findUnique({ where: { userId } });
        if (!driver)
            throw new common_1.NotFoundException('Driver profile not found');
        const trucks = await this.prisma.truck.findMany({
            where: { driverId: driver.id, deletedAt: null },
            include: { images: true, documents: true },
            orderBy: { createdAt: 'desc' },
        });
        return { message: 'Your trucks fetched', data: trucks };
    }
    async findAll(query) {
        const { category, isAvailable, page = 1, limit = 20 } = query;
        const where = { status: 'APPROVED', deletedAt: null };
        if (category)
            where.category = category;
        if (isAvailable !== undefined)
            where.isAvailable = isAvailable;
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
    async findOne(id) {
        const truck = await this.prisma.truck.findUnique({
            where: { id },
            include: { images: true, documents: true, driver: { include: { user: { select: { name: true, phone: true, avatar: true } } } } },
        });
        if (!truck)
            throw new common_1.NotFoundException('Truck not found');
        return { message: 'Truck fetched', data: truck };
    }
    async update(id, userId, role, dto) {
        const truck = await this.prisma.truck.findUnique({ where: { id }, include: { driver: true } });
        if (!truck)
            throw new common_1.NotFoundException('Truck not found');
        if (role === client_1.Role.DRIVER && truck.driver.userId !== userId)
            throw new common_1.ForbiddenException();
        const updated = await this.prisma.truck.update({ where: { id }, data: dto });
        return { message: 'Truck updated', data: updated };
    }
    async remove(id, userId, role) {
        const truck = await this.prisma.truck.findUnique({ where: { id }, include: { driver: true } });
        if (!truck)
            throw new common_1.NotFoundException('Truck not found');
        if (role === client_1.Role.DRIVER && truck.driver.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.truck.update({ where: { id }, data: { deletedAt: new Date() } });
        return { message: 'Truck removed' };
    }
    async addImage(truckId, userId, imageUrl, isPrimary = false) {
        const truck = await this.prisma.truck.findUnique({ where: { id: truckId }, include: { driver: true } });
        if (!truck || truck.driver.userId !== userId)
            throw new common_1.ForbiddenException();
        if (isPrimary)
            await this.prisma.truckImage.updateMany({ where: { truckId }, data: { isPrimary: false } });
        const image = await this.prisma.truckImage.create({ data: { truckId, url: imageUrl, isPrimary } });
        return { message: 'Image added', data: image };
    }
    async approveTruck(truckId, status, note) {
        const truck = await this.prisma.truck.update({
            where: { id: truckId },
            data: { status: status, approvalNote: note },
        });
        return { message: 'Truck status updated', data: truck };
    }
};
exports.TrucksService = TrucksService;
exports.TrucksService = TrucksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TrucksService);
//# sourceMappingURL=trucks.service.js.map