
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding packages...')

    // 1. Corte & Estilo
    const pack1 = await prisma.packages.create({
        data: {
            name: 'CORTE & ESTILO',
            price: 30.00,
            is_active: true,
            package_items: {
                create: [
                    { service_id: 1, quantity: 1 } // Assuming service_id 1 exists (Corte)
                ]
            }
        }
    })

    // 2. Ritual Caballero
    const pack2 = await prisma.packages.create({
        data: {
            name: 'RITUAL CABALLERO',
            price: 50.00,
            is_active: true, // Mark as popular? No field for that yet
            package_items: {
                create: [
                    { service_id: 1, quantity: 1 }, // Corte
                    // Add other services if you knew their IDs
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
