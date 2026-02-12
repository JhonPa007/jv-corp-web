"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaCut, FaWineGlass, FaGift } from "react-icons/fa";

import { createGiftCard, getActivePackages, type PackageWithItems } from "@/app/actions/gift-card-actions";

type GiftOption = number | "libre" | null; // number for package ID

export default function GiftCardsPage() {
    const [packages, setPackages] = useState<PackageWithItems[]>([]);

    // Fetch packages on mount
    useEffect(() => {
        const fetchPackages = async () => {
            const data = await getActivePackages();
            setPackages(data);
        };
        fetchPackages();
    }, []);

    const [selectedOption, setSelectedOption] = useState<GiftOption>(null);
    const [customAmount, setCustomAmount] = useState("");
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        message: "",
        whatsapp: "",
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const [isPersonalized, setIsPersonalized] = useState(true);

    const handleOptionSelect = (option: GiftOption) => {
        setSelectedOption(option);
        setIsPersonalized(true); // Reset to default
        setFormData({ from: "", to: "", message: "", whatsapp: "" }); // Reset form
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const [generatedCode, setGeneratedCode] = useState("");

    const [expirationDate, setExpirationDate] = useState<Date | null>(null);

    const handleGeneratePDF = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOption || !cardRef.current) return;

        setIsGenerating(true);

        try {
            // 1. Calculate amount and prepare data
            let amount = 0;
            let packageName = "";
            let packageId: number | undefined = undefined;

            if (selectedOption === "libre") {
                amount = parseFloat(customAmount) || 0;
                packageName = "Gift Card";
            } else if (typeof selectedOption === "number") {
                // It's a package
                const pkg = packages.find(p => p.id === selectedOption);
                if (pkg) {
                    amount = pkg.price;
                    packageName = pkg.name;
                    packageId = pkg.id;
                }
            }

            if (amount <= 0) {
                alert("Por favor ingresa un monto válido.");
                setIsGenerating(false);
                return;
            }

            // 2. Save to Database
            const result = await createGiftCard({
                amount: amount,
                from: isPersonalized ? formData.from : undefined,
                to: formData.to,
                message: isPersonalized ? formData.message : undefined,
                whatsapp: formData.whatsapp,
                packageId: packageId
            });

            if (!result.success || !result.code) {
                throw new Error(result.error || "Error al crear la tarjeta");
            }

            setGeneratedCode(result.code);
            if (result.expirationDate) {
                setExpirationDate(new Date(result.expirationDate));
            }

            // Wait for state update to reflect in DOM (Code is displayed in the hidden template)
            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure React renders the code

            // 3. Generate PDF
            const html2pdf = (await import("html2pdf.js")).default;

            const opt = {
                margin: 0,
                filename: `GiftCard-85x45mm-${result.code}.pdf`,
                image: { type: 'jpeg' as const, quality: 1.0 },
                html2canvas: {
                    scale: 4,
                    logging: false,
                    useCORS: true,
                    scrollY: 0,
                    width: 850, // Match element width
                    height: 450 // Match element height
                },
                jsPDF: { unit: 'mm', format: [85, 45] as [number, number], orientation: 'portrait' as const } // Portrait because we define WxH explicit
            };

            // Force a reflow/repaint before capture
            if (cardRef.current) {
                cardRef.current.style.display = 'flex'; // Ensure it's not 'none'
            }

            await html2pdf().set(opt).from(cardRef.current).save();

            // Auto-close modal and show success message
            setTimeout(() => {
                setSelectedOption(null);
                alert("¡Gift Card generada con éxito!");
            }, 1000); // Give it a sec for the download to start

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert(`Hubo un error al generar la tarjeta PDF: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const getPackDetails = () => {
        if (selectedOption === "libre") {
            return { title: "GIFT CARD", price: `S/ ${customAmount || "0.00"}`, desc: "Monto de consumo libre para cualquier servicio." };
        }
        if (typeof selectedOption === "number") {
            const pkg = packages.find(p => p.id === selectedOption);
            if (pkg) return {
                title: pkg.name.toUpperCase(),
                price: `S/ ${pkg.price.toFixed(2)}`,
                desc: pkg.description || "Recibe un servicio de lujo, con un corte de cabello que combina elegancia y modernidad"
            };
        }
        return { title: "", price: "", desc: "" };
    };

    const packDetails = getPackDetails();

    return (
        <main className="min-h-screen bg-[#121212] font-sans text-gray-200 selection:bg-barberia-gold selection:text-black">
            {/* Hero Section */}
            <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center text-center px-4">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 opacity-60"
                        style={{
                            backgroundImage: "url('/landing-bg.jpg')",
                            backgroundAttachment: "fixed",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-[#121212]/40 to-[#121212]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-agency font-bold tracking-wider text-white uppercase drop-shadow-2xl">
                        Para esa fecha <span className="text-barberia-gold">especial</span>,
                        <br />
                        Regala Experiencia
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
                    {/* Dynamic Packages */}
                    {/* Dynamic Packages */}
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            onClick={() => handleOptionSelect(pkg.id)}
                            className={`
                                group cursor-pointer relative p-8 md:p-12
                                bg-[#1a1a1a] border border-white/10
                                hover:border-barberia-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]
                                transition-all duration-500 ease-out
                                flex flex-col items-center text-center
                                ${selectedOption === pkg.id ? "border-barberia-gold bg-[#222] scale-105 shadow-[0_0_40px_rgba(212,175,55,0.15)] ring-1 ring-barberia-gold/50" : ""}
                            `}
                        >
                            <div className="mb-6 p-4 rounded-full bg-white/5 group-hover:bg-barberia-gold/20 transition-colors duration-500">
                                <FaCut className="w-8 h-8 text-barberia-gold" />
                            </div>
                            <h3 className="text-2xl font-agency font-bold text-white mb-2 tracking-wide group-hover:text-barberia-gold transition-colors uppercase">
                                {pkg.name}
                            </h3>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl font-bold text-white">S/ {pkg.price}</span>
                            </div>

                            {/* Description or Service List */}
                            <div className="text-gray-400 text-sm mb-8 text-left w-full px-4 min-h-[80px]">
                                {pkg.description ? (
                                    <p className="italic leading-relaxed line-clamp-3">"{pkg.description}"</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {pkg.package_items.slice(0, 3).map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-barberia-gold rounded-full" />
                                                {item.quantity > 1 ? `${item.quantity}x ` : ""}{item.servicios.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className={`w-full py-3 border border-white/20 text-sm uppercase tracking-widest transition-all duration-300
                                ${selectedOption === pkg.id ? "bg-barberia-gold text-black border-barberia-gold font-bold" : "text-white group-hover:border-barberia-gold group-hover:text-barberia-gold"}
                            `}>
                                {selectedOption === pkg.id ? "Seleccionado" : "Elegir Pack"}
                            </div>
                        </div>
                    ))}

                    {/* Card 3: Monto Libre (Always last) */}
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

            {/* Form Modal */}
            {selectedOption && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="relative w-full max-w-2xl bg-[#1a1a1a] p-8 md:p-10 rounded-none border border-barberia-gold shadow-[0_0_50px_rgba(212,175,55,0.2)]">

                        <button
                            onClick={() => setSelectedOption(null)}
                            className="absolute -top-5 -right-5 w-10 h-10 bg-barberia-gold text-black rounded-full flex items-center justify-center font-bold text-xl hover:bg-white transition-colors shadow-lg z-10"
                        >
                            ✕
                        </button>

                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-barberia-gold rotate-45"></div>

                        <h3 className="text-3xl font-agency text-white mb-2 text-center uppercase tracking-widest">
                            {isPersonalized ? "Personaliza tu" : "Datos del"} <span className="text-barberia-gold">{isPersonalized ? "Regalo" : "Beneficiario"}</span>
                        </h3>
                        <p className="text-center text-gray-400 mb-6 text-sm uppercase tracking-wide">
                            {selectedOption === "libre" ? "Monto Libre" : packages.find(p => p.id === selectedOption)?.name}
                        </p>

                        <div className="flex justify-center mb-6">
                            <label className="flex items-center cursor-pointer gap-3">
                                <span className={`text-sm uppercase tracking-wide ${!isPersonalized ? "text-barberia-gold font-bold" : "text-gray-500"}`}>Solo Beneficiario</span>
                                <div className="relative">
                                    <input type="checkbox" className="sr-only" checked={isPersonalized} onChange={() => setIsPersonalized(!isPersonalized)} />
                                    <div className={`block w-14 h-8 rounded-full border border-barberia-gold/50 transition-colors ${isPersonalized ? "bg-barberia-gold/20" : "bg-black/40"}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-barberia-gold w-6 h-6 rounded-full transition-transform duration-300 ${isPersonalized ? "translate-x-6 bg-barberia-gold" : "bg-gray-500"}`}></div>
                                </div>
                                <span className={`text-sm uppercase tracking-wide ${isPersonalized ? "text-barberia-gold font-bold" : "text-gray-500"}`}>Dedicatoria</span>
                            </label>
                        </div>

                        <form onSubmit={handleGeneratePDF} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isPersonalized && (
                                    <div className="space-y-2 animate-fade-in">
                                        <label className="text-xs uppercase tracking-widest text-barberia-gold font-bold">De (Tu Nombre)</label>
                                        <input
                                            type="text"
                                            name="from"
                                            value={formData.from}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/40 border-b border-white/20 py-3 px-4 text-white focus:outline-none focus:border-barberia-gold transition-colors"
                                            placeholder="Ej. Ana"
                                            required={isPersonalized}
                                        />
                                    </div>
                                )}
                                <div className={`space-y-2 ${!isPersonalized ? "md:col-span-2" : ""}`}>
                                    <label className="text-xs uppercase tracking-widest text-barberia-gold font-bold">Para (Afortunado)</label>
                                    <input
                                        type="text"
                                        name="to"
                                        value={formData.to}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border-b border-white/20 py-3 px-4 text-white focus:outline-none focus:border-barberia-gold transition-colors"
                                        placeholder="Ej. Carlos"
                                        required
                                    />
                                </div>
                                <div className={`space-y-2 ${!isPersonalized ? "md:col-span-2" : ""}`}>
                                    <label className="text-xs uppercase tracking-widest text-barberia-gold font-bold">WhatsApp del Beneficiario</label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border-b border-white/20 py-3 px-4 text-white focus:outline-none focus:border-barberia-gold transition-colors"
                                        placeholder="Ej. 999888777"
                                        required
                                    />
                                </div>
                            </div>

                            {isPersonalized && (
                                <div className="space-y-2 animate-fade-in">
                                    <label className="text-xs uppercase tracking-widest text-barberia-gold font-bold">Dedicatoria</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full bg-black/40 border-b border-white/20 py-3 px-4 text-white focus:outline-none focus:border-barberia-gold transition-colors resize-none"
                                        placeholder="Escribe un mensaje especial..."
                                        required={isPersonalized}
                                    ></textarea>
                                </div>
                            )}

                            <div className="pt-4 text-center flex flex-col items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={isGenerating}
                                    className="w-full md:w-auto px-12 py-4 bg-barberia-gold text-black font-agency font-bold text-xl uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGenerating ? "Generando..." : "Confirmar y Descargar PDF"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* HIDDEN PDF TEMPLATE - Exactly matching Reference Image 2 */}
            <div style={{ position: "fixed", left: "-9999px", top: "0", zIndex: -50, opacity: 0, pointerEvents: "none" }}>
                <div
                    ref={cardRef}
                    style={{
                        width: "850px",
                        height: "450px",
                        backgroundColor: "#000000",
                        backgroundImage: "url(/gift-card-bg-v3.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        flexDirection: "column",
                        padding: "40px 50px", // Adjusted padding
                        boxSizing: "border-box",
                        fontFamily: "var(--font-agency), sans-serif",
                        color: "white",
                        position: "relative"
                    }}
                >
                    {/* Header Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                        <div style={{ width: "30%" }}>
                            <h2 style={{ fontSize: "42px", fontWeight: "bold", margin: 0, lineHeight: 1 }}>
                                <span style={{ color: "#D4AF37" }}>JV</span> STUDIO
                            </h2>
                        </div>
                        <div style={{ width: "40%", textAlign: "center" }}>
                            <h3 style={{
                                color: "#D4AF37",
                                fontSize: "32px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                margin: "5px 0 0 0",
                                letterSpacing: "2px"
                            }}>
                                GIFT CARD
                            </h3>
                        </div>
                        <div style={{ width: "30%", display: "flex", justifyContent: "flex-end" }}>
                            <div style={{
                                border: "2px solid #D4AF37",
                                padding: "8px 15px",
                                fontSize: "18px",
                                textTransform: "uppercase",
                                letterSpacing: "1px"
                            }}>
                                CÓDIGO: <span style={{ fontWeight: "bold", color: "#fff" }}>{generatedCode || "PENDIENTE"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Center Content */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                        <h1 style={{
                            color: "#D4AF37",
                            fontSize: "64px",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            margin: "0 0 20px 0",
                            lineHeight: 0.8
                        }}>
                            {packDetails.title || "GIFT CARD"}
                        </h1>
                        <p style={{
                            fontSize: "22px",
                            color: "#cccccc",
                            fontWeight: "300",
                            maxWidth: "90%",
                            margin: 0,
                            lineHeight: 1.2
                        }}>
                            {packDetails.desc}
                        </p>
                    </div>

                    {/* Dedication */}
                    <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "30px", minHeight: "38px" }}>
                        {isPersonalized && (
                            <p style={{
                                color: "#D4AF37",
                                fontSize: "32px",
                                fontFamily: "Brush Script MT, cursive",
                                fontStyle: "italic",
                                margin: 0
                            }}>
                                "{formData.message || "Un presente especial para ti"}"
                            </p>
                        )}
                    </div>

                    {/* Footer Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div style={{ textAlign: "left" }}>
                            {isPersonalized ? (
                                <>
                                    <p style={{ fontSize: "22px", margin: "0 0 5px 0", color: "#fff" }}>
                                        <span style={{ color: "#bbb" }}>{formData.from}</span>
                                    </p>
                                    <p style={{ fontSize: "22px", margin: 0, color: "#fff" }}>
                                        <span style={{ color: "#bbb" }}>{formData.to}</span>
                                    </p>
                                </>
                            ) : (
                                <p style={{ fontSize: "26px", margin: 0, color: "#fff", fontWeight: "bold", textTransform: "uppercase" }}>
                                    <span style={{ color: "#fff" }}>{formData.to}</span>
                                </p>
                            )}
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "20px", color: "#ccc", margin: "0 0 5px 0" }}>
                                VENCE: <span style={{ color: "#fff" }}>{expirationDate ? expirationDate.toLocaleDateString("es-PE") : "PENDIENTE"}</span>
                            </p>
                            <p style={{ fontSize: "14px", color: "#888", textTransform: "uppercase", margin: 0, letterSpacing: "1px" }}>
                                VÁLIDO PARA CANJE EN JV STUDIO
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    );
}

