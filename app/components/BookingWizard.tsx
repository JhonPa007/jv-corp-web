"use client";

import { useState, useMemo, useEffect } from "react";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { FaWhatsapp, FaUser, FaCheckCircle, FaArrowLeft, FaStar, FaIdCard, FaEnvelope, FaPhone, FaCalendarAlt, FaUserEdit, FaClock } from "react-icons/fa";
import { registerClientForBooking, getAvailableTimeSlots, createReservation, searchClient } from "../actions/booking-actions";

import { useSearchParams } from "next/navigation";

type Step = "service" | "staff" | "time" | "client" | "confirm";

interface BookingWizardProps {
    services: any[];
    staff: any[];
}

// Extracted for performance and focus management
// 4. Client Identity & Registration
const ClientIdentityStep = ({
    clientData,
    setClientData,
    onNext,
    isSubmitting,
    clientError,
    setClientError
}: any) => {
    const [mode, setMode] = useState<'options' | 'search' | 'register' | 'confirm_identity'>('options');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchMessage, setSearchMessage] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        setIsSearching(true);
        setSearchMessage(null);
        try {
            const result = await searchClient(searchTerm);
            if (result.success && result.client) {
                // Found!
                setClientData({
                    nombres: result.client.razon_social_nombres,
                    apellidos: result.client.apellidos || '',
                    dni: result.client.numero_documento || '',
                    telefono: result.client.telefono,
                    email: result.client.email,
                    fecha_nacimiento: result.client.fecha_nacimiento ? new Date(result.client.fecha_nacimiento).toISOString().split('T')[0] : ''
                });
                setMode('confirm_identity');
            } else {
                setSearchMessage("No encontramos un cliente con esos datos. ¿Deseas registrarte?");
            }
        } catch (error) {
            console.error(error);
            setSearchMessage("Error al buscar. Inténtalo de nuevo.");
        } finally {
            setIsSearching(false);
        }
    };

    if (mode === 'options') {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-barberia-dark mb-2">¡Bienvenido!</h2>
                <p className="text-gray-500 text-sm mb-6">Para continuar, cuéntanos:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => setMode('register')}
                        className="p-6 rounded-xl border-2 border-gray-100 hover:border-barberia-gold hover:bg-amber-50 transition-all text-left group"
                    >
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mb-4 group-hover:bg-barberia-gold group-hover:text-white transition-colors">
                            <FaUserEdit size={20} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">Soy Nuevo</h3>
                        <p className="text-sm text-gray-500">Quiero registrar mis datos por primera vez.</p>
                    </button>

                    <button
                        onClick={() => setMode('search')}
                        className="p-6 rounded-xl border-2 border-gray-100 hover:border-barberia-gold hover:bg-amber-50 transition-all text-left group"
                    >
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mb-4 group-hover:bg-barberia-dark group-hover:text-white transition-colors">
                            <FaUser size={20} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">Ya soy Cliente</h3>
                        <p className="text-sm text-gray-500">Tengo una cuenta registrada.</p>
                    </button>
                </div>
            </div>
        );
    }

    if (mode === 'search') {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => setMode('options')} className="text-sm text-gray-500 hover:text-barberia-dark flex items-center gap-1">
                        <FaArrowLeft /> Atrás
                    </button>
                </div>
                <h2 className="text-2xl font-bold text-barberia-dark mb-2">Buscar Cliente</h2>
                <p className="text-gray-500 text-sm mb-6">Ingresa tu DNI, Teléfono o Email para encontrarte.</p>

                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="DNI, Celular o Correo"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-barberia-gold outline-none"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isSearching || !searchTerm}
                        className="absolute right-2 top-2 bottom-2 bg-barberia-dark text-white px-6 rounded-lg font-bold hover:bg-black transition-colors disabled:opacity-50"
                    >
                        {isSearching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Buscar'}
                    </button>
                </div>

                {searchMessage && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm flex gap-3 items-start">
                        <div className="mt-0.5 text-lg">⚠️</div>
                        <div>
                            <p className="font-bold mb-1">Resultado</p>
                            <p>{searchMessage}</p>
                            {searchMessage.includes("registrarse") && (
                                <button onClick={() => setMode('register')} className="mt-2 text-barberia-dark underline font-bold">
                                    Ir a Registro
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (mode === 'confirm_identity') {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-barberia-dark mb-2">¿Eres tú?</h2>
                <div className="bg-green-50 border border-green-200 p-6 rounded-xl flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-200 text-green-700 rounded-full flex items-center justify-center font-bold text-2xl">
                        {clientData.nombres.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">{clientData.nombres} {clientData.apellidos}</h3>
                        <p className="text-sm text-gray-600">{clientData.email}</p>
                        <p className="text-sm text-gray-600">{clientData.telefono}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setMode('search')}
                        className="p-4 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50"
                    >
                        No soy yo
                    </button>
                    <button
                        onClick={onNext}
                        className="p-4 rounded-xl bg-barberia-gold text-white font-bold hover:bg-yellow-600 shadow-lg"
                    >
                        Sí, continuar
                    </button>
                </div>
            </div>
        );
    }

    // Default: Register
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setMode('options')} className="text-sm text-gray-500 hover:text-barberia-dark flex items-center gap-1">
                    <FaArrowLeft /> Cambiar
                </button>
            </div>
            <ClientRegistrationForm
                data={clientData}
                onChange={setClientData}
                error={clientError}
                isSubmitting={isSubmitting}
                onSubmit={onNext}
            />
        </div>
    );
}

const ClientRegistrationForm = ({ data, onChange, error, isSubmitting, onSubmit }: any) => {
    // We could add onBlur validation here if verifyClient is passed
    // For now simple form
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-barberia-dark mb-2">Tus Datos</h2>
            <p className="text-gray-500 text-sm mb-6">Necesitamos estos datos para confirmar tu cita.</p>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 flex items-center gap-2">
                    <span>⚠️</span> {error}
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
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all text-gray-900"
                                placeholder="Ej: Juan"
                                value={data.nombres}
                                onChange={e => onChange({ ...data, nombres: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Apellidos</label>
                        <div className="relative">
                            <FaUserEdit className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all text-gray-900"
                                placeholder="Ej: Perez"
                                value={data.apellidos}
                                onChange={e => onChange({ ...data, apellidos: e.target.value })}
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
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all text-gray-900"
                                placeholder="8 dígitos"
                                maxLength={8}
                                value={data.dni}
                                onChange={e => onChange({ ...data, dni: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Fecha de Nacimiento *</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full pl-4 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all text-gray-900"
                                value={data.fecha_nacimiento}
                                onChange={e => onChange({ ...data, fecha_nacimiento: e.target.value })}
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
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all text-gray-900"
                                placeholder="Ej: 999888777"
                                value={data.telefono}
                                onChange={e => onChange({ ...data, telefono: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all text-gray-900"
                                placeholder="cliente@ejemplo.com"
                                value={data.email}
                                onChange={e => onChange({ ...data, email: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    onClick={onSubmit}
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
};

export default function BookingWizard({ services, staff }: BookingWizardProps) {
    const searchParams = useSearchParams();
    const preSelectedServiceId = searchParams.get("serviceId");

    const [currentStep, setCurrentStep] = useState<Step>("service");
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Auto-select service if present in URL
    useEffect(() => {
        if (preSelectedServiceId && services.length > 0) {
            const service = services.find(s => s.id === Number(preSelectedServiceId));
            if (service) {
                setSelectedService(service);
                setCurrentStep("staff");
            }
        }
    }, [preSelectedServiceId, services]);
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
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [reservationId, setReservationId] = useState<number | null>(null);

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
        // Just move to confirmation step, don't create reservation yet.
        // Or validate client data locally first?
        if (!clientData.nombres || !clientData.telefono || !clientData.email || !clientData.fecha_nacimiento) {
            setClientError("Por favor completa los campos obligatorios (*)");
            return;
        }
        setClientError(null);
        setCurrentStep("confirm");
    };

    const handleCreateReservation = async () => {
        if (!selectedService || !selectedStaff || !selectedDate || !selectedTime) return;

        setIsSubmitting(true);
        try {
            const result = await createReservation({
                client: {
                    ...clientData,
                    fecha_nacimiento: clientData.fecha_nacimiento ? new Date(clientData.fecha_nacimiento) : undefined
                },
                serviceId: selectedService.id,
                staffId: selectedStaff.any ? 'any' : selectedStaff.id,
                date: selectedDate,
                time: selectedTime,
                servicePrice: Number(selectedService.precio)
            });

            if (result.success && result.reservationId) {
                setReservationId(result.reservationId);
                // Success state handled in render
            } else {
                // Show error somewhere? For now allow retry or show generic alert
                alert(result.error || "No se pudo crear la reserva. Por favor intenta nuevamente.");
            }
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al procesar tu reserva.");
        } finally {
            setIsSubmitting(false);
        }
    }

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

        // Use Effect for fetching slots
        const [slots, setSlots] = useState<string[]>([]);
        const [loading, setLoading] = useState(false);

        // We use a key to force re-render or just standard useEffect
        useMemo(() => {
            const fetchSlots = async () => {
                if (!selectedService) return;
                setLoading(true);
                setSlots([]); // Clear prev

                const staffId = selectedStaff?.any ? 'any' : selectedStaff?.id;
                if (!staffId) return;

                const fetchedSlots = await getAvailableTimeSlots(selectedDate, staffId, selectedService.duracion_minutos);
                setSlots(fetchedSlots);
                setLoading(false);
            };
            fetchSlots();
        }, [selectedDate, selectedStaff, selectedService]);

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

                    {loading ? (
                        <div className="flex items-center gap-2 text-gray-500 py-8 justify-center">
                            <FaClock className="animate-spin" /> Buscando espacios disponibles...
                        </div>
                    ) : slots.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No hay horarios disponibles para esta fecha.</p>
                            <p className="text-sm text-gray-400 mt-1">Intenta con otra fecha o profesional.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {slots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => {
                                        setSelectedTime(time);
                                        setTimeout(() => setCurrentStep("client"), 200); // Skip directly to client? Flow is Service->Staff->Time->Client->Confirm
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
                    )}
                </div>
            </div>
        );
    };




    // 5. Confirmation
    const ConfirmationStep = () => {
        if (reservationId) {
            return (
                <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheckCircle className="text-5xl text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-barberia-dark mb-4">¡Reserva Confirmada!</h2>
                    <p className="text-gray-600 max-w-md mx-auto mb-8">
                        Tu cita ha sido agendada con éxito. Te esperamos el <strong>{format(selectedDate, "d 'de' MMMM", { locale: es })}</strong> a las <strong>{selectedTime}</strong>.
                    </p>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 max-w-sm mx-auto mb-8 text-left">
                        <p className="text-sm text-gray-500 mb-1">Código de Reserva</p>
                        <p className="text-xl font-mono font-bold text-gray-900">#{reservationId}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
                    >
                        Hacer otra reserva
                    </button>
                </div>
            );
        }

        return (
            <div className="text-center py-8">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCalendarAlt className="text-4xl text-barberia-gold" />
                </div>
                <h2 className="text-3xl font-bold text-barberia-dark mb-4">Confirmar Detalle</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                    Por favor revisa los detalles de tu reserva antes de confirmar.
                </p>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 max-w-md mx-auto mb-8 space-y-4">
                    <div className="flex justify-between border-b pb-2 border-gray-200">
                        <span className="text-gray-500">Servicio</span>
                        <span className="font-bold text-gray-900">{selectedService?.nombre}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 border-gray-200">
                        <span className="text-gray-500">Profesional</span>
                        <span className="font-bold text-gray-900">{selectedStaff?.any ? "Cualquiera" : (selectedStaff?.nombre_display || selectedStaff?.nombres)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 border-gray-200">
                        <span className="text-gray-500">Fecha y Hora</span>
                        <span className="font-bold text-gray-900">{format(selectedDate, "d MMM", { locale: es })} - {selectedTime}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span className="font-bold text-lg">Total a Pagar</span>
                        <span className="font-bold text-lg text-barberia-gold">{selectedService ? formatPrice(selectedService.precio) : "S/ 0.00"}</span>
                    </div>
                </div>

                <button
                    onClick={handleCreateReservation}
                    disabled={isSubmitting}
                    className="w-full md:w-auto inline-flex items-center gap-3 bg-barberia-dark text-white px-12 py-4 rounded-full font-bold text-xl shadow-xl hover:bg-black hover:scale-105 transition-all justify-center"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Confirmando...
                        </>
                    ) : (
                        "Confirmar Reserva"
                    )}
                </button>
            </div>
        );
    };

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
                    {currentStep === "client" && (
                        <ClientIdentityStep
                            clientData={clientData}
                            setClientData={setClientData}
                            onNext={handleClientSubmit}
                            isSubmitting={isSubmitting}
                            clientError={clientError}
                            setClientError={setClientError}
                        />
                    )}
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
