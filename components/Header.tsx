"use client";

import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { items } = useCart();
  const { data: session } = useSession();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white border-b sticky top-0 z-50">
      <Link href="/" className="text-2xl font-black tracking-tight">
        AKIRA<span style={{ color: "var(--accent)" }}>PRINT</span>
      </Link>
      <nav className="flex gap-8 items-center text-sm font-medium">
        <Link href="/shop" className="hover:text-[#FFD000] transition">Shop</Link>
       <Link href="/preventivo" className="hover:text-[#FFD000] transition">Preventivo</Link>
        <Link href="#" className="hover:text-[#FFD000] transition">Chi siamo</Link>

        {/* Carrello */}
        <Link href="/cart" className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" style={{ background: "var(--accent)" }}>
              {itemCount}
            </span>
          )}
        </Link>

        {/* Utente */}
        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-600">Ciao, {session.user?.name?.split(" ")[0]}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="border px-4 py-1.5 rounded-full text-sm hover:bg-gray-100 transition"
            >
              Esci
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-full text-sm font-bold text-white transition"
            style={{ background: "var(--accent)" }}
          >
            Accedi
          </Link>
        )}
      </nav>
    </header>
  );
}