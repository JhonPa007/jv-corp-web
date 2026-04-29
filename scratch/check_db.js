
const { PrismaClient } = require('../generated/client');
const prisma = new PrismaClient();

async function main() {
    const employees = await prisma.empleados.findMany({
        take: 5,
        select: { id: true, nombres: true, apellidos: true }
    });
    console.log('Employees:', JSON.stringify(employees, null, 2));

    const recurrente = await prisma.horarios_recurrentes.findMany({
        take: 5
    });
    console.log('Recurrente:', JSON.stringify(recurrente, null, 2));

    const empleado = await prisma.horarios_empleado.findMany({
        take: 5
    });
    console.log('Empleado:', JSON.stringify(empleado, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
