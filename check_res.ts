const { PrismaClient } = require('./generated/client/client');
const prisma = new PrismaClient();

async function checkReservations() {
  const now = new Date();
  const start = new Date(Date.UTC(2026, 4, 2, 5, 0, 0)); // May 2nd, 00:00 Peru
  const end = new Date(Date.UTC(2026, 4, 3, 5, 0, 0));   // May 3rd, 00:00 Peru

  console.log("Querying from:", start.toISOString(), "to", end.toISOString());

  const reservations = await prisma.reservas.findMany({
    where: {
      fecha_hora_inicio: {
        gte: start,
        lt: end
      }
    },
    include: {
      empleados: { select: { nombre_display: true, nombres: true } }
    }
  });

  console.log(`Found ${reservations.length} reservations:`);
  reservations.forEach(r => {
    console.log(`- ${r.empleados?.nombre_display || r.empleados?.nombres}: ${r.fecha_hora_inicio.toISOString()} to ${r.fecha_hora_fin.toISOString()}`);
  });
}

checkReservations();
