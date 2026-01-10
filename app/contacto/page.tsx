import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

export default function ContactoPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="container mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-agency font-bold text-barberia-gold mb-6 tracking-wide">
                        VISÍTANOS
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        Estamos ubicados en el corazón de la ciudad, listos para brindarte la mejor atención.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Info Card */}
                    <div className="bg-[#111] p-10 border border-white/10 rounded-lg space-y-10">

                        {/* Address */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-barberia-gold/10 rounded-full flex items-center justify-center text-barberia-gold shrink-0">
                                <FaMapMarkerAlt size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-agency font-bold text-white mb-2">UBICACIÓN</h3>
                                <p className="text-gray-400 text-lg">Jr Andahuaylas 216</p>
                                <p className="text-gray-500 text-sm">Abancay, Apurimac</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-barberia-gold/10 rounded-full flex items-center justify-center text-barberia-gold shrink-0">
                                <FaPhone size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-agency font-bold text-white mb-2">TELÉFONO & WHATSAPP</h3>
                                <p className="text-gray-400 text-lg">+51 965 432 443</p>
                                <p className="text-gray-500 text-sm">Atención inmediata para reservas</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-barberia-gold/10 rounded-full flex items-center justify-center text-barberia-gold shrink-0">
                                <FaEnvelope size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-agency font-bold text-white mb-2">CORREO ELECTRÓNICO</h3>
                                <p className="text-gray-400 text-lg">contacto@barberia.jvcorp.pe</p>
                            </div>
                        </div>

                        {/* Horario - Hardcoded for now based on standard salon hours, user can request changes */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-barberia-gold/10 rounded-full flex items-center justify-center text-barberia-gold shrink-0">
                                <FaClock size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-agency font-bold text-white mb-2">HORARIO DE ATENCIÓN</h3>
                                <ul className="text-gray-400 space-y-1">
                                    <li className="flex justify-between w-48"><span>Lunes - Sábado:</span> <span>9:00 AM - 9:00 PM</span></li>
                                    <li className="flex justify-between w-48"><span>Domingo:</span> <span>10:00 AM - 6:00 PM</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Google Map */}
                    <div className="h-[600px] w-full bg-[#111] border border-white/10 rounded-lg overflow-hidden relative">
                        <iframe
                            src="https://maps.google.com/maps?q=Jr%20Andahuaylas%20216%2C%20Abancay%2C%20Apurimac&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        {/* Overlay to ensure map fits theme (optional, pure CSS filter above usually works well for dark maps) */}
                    </div>
                </div>
            </div>
        </div>
    );
}
