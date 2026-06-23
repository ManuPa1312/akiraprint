"use client";

import { useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

export default function ShopClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* Barra di ricerca */}
      <div className="max-w-xl mx-auto px-6 pb-6">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cerca prodotti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-full pl-12 pr-5 py-3 text-sm bg-white focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        {search && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            {filtered.length} risultat{filtered.length === 1 ? "o" : "i"} per &quot;{search}&quot;
          </p>
        )}
      </div>

      {/* Prodotti */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6 pb-20">
        {filtered.length === 0 ? (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-semibold text-lg">Nessun prodotto trovato</p>
            <p className="text-sm mt-1">Prova con un termine diverso</p>
          </div>
        ) : (
          filtered.map((product) => (
            <Link key={product.id} href={`/shop/${product.id}`} className="card bg-white">
              <div className="h-56 overflow-hidden">
                <img
                  src={product.image || `https://picsum.photos/seed/${product.id}/400/300`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--accent)" }}>
                  {product.category}
                </p>
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-500">€{product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}