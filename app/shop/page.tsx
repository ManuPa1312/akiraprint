import Link from "next/link";
import prisma from "@/lib/prisma";
import ShopClient from "@/components/ShopClient";
const categories = ["tutti", "maglie", "cappellini", "gadget", "adesivi", "roll-up", "banner", "pet-lover"];

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
      <section className="bg-white border-b py-12 px-6 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--accent)" }}>
          Catalogo
        </p>
        <h1 className="text-4xl font-black">Tutti i prodotti</h1>
      </section>

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

      <ShopClient products={products} />
    </main>
  );
}