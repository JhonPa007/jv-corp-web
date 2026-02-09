
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Querying constraint definition...");
    try {
        const result = await prisma.$queryRaw`
      SELECT conname, pg_get_constraintdef(oid) as def
      FROM pg_constraint
      WHERE conname = 'gift_cards_status_check'
    `;
        console.log("CONSTRAINT RESULT:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("QUERY ERROR:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
