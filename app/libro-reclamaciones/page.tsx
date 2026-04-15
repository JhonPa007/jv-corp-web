'use client';

import React, { useState } from 'react';
import { createReclamacion } from '../actions/reclamaciones-actions';
import { FiSend, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

export default function LibroReclamacionesPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; codigo?: string } | null>(null);
    const [esMenor, setEsMenor] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setResult(null);

        const formData = new FormData(e.currentTarget);
        const res = await createReclamacion(formData);

        setResult(res as any);
        setIsSubmitting(false);

        if (res.success) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    if (result?.success) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-green-100">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-800 mb-2">¡Reclamación Registrada!</h2>
                    <p className="text-neutral-600 mb-6">{result.message}</p>
                    <div className="bg-neutral-100 p-4 rounded-lg mb-8">
                        <p className="text-sm text-neutral-500 uppercase font-semibold mb-1">Código de Seguimiento</p>
                        <p className="text-2xl font-mono font-bold text-neutral-900 tracking-wider font-agency">{result.codigo}</p>
                    </div>
                    <p className="text-sm text-neutral-500 mb-8">
                        Se ha enviado una copia fiel a su correo electrónico. Guarde este código para futuras consultas.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-barberia-dark text-white font-bold py-3 rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                        Volver a Inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-50 pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Legal */}
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 mb-8 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2 uppercase tracking-tight">
                        Libro de Reclamaciones Virtual
                    </h1>
                    <p className="text-neutral-500 text-sm md:text-base font-medium">
                        Conforme al Código de Protección y Defensa del Consumidor (Ley N° 29571)
                    </p>
                    <div className="mt-4 inline-block px-4 py-1 bg-barberia-gold/10 text-barberia-gold rounded-full text-xs font-bold uppercase tracking-wider">
                        JV CORP SAC - RUC 20614287561
                    </div>
                </div>

                {result?.success === false && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                        <FiAlertCircle className="shrink-0" />
                        <p className="text-sm">{result.message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Sección 1: Datos del Consumidor */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                        <div className="bg-neutral-900 px-6 py-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-barberia-gold text-white flex items-center justify-center font-bold">1</span>
                            <h2 className="text-white font-bold uppercase text-sm tracking-widest">Identificación del Consumidor</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Nombre Completo *</label>
                                <input required name="nombre_completo" type="text" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all placeholder:text-neutral-400" placeholder="Ej: Juan Pérez Rojas" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Tipo de Documento *</label>
                                <select required name="tipo_documento" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all">
                                    <option value="DNI">DNI</option>
                                    <option value="CE">C.E. (Carné de Extranjería)</option>
                                    <option value="Pasaporte">Pasaporte</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Número de Documento *</label>
                                <input required name="numero_documento" type="text" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all" placeholder="Ej: 71234567" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Domicilio *</label>
                                <input required name="direccion_domicilio" type="text" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all" placeholder="Dirección completa, distrito y ciudad" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Teléfono / Celular *</label>
                                <input required name="telefono" type="tel" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all" placeholder="Ej: 987654321" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Correo Electrónico *</label>
                                <input required name="email" type="email" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all" placeholder="ejemplo@correo.com" />
                            </div>

                            <div className="md:col-span-2 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={esMenor}
                                        onChange={(e) => setEsMenor(e.target.checked)}
                                        className="w-5 h-5 accent-barberia-gold rounded"
                                    />
                                    <span className="text-sm text-neutral-700 font-medium">Soy menor de edad</span>
                                </label>

                                {esMenor && (
                                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Nombre del Padre o Tutor *</label>
                                        <input required={esMenor} name="nombre_padre_tutor" type="text" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all" placeholder="Nombre completo del representante" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Identificación del Bien */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                        <div className="bg-neutral-900 px-6 py-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-barberia-gold text-white flex items-center justify-center font-bold">2</span>
                            <h2 className="text-white font-bold uppercase text-sm tracking-widest">Identificación del Bien Contratado</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Unidad de Negocio *</label>
                                <select required name="unidad_negocio" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all">
                                    <option value="Studio">JV Studio (Barbería/Salón)</option>
                                    <option value="School">JV School (Academia)</option>
                                    <option value="Comercial">JV Comercial (Productos)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Tipo de Bien *</label>
                                <div className="flex gap-4 mt-1">
                                    <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 has-[:checked]:border-barberia-gold has-[:checked]:bg-barberia-gold/5 transition-all">
                                        <input required type="radio" name="tipo_bien" value="Producto" className="w-4 h-4 accent-barberia-gold" />
                                        <span className="text-sm font-bold uppercase text-neutral-600">Producto</span>
                                    </label>
                                    <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 has-[:checked]:border-barberia-gold has-[:checked]:bg-barberia-gold/5 transition-all">
                                        <input required type="radio" name="tipo_bien" value="Servicio" className="w-4 h-4 accent-barberia-gold" />
                                        <span className="text-sm font-bold uppercase text-neutral-600">Servicio</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Monto Reclamado (S/.)</label>
                                <input name="monto_reclamado" type="number" step="0.01" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all" placeholder="0.00" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Descripción del Producto o Servicio *</label>
                                <textarea required name="descripcion_bien" rows={2} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all resize-none" placeholder="Indique brevemente el producto o servicio..." />
                            </div>
                        </div>
                    </div>

                    {/* Sección 3: Detalle de Reclamación */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                        <div className="bg-neutral-900 px-6 py-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-barberia-gold text-white flex items-center justify-center font-bold">3</span>
                            <h2 className="text-white font-bold uppercase text-sm tracking-widest">Detalle de la Disconformidad</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Tipo de Incidencia *</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 has-[:checked]:border-barberia-gold has-[:checked]:bg-barberia-gold/5 transition-all">
                                        <div className="flex items-center gap-3 mb-2">
                                            <input required type="radio" name="tipo_incidencia" value="Reclamo" className="w-5 h-5 accent-barberia-gold" />
                                            <span className="font-bold uppercase text-neutral-800">Reclamo</span>
                                        </div>
                                        <p className="text-xs text-neutral-500 leading-relaxed pl-8">
                                            Disconformidad relacionada a los productos o servicios expendidos o suministrados.
                                        </p>
                                    </label>
                                    <label className="p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 has-[:checked]:border-barberia-gold has-[:checked]:bg-barberia-gold/5 transition-all">
                                        <div className="flex items-center gap-3 mb-2">
                                            <input required type="radio" name="tipo_incidencia" value="Queja" className="w-5 h-5 accent-barberia-gold" />
                                            <span className="font-bold uppercase text-neutral-800">Queja</span>
                                        </div>
                                        <p className="text-xs text-neutral-500 leading-relaxed pl-8">
                                            Malestar o descontento respecto a la atención al público.
                                        </p>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Detalle de la Reclamación *</label>
                                <textarea required name="detalle_incidencia" rows={5} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all resize-none" placeholder="Describa con detalle lo sucedido..." />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Pedido del Consumidor *</label>
                                <textarea required name="pedido_consumidor" rows={3} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all resize-none" placeholder="¿Qué es lo que solicita?" />
                            </div>
                        </div>
                    </div>

                    {/* Aceptación y Envío */}
                    <div className="bg-neutral-900 rounded-2xl p-6 md:p-8 shadow-xl text-white">
                        <div className="flex items-start gap-4 mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
                            <input required type="checkbox" id="acepto_plazos" className="w-6 h-6 mt-1 accent-barberia-gold cursor-pointer" />
                            <label htmlFor="acepto_plazos" className="text-sm md:text-base leading-relaxed cursor-pointer text-neutral-300">
                                Acepto que la respuesta será enviada en un plazo máximo de <span className="text-barberia-gold font-bold">15 días hábiles</span> (improrrogables) al correo electrónico proporcionado, conforme a la normativa vigente de INDECOPI.
                            </label>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full md:w-auto min-w-[200px] bg-barberia-gold text-barberia-dark font-black uppercase tracking-widest py-4 px-8 rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-none"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-barberia-dark/30 border-t-barberia-dark rounded-full animate-spin" />
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Enviar Reclamo</span>
                                        <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <div className="flex items-center gap-2 text-neutral-400 text-xs text-center md:text-left">
                                <FiInfo size={16} className="text-barberia-gold shrink-0" />
                                <p>Sus datos están protegidos por la Ley de Protección de Datos Personales.</p>
                            </div>
                        </div>
                    </div>
                </form>

                <footer className="mt-12 text-center text-neutral-400 text-xs py-6 border-t border-neutral-200">
                    <p>© {new Date().getFullYear()} JV Corp SAC. Todos los derechos reservados.</p>
                </footer>
            </div>
        </main>
    );
}
