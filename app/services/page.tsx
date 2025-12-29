import ServiceList from "../components/ServiceList";

export default function ServicesPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-white">
                    Nuestros Servicios
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
                    Explora nuestra completa gama de servicios de barbería clásica y estilismo de salón.
                </p>
            </div>

            <div className="min-h-[400px]">
                <ServiceList />
            </div>
        </div>
    );
}
