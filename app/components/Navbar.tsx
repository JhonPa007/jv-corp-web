import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    return (
        <nav className="bg-black text-white p-4 sticky top-0 z-50 shadow-lg border-b border-white/10">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <div className="relative w-12 h-12">
                        <Image
                            src="/images/logo-white.png"
                            alt="JV Studio Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-3xl font-agency font-bold tracking-wider">JV STUDIO</span>
                </Link>
                <div className="hidden md:flex gap-8 font-medium font-agency tracking-wider text-lg items-center">
                    <Link href="/" className="hover:text-barberia-gold transition-colors">
                        INICIO
                    </Link>
                    <Link href="/nosotros" className="hover:text-barberia-gold transition-colors">
                        NOSOTROS
                    </Link>
                    <Link href="/services" className="hover:text-barberia-gold transition-colors">
                        SERVICIOS
                    </Link>
                    <Link href="/staff" className="hover:text-barberia-gold transition-colors">
                        STAFF
                    </Link>
                    <Link href="/tienda" className="hover:text-barberia-gold transition-colors">
                        TIENDA
                    </Link>
                    <Link href="/contacto" className="hover:text-barberia-gold transition-colors">
                        CONTACTO
                    </Link>
                    <Link href="/reservas" className="bg-barberia-gold text-black px-6 py-2 rounded-sm font-bold hover:bg-white transition-colors">
                        RESERVAR
                    </Link>
                </div>
            </div>
        </nav>
    );
}
