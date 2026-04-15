'use client';

import React, { useState } from 'react';
import { createReclamacion } from '../actions/reclamaciones-actions';
import { FiSend, FiCheckCircle, FiAlertCircle, FiInfo, FiDownload } from 'react-icons/fi';

export default function LibroReclamacionesPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; codigo?: string } | null>(null);
    const [esMenor, setEsMenor] = useState(false);
    const [submittedData, setSubmittedData] = useState<any>(null);

    const handleDownloadPDF = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const dataObj = Object.fromEntries(formData.entries());

        // Validación de Blindaje de Datos
        if (formData.get('acepto_terminos') !== 'on') {
            alert("Debe aceptar el tratamiento de datos para continuar");
            return;
        }

        setIsSubmitting(true);
        setResult(null);

        try {
            const res = await createReclamacion(formData);
            setResult(res as any);
            if (res.success) {
                setSubmittedData(dataObj);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            setResult({ success: false, message: "Error de red o servidor. Intente de nuevo." });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (result?.success) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div id="reclamacion-content" className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-green-100 no-print">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiCheckCircle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-800 mb-1">¡Registro Exitoso!</h2>
                        <p className="text-neutral-500 text-sm mb-4">Su solicitud ha sido procesada correctamente.</p>

                        <div className="bg-neutral-50 p-4 rounded-xl mb-6 border border-neutral-100">
                            <p className="text-[10px] text-neutral-400 uppercase font-black tracking-widest mb-1">Código de Seguimiento</p>
                            <p className="text-3xl font-bold text-neutral-900 font-agency tracking-wider">{result.codigo}</p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                            <FiInfo className="text-barberia-gold mt-0.5 shrink-0" />
                            <p className="text-xs text-neutral-600">Se envió una copia fiel a <strong>su correo</strong>. Puede descargar el PDF numerado aquí debajo.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 no-print">
                        <button
                            onClick={handleDownloadPDF}
                            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                        >
                            <FiDownload /> Imprimir / Guardar Hoja Completa
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full bg-neutral-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all"
                        >
                            Volver al Inicio
                        </button>
                    </div>

                    {/* HOJA DE RECLAMACIÓN OFICIAL (VISIBLE SOLO AL IMPRIMIR) */}
                    {submittedData && (
                        <div id="hoja-reclamacion" className="print-only hidden">
                            <div className="p-8 border-2 border-black">
                                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
                                    <div>
                                        <h1 className="text-2xl font-black">LIBRO DE RECLAMACIONES</h1>
                                        <p className="text-xs">JV CORP SAC - RUC 20614287561</p>
                                        <p className="text-xs">Av. Abancay con Jr. Cuzco, Lima</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="border-2 border-red-600 p-2 text-red-600 font-bold mb-2">
                                            HOJA DE RECLAMACIÓN<br />
                                            N° {result.codigo}
                                        </div>
                                        <p className="text-xs">Fecha: {new Date().toLocaleDateString('es-PE')}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-sm">
                                    {/* 1. Identificación del Consumidor */}
                                    <div className="border-b border-black pb-2">
                                        <h3 className="bg-neutral-200 px-2 py-1 font-bold mb-2">1. IDENTIFICACIÓN DEL CONSUMIDOR</h3>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-2">
                                            <p><span className="font-bold">Nombre:</span> {submittedData.nombre_completo}</p>
                                            <p><span className="font-bold">DNI/CE:</span> {submittedData.numero_documento}</p>
                                            <p className="col-span-2"><span className="font-bold">Domicilio:</span> {submittedData.direccion_domicilio}</p>
                                            <p><span className="font-bold">Teléfono:</span> {submittedData.telefono}</p>
                                            <p><span className="font-bold">E-mail:</span> {submittedData.email}</p>
                                            {submittedData.nombre_padre_tutor && (
                                                <p className="col-span-2"><span className="font-bold">Padre/Tutor:</span> {submittedData.nombre_padre_tutor}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* 2. Identificación del Bien */}
                                    <div className="border-b border-black pb-2">
                                        <h3 className="bg-neutral-200 px-2 py-1 font-bold mb-2">2. IDENTIFICACIÓN DEL BIEN CONTRATADO</h3>
                                        <div className="px-2">
                                            <p><span className="font-bold">Unidad:</span> {submittedData.unidad_negocio} | <span className="font-bold">Tipo:</span> {submittedData.tipo_bien}</p>
                                            <p><span className="font-bold">Monto:</span> S/. {submittedData.monto_reclamado || '0.00'}</p>
                                            <p><span className="font-bold">Descripción:</span> {submittedData.descripcion_bien}</p>
                                        </div>
                                    </div>

                                    {/* 3. Detalle de Reclamación */}
                                    <div className="border-b border-black pb-2">
                                        <h3 className="bg-neutral-200 px-2 py-1 font-bold mb-2">3. DETALLE DE LA RECLAMACIÓN Y PEDIDO DEL CONSUMIDOR</h3>
                                        <div className="px-2 space-y-2">
                                            <p><span className="font-bold">Incidencia:</span> {submittedData.tipo_incidencia}</p>
                                            <div className="border p-2 rounded">
                                                <p className="font-bold text-xs uppercase mb-1 underline">Detalle:</p>
                                                <p>{submittedData.detalle_incidencia}</p>
                                            </div>
                                            <div className="border p-2 rounded">
                                                <p className="font-bold text-xs uppercase mb-1 underline">Pedido del Consumidor:</p>
                                                <p>{submittedData.pedido_consumidor}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. Acciones del Proveedor */}
                                    <div className="border-b border-black pb-2">
                                        <h3 className="bg-neutral-200 px-2 py-1 font-bold mb-2">4. OBSERVACIONES Y ACCIONES DEL PROVEEDOR</h3>
                                        <div className="h-24 border border-dashed border-neutral-400 p-2 flex items-end">
                                            <p className="text-[10px] text-neutral-400 italic">Espacio reservado para el proveedor...</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-12 text-center text-xs">
                                    <div className="border-t border-black pt-2">FIRMA DEL CONSUMIDOR</div>
                                    <div className="border-t border-black pt-2">FIRMA DEL PROVEEDOR</div>
                                </div>

                                <div className="mt-6 text-[9px] text-neutral-500 leading-tight">
                                    * La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es condición previa para interponer una denuncia ante el INDECOPI.<br />
                                    * El proveedor deberá dar respuesta al reclamo en un plazo no mayor a quince (15) días hábiles.
                                </div>
                            </div>
                        </div>
                    )}

                    <style jsx>{`
                        @media print {
                            body * {
                                visibility: hidden !important;
                            }
                            #hoja-reclamacion, #hoja-reclamacion * {
                                visibility: visible !important;
                            }
                            #hoja-reclamacion {
                                display: block !important;
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                            }
                            .no-print {
                                display: none !important;
                            }
                        }
                        .print-only {
                            display: none;
                        }
                    `}</style>
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
                                <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Nombre Completo *</label>
                                <input required name="nombre_completo" type="text" className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold focus:border-transparent outline-none transition-all text-neutral-900 placeholder:text-neutral-500 font-medium" placeholder="Ej: Juan Pérez Rojas" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Tipo de Documento *</label>
                                <select required name="tipo_documento" className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all text-neutral-900 font-medium">
                                    <option value="DNI">DNI</option>
                                    <option value="CE">C.E. (Carné de Extranjería)</option>
                                    <option value="Pasaporte">Pasaporte</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Número de Documento *</label>
                                <input required name="numero_documento" type="text" className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all text-neutral-900 font-bold" placeholder="Ej: 71234567" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Domicilio *</label>
                                <input required name="direccion_domicilio" type="text" className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all text-neutral-900 font-bold" placeholder="Dirección completa, distrito y ciudad" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Teléfono / Celular *</label>
                                <input required name="telefono" type="tel" className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all text-neutral-900 font-bold" placeholder="Ej: 987654321" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Correo Electrónico *</label>
                                <input required name="email" type="email" className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all text-neutral-900 font-bold" placeholder="ejemplo@correo.com" />
                            </div>

                            <div className="md:col-span-2 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={esMenor}
                                        onChange={(e) => setEsMenor(e.target.checked)}
                                        className="w-5 h-5 accent-barberia-gold rounded"
                                    />
                                    <span className="text-sm text-neutral-900 font-bold">Soy menor de edad</span>
                                </label>

                                {esMenor && (
                                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Nombre del Padre o Tutor *</label>
                                        <input required={esMenor} name="nombre_padre_tutor" type="text" className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all text-neutral-900 font-bold" placeholder="Nombre completo del representante" />
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
                                <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Unidad de Negocio *</label>
                                <select required name="unidad_negocio" className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all text-neutral-900 font-bold">
                                    <option value="Studio">JV Studio (Barbería/Salón)</option>
                                    <option value="School">JV School (Academia)</option>
                                    <option value="Comercial">JV Comercial (Productos)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Tipo de Bien *</label>
                                <div className="flex gap-4 mt-1">
                                    <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 has-[:checked]:border-barberia-gold has-[:checked]:bg-barberia-gold/5 transition-all">
                                        <input required type="radio" name="tipo_bien" value="Producto" className="w-4 h-4 accent-barberia-gold" />
                                        <span className="text-sm font-bold uppercase text-neutral-900">Producto</span>
                                    </label>
                                    <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 has-[:checked]:border-barberia-gold has-[:checked]:bg-barberia-gold/5 transition-all">
                                        <input required type="radio" name="tipo_bien" value="Servicio" className="w-4 h-4 accent-barberia-gold" />
                                        <span className="text-sm font-bold uppercase text-neutral-900">Servicio</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Monto Reclamado (S/.)</label>
                                <input name="monto_reclamado" type="number" step="0.01" className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all text-neutral-900 font-bold" placeholder="0.00" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Descripción del Producto o Servicio *</label>
                                <textarea required name="descripcion_bien" rows={2} className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all text-neutral-900 placeholder:text-neutral-500 font-medium resize-none" placeholder="Indique brevemente el producto o servicio..." />
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
                                <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Tipo de Incidencia *</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 has-[:checked]:border-barberia-gold has-[:checked]:bg-barberia-gold/5 transition-all">
                                        <div className="flex items-center gap-3 mb-2">
                                            <input required type="radio" name="tipo_incidencia" value="Reclamo" className="w-5 h-5 accent-barberia-gold" />
                                            <span className="font-bold uppercase text-neutral-800">Reclamo</span>
                                        </div>
                                        <p className="text-xs text-neutral-700 leading-relaxed pl-8 font-medium">
                                            Disconformidad relacionada a los productos o servicios expendidos o suministrados.
                                        </p>
                                    </label>
                                    <label className="p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 has-[:checked]:border-barberia-gold has-[:checked]:bg-barberia-gold/5 transition-all">
                                        <div className="flex items-center gap-3 mb-2">
                                            <input required type="radio" name="tipo_incidencia" value="Queja" className="w-5 h-5 accent-barberia-gold" />
                                            <span className="font-bold uppercase text-neutral-800">Queja</span>
                                        </div>
                                        <p className="text-xs text-neutral-700 leading-relaxed pl-8 font-medium">
                                            Malestar o descontento respecto a la atención al público.
                                        </p>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Detalle de la Reclamación *</label>
                                <textarea required name="detalle_incidencia" rows={5} className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all text-neutral-900 placeholder:text-neutral-500 font-bold resize-none" placeholder="Describa con detalle lo sucedido..." />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-700 font-bold uppercase mb-2 tracking-wide">Pedido del Consumidor *</label>
                                <textarea required name="pedido_consumidor" rows={3} className="w-full bg-neutral-100 border border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-barberia-gold outline-none transition-all text-neutral-900 placeholder:text-neutral-500 font-bold resize-none" placeholder="¿Qué es lo que solicita?" />
                            </div>
                        </div>
                    </div>

                    {/* Aceptación y Envío */}
                    <div className="bg-neutral-900 rounded-2xl p-6 md:p-8 shadow-xl text-white">
                        <div className="flex flex-col gap-6 mb-8">
                            {/* Plazo Legal INDECOPI */}
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                <input required type="checkbox" id="acepto_plazos" className="w-6 h-6 mt-1 accent-barberia-gold cursor-pointer" />
                                <label htmlFor="acepto_plazos" className="text-sm md:text-base leading-relaxed cursor-pointer text-neutral-300">
                                    Acepto que la respuesta será enviada en un plazo máximo de <span className="text-barberia-gold font-bold">15 días hábiles</span> (improrrogables) al correo electrónico proporcionado.
                                </label>
                            </div>

                            {/* Blindaje de Datos Personales - Ley N° 29733 */}
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                <input required name="acepto_terminos" type="checkbox" id="acepto_terminos" className="w-6 h-6 mt-1 accent-barberia-gold cursor-pointer" />
                                <div className="flex flex-col">
                                    <label htmlFor="acepto_terminos" className="text-[11px] md:text-[12px] leading-snug cursor-pointer text-neutral-400">
                                        De conformidad con la <span className="text-white font-medium">Ley N° 29733 de Protección de Datos Personales</span>, autorizo a <span className="text-white font-medium">JV Corp SAC (RUC 20614287561)</span> a tratar mis datos para la gestión de este reclamo. Entiendo que mis datos se almacenarán en su banco de datos por un periodo de 2 años según exige INDECOPI y que puedo ejercer mis derechos ARCO escribiendo a <span className="text-barberia-gold underline">legal@jvcorp.com</span>.
                                    </label>
                                    <a href="/politica-de-privacidad" target="_blank" className="text-[10px] text-barberia-gold uppercase font-bold mt-2 hover:underline">Ver Política de Privacidad completa</a>
                                </div>
                            </div>
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

                <footer className="mt-12 text-center text-neutral-400 text-xs py-6 border-t border-neutral-200 no-print">
                    <p>© {new Date().getFullYear()} JV Corp SAC. Todos los derechos reservados.</p>
                </footer>
            </div>
        </main>
    );
}
