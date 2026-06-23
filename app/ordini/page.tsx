"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  customizationNotes: string;
};

type Order = {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  trackingNumber: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  items: OrderItem[];
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pagato: { label: "Pagato", color: "bg-blue-100 text-blue-700" },
  in_lavorazione: { label: "In lavorazione", color: "bg-yellow-100 text-yellow-700" },
  spedito: { label: "Spedito", color: "bg-purple-100 text-purple-700" },
  consegnato: { label: "Consegnato", color: "bg-green-100 text-green-700" },
};

export default function OrdiniPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/orders?mine=true")
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-black mb-3">Accedi per vedere i tuoi ordini</h1>
          <p className="text-gray-500 mb-6">Devi essere loggato per visualizzare la cronologia degli ordini.</p>
          <Link href="/login" className="btn-primary">Accedi</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f9f9f9] min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2">I miei ordini</h1>
        <p className="text-gray-500 mb-10">Ciao {session?.user?.name?.split(" ")[0]}! Ecco la cronologia dei tuoi ordini.</p>

        {loading ? (
          <p className="text-gray-400">Caricamento...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2">Nessun ordine ancora</h2>
            <p className="text-gray-500 mb-6">Non hai ancora effettuato ordini. Scopri il nostro catalogo!</p>
            <Link href="/shop" className="btn-primary">Vai allo shop</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = STATUS_LABELS[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="font-bold text-lg">Ordine #{order.id}</h2>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("it-IT", {
                          day: "2-digit", month: "long", year: "numeric"
                        })}
                      </p>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Tracking */}
                  {order.trackingNumber && (
                    <div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                      <p className="text-sm font-semibold text-purple-700">📬 Tracking spedizione</p>
                      <p className="text-sm font-mono mt-1">{order.trackingNumber}</p>
                    </div>
                  )}

                  {/* Indirizzo */}
                  {order.shippingAddress && (
                    <p className="text-sm text-gray-500 mb-4">
                      📍 {order.shippingAddress}, {order.shippingZip} {order.shippingCity}
                    </p>
                  )}

                  {/* Prodotti */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm border rounded-lg px-4 py-3 bg-gray-50">
                        <span>Prodotto #{item.productId} × {item.quantity}</span>
                        <span className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm text-gray-500">Totale ordine</span>
                    <span className="font-black text-lg">€{order.total.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}