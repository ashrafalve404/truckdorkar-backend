"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Migrating employees to agents...');
    const updatedUsers = await prisma.user.updateMany({
        where: { role: 'EMPLOYEE' },
        data: { role: 'AGENT' },
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
//# sourceMappingURL=migrate-role-agent.js.map