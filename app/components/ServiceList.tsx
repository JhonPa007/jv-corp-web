import { prisma } from "../lib/prisma";

export default async function ServiceList() {
    const services = await prisma.servicios.findMany({
        include: {
            categorias_servicios: true,
        },
        where: {
            activo: true,
        },
    });

    return (
        <div className="grid gap-4 p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service: any) => {
                const categoryName = service.categorias_servicios.nombre;
                const isBarberia = categoryName === "Barbería";

                // Barbería: Dark (#1A1A1A), Gold (#D4AF37)
                // Salón: Beige (#EBDECF), White (#FFFFFF)
                const cardStyle = isBarberia
                    ? "bg-barberia-dark text-barberia-gold border-barberia-gold"
                    : "bg-salon-white text-gray-900 border-salon-beige";

                return (
                    <div
                        key={service.id}
                        className={`p-6 rounded-lg shadow-md border ${cardStyle} transition-transform hover:scale-105`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-agency font-bold tracking-wide">{service.nombre}</h3>
                            <span className="text-sm px-2 py-1 rounded-full opacity-80 border border-current">
                                {categoryName}
                            </span>
                        </div>
                        {service.descripcion && (
                            <p className="mb-4 opacity-90 text-sm">{service.descripcion}</p>
                        )}
                        <div className="flex justify-between items-end mt-4">
                            <div className="flex flex-col">
                                <span className="text-sm opacity-75">Duración</span>
                                <span className="font-semibold">{service.duracion_minutos} min</span>
                            </div>
                            <div className="text-3xl font-agency font-bold">
                                ${Number(service.precio).toFixed(2)}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
