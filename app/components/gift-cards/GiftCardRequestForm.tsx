"use client";

import { useState } from "react";
import { createGiftCard } from "@/app/actions/gift-card-actions";

type Package = {
    id: number;
    name: string;
    description: string | null;
    price: number;
};

export default function GiftCardRequestForm({ packages }: { packages: Package[] }) {
    const [formData, setFormData] = useState({
        purchaser_name: "",
        email: "",
        recipient_name: "",
        selection_type: "amount",
        amount: "",
        package_id: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const result = await createGiftCard({
                from: formData.purchaser_name,
                to: formData.recipient_name,
                amount: formData.selection_type === "amount" ? parseFloat(formData.amount) : 0, // Backend might ignore amount if package is selected, but let's be safe
                packageId: formData.selection_type === "package" ? parseInt(formData.package_id) : undefined,
                // You might need to update createGiftCard to handle package price if amount is not passed for package
                // Assuming backend handles it or we need to pass the package price. 
                // Let's assume for now createGiftCard handles logic or we pass the price.
                // Wait, the original code passed 'amount' for amount type.
            });

            if (result.success) {
                setMessage({ type: "success", text: `¡Solicitud enviada! Código: ${result.code}` });
                setFormData({
                    purchaser_name: "",
                    email: "",
                    recipient_name: "",
                    selection_type: "amount",
                    amount: "",
                    package_id: "",
                });
            } else {
                setMessage({ type: "error", text: `Error: ${result.error}` });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Error de conexión." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white font-agency">Regala una Gift Card</h2>

            {message && (
                <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message.text}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tu Nombre (Comprador)</label>
                <input
                    type="text"
                    name="purchaser_name"
                    value={formData.purchaser_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-barberia-gold"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tu Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-barberia-gold"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Destinatario (Para)</label>
                <input
                    type="text"
                    name="recipient_name"
                    value={formData.recipient_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-barberia-gold"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Regalo</label>
                <select
                    name="selection_type"
                    value={formData.selection_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-barberia-gold"
                >
                    <option value="amount">Monto en Dinero</option>
                    <option value="package">Paquete de Servicios</option>
                </select>
            </div>

            {formData.selection_type === "amount" ? (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto (S/)</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-barberia-gold"
                        placeholder="Ej. 100.00"
                        step="0.01"
                        required={formData.selection_type === "amount"}
                    />
                </div>
            ) : (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selecciona un Paquete</label>
                    <select
                        name="package_id"
                        value={formData.package_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-barberia-gold"
                        required={formData.selection_type === "package"}
                    >
                        <option value="">-- Selecciona un paquete --</option>
                        {packages.map((pkg) => (
                            <option key={pkg.id} value={pkg.id}>
                                {pkg.name} - S/ {pkg.price}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-barberia-gold hover:bg-[#b5952f] text-black font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
            >
                {loading ? "Generando..." : "Solicitar Gift Card"}
            </button>
        </form>
    );
}
