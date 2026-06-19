"use client";

import { useCart } from "@/context/CartContext";
import { use, useState, useEffect } from "react";
import ProductCustomizer from "@/components/ProductCustomizer";

type Color = { id: number; name: string; hex: string };
type PriceTier = { id: number; minQty: number; maxQty: number | null; price: number };
type Size = { id: number; name: string };

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  backImage: string;
  backPrice: number;
  customizable: boolean;
  colors: Color[];
  priceTiers: PriceTier[];
  sizes: Size[];
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customizationFront, setCustomizationFront] = useState<string>("");
  const [customizationBack, setCustomizationBack] = useState<string>("");
  const [originalFront, setOriginalFront] = useState<string>("");
  const [originalBack, setOriginalBack] = useState<string>("");
  const [wantsBack, setWantsBack] = useState(false);
  const [customizationNotes, setCustomizationNotes] = useState<string>("");

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0].name);
      });
  }, [id]);

  if (!product) return (
    <main className="py-16 px-6 text-center text-gray-400">Caricamento...</main>
  );

  const getPrice = (qty: number) => {
    if (!product.priceTiers || product.priceTiers.length === 0) return product.price;
    const sorted = [...product.priceTiers].sort((a, b) => a.minQty - b.minQty);
    let price = product.price;
    for (const tier of sorted) {
      if (qty >= tier.minQty && (tier.maxQty === null || qty <= tier.maxQty)) {
        price = tier.price;
        break;
      }
    }
    return price;
  };

  const unitPrice = getPrice(quantity) + (wantsBack && customizationBack ? product.backPrice : 0);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      price: unitPrice,
      customizationFront,
      customizationBack,
      originalFront,
      originalBack,
      customizationNotes,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="bg-[#f9f9f9] min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="grid md:grid-cols-2">
          {/* Immagine */}
          <div className="h-80 md:h-full overflow-hidden">
            <img
              src={product.image || `https://picsum.photos/seed/${product.id}/600/500`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="p-8 md:p-10">
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--accent)" }}>
              {product.category}
            </p>
            <h1 className="text-3xl font-black mb-3">{product.name}</h1>
            <p className="text-gray-500 mb-6">{product.description}</p>

            {/* Colori */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2">
                  Colore: <span className="font-normal text-gray-500">{selectedColor?.name}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      className="w-8 h-8 rounded-full border-2 transition"
                      style={{
                        background: color.hex,
                        borderColor: selectedColor?.id === color.id ? "var(--accent)" : "#e0e0e0",
                        transform: selectedColor?.id === color.id ? "scale(1.2)" : "scale(1)",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Taglie */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2">
                  Taglia: <span className="font-normal text-gray-500">{selectedSize || "Seleziona"}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.name)}
                      className="px-4 py-2 border rounded-full text-sm font-medium transition"
                      style={
                        selectedSize === size.name
                          ? { background: "var(--accent)", borderColor: "var(--accent)" }
                          : {}
                      }
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantità */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Quantità</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 border rounded-full text-lg font-bold hover:bg-gray-100 transition"
                >
                  −
                </button>
                <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 border rounded-full text-lg font-bold hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Prezzi a scaglioni */}
            {product.priceTiers.length > 0 && (
              <div className="mb-6 bg-[#f9f9f9] rounded-xl p-4">
                <p className="text-sm font-semibold mb-2">Prezzi per quantità</p>
                <div className="space-y-1">
                  {[...product.priceTiers]
                    .sort((a, b) => a.minQty - b.minQty)
                    .map((tier) => (
                      <div
                        key={tier.id}
                        className="flex justify-between text-sm px-2 py-1 rounded-lg transition"
                        style={
                          quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty)
                            ? { background: "var(--accent)", color: "black", fontWeight: "bold" }
                            : { color: "#9ca3af" }
                        }
                      >
                        <span>{tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : "+"} pezzi</span>
                        <span>€{tier.price.toFixed(2)} cad.</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Personalizzazione */}
            {product.customizable && (
              <div className="mb-6">
                {!showCustomizer ? (
                  <button
                    onClick={() => setShowCustomizer(true)}
                    className="w-full py-3 border-2 rounded-full font-bold transition hover:bg-gray-50"
                    style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
                  >
                    🎨 Personalizza questo prodotto
                  </button>
                ) : (
                  <div className="mt-4 space-y-6">
                    {/* Fronte */}
                    <div className="border rounded-xl p-4 bg-gray-50">
                      <h3 className="font-bold mb-3">Grafica fronte</h3>
                      <ProductCustomizer
                        label="Carica la grafica per il fronte"
                        onConfirm={(file) => {
                          setCustomizationFront(file);
                          setOriginalFront(file);
                        }}
                      />
                      {customizationFront && (
                        <div className="mt-2 flex items-center gap-2">
                          <img src={customizationFront} alt="Fronte" className="h-16 object-contain rounded-lg border bg-white" />
                          <p className="text-sm text-green-600 font-semibold">✓ Fronte confermato</p>
                        </div>
                      )}
                    </div>

                    {/* Retro */}
                    {product.backImage && (
                      <div className="border rounded-xl p-4 bg-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                          <input
                            type="checkbox"
                            id="wantsBack"
                            checked={wantsBack}
                            onChange={(e) => setWantsBack(e.target.checked)}
                            className="w-5 h-5 cursor-pointer"
                            style={{ accentColor: "var(--accent)" }}
                          />
                          <label htmlFor="wantsBack" className="cursor-pointer font-bold">
                            Vuoi personalizzare anche il retro?
                            {product.backPrice > 0 && (
                              <span className="ml-2 text-sm font-semibold" style={{ color: "var(--accent)" }}>
                                +€{product.backPrice.toFixed(2)}
                              </span>
                            )}
                          </label>
                        </div>

                        {wantsBack && (
                          <>
                            <ProductCustomizer
                              label="Carica la grafica per il retro"
                              onConfirm={(file) => {
                                setCustomizationBack(file);
                                setOriginalBack(file);
                              }}
                            />
                            {customizationBack && (
                              <div className="mt-2 flex items-center gap-2">
                                <img src={customizationBack} alt="Retro" className="h-16 object-contain rounded-lg border bg-white" />
                                <p className="text-sm text-green-600 font-semibold">✓ Retro confermato</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Note */}
                    <div>
                      <label className="text-sm font-semibold block mb-2">
                        Istruzioni per la stampa (opzionale)
                      </label>
                      <textarea
                        placeholder="Es: Logo centrato sul petto, dimensione circa 20x20cm, colori invariati..."
                        value={customizationNotes}
                        onChange={(e) => setCustomizationNotes(e.target.value)}
                        className="border rounded-xl px-4 py-3 w-full text-sm"
                        rows={3}
                      />
                    </div>

                    <button
                      onClick={() => setShowCustomizer(false)}
                      className="text-sm underline text-gray-400"
                    >
                      Chiudi editor
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Prezzo totale */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-400">Prezzo unitario</p>
                <p className="text-2xl font-black">€{unitPrice.toFixed(2)}</p>
              </div>
              {quantity > 1 && (
                <div className="text-right">
                  <p className="text-sm text-gray-400">Totale</p>
                  <p className="text-2xl font-black">€{totalPrice.toFixed(2)}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full font-bold transition"
              style={{
                background: added ? "#22c55e" : "var(--accent)",
                color: added ? "white" : "black",
              }}
            >
              {added ? "✓ Aggiunto al carrello!" : "Aggiungi al carrello"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}