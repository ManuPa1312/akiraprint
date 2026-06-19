import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      {/* Hero */}
      <section className="relative text-center py-32 px-6 bg-[#f9f9f9] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: "var(--accent)" }}></div>
        <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent)" }}>
          Maglie · Cappellini · Gadget
        </p>
        <h1 className="text-6xl font-black tracking-tight mb-6 leading-tight">
          Il tuo stile,<br />
          <span style={{ color: "var(--accent)" }}>personalizzato</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
          Grafiche originali e prodotti su misura per privati e aziende. Dal singolo pezzo alle grandi quantità.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/shop" className="btn-primary">
            Scopri il catalogo
          </Link>
          <Link href="#" className="btn-secondary">
            Richiedi personalizzazione
          </Link>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-3xl font-black text-center mb-14">Come funziona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto text-center">
          {[
            { step: "01", title: "Scegli il prodotto", desc: "Esplora il catalogo e trova maglie, cappellini e gadget." },
            { step: "02", title: "Personalizza", desc: "Inviaci la tua grafica o scegli tra i nostri design originali." },
            { step: "03", title: "Ricevi a casa", desc: "Stampiamo e spediamo direttamente da te, velocemente." },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center">
              <span className="text-5xl font-black mb-4" style={{ color: "var(--accent)" }}>{item.step}</span>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prodotti in evidenza */}
      <section className="py-20 px-6 bg-[#f9f9f9]">
        <h2 className="text-3xl font-black text-center mb-14">I più amati</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {products.map((product) => (
            <Link key={product.id} href={`/shop/${product.id}`} className="card bg-white">
             <div className="h-56 overflow-hidden">
  <img
    src={product.image || `https://picsum.photos/seed/${product.id}/400/300`}
    alt={product.name}
    className="w-full h-full object-cover"
  />
</div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--accent)" }}>{product.category}</p>
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-500">€{product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/shop" className="btn-primary">Vedi tutto il catalogo</Link>
        </div>
      </section>

      {/* Banner personalizzazione */}
      <section className="py-20 px-6 text-white text-center" style={{ background: "var(--accent)" }}>
        <h2 className="text-4xl font-black mb-4">Vuoi un prodotto personalizzato?</h2>
        <p className="text-lg mb-8 opacity-90">Per aziende, eventi, team sportivi o regali unici. Preventivo gratuito.</p>
        <Link href="#" className="bg-white font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition" style={{ color: "var(--accent)" }}>
          Richiedi un preventivo
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-6 text-center text-gray-400 text-sm bg-white">
        <p className="text-xl font-black mb-3 text-black">
          AKIRA<span style={{ color: "var(--accent)" }}>PRINT</span>
        </p>
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:text-[#F4721E] transition">Instagram</a>
          <a href="#" className="hover:text-[#F4721E] transition">TikTok</a>
          <a href="#" className="hover:text-[#F4721E] transition">Contatti</a>
        </div>
        <p>Akira Print © 2026 — Tutti i diritti riservati</p>
      </footer>
    </main>
  );
}