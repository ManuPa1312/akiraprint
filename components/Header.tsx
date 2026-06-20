"use client";

import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const { items } = useCart();
  const { data: session } = useSession();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 md:px-8 py-4">
        <Link href="/" className="text-2xl font-black tracking-tight" onClick={() => setMenuOpen(false)}>
          AKIRA<span style={{ color: "var(--accent)" }}>PRINT</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
          <Link href="/shop" className="hover:text-[#FFD000] transition">Shop</Link>
          <Link href="/preventivo" className="hover:text-[#FFD000] transition">Preventivo</Link>
          <Link href="/chi-siamo" className="hover:text-[#FFD000] transition">Chi siamo</Link>

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

        {/* Icone mobile: carrello + hamburger */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart" className="relative" onClick={() => setMenuOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" style={{ background: "var(--accent)" }}>
                {itemCount}
              </span>
            )}
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile a tendina */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col px-6 pb-6 gap-4 text-sm font-medium border-t pt-4">
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="hover:text-[#FFD000] transition">Shop</Link>
          <Link href="/preventivo" onClick={() => setMenuOpen(false)} className="hover:text-[#FFD000] transition">Preventivo</Link>
          <Link href="/chi-siamo" onClick={() => setMenuOpen(false)} className="hover:text-[#FFD000] transition">Chi siamo</Link>

          {session ? (
            <div className="flex flex-col gap-3 pt-2 border-t">
              <span className="text-gray-600">Ciao, {session.user?.name?.split(" ")[0]}</span>
              <button
                onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                className="border px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition text-center"
              >
                Esci
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 rounded-full text-sm font-bold text-white transition text-center"
              style={{ background: "var(--accent)" }}
            >
              Accedi
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}