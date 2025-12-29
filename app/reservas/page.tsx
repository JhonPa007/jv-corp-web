import { prisma } from "../lib/prisma";
import BookingServiceSelector from "../components/BookingServiceSelector";

export const dynamic = "force-dynamic";

async function getServices() {
    try {
        const services = await prisma.servicios.findMany({
            where: { activo: true },
            include: { categorias_servicios: true },
            orderBy: { nombre: 'asc' }
        });
        return services;
    } catch (error) {
        console.error("Error loading services for booking:", error);
        return [];
    }
}

export default async function ReservasPage() {
    const services = await getServices();

    return (
        <div className="flex flex-col min-h-screen bg-salon-beige">
            <div className="bg-barberia-dark py-16 px-4 text-center border-b-4 border-barberia-gold">
                <h1 className="text-5xl md:text-6xl font-agency font-bold text-barberia-gold tracking-wider">
                    RESERVA TU CITA
                </h1>
                <p className="text-xl text-gray-300 mt-4 max-w-2xl mx-auto">
                    Selecciona tu servicio y horario preferido. La excelencia te espera.
                </p>
            </div>

            <div className="flex-1 container mx-auto p-4 md:p-8 flex flex-col items-center">
                {services.length > 0 ? (
                    <BookingServiceSelector services={services} />
                ) : (
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center border border-gray-100">
                        <h2 className="text-xl font-bold text-red-600 mb-4">Error de Conexión</h2>
                        <p className="text-gray-600 mb-4">
                            No pudimos cargar la lista de servicios. Por favor contáctanos directamente.
                        </p>
                        <a
                            href="https://wa.me/51965432443"
                            target="_blank"
                            className="inline-block mt-4 px-6 py-3 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#128C7E] transition-colors"
                        >
                            Contactar por WhatsApp
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
