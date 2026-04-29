
const { PrismaClient } = require("../generated/client/client");
const prisma = new PrismaClient();

async function main() {
    try {
        const schedules = await prisma.horarios_recurrentes.findMany();
        console.log("SCHEDULES_START");
        console.log(JSON.stringify(schedules));
        console.log("SCHEDULES_END");
        
        const employees = await prisma.empleados.findMany({ where: { activo: true, realiza_servicios: true } });
        console.log("EMPLOYEES_START");
        console.log(JSON.stringify(employees.map(e => ({ id: e.id, nombres: e.nombres }))));
        console.log("EMPLOYEES_END");

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
