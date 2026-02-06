
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding packages...')

    // Get first available service to link (mock logic for now if specific IDs aren't known)
    const service = await prisma.servicios.findFirst()
    const serviceId = service ? service.id : 1 // Fallback to 1 if no service found (might fail if empty)

    if (!service) {
        console.warn("WARNING: No services found in DB. Package items might fail if FK is strict.")
    }

    // 1. Corte & Estilo
    const pack1 = await prisma.packages.create({
        data: {
            name: 'CORTE & ESTILO',
            price: 30.00,
            is_active: true,
            package_items: {
                create: [
                    { service_id: serviceId, quantity: 1 }
                ]
            }
        }
    })

    // 2. Ritual Caballero
    const pack2 = await prisma.packages.create({
        data: {
            name: 'RITUAL CABALLERO',
            price: 50.00,
            is_active: true,
            package_items: {
                create: [
                    { service_id: serviceId, quantity: 1 }
                ]
            }
        }
    })

    console.log('Packages created:', pack1, pack2)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
