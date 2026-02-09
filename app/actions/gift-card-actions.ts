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

// Helper to try creating with a specific status
async function tryCreateWithStatus(data: any, status: string, code: string, expirationDate: Date) {
    return await prisma.gift_cards.create({
        data: {
            code: code,
            initial_amount: data.amount,
            current_balance: data.amount,
            status: status,
            expiration_date: expirationDate,
            purchaser_name: data.from,
            recipient_name: data.to,
            package_id: data.packageId,
        },
    });
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

        // Try candidate statuses in order of likelihood
        const candidateStatuses = ["is_active", "IS_ACTIVE", "true", "TRUE", "1", "Activa", "ACTIVA", "Activo", "ACTIVO", "Active", "ACTIVE", "Valid", "VALID", "Generada", "Emitida"];

        let giftCard;
        let lastError;

        for (const status of candidateStatuses) {
            try {
                giftCard = await tryCreateWithStatus(data, status, code, expirationDate);
                break; // Success!
            } catch (error: any) {
                lastError = error;
                // Only retry if it's the specific check constraint error
                if (error?.message?.includes('gift_cards_status_check') || error?.code === 'P2002') {
                    // Continue to next status
                    continue;
                }
                throw error; // Rethrow other errors
            }
        }

        if (!giftCard) {
            console.error("Failed to create gift card with any known status. Last error:", lastError);
            throw lastError || new Error("Failed to create gift card: Invalid status constraint");
        }

        revalidatePath("/admin/gift-cards"); // Assuming an admin page exists or will exist
        return { success: true, code: giftCard.code, id: giftCard.id };
    } catch (error) {
        console.error("Error creating gift card:", error);
        return { success: false, error: "Failed to create gift card" };
    }
}
