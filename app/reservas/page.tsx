export default function ReservasPage() {
    return (
        <div className="flex flex-col min-h-screen bg-salon-beige">
            <div className="bg-barberia-dark py-16 px-4 text-center border-b-4 border-barberia-gold">
                <h1 className="text-5xl md:text-6xl font-agency font-bold text-barberia-gold tracking-wider">
                    RESERVA TU CITA
                </h1>
                <p className="text-xl text-gray-300 mt-4 max-w-2xl mx-auto">
                    Selecciona tu servicio y horario preferido. La excelencia te espera.
                </p>
            </div>

            <div className="flex-1 container mx-auto p-8 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center border border-gray-100">
                    <h2 className="text-3xl font-agency font-bold text-barberia-dark mb-6">PROXIMAMENTE</h2>
                    <p className="text-gray-600 mb-8">
                        Estamos actualizando nuestro sistema de reservas en línea para brindarte una mejor experiencia.
                    </p>
                    <p className="text-barberia-dark font-bold">
                        Por favor contáctanos vía WhatsApp para agendar:
                    </p>
                    <a
                        href="https://wa.me/51965432443"
                        target="_blank"
                        className="inline-block mt-4 px-6 py-3 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#128C7E] transition-colors"
                    >
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
