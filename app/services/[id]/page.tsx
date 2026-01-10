import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { id: string } }) {
    const categoryId = parseInt(params.id);

    if (isNaN(categoryId)) {
        notFound();
    }

    // Fetch Category Info
    const categoryData = await prisma.categorias_servicios.findUnique({
        where: { id: categoryId }
    }).catch(e => null);

    if (!categoryData) {
        notFound();
    }

    // Attempt to fetch services matching the category ID
    const services = await prisma.servicios.findMany({
        where: {
            activo: true,
            categoria_id: categoryId
        }
    }).catch((e) => {
        console.error("Error fetching services", e);
        return [];
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="mb-12">
                    <Link href="/services" className="text-barberia-gold hover:text-white transition-colors mb-4 inline-block font-agency tracking-wider">
                        ← VOLVER A SERVICIOS
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-agency font-bold text-white mb-4 uppercase">
                        {categoryData.nombre}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl font-light">
                        {categoryData.descripcion || "Servicios exclusivos."}
                    </p>
                </div>

                {services.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service: any) => (
                            <div key={service.id} className="bg-[#111] border border-white/10 p-8 hover:border-barberia-gold/50 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-agency font-bold text-white group-hover:text-barberia-gold transition-colors">
                                        {service.nombre}
                                    </h3>
                                    <span className="text-barberia-gold font-bold font-agency text-2xl">
                                        S/ {Number(service.precio).toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                                    {service.descripcion || "Servicio profesional de alta calidad."}
                                </p>
                                <div className="flex justify-between items-center text-sm text-gray-500 border-t border-white/5 pt-4">
                                    <span>{service.duracion_minutos} min</span>
                                    <Link href={`/reservas?serviceId=${service.id}`} className="text-white hover:text-barberia-gold transition-colors uppercase font-bold tracking-wider text-xs">
                                        Reservar
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 border border-white/10 rounded-lg">
                        <p className="text-gray-400 text-lg">Próximamente disponible.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
