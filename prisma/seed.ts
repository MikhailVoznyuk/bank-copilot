import "dotenv/config";
import crypto from "crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { Role, Status } from "@/generated/prisma/enums";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({adapter});

const hash = (v: string) => {
    return crypto.createHash("sha256").update(v).digest("hex");
}

async function main() {
    await prisma.user.upsert({
        where: {login: 'client1'},
        update: {
            login: 'client1',
            passwordHash: hash('client1'),
            role: Role.client,
            actorId: 'client-1',
            firstName: 'Алексей',
            middleName: 'Михайлович',
            lastName: 'Романов',
            status: Status.premier
        },
        create: {
            login: 'client1',
            passwordHash: hash('client1'),
            role: Role.client,
            actorId: 'client-1',
            firstName: 'Алексей',
            middleName: 'Михайлович',
            lastName: 'Романов',
            status: Status.premier
        }
    })
    await prisma.user.upsert({
        where: {login: 'client2'},
        update: {
            login: 'client2',
            passwordHash: hash('client2'),
            role: Role.client,
            actorId: 'client-2',
            firstName: 'Анна',
            middleName: 'Владимировна',
            lastName: 'Гагарина',
            status: Status.basic
        },
        create: {
            login: 'client2',
            passwordHash: hash('client2'),
            role: Role.client,
            actorId: 'client-2',
            firstName: 'Анна',
            middleName: 'Владимировна',
            lastName: 'Гагарина',
            status: Status.basic
        }
    })
    await prisma.user.upsert({
        where: {login: 'operator1'},
        update: {
            login: 'operator1',
            passwordHash: hash('operator1'),
            role: Role.operator,
            actorId: 'operator-1',
            firstName: 'Сергей',
            middleName: 'Владимирович',
            lastName: 'Меньшиков',
            status: null
        },
        create: {
            login: 'operator1',
            passwordHash: hash('operator1'),
            role: Role.operator,
            actorId: 'operator-1',
            firstName: 'Сергей',
            middleName: 'Владимирович',
            lastName: 'Меньшиков',
            status: null
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (err) => {
        console.error(err);
        await prisma.$disconnect();
        process.exit(1);
    })

