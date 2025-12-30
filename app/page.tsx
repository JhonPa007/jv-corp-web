import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-barberia-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          {/* Placeholder for background image if desired */}
          {/* <Image src="/hero-bg.jpg" alt="Background" fill className="object-cover" /> */}
        </div>

        <div className="z-10 max-w-4xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-agency font-bold tracking-wider text-barberia-gold">
            Estilo y Elegancia
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            La experiencia definitiva en Barbería y Salón de Belleza.
            Cuidado personal diseñado exclusivamente para ti.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/services"
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors text-lg"
            >
              Ver Servicios
            </Link>
            <Link
              href="/reservas"
              className="px-8 py-4 border-2 border-barberia-gold text-barberia-gold font-bold rounded-full hover:bg-barberia-gold hover:text-black transition-colors text-lg"
            >
              Reservar Cita
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Split - Visual distinction */}
      <section className="grid md:grid-cols-2">
        <div className="bg-barberia-dark text-barberia-gold p-16 flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl font-bold mb-4">Barbería</h2>
          <p className="mb-8 opacity-80">Cortes clásicos, afeitados tradicionales y cuidado moderno para el caballero.</p>
          <Link href="/services" className="underline underline-offset-4 hover:text-white">Explorar Barbería &rarr;</Link>
        </div>
        <div className="bg-salon-beige text-bg-salon-white p-16 flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Salón</h2>
          <p className="mb-8 text-gray-700">Estlismo, coloración y tratamientos de belleza premium.</p>
          <Link href="/services" className="underline underline-offset-4 text-pink-500 font-bold hover:text-pink-700">Explorar Salón &rarr;</Link>
        </div>
      </section>
    </main>
  );
}
