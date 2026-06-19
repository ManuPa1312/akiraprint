"use client";

import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === "akira2026") {
      setAuthed(true);
    } else {
      setError("Password errata");
    }
  };

  if (!authed) {
    return (
      <main className="py-24 px-6 max-w-sm mx-auto text-center">
        <h1 className="text-2xl font-bold mb-6">Admin</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full mb-3"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          onClick={handleLogin}
          className="bg-black text-white w-full py-2 rounded-lg hover:bg-gray-800"
        >
          Accedi
        </button>
      </main>
    );
  }

  return (
    <main className="py-16 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-10">Pannello Admin</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <a href="/admin/products" className="border rounded-xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Prodotti</h2>
          <p className="text-gray-500">Aggiungi, modifica o elimina prodotti</p>
        </a>
        <a href="/admin/orders" className="border rounded-xl p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Ordini</h2>
          <p className="text-gray-500">Visualizza e gestisci gli ordini ricevuti</p>
        </a>
      </div>
    </main>
  );
}