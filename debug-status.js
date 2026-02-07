
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const statuses = ['ACTIVA', 'Activo', 'ACTIVO', 'Active', 'ACTIVE', 'Generada', 'Emitida', 'Valid'];
    console.log("Starting Status Check...");

    // 1. Check existing statuses
    try {
        const existing = await prisma.gift_cards.findMany({ select: { status: true }, take: 5 });
        console.log("Existing statuses:", existing);
    } catch (e) {
        console.log("Could not fetch existing:", e.message);
    }

    // 2. Try creating
    for (const status of statuses) {
        try {
            console.log(`Trying to create with status: '${status}'`);
            await prisma.gift_cards.create({
                data: {
                    code: `TEST-${status}-${Math.floor(Math.random() * 10000)}`,
                    initial_amount: 10,
                    current_balance: 10,
                    status: status,
                    expiration_date: new Date(),
                    purchaser_name: 'Test',
                    recipient_name: 'Test'
                }
            });
            console.log(` >>> SUCCESS: Status '${status}' is VALID.`);
            return;
        } catch (e) {
            if (e.message.includes('gift_cards_status_check')) {
                console.log(` >>> FAILED: '${status}' violates constraint.`);
            } else {
                console.log(` >>> ERROR with '${status}':`, e.message);
            }
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
