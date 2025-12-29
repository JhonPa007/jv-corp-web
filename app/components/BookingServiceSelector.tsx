"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function BookingServiceSelector({ services }: { services: any[] }) {
    const [selectedService, setSelectedService] = useState<any | null>(null);

    const formatPrice = (price: number) => `$${Number(price).toFixed(2)}`;

    const getWhatsAppLink = () => {
        const baseUrl = "https://wa.me/51965432443";
        if (!selectedService) {
            return baseUrl;
        }
        const message = `Hola, quisiera reservar el servicio de *${selectedService.nombre}*.`;
        return `${baseUrl}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="max-w-4xl mx-auto w-full">
            <h3 className="text-2xl font-agency font-bold text-center mb-8 text-barberia-dark dark:text-barberia-gold">
                SELECCIONA UN SERVICIO
            </h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
                {services.map((service) => {
                    const isSelected = selectedService?.id === service.id;
                    const isBarberia = service.categorias_servicios?.nombre === "Barbería";

                    return (
                        <div
                            key={service.id}
                            onClick={() => setSelectedService(service)}
                            className={`
                                cursor-pointer p-6 rounded-lg border-2 transition-all duration-300 relative
                                ${isSelected
                                    ? "border-[#25D366] bg-green-50 scale-105 shadow-xl"
                                    : "border-gray-200 hover:border-barberia-gold hover:shadow-md bg-white"
                                }
                            `}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2 text-[#25D366]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}

                            <h4 className={`font-bold text-lg mb-2 ${isBarberia ? 'text-barberia-dark' : 'text-gray-800'}`}>
                                {service.nombre}
                            </h4>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm opacity-70">{service.duracion_minutos} min</span>
                                <span className="font-agency font-bold text-xl text-barberia-gold">
                                    {formatPrice(service.precio)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-gray-100 sticky bottom-4">
                {selectedService ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <p className="text-gray-600 mb-4">
                            Has seleccionado: <span className="font-bold text-barberia-dark">{selectedService.nombre}</span>
                        </p>
                        <a
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#128C7E] transition-all transform hover:scale-105 shadow-lg text-lg"
                        >
                            <FaWhatsapp className="text-2xl" />
                            CONFIRMAR RESERVA EN WHATSAPP
                        </a>
                    </div>
                ) : (
                    <div className="opacity-50">
                        <p className="text-gray-500 mb-4">Selecciona un servicio arriba para continuar</p>
                        <button disabled className="px-8 py-4 bg-gray-300 text-white font-bold rounded-full cursor-not-allowed">
                            SELECCIONAR SERVICIO
                        </button>
                    </div>
                )}
            </div>

            <p className="text-center text-gray-500 text-sm mt-8">
                * Serás redirigido a WhatsApp para coordinar la fecha y hora.
            </p>
        </div>
    );
}
