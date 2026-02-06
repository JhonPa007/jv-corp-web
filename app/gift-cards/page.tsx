"use client";

import { useState } from "react";
import Image from "next/image";
import { FaCut, FaWineGlass, FaGift } from "react-icons/fa";

type GiftOption = "corte" | "ritual" | "libre" | null;

export default function GiftCardsPage() {
    const [selectedOption, setSelectedOption] = useState<GiftOption>(null);
    const [customAmount, setCustomAmount] = useState("");

    const handleOptionSelect = (option: GiftOption) => {
        setSelectedOption(option);
    };

    return (
        <main className="min-h-screen bg-[#121212] font-sans text-gray-200 selection:bg-barberia-gold selection:text-black">
            {/* Hero Section */}
            <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center text-center px-4">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/hero-luxury-barber.png"
                        alt="Amigos brindando en barbería"
                        fill
                        className="object-cover opacity-50 grayscale"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-[#121212]/40 to-[#121212]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-agency font-bold tracking-wider text-white uppercase drop-shadow-2xl">
                        Regala <span className="text-barberia-gold">Estatus</span>,
                        <br />
                        No Objetos
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide max-w-2xl mx-auto">
                        La experiencia de barbería premium que él realmente quiere.
                    </p>
                </div>
            </section>

            {/* Selection Section */}
            <section className="py-24 px-4 max-w-7xl mx-auto z-20 relative -mt-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-agency font-bold text-barberia-gold uppercase tracking-[0.2em] mb-4">
                        Elige la Experiencia
                    </h2>
                    <div className="w-24 h-1 bg-barberia-gold/50 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1: Corte & Estilo */}
                    <div
                        onClick={() => handleOptionSelect("corte")}
                        className={`
              group cursor-pointer relative p-8 md:p-12
              bg-[#1a1a1a] border border-white/10
              hover:border-barberia-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]
              transition-all duration-500 ease-out
              flex flex-col items-center text-center
              ${selectedOption === "corte" ? "border-barberia-gold bg-[#222] scale-105 shadow-[0_0_40px_rgba(212,175,55,0.15)] ring-1 ring-barberia-gold/50" : ""}
            `}
                    >
                        <div className="mb-6 p-4 rounded-full bg-white/5 group-hover:bg-barberia-gold/20 transition-colors duration-500">
                            <FaCut className="w-8 h-8 text-barberia-gold" />
                        </div>
                        <h3 className="text-2xl font-agency font-bold text-white mb-2 tracking-wide group-hover:text-barberia-gold transition-colors">
                            CORTE & ESTILO
                        </h3>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-gray-500 line-through text-lg">S/ 40</span>
                            <span className="text-3xl font-bold text-white">S/ 30</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Corte clásico o moderno, lavado premium y styling con productos exclusivos.
                        </p>
                        <div className={`w-full py-3 border border-white/20 text-sm uppercase tracking-widest transition-all duration-300
                ${selectedOption === "corte" ? "bg-barberia-gold text-black border-barberia-gold font-bold" : "text-white group-hover:border-barberia-gold group-hover:text-barberia-gold"}
            `}>
                            {selectedOption === "corte" ? "Seleccionado" : "Elegir Pack"}
                        </div>
                    </div>

                    {/* Card 2: Ritual Caballero */}
                    <div
                        onClick={() => handleOptionSelect("ritual")}
                        className={`
              group cursor-pointer relative p-8 md:p-12
              bg-[#1a1a1a] border border-barberia-gold/30
              hover:border-barberia-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]
              transition-all duration-500 ease-out
              flex flex-col items-center text-center
              transform md:-translate-y-4
              ${selectedOption === "ritual" ? "border-barberia-gold bg-[#222] scale-105 shadow-[0_0_50px_rgba(212,175,55,0.2)] ring-1 ring-barberia-gold" : ""}
            `}
                    >
                        <div className="absolute top-0 right-0 bg-barberia-gold text-black text-xs font-bold px-4 py-1 uppercase tracking-widest">
                            Más Popular
                        </div>
                        <div className="mb-6 p-4 rounded-full bg-white/5 group-hover:bg-barberia-gold/20 transition-colors duration-500">
                            <FaWineGlass className="w-8 h-8 text-barberia-gold" />
                        </div>
                        <h3 className="text-2xl font-agency font-bold text-white mb-2 tracking-wide group-hover:text-barberia-gold transition-colors">
                            RITUAL CABALLERO
                        </h3>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl font-bold text-barberia-gold">S/ 50</span>
                        </div>
                        <ul className="text-gray-400 text-sm space-y-2 mb-8 text-left w-full px-4">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-barberia-gold rounded-full" /> Corte de Cabello Premium</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-barberia-gold rounded-full" /> Perfilado de Barba</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-barberia-gold rounded-full" /> Mascarilla Facial Negra</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-barberia-gold rounded-full" /> Bebida de Cortesía</li>
                        </ul>
                        <div className={`w-full py-3 border border-barberia-gold text-sm uppercase tracking-widest transition-all duration-300
                ${selectedOption === "ritual" ? "bg-barberia-gold text-black font-bold shadow-lg" : "text-barberia-gold hover:bg-barberia-gold hover:text-black"}
            `}>
                            {selectedOption === "ritual" ? "Seleccionado" : "Elegir Ritual"}
                        </div>
                    </div>

                    {/* Card 3: Monto Libre */}
                    <div
                        onClick={() => handleOptionSelect("libre")}
                        className={`
              group cursor-pointer relative p-8 md:p-12
              bg-[#1a1a1a] border border-white/10
              hover:border-barberia-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]
              transition-all duration-500 ease-out
              flex flex-col items-center text-center
              ${selectedOption === "libre" ? "border-barberia-gold bg-[#222] scale-105 shadow-[0_0_40px_rgba(212,175,55,0.15)] ring-1 ring-barberia-gold/50" : ""}
            `}
                    >
                        <div className="mb-6 p-4 rounded-full bg-white/5 group-hover:bg-barberia-gold/20 transition-colors duration-500">
                            <FaGift className="w-8 h-8 text-barberia-gold" />
                        </div>
                        <h3 className="text-2xl font-agency font-bold text-white mb-2 tracking-wide group-hover:text-barberia-gold transition-colors">
                            MONTO LIBRE
                        </h3>

                        <div className="w-full mb-6 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-barberia-gold text-xl font-bold">S/</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                onClick={(e) => e.stopPropagation()} // Prevent card toggle when clicking input
                                className="w-full bg-black/40 border border-white/20 rounded-none py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-barberia-gold transition-colors text-lg"
                            />
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Tú decides el valor del regalo. Válido para canjear por cualquier servicio o producto de la tienda.
                        </p>
                        <div className={`w-full py-3 border border-white/20 text-sm uppercase tracking-widest transition-all duration-300
                ${selectedOption === "libre" ? "bg-barberia-gold text-black border-barberia-gold font-bold" : "text-white group-hover:border-barberia-gold group-hover:text-barberia-gold"}
            `}>
                            {selectedOption === "libre" ? "Seleccionado" : "Personalizar"}
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className={`
        relative pb-32 transition-all duration-700 ease-in-out
        ${selectedOption ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none h-0 overflow-hidden"}
      `}>
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-[#1a1a1a] p-10 border-t-4 border-barberia-gold shadow-2xl relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-barberia-gold rotate-45"></div>

                        <h3 className="text-2xl font-agency text-white mb-8 text-center uppercase tracking-widest">
                            Personaliza tu <span className="text-barberia-gold">Regalo</span>
                        </h3>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-barberia-gold font-bold">De (Tu Nombre)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/40 border-b border-white/20 py-3 px-4 text-white focus:outline-none focus:border-barberia-gold transition-colors"
                                        placeholder="Ej. Ana"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-barberia-gold font-bold">Para (Afortunado)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/40 border-b border-white/20 py-3 px-4 text-white focus:outline-none focus:border-barberia-gold transition-colors"
                                        placeholder="Ej. Carlos"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-barberia-gold font-bold">Dedicatoria</label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-black/40 border-b border-white/20 py-3 px-4 text-white focus:outline-none focus:border-barberia-gold transition-colors resize-none"
                                    placeholder="Escribe un mensaje especial..."
                                ></textarea>
                            </div>

                            <div className="pt-8 text-center">
                                <button type="submit" className="px-12 py-4 bg-barberia-gold text-black font-agency font-bold text-xl uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                                    Continuar al Pago
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
