"use client";

import { useState, useMemo } from "react";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { FaWhatsapp, FaCalendarAlt, FaUser, FaCut, FaCheckCircle, FaArrowLeft, FaStar } from "react-icons/fa";

type Step = "service" | "staff" | "time" | "confirm";

interface BookingWizardProps {
    services: any[];
    staff: any[];
}

export default function BookingWizard({ services, staff }: BookingWizardProps) {
    const [currentStep, setCurrentStep] = useState<Step>("service");
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // --- Helpers ---
    const formatPrice = (price: number) => `$${Number(price).toFixed(2)}`;

    const nextStep = () => {
        if (currentStep === "service" && selectedService) setCurrentStep("staff");
        else if (currentStep === "staff" && selectedStaff) setCurrentStep("time");
        else if (currentStep === "time" && selectedTime) setCurrentStep("confirm");
    };

    const prevStep = () => {
        if (currentStep === "staff") setCurrentStep("service");
        else if (currentStep === "time") setCurrentStep("staff");
        else if (currentStep === "confirm") setCurrentStep("time");
    };

    const getWhatsAppLink = () => {
        if (!selectedService || !selectedStaff || !selectedDate || !selectedTime) return "#";

        const dateStr = format(selectedDate, "EEEE d 'de' MMMM", { locale: es });
        const message = `Hola JV Studio, quisiera confirmar una reserva:
        
✂️ *Servicio*: ${selectedService.nombre}
👤 *Profesional*: ${selectedStaff.nombres} ${selectedStaff.apellidos}
📅 *Fecha*: ${dateStr}
⏰ *Hora*: ${selectedTime}

¿Me confirman la disponibilidad? Gracias.`;

        return `https://wa.me/51965432443?text=${encodeURIComponent(message)}`;
    };

    // --- Components for each step ---

    // 1. Service Selection
    const ServiceSelection = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-barberia-dark">Selecciona un Servicio</h2>
            <div className="grid gap-4">
                {services.map((service) => (
                    <div
                        key={service.id}
                        onClick={() => {
                            setSelectedService(service);
                            // Auto-advance is optional, but often nice. Let's keep manual next or explicit click.
                            // For this UI, let's select and require "Next" button click or double click? 
                            // Fresha usually advances on click. Let's auto-advance for smoother flow.
                            setSelectedService(service);
                            setTimeout(() => setCurrentStep("staff"), 200);
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center group
                            ${selectedService?.id === service.id
                                ? "border-barberia-gold bg-amber-50"
                                : "border-gray-100 hover:border-gray-300 bg-white"
                            }`}
                    >
                        <div>
                            <h3 className="font-bold text-lg text-barberia-dark">{service.nombre}</h3>
                            <p className="text-sm text-gray-500">{service.duracion_minutos} min</p>
                            {service.descripcion && <p className="text-sm text-gray-400 mt-1">{service.descripcion}</p>}
                        </div>
                        <div className="text-right">
                            <span className="font-bold text-lg text-barberia-dark block">{formatPrice(service.precio)}</span>
                            <div className={`mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center
                                ${selectedService?.id === service.id ? "border-barberia-gold bg-barberia-gold text-white" : "border-gray-300"}
                             `}>
                                {selectedService?.id === service.id && <FaCheckCircle size={14} />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // 2. Staff Selection
    const StaffSelection = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-barberia-dark">Elige tu Profesional</h2>

            {/* Option "Any Professional" */}
            <div
                onClick={() => {
                    setSelectedStaff({ id: 'any', nombres: "Cualquier", apellidos: "Profesional", any: true });
                    setTimeout(() => setCurrentStep("time"), 200);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4
                    ${selectedStaff?.any
                        ? "border-barberia-gold bg-amber-50"
                        : "border-gray-100 hover:border-gray-300 bg-white"
                    }`}
            >
                <div className="w-12 h-12 rounded-full bg-barberia-dark text-barberia-gold flex items-center justify-center font-bold">
                    JV
                </div>
                <div>
                    <h3 className="font-bold text-lg text-barberia-dark">Cualquier Profesional</h3>
                    <p className="text-sm text-gray-500">Para máxima disponibilidad</p>
                </div>
            </div>

            <div className="grid gap-4">
                {staff.map((employee) => (
                    <div
                        key={employee.id}
                        onClick={() => {
                            setSelectedStaff(employee);
                            setTimeout(() => setCurrentStep("time"), 200);
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4
                             ${selectedStaff?.id === employee.id && !selectedStaff?.any
                                ? "border-barberia-gold bg-amber-50"
                                : "border-gray-100 hover:border-gray-300 bg-white"
                            }`}
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative">
                            {/* Placeholder for avatar */}
                            <FaUser className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-barberia-dark">{employee.nombres} {employee.apellidos}</h3>
                                <div className="flex text-yellow-400 text-xs gap-0.5">
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">{employee.nombre_display || "Estilista Profesional"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // 3. Time Selection
    const TimeSelection = () => {
        // Generate next 7 days
        const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i)), []);

        // Mock time slots
        const timeSlots = ["10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "14:00", "15:00", "16:00", "16:30", "17:00", "18:00", "19:00"];

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-barberia-dark">Fecha y Hora</h2>

                {/* Date Slider */}
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                    {days.map((day) => {
                        const isSelected = isSameDay(day, selectedDate);
                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                                className={`flex-shrink-0 w-20 h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all
                                    ${isSelected
                                        ? "border-barberia-dark bg-barberia-dark text-white shadow-lg scale-105"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                    }`}
                            >
                                <span className="text-xs uppercase font-bold">{format(day, "EEE", { locale: es })}</span>
                                <span className="text-2xl font-bold">{format(day, "d")}</span>
                                <span className="text-xs opacity-70">{format(day, "MMM", { locale: es })}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Time Grid */}
                <div>
                    <h3 className="font-bold text-gray-700 mb-4">{format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {timeSlots.map((time) => (
                            <button
                                key={time}
                                onClick={() => {
                                    setSelectedTime(time);
                                    setTimeout(() => setCurrentStep("confirm"), 200);
                                }}
                                className={`py-3 px-2 rounded-lg border text-sm font-semibold transition-all
                                    ${selectedTime === time
                                        ? "bg-barberia-gold border-barberia-gold text-white shadow-md"
                                        : "bg-white border-gray-200 text-gray-700 hover:border-barberia-gold hover:text-barberia-gold"
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // 4. Confirmation (Actually, mostly handled by summary, but maybe a final view)
    const ConfirmationStep = () => (
        <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-4xl text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-barberia-dark mb-4">¡Todo listo!</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
                Tienes todos los detalles seleccionados. Haz clic en el botón de abajo para finalizar tu reserva vía WhatsApp.
            </p>

            <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl hover:bg-[#128C7E] hover:scale-105 transition-all w-full md:w-auto justify-center"
            >
                <FaWhatsapp className="text-2xl" />
                Enviar Reserva por WhatsApp
            </a>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full">
            {/* Left Column: Content */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
                {/* Back Button */}
                {currentStep !== "service" && (
                    <button
                        onClick={prevStep}
                        className="flex items-center gap-2 text-gray-500 hover:text-barberia-dark mb-6 font-medium text-sm transition-colors"
                    >
                        <FaArrowLeft /> Volver
                    </button>
                )}

                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    {currentStep === "service" && <ServiceSelection />}
                    {currentStep === "staff" && <StaffSelection />}
                    {currentStep === "time" && <TimeSelection />}
                    {currentStep === "confirm" && <ConfirmationStep />}
                </div>
            </div>

            {/* Right Column: Sticky Summary */}
            <div className="lg:w-80 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-lg bg-barberia-dark text-barberia-gold flex items-center justify-center font-bold text-xl font-agency">
                            JV
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">JV Studio</h4>
                            <p className="text-xs text-gray-500">Jr. Andahuaylas 216</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {selectedService ? (
                            <div className="flex justify-between items-start text-sm">
                                <span className="text-gray-600">{selectedService.nombre}</span>
                                <span className="font-bold">{formatPrice(selectedService.precio)}</span>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">Selecciona un servicio...</p>
                        )}

                        {selectedStaff && (
                            <div className="flex justify-between items-start text-sm">
                                <span className="text-gray-600">Profesional: {selectedStaff.nombres}</span>
                            </div>
                        )}

                        {(selectedTime && currentStep !== 'service' && currentStep !== 'staff') && (
                            <div className="flex justify-between items-start text-sm">
                                <span className="text-gray-600">Fecha: {format(selectedDate, "d MMM", { locale: es })} {selectedTime}</span>
                            </div>
                        )}

                        <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-lg text-barberia-dark">Total</span>
                            <span className="font-bold text-2xl text-barberia-dark">
                                {selectedService ? formatPrice(selectedService.precio) : "$0.00"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
