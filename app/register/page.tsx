"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-md">
        <h1 className="text-3xl font-black mb-2">Registrati</h1>
        <p className="text-gray-500 mb-8">Crea il tuo account <span style={{ color: "var(--accent)" }}>AkiraPrint</span></p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome e cognome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg px-4 py-3 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded-lg px-4 py-3 w-full"
          />
          <input
            type="password"
            placeholder="Password (minimo 6 caratteri)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border rounded-lg px-4 py-3 w-full"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full py-3 rounded-full font-bold text-white transition disabled:opacity-50"
          style={{ background: "var(--accent)" }}
        >
          {loading ? "Registrazione in corso..." : "Registrati"}
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
          Hai già un account?{" "}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: "var(--accent)" }}>
            Accedi
          </Link>
        </p>
      </div>
    </main>
  );
}