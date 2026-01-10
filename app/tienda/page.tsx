import { prisma } from "../lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp, FaShoppingCart } from "react-icons/fa";

export const dynamic = "force-dynamic";

async function getData() {
    try {
        const [products, categories] = await Promise.all([
            prisma.productos.findMany({
                where: { activo: true },
                include: { categorias_productos: true, marcas: true }
            }),
            prisma.categorias_productos.findMany({
                where: { activo: true }
            })
        ]);
        return { products, categories };
    } catch (error) {
        console.error("Error fetching store data:", error);
        return { products: [], categories: [] };
    }
}

// Client Component Wrapper for Filtration? 
// Actually, simple server render with search params is better for SEO, but for "Filter by category" buttons, 
// let's do a simple client component for the grid OR just use searchParams.
// Let's us searchParams to keep it simple and server-side first.
// Wait, I need to make the page accept searchParams.

export default async function TiendaPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
    const { category: categoryFilter } = await searchParams as any; // Type casting for simplicity here
    const { products, categories } = await getData();

    // Filter Logic
    const categoryId = categoryFilter ? parseInt(categoryFilter) : null;
    const filteredProducts = categoryId
        ? products.filter(p => p.categoria_id === categoryId)
        : products;

    const getWhatsAppLink = (productName: string) => {
        const message = `Hola JV Studio, estoy interesado en comprar el producto: *${productName}*. ¿Tienen stock?`;
        return `https://wa.me/51965432443?text=${encodeURIComponent(message)}`;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <div className="bg-[#111] border-b border-white/5 py-16 text-center">
                <h1 className="text-4xl md:text-6xl font-agency font-bold text-barberia-gold mb-4 tracking-wide">
                    TIENDA EXCLUSIVA
                </h1>
                <p className="text-gray-400 font-light max-w-xl mx-auto px-4">
                    Productos premium para el cuidado personal. Lleva la experiencia JV a tu hogar.
                </p>
            </div>

            <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">

                {/* Sidebar / Filters */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="sticky top-24 space-y-8">
                        <div>
                            <h3 className="text-xl font-agency font-bold text-white mb-4 border-b border-white/10 pb-2">CATEGORÍAS</h3>
                            <div className="space-y-2">
                                <Link
                                    href="/tienda"
                                    className={`block px-4 py-2 rounded transition-colors ${!categoryId ? 'bg-barberia-gold text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    Todos los Productos
                                </Link>
                                {categories.map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={`/tienda?category=${cat.id}`}
                                        className={`block px-4 py-2 rounded transition-colors ${categoryId === cat.id ? 'bg-barberia-gold text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {cat.nombre}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1">
                    {filteredProducts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="bg-[#111] border border-white/5 rounded-lg overflow-hidden group hover:border-barberia-gold/30 transition-all flex flex-col">
                                    <div className="h-64 relative bg-white/5 flex items-center justify-center p-4">
                                        {product.imagen_url ? (
                                            <Image
                                                src={product.imagen_url}
                                                alt={product.nombre}
                                                fill
                                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="text-gray-600 flex flex-col items-center">
                                                <FaShoppingCart size={40} className="mb-2 opacity-50" />
                                                <span className="text-xs uppercase">Sin Imagen</span>
                                            </div>
                                        )}

                                        {/* Tag Brand */}
                                        {product.marcas && (
                                            <span className="absolute top-2 right-2 bg-black/50 backdrop-blur text-xs px-2 py-1 rounded text-white border border-white/10">
                                                {product.marcas.nombre}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg text-white mb-2 leading-tight group-hover:text-barberia-gold transition-colors">
                                            {product.nombre}
                                        </h3>
                                        {product.descripcion && (
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                                                {product.descripcion}
                                            </p>
                                        )}

                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                                            <span className="text-xl font-agency font-bold text-white">
                                                S/ {Number(product.precio_venta).toFixed(2)}
                                            </span>
                                            <a
                                                href={getWhatsAppLink(product.nombre)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-full shadow-lg hover:shadow-green-900/20 transition-all"
                                                title="Consultar por WhatsApp"
                                            >
                                                <FaWhatsapp size={20} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-[#111] rounded-lg border border-white/10">
                            <p className="text-gray-400">No se encontraron productos en esta categoría.</p>
                            <Link href="/tienda" className="text-barberia-gold mt-4 inline-block hover:underline">Ver todos</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
