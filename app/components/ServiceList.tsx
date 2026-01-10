import { prisma } from "../lib/prisma";

export default async function ServiceList() {
    let services: any[] = [];
    try {
        services = await prisma.servicios.findMany({
            include: {
                categorias_servicios: true,
            },
            where: {
                activo: true,
                categorias_servicios: {
                    activo: true
                }
            },
        });
    } catch (error) {
        console.error("Error fetching services:", error);
        return (
            <div className="text-center p-8 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
                <p className="text-red-700 dark:text-red-300 font-bold mb-2">
                    No se pudieron cargar los servicios.
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                    Por favor intenta de nuevo más tarde o verifica la conexión.
                </p>
            </div>
        );
    }

    // Helper for images (Static mapping for now)
    const getServiceImage = (category: string, serviceName: string) => {
        const name = serviceName.toLowerCase();
        const cat = category.toLowerCase();

        if (cat.includes("barber") || cat.includes("caballero") || name.includes("corte")) {
            return "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80";
        }
        if (cat.includes("salon") || cat.includes("dama") || name.includes("tinte") || name.includes("mechas")) {
            return "https://images.unsplash.com/photo-1560066984-35bb31f74358?auto=format&fit=crop&w=600&q=80";
        }
        return "https://images.unsplash.com/photo-1521590832169-dca1f55b2f10?auto=format&fit=crop&w=600&q=80";
    };

    return (
        <div className="w-full overflow-x-auto pb-6 pt-2 px-4 snap-x snap-mandatory flex gap-6 no-scrollbar">
            {services.map((service: any) => {
                const categoryName = service.categorias_servicios.nombre;
                const isBarberia = categoryName === "Barbería";
                const imageUrl = getServiceImage(categoryName, service.nombre);

                // Barbería: Dark (#1A1A1A), Gold (#D4AF37)
                // Salón: Beige (#EBDECF), White (#FFFFFF)
                const cardStyle = isBarberia
                    ? "bg-[#0f0f0f] text-[#D4AF37] border-barberia-gold shadow-gold/20"
                    : "bg-white text-gray-900 border-salon-beige";

                return (
                    <div
                        key={service.id}
                        className={`min-w-[300px] md:min-w-[340px] snap-center rounded-2xl overflow-hidden shadow-xl border ${cardStyle} transition-transform hover:scale-[1.02] flex flex-col`}
                    >
                        {/* Image Header */}
                        <div className="h-48 w-full relative bg-gray-800">
                            <img
                                src={imageUrl}
                                alt={service.nombre}
                                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                                {categoryName}
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-agency font-bold tracking-wide mb-2 line-clamp-1" title={service.nombre}>
                                {service.nombre}
                            </h3>

                            {service.descripcion && (
                                <p className="mb-4 opacity-75 text-sm line-clamp-3">
                                    {service.descripcion}
                                </p>
                            )}

                            <div className="mt-auto pt-4 border-t border-current/10 flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-xs opacity-60 uppercase tracking-wider font-bold">Duración</span>
                                    <span className="font-semibold text-sm">{service.duracion_minutos} min</span>
                                </div>
                                <div className="text-3xl font-agency font-bold">
                                    S/ {Number(service.precio).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
