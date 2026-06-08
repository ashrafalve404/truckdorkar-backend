import { PrismaClient, Role, DriverStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Admin
    const admin = await prisma.user.upsert({
        where: { phone: '01711111111' },
        update: {},
        create: {
            name: 'Site Owner',
            phone: '01711111111',
            email: 'admin@truckdorkar.com',
            password: hashedPassword,
            role: Role.ADMIN,
            isActive: true,
        },
    });
    console.log('Admin created:', admin.phone);

    // 2. Create Driver
    const driverUser = await prisma.user.upsert({
        where: { phone: '01811111111' },
        update: {},
        create: {
            name: 'Rahim Driver',
            phone: '01811111111',
            email: 'driver@truckdorkar.com',
            password: hashedPassword,
            role: Role.DRIVER,
            isActive: true,
            driver: {
                create: {
                    licenseNumber: 'DL123456',
                    status: DriverStatus.VERIFIED,
                    experience: 5,
                }
            }
        },
    });
    console.log('Driver created:', driverUser.phone);

    // 3. Create Employee
    const employeeUser = await prisma.user.upsert({
        where: { phone: '01911111111' },
        update: {},
        create: {
            name: 'Operations Staff',
            phone: '01911111111',
            email: 'employee@truckdorkar.com',
            password: hashedPassword,
            role: Role.EMPLOYEE,
            isActive: true,
            employee: {
                create: {
                    employeeId: 'EMP001',
                    department: 'Logistics',
                    designation: 'Manager',
                }
            }
        },
    });
    console.log('Employee created:', employeeUser.phone);

    // 4. Create Regular User
    const regularUser = await prisma.user.upsert({
        where: { phone: '01511111111' },
        update: {},
        create: {
            name: 'Ashik User',
            phone: '01511111111',
            email: 'user@truckdorkar.com',
            password: hashedPassword,
            role: Role.USER,
            isActive: true,
        },
    });
    console.log('Regular User created:', regularUser.phone);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
