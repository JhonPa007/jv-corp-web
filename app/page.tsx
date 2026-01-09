import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-black text-white relative overflow-hidden min-h-[80vh]">
        <div className="absolute inset-0 z-0">
          {/* Hero Background Image */}
          <Image
            src="/images/hero-luxury-barber.png"
            alt="Luxury Barbershop Interior"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
        </div>

        <div className="z-10 max-w-5xl space-y-8 animate-fade-in-up">
          <h2 className="text-barberia-gold tracking-[0.2em] uppercase text-sm md:text-base font-medium mb-4">
            Exclusividad y Estilo
          </h2>
          <h1 className="text-6xl md:text-8xl font-agency font-bold tracking-wide text-white mb-6">
            <span className="text-barberia-gold">JV</span> STUDIO
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            Donde la tradición del afeitado clásico se encuentra con el lujo moderno.
            <br className="hidden md:block" />
            Una experiencia diseñada solo para caballeros.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Link
              href="/reservas"
              className="px-10 py-5 bg-barberia-gold text-black font-bold text-lg hover:bg-white transition-all duration-300 uppercase tracking-wider"
            >
              Reservar Cita
            </Link>
            <Link
              href="/services"
              className="px-10 py-5 border border-white/30 backdrop-blur-sm text-white font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider"
            >
              Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Luxury Experience Section - Replaces Split */}
      <section className="py-24 bg-[#0a0a0a] text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[600px] w-full group">
              <div className="absolute -inset-4 bg-barberia-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              <Image
                src="/images/service-beard-luxury.png"
                alt="Experiencia Barbería"
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 border border-barberia-gold/30 m-4 pointer-events-none"></div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-agency font-bold text-barberia-gold">
                MAESTROS DE LA BARBERÍA
              </h2>
              <div className="w-20 h-1 bg-barberia-gold/50"></div>
              <p className="text-gray-400 text-lg leading-loose">
                En JV Barbershop, entendemos que el estilo es una forma de expresión personal.
                Nuestros barberos expertos combinan técnicas tradicionales con tendencias contemporáneas
                para ofrecerte un corte y afeitado impecables.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-barberia-gold rotate-45"></span>
                  Cortes de cabello personalizados
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-barberia-gold rotate-45"></span>
                  Afeitado tradicional con toalla caliente
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-barberia-gold rotate-45"></span>
                  Ambiente exclusivo y relajante
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
