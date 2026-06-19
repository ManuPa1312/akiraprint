import Link from "next/link";
import prisma from "@/lib/prisma";

const categories = ["tutti", "maglie", "cappellini", "gadget", "personalizzati"];

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selected = category || "tutti";

  const products = await prisma.product.findMany({
    where: selected === "tutti" ? {} : { category: selected },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="bg-[#f9f9f9] min-h-screen">
      {/* Header pagina */}
      <section className="bg-white border-b py-12 px-6 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--accent)" }}>
          Catalogo
        </p>
        <h1 className="text-4xl font-black">Tutti i prodotti</h1>
      </section>

      {/* Filtri */}
      <div className="flex justify-center gap-3 py-8 px-6 flex-wrap">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={cat === "tutti" ? "/shop" : `/shop?category=${cat}`}
            className={`px-5 py-2 rounded-full border font-medium capitalize transition text-sm ${
              selected === cat
                ? "text-white border-transparent"
                : "bg-white hover:border-[#F4721E] hover:text-[#F4721E]"
            }`}
            style={selected === cat ? { background: "var(--accent)", borderColor: "var(--accent)" } : {}}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Prodotti */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6 pb-20">
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
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--accent)" }}>
                {product.category}
              </p>
              <h3 className="font-bold text-lg mb-1">{product.name}</h3>
              <p className="text-gray-500">€{product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}