const { jiti } = require("jiti");
const path = require("path");

const loader = jiti(__filename, { esmResolve: true });

async function main() {
    try {
        const { prisma } = loader("../app/lib/prisma");
        const schedules = await prisma.horarios_recurrentes.findMany({ take: 5 });
        console.log("Schedules:", JSON.stringify(schedules, null, 2));
        
        const now = new Date();
        console.log("Current Day JS:", now.getDay());
    } catch (e) {
        console.error(e);
    }
}

main();
