
import { PrismaClient } from './generated/client/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Status Check V2...");

    // 1. Check existing statuses
    try {
        const count = await prisma.gift_cards.count();
        console.log("Total existing cards:", count);
        if (count > 0) {
            const existing = await prisma.gift_cards.findMany({
                select: { status: true },
                take: 5
            });
            console.log(" >>> FOUND EXISTING STATUSES:", existing);
        }
    } catch (e) {
        console.log("Could not fetch existing:", (e as Error).message);
    }

    // 1.5 Get Constraint Definition
    try {
        const result = await prisma.$queryRaw`SELECT 
            conname as "constraint_name", 
            pg_get_constraintdef(oid) as "definition"
            FROM pg_constraint 
            WHERE conname = 'gift_cards_status_check'`;
        console.log(" >>> CONSTRAINT DEFINITION:", JSON.stringify(result, null, 2));
        fs.writeFileSync('constraint.log', JSON.stringify(result, null, 2));
    } catch (e) {
        console.log("Could not fetch constraint def:", (e as Error).message);
    }

    // 2. Try creating with new candidates
    const statuses = [
        'Issued', 'ISSUED', 'issued',
        'Pending', 'PENDING', 'pending',
        'Open', 'OPEN', 'open',
        'New', 'NEW', 'new',
        'Available', 'AVAILABLE', 'available',
        'Created', 'CREATED', 'created',
        'Active', 'ACTIVE', 'active'
    ];

    for (const status of statuses) {
        try {
            console.log(`Trying status: '${status}'`);
            await prisma.gift_cards.create({
                data: {
                    code: `TEST-V2-${status.substring(0, 5)}-${Math.floor(Math.random() * 1000)}`,
                    initial_amount: 10,
                    current_balance: 10,
                    status: status,
                    expiration_date: new Date(),
                    purchaser_name: 'Test',
                    recipient_name: 'Test'
                }
            });
            console.log(` >>> SUCCESS!! Status '${status}' is VALID.`);
            return; // Found it!
        } catch (e: any) {
            if (e?.message?.includes('gift_cards_status_check')) {
                // Constraint violation, expected
            } else {
                console.log(`Error with '${status}':`, e?.message?.substring(0, 100)); // Log short error
            }
        }
    }
    console.log("All candidates failed.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
