import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const agents = await prisma.agent.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: {
            id: true,
            nidNumber: true,
            nidFrontUrl: true,
            nidBackUrl: true,
            verificationStatus: true
        }
    });
    console.log(JSON.stringify(agents, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
