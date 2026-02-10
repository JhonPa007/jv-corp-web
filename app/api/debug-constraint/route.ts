
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
    try {
        const result = await prisma.$queryRaw`SELECT 
            conname as "constraint_name", 
            pg_get_constraintdef(oid) as "definition"
            FROM pg_constraint 
            WHERE conname = 'gift_cards_status_check'`;

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
