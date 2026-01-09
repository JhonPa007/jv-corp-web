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
