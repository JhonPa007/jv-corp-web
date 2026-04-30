import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const staff = await prisma.empleados.findMany({
            where: { activo: true, realiza_servicios: true },
            select: { id: true, nombres: true }
        });

        const schedules = await prisma.horarios_recurrentes.findMany({
            take: 20
        });

        const now = new Date();
        const dayOfWeek = now.getDay();

        return NextResponse.json({
            currentDayJS: dayOfWeek,
            currentTime: now.toISOString(),
            staffCount: staff.length,
            staff,
            schedulesCount: schedules.length,
            schedules
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
