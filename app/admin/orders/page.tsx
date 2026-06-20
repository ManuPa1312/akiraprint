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
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingCountry: string;
  shippingCost: number;
  trackingNumber: string;
  items: OrderItem[];
};

const STATUS_OPTIONS = [
  { value: "pagato", label: "Pagato", color: "bg-blue-100 text-blue-700" },
  { value: "in_lavorazione", label: "In lavorazione", color: "bg-yellow-100 text-yellow-700" },
  { value: "spedito", label: "Spedito", color: "bg-purple-100 text-purple-700" },
  { value: "consegnato", label: "Consegnato", color: "bg-green-100 text-green-700" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingInputs, setTrackingInputs] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchOrders = () => {
    fetch(`${window.location.origin}/api/orders`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status: string) => {
    return STATUS_OPTIONS.find((s) => s.value === status)?.color || "bg-gray-100 text-gray-700";
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setSavingId(orderId);
    await fetch(`${window.location.origin}/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
    setSavingId(null);
  };

  const handleTrackingSave = async (orderId: number) => {
    const tracking = trackingInputs[orderId];
    if (!tracking) return;
    setSavingId(orderId);
    await fetch(`${window.location.origin}/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingNumber: tracking, status: "spedito" }),
    });
    fetchOrders();
    setSavingId(null);
  };

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
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={savingId === order.id}
                  className={`text-sm px-3 py-1 rounded-full font-medium border-0 cursor-pointer ${getStatusStyle(order.status)}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <p className="text-gray-500 text-sm mb-1">
                {new Date(order.createdAt).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="font-bold mb-4">Totale: €{order.total.toFixed(2)} {order.shippingCost > 0 && <span className="font-normal text-gray-400 text-sm">(spedizione €{order.shippingCost.toFixed(2)})</span>}</p>

              {/* Dati cliente e spedizione */}
              {(order.customerName || order.shippingAddress) && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs font-semibold text-blue-700 mb-2">📦 Spedizione</p>
                  <p className="text-sm font-semibold">{order.customerName}</p>
                  {order.customerEmail && <p className="text-sm text-gray-600">{order.customerEmail}</p>}
                  {order.customerPhone && <p className="text-sm text-gray-600">{order.customerPhone}</p>}
                  {order.shippingAddress && (
                    <p className="text-sm text-gray-600 mt-1">
                      {order.shippingAddress}, {order.shippingZip} {order.shippingCity} ({order.shippingCountry})
                    </p>
                  )}

                  {/* Tracking */}
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    {order.trackingNumber ? (
                      <p className="text-sm">
                        <span className="font-semibold">Tracking:</span> {order.trackingNumber}
                      </p>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          placeholder="Numero tracking"
                          value={trackingInputs[order.id] || ""}
                          onChange={(e) => setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })}
                          className="border rounded-lg px-3 py-1.5 text-sm flex-1"
                        />
                        <button
                          onClick={() => handleTrackingSave(order.id)}
                          disabled={savingId === order.id}
                          className="text-sm px-4 py-1.5 rounded-lg text-white disabled:opacity-50"
                          style={{ background: "var(--accent)" }}
                        >
                          Salva e segna spedito
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm font-semibold mb-2">
                      Prodotto #{item.productId} — {item.quantity} pz — €{item.price.toFixed(2)} cad.
                    </p>

                    {item.customizationNotes && (
                      <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs font-semibold text-yellow-700 mb-1">📝 Istruzioni cliente:</p>
                        <p className="text-sm text-gray-700">{item.customizationNotes}</p>
                      </div>
                    )}

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