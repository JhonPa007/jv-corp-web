import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-barberia-dark text-barberia-gold border-t border-barberia-gold/20 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-agency font-bold tracking-wider mb-2">JV STUDIO</h2>
                        <p className="text-sm opacity-80 text-gray-400">
                            Excelencia en cada detalle.
                        </p>
                    </div>

                    <div className="flex gap-8 font-medium">
                        <Link href="/" className="hover:text-white transition-colors text-sm">
                            INICIO
                        </Link>
                        <Link href="/services" className="hover:text-white transition-colors text-sm">
                            SERVICIOS
                        </Link>
                        <Link href="/reservas" className="hover:text-white transition-colors text-sm">
                            RESERVAS
                        </Link>
                    </div>

                    <div className="flex flex-col gap-2 text-right">
                        <span className="text-xs font-bold opacity-50 uppercase tracking-widest">Síguenos</span>
                        <div className="flex gap-4 text-sm">
                            <a href="https://www.tiktok.com/@jvbarberia?lang=es-419" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok</a>
                            <a href="https://www.facebook.com/BarberiaAbancay" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
                            <a href="https://www.instagram.com/jvstudio_formen/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                        </div>
                    </div>

                    <div className="text-sm opacity-60 text-gray-500">
                        &copy; {new Date().getFullYear()} JV Corp. Todos los derechos reservados.
                    </div>
                </div>
            </div>
        </footer>
    );
}
