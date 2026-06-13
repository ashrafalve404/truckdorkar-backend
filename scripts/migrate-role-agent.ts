import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Migrating employees to agents...');

    // Update Role enum usages in User table
    // Since we added AGENT to the enum, we can now update existing EMPLOYEE users
    const updatedUsers = await prisma.user.updateMany({
        where: { role: 'EMPLOYEE' as any },
        data: { role: 'AGENT' as any },
    });

    console.log(`Updated ${updatedUsers.count} users to AGENT role.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
