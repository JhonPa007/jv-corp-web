import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-barberia-dark text-barberia-gold p-4 sticky top-0 z-50 shadow-lg border-b border-barberia-gold/20">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-90 transition-opacity">
                    JV STUDIO
                </Link>
                <div className="flex gap-6 font-medium">
                    <Link href="/" className="hover:text-white transition-colors">
                        Inicio
                    </Link>
                    <Link href="/services" className="hover:text-white transition-colors">
                        Servicios
                    </Link>
                    <Link href="/reservas" className="hover:text-white transition-colors">
                        Reservas
                    </Link>
                </div>
            </div>
        </nav>
    );
}
