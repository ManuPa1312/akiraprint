"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  productId: number;
  customizationFront: string;
  customizationBack: string;
  originalFront: string;
  originalBack: string;
  customizationNotes: string;
};

type Order = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${window.location.origin}/api/orders`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="py-16 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-10">Ordini</h1>
      {loading ? (
        <p className="text-gray-500">Caricamento...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">Nessun ordine ancora.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-xl px-6 py-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">Ordine #{order.id}</h3>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${order.status === "pagato" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-1">
                {new Date(order.createdAt).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="font-bold mb-4">Totale: €{order.total.toFixed(2)}</p>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm font-semibold mb-2">
                      Prodotto #{item.productId} — {item.quantity} pz — €{item.price.toFixed(2)} cad.
                    </p>

                    {/* Note personalizzazione */}
                    {item.customizationNotes && (
                      <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs font-semibold text-yellow-700 mb-1">📝 Istruzioni cliente:</p>
                        <p className="text-sm text-gray-700">{item.customizationNotes}</p>
                      </div>
                    )}

                    {/* Mockup */}
                    {(item.customizationFront || item.customizationBack) && (
                      <div className="flex gap-4 flex-wrap mt-2">
                        {item.customizationFront && (
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Mockup fronte</p>
                            <img src={item.customizationFront} alt="Fronte" className="h-24 rounded-lg border" />
                            <a href={item.customizationFront} download className="text-xs underline mt-1 block" style={{ color: "var(--accent)" }}>
                              Scarica
                            </a>
                          </div>
                        )}
                        {item.customizationBack && (
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Mockup retro</p>
                            <img src={item.customizationBack} alt="Retro" className="h-24 rounded-lg border" />
                            <a href={item.customizationBack} download className="text-xs underline mt-1 block" style={{ color: "var(--accent)" }}>
                              Scarica
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* File originali */}
                    {(item.originalFront || item.originalBack) && (
                      <div className="flex gap-4 flex-wrap mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-400 w-full font-semibold">File originali per la stampa:</p>
                        {item.originalFront && (
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">File fronte</p>
                            <img src={item.originalFront} alt="File fronte" className="h-24 rounded-lg border" />
                            <a href={item.originalFront} download className="text-xs underline mt-1 block" style={{ color: "var(--accent)" }}>
                              Scarica originale
                            </a>
                          </div>
                        )}
                        {item.originalBack && (
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">File retro</p>
                            <img src={item.originalBack} alt="File retro" className="h-24 rounded-lg border" />
                            <a href={item.originalBack} download className="text-xs underline mt-1 block" style={{ color: "var(--accent)" }}>
                              Scarica originale
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}