"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.upsert({
        where: { phone: '01711111111' },
        update: {},
        create: {
            name: 'Site Owner',
            phone: '01711111111',
            email: 'admin@truckdorkar.com',
            password: hashedPassword,
            role: client_1.Role.ADMIN,
            isActive: true,
        },
    });
    console.log('Admin created:', admin.phone);
    const driverUser = await prisma.user.upsert({
        where: { phone: '01811111111' },
        update: {},
        create: {
            name: 'Rahim Driver',
            phone: '01811111111',
            email: 'driver@truckdorkar.com',
            password: hashedPassword,
            role: client_1.Role.DRIVER,
            isActive: true,
            driver: {
                create: {
                    licenseNumber: 'DL123456',
                    status: client_1.DriverStatus.VERIFIED,
                    experience: 5,
                }
            }
        },
    });
    console.log('Driver created:', driverUser.phone);
    const agentUser = await prisma.user.upsert({
        where: { phone: '01911111111' },
        update: {},
        create: {
            name: 'Operations Staff',
            phone: '01911111111',
            email: 'agent@truckdorkar.com',
            password: hashedPassword,
            role: client_1.Role.AGENT,
            isActive: true,
            agent: {
                create: {
                    agentId: 'AGT001',
                    department: 'Logistics',
                    designation: 'Manager',
                }
            }
        },
    });
    console.log('Agent created:', agentUser.phone);
    const regularUser = await prisma.user.upsert({
        where: { phone: '01511111111' },
        update: {},
        create: {
            name: 'Ashik User',
            phone: '01511111111',
            email: 'user@truckdorkar.com',
            password: hashedPassword,
            role: client_1.Role.USER,
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
//# sourceMappingURL=seed.js.map