"use client";

import { useState, useMemo } from "react";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { FaWhatsapp, FaUser, FaCheckCircle, FaArrowLeft, FaStar, FaIdCard, FaEnvelope, FaPhone, FaCalendarAlt, FaUserEdit } from "react-icons/fa";
import { registerClientForBooking } from "../actions/booking-actions";

type Step = "service" | "staff" | "time" | "client" | "confirm";

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
    const [clientData, setClientData] = useState({
        nombres: '',
        apellidos: '',
        dni: '',
        telefono: '',
        email: '',
        fecha_nacimiento: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clientError, setClientError] = useState<string | null>(null);

    // --- Helpers ---
    const formatPrice = (price: number) => `S/ ${Number(price).toFixed(2)}`;

    const nextStep = () => {
        if (currentStep === "service" && selectedService) setCurrentStep("staff");
        else if (currentStep === "staff" && selectedStaff) setCurrentStep("time");
        else if (currentStep === "time" && selectedTime) setCurrentStep("client");
        else if (currentStep === "client") handleClientSubmit();
    };

    const prevStep = () => {
        if (currentStep === "staff") setCurrentStep("service");
        else if (currentStep === "time") setCurrentStep("staff");
        else if (currentStep === "client") setCurrentStep("time");
        else if (currentStep === "confirm") setCurrentStep("client");
    };

    const handleClientSubmit = async () => {
        if (!clientData.nombres || !clientData.telefono || !clientData.email || !clientData.fecha_nacimiento) {
            setClientError("Por favor completa los campos obligatorios (*)");
            return;
        }

        setIsSubmitting(true);
        setClientError(null);

        try {
            const birthDate = new Date(clientData.fecha_nacimiento);
            const result = await registerClientForBooking({
                ...clientData,
                fecha_nacimiento: !isNaN(birthDate.getTime()) ? birthDate : undefined
            });

            if (result.success) {
                setCurrentStep("confirm");
            } else {
                setClientError(result.error || "Error al registrar cliente");
            }
        } catch (err) {
            setClientError("Ocurrió un error inesperado.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getWhatsAppLink = () => {
        if (!selectedService || !selectedStaff || !selectedDate || !selectedTime) return "#";

        const dateStr = format(selectedDate, "EEEE d 'de' MMMM", { locale: es });
        const staffName = selectedStaff.any ? "Cualquier Profesional" : `${selectedStaff.nombre_display || selectedStaff.nombres}`;

        const message = `Hola JV Studio, quisiera reconfirmar mi reserva creada desde la web:
        
✂️ *Servicio*: ${selectedService.nombre}
👤 *Profesional*: ${staffName}
📅 *Fecha*: ${dateStr}
⏰ *Hora*: ${selectedTime}

👤 *Cliente*: ${clientData.nombres} ${clientData.apellidos}
📞 *Teléfono*: ${clientData.telefono}

¿Todo conforme? Gracias.`;

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
                            setTimeout(() => setCurrentStep("staff"), 200);
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center group
                            ${selectedService?.id === service.id
                                ? "border-barberia-gold bg-amber-50"
                                : "border-gray-100 hover:border-gray-300 bg-white"
                            }`}
                    >
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{service.nombre}</h3>
                            <p className="text-sm text-gray-500">{service.duracion_minutos} min</p>
                            {service.descripcion && <p className="text-sm text-gray-400 mt-1">{service.descripcion}</p>}
                        </div>
                        <div className="text-right">
                            <span className="font-bold text-lg text-gray-900 block">{formatPrice(service.precio)}</span>
                            <div className={`mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ml-auto
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
    const StaffSelection = () => {
        // Filter logic
        const relevantStaff = staff.filter(employee => {
            // Use profesion if available, otherwise role, otherwise empty
            const jobTitle = (employee.profesion || employee.roles?.nombre || "").toLowerCase();
            const serviceCategory = (selectedService?.categorias_servicios?.nombre || "").toLowerCase();

            if (serviceCategory.includes("barber")) {
                return jobTitle.includes("barber") || jobTitle.includes("general");
            }
            return true;
        });

        const displayStaff = relevantStaff.length > 0 ? relevantStaff : staff;

        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6 text-black">Elige tu Profesional</h2>

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
                        <h3 className="font-bold text-lg text-gray-900">Cualquier Profesional</h3>
                        <p className="text-sm text-gray-500">Para máxima disponibilidad</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {displayStaff.map((employee) => (
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
                            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
                                <FaUser className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg text-gray-900">{employee.nombre_display || employee.nombres}</h3>
                                    <div className="flex text-yellow-400 text-xs gap-0.5">
                                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                    {employee.profesion || employee.roles?.nombre || "Estilista Profesional"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // 3. Time Selection
    const TimeSelection = () => {
        const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i)), []);
        const timeSlots = ["10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "14:00", "15:00", "16:00", "16:30", "17:00", "18:00", "19:00"];

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-barberia-dark">Fecha y Hora</h2>

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


    // 4. Client Registration
    const ClientRegistrationStep = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-barberia-dark mb-2">Tus Datos</h2>
            <p className="text-gray-500 text-sm mb-6">Necesitamos estos datos para confirmar tu cita.</p>

            {clientError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                    {clientError}
                </div>
            )}

            <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nombres *</label>
                        <div className="relative">
                            <FaUserEdit className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all"
                                placeholder="Ej: Juan"
                                value={clientData.nombres}
                                onChange={e => setClientData({ ...clientData, nombres: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Apellidos</label>
                        <div className="relative">
                            <FaUserEdit className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all"
                                placeholder="Ej: Perez"
                                value={clientData.apellidos}
                                onChange={e => setClientData({ ...clientData, apellidos: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">DNI (Opcional)</label>
                        <div className="relative">
                            <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all"
                                placeholder="8 dígitos"
                                maxLength={8}
                                value={clientData.dni}
                                onChange={e => setClientData({ ...clientData, dni: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Fecha de Nacimiento *</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full pl-4 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all text-gray-600"
                                value={clientData.fecha_nacimiento}
                                onChange={e => setClientData({ ...clientData, fecha_nacimiento: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono / WhatsApp *</label>
                        <div className="relative">
                            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all"
                                placeholder="Ej: 999888777"
                                value={clientData.telefono}
                                onChange={e => setClientData({ ...clientData, telefono: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all"
                                placeholder="cliente@ejemplo.com"
                                value={clientData.email}
                                onChange={e => setClientData({ ...clientData, email: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    onClick={nextStep}
                    disabled={isSubmitting}
                    className="w-full bg-barberia-gold text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-yellow-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Procesando...
                        </>
                    ) : (
                        "Continuar a Confirmación"
                    )}
                </button>
            </div>
        </div>
    );

    // 5. Confirmation
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
                    {currentStep === "client" && <ClientRegistrationStep />}
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
                                <span className="font-bold text-gray-900">{formatPrice(selectedService.precio)}</span>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">Selecciona un servicio...</p>
                        )}

                        {selectedStaff && (
                            <div className="flex justify-between items-start text-sm">
                                <span className="text-gray-600">
                                    Profesional: <span className="font-medium text-barberia-dark">{selectedStaff.any ? "Cualquiera" : (selectedStaff.nombre_display || selectedStaff.nombres)}</span>
                                </span>
                            </div>
                        )}

                        {(selectedTime && currentStep !== 'service' && currentStep !== 'staff') && (
                            <div className="flex justify-between items-start text-sm">
                                <span className="text-gray-600">
                                    Fecha: <span className="font-medium text-barberia-dark">{format(selectedDate, "d MMM", { locale: es })} {selectedTime}</span>
                                </span>
                            </div>
                        )}

                        {clientData.nombres && (
                            <div className="flex justify-between items-start text-sm">
                                <span className="text-gray-600">
                                    Cliente: <span className="font-medium text-barberia-dark">{clientData.nombres} {clientData.apellidos}</span>
                                </span>
                            </div>
                        )}

                        <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-lg text-gray-800">Total</span>
                            <span className="font-bold text-2xl text-gray-800">
                                {selectedService ? formatPrice(selectedService.precio) : "S/ 0.00"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
