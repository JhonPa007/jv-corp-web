"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export type PackageWithItems = {
    id: number;
    name: string;
    description: string | null;
    price: number; // Decimal converted to number for client
    package_items: {
        quantity: number;
        servicios: {
            nombre: string;
        };
    }[];
};

// Fetch active packages with their items and services
export async function getActivePackages() {
    try {
        const packages = await prisma.packages.findMany({
            where: { is_active: true },
            include: {
                package_items: {
                    include: {
                        servicios: true,
                    },
                },
            },
            orderBy: { price: "asc" },
        });

        // Serialize Decimal to number for client components
        return packages.map((pkg) => ({
            ...pkg,
            description: pkg.description,
            price: Number(pkg.price),
            package_items: pkg.package_items.map((item) => ({
                ...item,
                servicios: {
                    ...item.servicios,
                    price: Number(item.servicios.precio)
                }
            })),
        }));
    } catch (error) {
        console.error("Error fetching packages:", error);
        return [];
    }
}

// Create a new Gift Card
export async function createGiftCard(data: {
    amount: number;
    from: string;
    to: string;
    message?: string;
    packageId?: number;
    quantity?: number; // Optional, defaulted to 1 usually
}) {
    try {
        // Generate a unique code (Simple alphanumeric for now)
        const code = `JV-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Valid for 1 year

        const giftCard = await prisma.gift_cards.create({
            data: {
                code: code,
                initial_amount: data.amount,
                current_balance: data.amount,
                status: "Activa",
                expiration_date: expirationDate,
                purchaser_name: data.from,
                recipient_name: data.to,
                package_id: data.packageId,
            },
        });

        revalidatePath("/admin/gift-cards"); // Assuming an admin page exists or will exist
        return { success: true, code: giftCard.code, id: giftCard.id };
    } catch (error) {
        console.error("Error creating gift card:", error);
        return { success: false, error: "Failed to create gift card" };
    }
}
