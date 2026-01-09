import Link from "next/link";
import Image from "next/image";
import { serviceCategories } from "../lib/servicesData";

export default function ServicesPage() {
    return (
        <div className="container mx-auto py-24 px-4 bg-[#0a0a0a] min-h-screen">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl md:text-7xl font-agency font-bold text-barberia-gold tracking-wider">
                    NUESTROS SERVICIOS
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                    Selecciona una categoría para explorar nuestra oferta exclusiva.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {serviceCategories.map((category) => (
                    <Link
                        href={`/services/${category.id}`}
                        key={category.id}
                        className="group relative h-[400px] overflow-hidden border border-white/10 hover:border-barberia-gold/50 transition-all duration-500"
                    >
                        <Image
                            src={category.image}
                            alt={category.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <h2 className="text-3xl font-agency font-bold text-white mb-2 group-hover:text-barberia-gold transition-colors">
                                {category.title}
                            </h2>
                            <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                {category.description}
                            </p>
                            <div className="mt-4 w-12 h-0.5 bg-barberia-gold transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
