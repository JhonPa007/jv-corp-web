
import { prisma } from "../lib/prisma";
import BookingWizard from "../components/BookingWizard";

export const dynamic = "force-dynamic";

async function getData() {
    try {
        const [services, staff] = await Promise.all([
            prisma.servicios.findMany({
                where: { activo: true },
                include: { categorias_servicios: true },
                orderBy: { nombre: 'asc' }
            }),
            prisma.empleados.findMany({
                where: {
                    activo: true,
                    realiza_servicios: true
                },
                include: {
                    roles: true
                },
                orderBy: { nombres: 'asc' }
            })
        ]);
        return { services, staff };
    } catch (error) {
        console.error("Error loading booking data:", error);
        return { services: [], staff: [] };
    }
}

export default async function ReservasPage() {
    const { services, staff } = await getData();

    return (
        <div className="flex flex-col min-h-screen bg-salon-beige">
            {/* Header */}
            <div className="bg-barberia-dark pt-12 pb-24 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-agency font-bold text-barberia-gold tracking-wider mb-2">
                    RESERVA TU EXPERIENCIA
                </h1>
                <p className="text-gray-400 text-lg">
                    Calidad y estilo en cada detalle.
                </p>
            </div>

            {/* Main Content (Wizard) - Negative margin to overlap header like standard modern UIs */}
            <div className="flex-1 container mx-auto px-4 -mt-16 mb-12">
                {services.length > 0 ? (
                    <BookingWizard services={services} staff={staff} />
                ) : (
                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-100 mx-auto mt-8">
                        <h2 className="text-xl font-bold text-red-600 mb-4">Error de Conexión</h2>
                        <p className="text-gray-600 mb-4">
                            No pudimos cargar los datos de reserva.
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
