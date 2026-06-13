export default function Home() {
  return (
    <main>
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b">
        <h1 className="text-2xl font-bold">Akira Print</h1>
        <nav className="flex gap-6">
          <a href="#" className="hover:underline">Shop</a>
          <a href="#" className="hover:underline">Personalizza</a>
          <a href="#" className="hover:underline">Chi siamo</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl font-bold mb-4">Maglie, cappellini e gadget unici</h2>
        <p className="text-lg text-gray-600 mb-6">
          Grafiche originali, trend e personalizzazione su misura
        </p>
        <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
          Scopri il catalogo
        </button>
      </section>

      {/* Prodotti in evidenza */}
<section className="py-16 px-6">
  <h2 className="text-2xl font-bold text-center mb-10">I più amati</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
    
    <div className="border rounded-lg p-4 text-center">
      <div className="bg-gray-200 h-48 mb-4 rounded"></div>
      <h3 className="font-semibold">Maglia "Trend Wave"</h3>
      <p className="text-gray-600">€19,99</p>
    </div>

    <div className="border rounded-lg p-4 text-center">
      <div className="bg-gray-200 h-48 mb-4 rounded"></div>
      <h3 className="font-semibold">Cappellino "Akira"</h3>
      <p className="text-gray-600">€14,99</p>
    </div>

    <div className="border rounded-lg p-4 text-center">
      <div className="bg-gray-200 h-48 mb-4 rounded"></div>
      <h3 className="font-semibold">Gadget personalizzabile</h3>
      <p className="text-gray-600">€9,99</p>
    </div>

  </div>
</section>
{/* Footer */}
<footer className="border-t py-8 px-6 text-center text-gray-600">
  <p className="mb-2">Akira Print © 2026 — Tutti i diritti riservati</p>
  <div className="flex justify-center gap-4">
    <a href="#" className="hover:underline">Instagram</a>
    <a href="#" className="hover:underline">TikTok</a>
    <a href="#" className="hover:underline">Contatti</a>
  </div>
</footer>
    </main>
  );
}