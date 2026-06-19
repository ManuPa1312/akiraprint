"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, total } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    const processedItems = await Promise.all(
      items.map(async (item) => {
        let customizationFront = (item as any).customizationFront || "";
        let customizationBack = (item as any).customizationBack || "";
        let originalFront = (item as any).originalFront || "";
        let originalBack = (item as any).originalBack || "";

        console.log("originalFront nel checkout:", originalFront.length);

        if (customizationFront && customizationFront.startsWith("data:")) {
          const res = await fetch("/api/save-customization", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageData: customizationFront }),
          });
          const data = await res.json();
          customizationFront = data.url;
        }

        if (customizationBack && customizationBack.startsWith("data:")) {
          const res = await fetch("/api/save-customization", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageData: customizationBack }),
          });
          const data = await res.json();
          customizationBack = data.url;
        }

        if (originalFront && originalFront.startsWith("data:")) {
          const res = await fetch("/api/save-customization", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageData: originalFront }),
          });
          const data = await res.json();
          originalFront = data.url;
        }

        if (originalBack && originalBack.startsWith("data:")) {
          const res = await fetch("/api/save-customization", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageData: originalBack }),
          });
          const data = await res.json();
          originalBack = data.url;
        }

        return { ...item, customizationFront, customizationBack, originalFront, originalBack };
      })
    );

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: processedItems }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <main className="py-16 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Il tuo carrello è vuoto</h1>
        <Link href="/shop" className="underline">
          Vai al catalogo
        </Link>
      </main>
    );
  }

  return (
    <main className="py-16 px-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Carrello</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b pb-4"
          >
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">
                {item.quantity} x €{item.price.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 hover:underline"
            >
              Rimuovi
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center text-xl font-bold">
        <span>Totale</span>
        <span>€{total.toFixed(2)}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-6 w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition disabled:opacity-50"
      >
        {loading ? "Reindirizzamento..." : "Procedi al checkout"}
      </button>
    </main>
  );
}