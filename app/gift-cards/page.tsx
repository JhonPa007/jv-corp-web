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
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleOptionSelect = (option: GiftOption) => {
        setSelectedOption(option);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const [generatedCode, setGeneratedCode] = useState("");
    const [expirationDate, setExpirationDate] = useState<Date | null>(null);
    const [showPreview, setShowPreview] = useState(false);

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
                from: formData.from,
                to: formData.to,
                message: formData.message,
                packageId: packageId // TODO: If you have actual packages in DB, map them here. For now we use the ID if we had it, or just amount.
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
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 4, logging: false, useCORS: true }, // Increased scale for better quality at small size
                jsPDF: { unit: 'mm', format: [85, 45] as [number, number], orientation: 'landscape' as const }
            };

            // Force a reflow/repaint before capture
            if (cardRef.current) {
                cardRef.current.style.display = 'flex'; // Ensure it's not 'none'
            }

            await html2pdf().set(opt).from(cardRef.current).save();

            // Reset form or show success message?
            // alert("Tarjeta generada exitosamente!"); 

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert(`Hubo un error al generar la tarjeta PDF: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const getPackDetails = () => {
        if (selectedOption === "libre") {
            return { title: "GIFT CARD", price: `S/ ${customAmount || "0.00"}` };
        }
        if (typeof selectedOption === "number") {
            const pkg = packages.find(p => p.id === selectedOption);
            if (pkg) return { title: pkg.name.toUpperCase(), price: `S/ ${pkg.price.toFixed(2)}` };
        }
        return { title: "", price: "" };
    };

    const packDetails = getPackDetails();

    return (
        <main className="min-h-screen bg-[#121212] font-sans text-gray-200 selection:bg-barberia-gold selection:text-black">
            {/* Hero Section */}
            <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center text-center px-4">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/landing-bg.jpg"
                        alt="Amigos brindando en barbería"
                        fill
                        className="object-cover opacity-60"
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

                        <form onSubmit={handleGeneratePDF} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-barberia-gold font-bold">De (Tu Nombre)</label>
                                    <input
                                        type="text"
                                        name="from"
                                        value={formData.from}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border-b border-white/20 py-3 px-4 text-white focus:outline-none focus:border-barberia-gold transition-colors"
                                        placeholder="Ej. Ana"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
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
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-barberia-gold font-bold">Dedicatoria</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full bg-black/40 border-b border-white/20 py-3 px-4 text-white focus:outline-none focus:border-barberia-gold transition-colors resize-none"
                                    placeholder="Escribe un mensaje especial..."
                                    required
                                ></textarea>
                            </div>

                            <div className="pt-8 text-center">
                                <button
                                    type="submit"
                                    disabled={isGenerating}
                                    className="px-12 py-4 bg-barberia-gold text-black font-agency font-bold text-xl uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGenerating ? "Generando..." : "Descargar Tarjeta PDF"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(true)}
                                    className="mt-4 text-barberia-gold underline text-sm uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Vista Previa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* PREVIEW MODAL */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="relative bg-[#1a1a1a] p-2 rounded-lg shadow-2xl border border-barberia-gold/30">
                        <button
                            onClick={() => setShowPreview(false)}
                            className="absolute -top-4 -right-4 bg-barberia-gold text-black w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-white transition-colors z-[60]"
                        >
                            X
                        </button>
                        <div className="scale-[0.6] md:scale-100 origin-center">
                            {/* We just render the same structure here for preview, or reuse the hidden one? 
                                Reusing logic via React component would be best, but let's just use the hidden one 
                                by temporarily un-hiding it? No, that messes with layout. 
                                Let's duplicated the render for now as it's cleaner than extracting a component mid-flow. 
                            */}
                            <div
                                className="w-[800px] h-[400px] relative flex flex-col justify-between p-8 text-white overflow-hidden shadow-2xl"
                                style={{
                                    backgroundColor: "#111",
                                    backgroundImage: `
                                radial-gradient(circle at 50% 0%, #222, transparent 60%),
                                linear-gradient(45deg, #121212 25%, #151515 25%, #151515 50%, #121212 50%, #121212 75%, #151515 75%, #151515 100%)
                            `,
                                    backgroundSize: "100% 100%, 20px 20px"
                                }}
                            >
                                {/* Double Golden Border */}
                                <div className="absolute inset-4 border-2 border-barberia-gold opacity-80 pointer-events-none rounded-sm"></div>
                                <div className="absolute inset-6 border border-barberia-gold opacity-50 pointer-events-none rounded-sm"></div>

                                {/* Header / Logo */}
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="text-left">
                                        <h1 className="text-5xl font-agency font-bold tracking-wider text-white">
                                            <span className="text-barberia-gold">JV</span> STUDIO
                                        </h1>
                                        <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mt-1 pl-1">Barbería Premium</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-barberia-gold font-bold text-xl tracking-widest border border-barberia-gold px-3 py-1 bg-black/50">
                                            PREVIEW
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 flex flex-col justify-center items-center text-center relative z-10 my-4">
                                    <p className="text-gray-400 uppercase tracking-widest text-xs mb-2">Una experiencia exclusiva para ti</p>
                                    <h2 className="text-6xl font-agency font-bold text-barberia-gold tracking-wide drop-shadow-md mb-2">
                                        {packDetails.title || "SELECCIONA UNA OPCIÓN"}
                                    </h2>
                                    <p className="text-2xl font-light text-white tracking-widest border-b border-white/20 pb-2 px-8">
                                        {packDetails.price || "S/ 0.00"}
                                    </p>
                                </div>

                                {/* Footer / Info */}
                                <div className="relative z-10 grid grid-cols-2 gap-8 border-t border-white/10 pt-4 mt-2">
                                    <div>
                                        <p className="text-[10px] uppercase text-barberia-gold tracking-widest font-bold mb-1">De:</p>
                                        <p className="text-lg font-agency tracking-wide text-white">{formData.from || "Tu Nombre"}</p>
                                        <p className="text-[10px] uppercase text-barberia-gold tracking-widest font-bold mb-1 mt-3">Para:</p>
                                        <p className="text-lg font-agency tracking-wide text-white">{formData.to || "Destinatario"}</p>
                                    </div>
                                    <div className="text-right flex flex-col justify-end">
                                        <p className="text-sm italic text-gray-300 font-light mb-auto line-clamp-3">
                                            "{formData.message || "Tu mensaje personalizado aquí..."}"
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2 uppercase tracking-wide">
                                            Válido para canje en JV Studio Abancay.
                                            <br />Incluye bebida de cortesía.
                                        </p>
                                    </div>
                                </div>

                                {/* Ornate corners (CSS) */}
                                <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-barberia-gold opacity-100"></div>
                                <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-barberia-gold opacity-100"></div>
                                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-barberia-gold opacity-100"></div>
                                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-barberia-gold opacity-100"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* HIDDEN PDF TEMPLATE - Positioned to be capturable but invisible */}
            <div style={{ position: "fixed", left: "-9999px", top: "0", zIndex: -50, opacity: 0, pointerEvents: "none" }}>
                <div
                    ref={cardRef}
                    className="w-[850px] h-[450px] relative flex flex-col p-8 overflow-hidden"
                    style={{
                        backgroundImage: "url(/gift-card-bg-final.jpg)", // Updated background
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        fontFamily: "var(--font-agency), sans-serif"
                    }}
                >
                    {/* Dark Overlay - Optional, adjusting opacity based on new bg */}
                    <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.1)" }}></div>

                    {/* Content Container */}
                    <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column" }}>

                        {/* Top Row: Logo | Title | Code */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                            {/* Left: Logo */}
                            <div style={{ width: "25%" }}>
                                <h2 style={{
                                    color: "#ffffff",
                                    fontSize: "32px",
                                    fontWeight: "bold",
                                    margin: 0,
                                    lineHeight: 1
                                }}>
                                    <span style={{ color: "#D4AF37" }}>JV</span> STUDIO
                                </h2>
                            </div>

                            {/* Center: Title */}
                            <div style={{ width: "50%", textAlign: "center" }}>
                                <h1 style={{
                                    color: "#D4AF37",
                                    fontSize: "42px",
                                    fontWeight: "bold",
                                    textTransform: "uppercase",
                                    margin: 0,
                                    lineHeight: 1
                                }}>
                                    GIFT CARD
                                </h1>
                            </div>

                            {/* Right: Code */}
                            <div style={{ width: "25%", display: "flex", justifyContent: "flex-end" }}>
                                <div style={{
                                    border: "1px solid #D4AF37",
                                    padding: "5px 10px",
                                    color: "#ffffff",
                                    fontSize: "16px",
                                    textTransform: "uppercase",
                                    whiteSpace: "nowrap"
                                }}>
                                    CÓDIGO: <span style={{ color: "#ffffff", fontWeight: "bold" }}>{generatedCode || "PENDIENTE"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Middle: Service & Description */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", marginBottom: "10px" }}>
                            <h3 style={{
                                color: "#D4AF37",
                                fontSize: "56px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                margin: "0 0 10px 0",
                                lineHeight: "0.9"
                            }}>
                                {packDetails.title || "MONTO DE CONSUMO"}
                            </h3>
                            <p style={{
                                color: "#cccccc",
                                fontSize: "18px",
                                maxWidth: "80%",
                                margin: 0,
                                lineHeight: "1.2"
                            }}>
                                Recibe un servicio de lujo, con un corte de cabello que combina elegancia y modernidad
                            </p>
                        </div>

                        {/* Dedication */}
                        <div style={{ textAlign: "center", marginBottom: "20px" }}>
                            <p style={{
                                color: "#D4AF37",
                                fontSize: "28px",
                                fontFamily: "'Brush Script MT', cursive",
                                fontStyle: "italic",
                                margin: 0
                            }}>
                                "{formData.message || "Para ti, con mucho cariño"}"
                            </p>
                        </div>

                        {/* Bottom Row: De/Para | Details */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto" }}>
                            {/* Left: De / Para */}
                            <div style={{ textAlign: "left" }}>
                                <div style={{ marginBottom: "5px" }}>
                                    <span style={{ color: "#ffffff", fontSize: "20px", textTransform: "uppercase" }}>
                                        De: <span style={{ color: "#cccccc" }}>{formData.from}</span>
                                    </span>
                                </div>
                                <div>
                                    <span style={{ color: "#ffffff", fontSize: "20px", textTransform: "uppercase" }}>
                                        Para: <span style={{ color: "#cccccc" }}>{formData.to}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Right: Vence / Legal */}
                            <div style={{ textAlign: "right" }}>
                                <div style={{ marginBottom: "5px" }}>
                                    <span style={{ color: "#cccccc", fontSize: "16px", textTransform: "uppercase" }}>VENCE: </span>
                                    <span style={{ color: "#ffffff", fontSize: "20px" }}>
                                        {expirationDate ? expirationDate.toLocaleDateString("es-PE") : "PENDIENTE"}
                                    </span>
                                </div>
                                <div>
                                    <span style={{ color: "#999999", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                        VÁLIDO PARA CANJE EN JV STUDIO
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
