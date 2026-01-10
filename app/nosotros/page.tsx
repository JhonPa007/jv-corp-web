import Image from "next/image";

export default function NosotrosPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Hero Section */}
            <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero-luxury-barber.png" // Reusing hero for now
                        alt="Interior Barbería"
                        fill
                        className="object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0a0a0a]" />
                </div>
                <div className="relative z-10 text-center max-w-4xl px-4">
                    <h1 className="text-5xl md:text-7xl font-agency font-bold text-barberia-gold mb-6 tracking-widest">
                        NUESTRA ESENCIA
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light">
                        Más que una barbería, un legado de estilo y tradición.
                    </p>
                </div>
            </div>

            {/* Mision / Vision / Valores */}
            <section className="py-24 container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Mision */}
                    <div className="group bg-[#111] p-10 border border-white/5 hover:border-barberia-gold/50 transition-all duration-500 rounded-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-9xl font-agency font-bold text-white">01</span>
                        </div>
                        <h2 className="text-3xl font-agency font-bold text-barberia-gold mb-6 relative z-10">
                            MISIÓN
                        </h2>
                        <p className="text-gray-400 leading-relaxed relative z-10 text-lg">
                            Brindar una experiencia de cuidado personal inigualable para el caballero moderno,
                            fusionando técnicas tradicionales de barbería con un servicio de lujo y un ambiente exclusivo
                            donde cada cliente se sienta renovado y confiado.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="group bg-[#111] p-10 border border-white/5 hover:border-barberia-gold/50 transition-all duration-500 rounded-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-9xl font-agency font-bold text-white">02</span>
                        </div>
                        <h2 className="text-3xl font-agency font-bold text-barberia-gold mb-6 relative z-10">
                            VISIÓN
                        </h2>
                        <p className="text-gray-400 leading-relaxed relative z-10 text-lg">
                            Ser reconocidos como el referente indiscutible de la barbería de alta gama en la región,
                            expandiendo nuestro legado de excelencia y estilo, y creando una comunidad de caballeros
                            que valoran la calidad y el detalle.
                        </p>
                    </div>

                    {/* Valores */}
                    <div className="group bg-[#111] p-10 border border-white/5 hover:border-barberia-gold/50 transition-all duration-500 rounded-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-9xl font-agency font-bold text-white">03</span>
                        </div>
                        <h2 className="text-3xl font-agency font-bold text-barberia-gold mb-6 relative z-10">
                            VALORES
                        </h2>
                        <ul className="text-gray-400 leading-relaxed relative z-10 space-y-3 text-lg">
                            <li className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-barberia-gold rounded-full" />
                                Excelencia en cada corte
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-barberia-gold rounded-full" />
                                Atención personalizada
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-barberia-gold rounded-full" />
                                Higiene impecable
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-barberia-gold rounded-full" />
                                Pasión por el estilo
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
