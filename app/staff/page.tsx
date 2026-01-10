import { prisma } from "../lib/prisma";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getStaff() {
    try {
        const staff = await prisma.empleados.findMany({
            where: {
                activo: true,
                realiza_servicios: true
                // Optional: Only show staff with photos? Or show placeholders?
                // Let's show all active staff, placeholders if needed.
            },
            select: {
                id: true,
                nombres: true,
                apellidos: true,
                profesion: true
            },
            orderBy: { nombres: 'asc' }
        });
        return staff;
    } catch (e) {
        console.error("Error fetching staff:", e);
        return [];
    }
}

export default async function StaffPage() {
    const staff = await getStaff();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="container mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-agency font-bold text-barberia-gold mb-6 tracking-wide">
                        NUESTRO EQUIPO
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        Maestros en el arte de la barbería y el estilismo. Conoce a los profesionales detrás de tu mejor look.
                    </p>
                </div>

                {staff.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {staff.map((member) => (
                            <div key={member.id} className="group relative bg-[#111] border border-white/5 overflow-hidden rounded-lg hover:border-barberia-gold transition-colors duration-300">
                                {/* Image Container */}
                                <div className="h-[400px] w-full relative grayscale group-hover:grayscale-0 transition-all duration-500">
                                    <Image
                                        src={"/images/hero-luxury-barber.png"} // Fallback image needed
                                        alt={member.nombres}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                </div>

                                {/* Info Overlay */}
                                <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-2xl font-agency font-bold text-white mb-1 group-hover:text-barberia-gold transition-colors">
                                        {member.nombres} {member.apellidos}
                                    </h3>
                                    <p className="text-gray-400 uppercase tracking-wider text-sm font-medium mb-4">
                                        {member.profesion || "Especialista JV"}
                                    </p>

                                    {/* Optional: Add social links or 'Book' button here later */}
                                    <div className="w-full h-0.5 bg-barberia-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 border border-white/10 rounded-lg bg-[#111]">
                        <p className="text-gray-400 text-lg">Nuestro equipo se está preparando. Pronto verás sus perfiles aquí.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
