
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const result = await prisma.$queryRaw`
      SELECT pg_get_constraintdef(oid) AS constraint_def
      FROM pg_constraint
      WHERE conname = 'gift_cards_status_check';
    `;
        console.log("Constraint Definition:", result);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
