"use client";

import { useCart } from "@/context/CartContext";
import { use, useState, useEffect } from "react";
import ProductCustomizer from "@/components/ProductCustomizer";

type Color = { id: number; name: string; hex: string };
type PriceTier = { id: number; minQty: number; maxQty: number | null; price: number };
type Size = { id: number; name: string };
type StickerDiscount = { id: number; minQty: number; discount: number };

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
  hasShapeOption: boolean;
  isSticker: boolean;
  pricePerCm2: number;
  laminationPrice: number;
  minOrderPrice: number;
  minSizeCm: number;
  maxSizeCm: number;
  hasTechniqueOption: boolean;
  embroideryPrice: number;
  colors: Color[];
  priceTiers: PriceTier[];
  sizes: Size[];
  stickerDiscounts: StickerDiscount[];
};

const SHAPES = [
  { value: "quadrato", label: "Quadrato", icon: "⬛" },
  { value: "rotondo", label: "Rotondo", icon: "⚫" },
  { value: "sagomato", label: "Sagomato (a contorno)", icon: "✂️" },
];

const STICKER_QUANTITIES = [1, 10, 25, 50, 100, 200, 300, 500];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedShape, setSelectedShape] = useState<string>("quadrato");
  const [selectedTechnique, setSelectedTechnique] = useState<string>("stampa");
  const [quantity, setQuantity] = useState(1);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customizationFront, setCustomizationFront] = useState<string>("");
  const [customizationBack, setCustomizationBack] = useState<string>("");
  const [originalFront, setOriginalFront] = useState<string>("");
  const [originalBack, setOriginalBack] = useState<string>("");
  const [wantsBack, setWantsBack] = useState(false);
  const [customizationNotes, setCustomizationNotes] = useState<string>("");

  // Stato calcolatore adesivi
  const [widthCm, setWidthCm] = useState<number>(10);
  const [heightCm, setHeightCm] = useState<number>(10);
  const [wantsLamination, setWantsLamination] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0].name);
        if (data.isSticker) {
          setWidthCm(data.minSizeCm || 10);
          setHeightCm(data.minSizeCm || 10);
          setQuantity(STICKER_QUANTITIES[0]);
        }
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

  // Trova lo sconto applicabile alla quantità corrente
  const getApplicableDiscount = () => {
    if (!product.stickerDiscounts || product.stickerDiscounts.length === 0) return null;
    const sorted = [...product.stickerDiscounts].sort((a, b) => b.minQty - a.minQty);
    return sorted.find((d) => quantity >= d.minQty) || null;
  };

  // Calcolo prezzo adesivo (cm²)
  const getStickerUnitPrice = () => {
    const area = widthCm * heightCm;
    const basePrice = area * product.pricePerCm2;
    const laminationCost = wantsLamination ? area * product.laminationPrice : 0;
    let raw = basePrice + laminationCost;

    const applicable = getApplicableDiscount();
    if (applicable) {
      raw = raw * (1 - applicable.discount / 100);
    }

    return raw;
  };

 const unitPrice = product.isSticker
  ? getStickerUnitPrice()
  : getPrice(quantity) + (wantsBack && customizationBack ? product.backPrice : 0) 
  + (selectedTechnique === "ricamo" ? product.embroideryPrice : 0);

  const rawTotal = unitPrice * quantity;
  const totalPrice = product.isSticker
    ? Math.max(rawTotal, product.minOrderPrice)
    : rawTotal;

  const applicableDiscount = product.isSticker ? getApplicableDiscount() : null;

const handleAddToCart = () => {
  const shapeNote = product.hasShapeOption
    ? `Forma: ${SHAPES.find((s) => s.value === selectedShape)?.label}. `
    : "";
  const sizeNote = product.isSticker
    ? `Dimensioni: ${widthCm}x${heightCm}cm. ${wantsLamination ? "Con plastificazione. " : ""}`
    : "";
  const techniqueNote = product.hasTechniqueOption
    ? `Tecnica: ${selectedTechnique === "ricamo" ? "Ricamo" : "Stampa"}. `
    : "";
  addToCart({
    ...product,
    price: unitPrice,
    customizationFront,
    customizationBack,
    originalFront,
    originalBack,
    customizationNotes: shapeNote + sizeNote + techniqueNote + customizationNotes,
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

            {/* Forma (per adesivi) */}
            {product.hasShapeOption && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2">Forma</p>
                <div className="flex gap-2 flex-wrap">
                  {SHAPES.map((shape) => (
                    <button
                      key={shape.value}
                      onClick={() => setSelectedShape(shape.value)}
                      className="px-4 py-2 border rounded-full text-sm font-medium transition flex items-center gap-2"
                      style={
                        selectedShape === shape.value
                          ? { background: "var(--accent)", borderColor: "var(--accent)" }
                          : {}
                      }
                    >
                      <span>{shape.icon}</span>
                      {shape.label}
                    </button>
                  ))}
                </div>
                {selectedShape === "sagomato" && (
                  <p className="text-xs text-gray-400 mt-2">
                    Il taglio seguirà esattamente il contorno della tua grafica.
                  </p>
                )}
              </div>
            )}

            {/* Tecnica: stampa o ricamo */}
{product.hasTechniqueOption && (
  <div className="mb-6">
    <p className="text-sm font-semibold mb-2">Tecnica di personalizzazione</p>
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setSelectedTechnique("stampa")}
        className="px-4 py-2 border rounded-full text-sm font-medium transition flex items-center gap-2"
        style={
          selectedTechnique === "stampa"
            ? { background: "var(--accent)", borderColor: "var(--accent)" }
            : {}
        }
      >
        🖨️ Stampa
      </button>
      <button
        onClick={() => setSelectedTechnique("ricamo")}
        className="px-4 py-2 border rounded-full text-sm font-medium transition flex items-center gap-2"
        style={
          selectedTechnique === "ricamo"
            ? { background: "var(--accent)", borderColor: "var(--accent)" }
            : {}
        }
      >
        🧵 Ricamo
        {product.embroideryPrice > 0 && (
          <span className="text-xs font-semibold">+€{product.embroideryPrice.toFixed(2)}</span>
        )}
      </button>
    </div>
    {selectedTechnique === "ricamo" && (
      <p className="text-xs text-gray-400 mt-2">
        Il ricamo offre un effetto più resistente e premium rispetto alla stampa.
      </p>
    )}
  </div>
)}


            {/* Calcolatore dimensioni adesivo (cm²) */}
            {product.isSticker && (
              <div className="mb-6 p-4 border rounded-xl bg-yellow-50">
                <p className="text-sm font-semibold mb-3">📐 Dimensioni personalizzate</p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      Larghezza (cm) — min {product.minSizeCm}, max {product.maxSizeCm}
                    </label>
                    <input
                      type="number"
                      min={product.minSizeCm}
                      max={product.maxSizeCm}
                      value={widthCm}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || product.minSizeCm;
                        const clamped = Math.min(Math.max(val, product.minSizeCm), product.maxSizeCm);
                        setWidthCm(clamped);
                      }}
                      className="border rounded-lg px-3 py-2 w-full bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      Altezza (cm) — min {product.minSizeCm}, max {product.maxSizeCm}
                    </label>
                    <input
                      type="number"
                      min={product.minSizeCm}
                      max={product.maxSizeCm}
                      value={heightCm}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || product.minSizeCm;
                        const clamped = Math.min(Math.max(val, product.minSizeCm), product.maxSizeCm);
                        setHeightCm(clamped);
                      }}
                      className="border rounded-lg px-3 py-2 w-full bg-white"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  Area: {(widthCm * heightCm).toFixed(0)} cm²
                </p>

                {product.laminationPrice > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                    <input
                      type="checkbox"
                      id="wantsLamination"
                      checked={wantsLamination}
                      onChange={(e) => setWantsLamination(e.target.checked)}
                      className="w-5 h-5 cursor-pointer"
                      style={{ accentColor: "var(--accent)" }}
                    />
                    <label htmlFor="wantsLamination" className="cursor-pointer text-sm font-medium">
                      Aggiungi plastificazione protettiva
                      <span className="ml-2 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                        +€{(widthCm * heightCm * product.laminationPrice).toFixed(2)}
                      </span>
                    </label>
                  </div>
                )}
              </div>
            )}

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

            {/* Taglie — nascoste per adesivi visto che usano cm liberi */}
            {!product.isSticker && product.sizes.length > 0 && (
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

            {/* Quantità — pulsanti fissi per adesivi, +/- per il resto */}
            {product.isSticker ? (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2">Quantità</p>
                <div className="grid grid-cols-4 gap-2">
                  {STICKER_QUANTITIES.map((q) => {
                    const discountForQty = product.stickerDiscounts
                      ?.filter((d) => q >= d.minQty)
                      .sort((a, b) => b.minQty - a.minQty)[0];
                    return (
                      <button
                        key={q}
                        onClick={() => setQuantity(q)}
                        className="px-2 py-2.5 border rounded-lg text-sm font-semibold transition flex flex-col items-center"
                        style={
                          quantity === q
                            ? { background: "var(--accent)", borderColor: "var(--accent)" }
                            : {}
                        }
                      >
                        <span>{q} pz</span>
                        {discountForQty && (
                          <span className="text-[10px] font-normal opacity-75">
                            -{discountForQty.discount}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {applicableDiscount && (
                  <p className="text-xs mt-2 font-semibold" style={{ color: "var(--accent)" }}>
                    ✓ Sconto del {applicableDiscount.discount}% applicato per {quantity}+ pezzi
                  </p>
                )}
              </div>
            ) : (
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
            )}

            {/* Prezzi a scaglioni — solo per prodotti non-adesivo */}
            {!product.isSticker && product.priceTiers.length > 0 && (
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
                      <h3 className="font-bold mb-3">Grafica</h3>
                      <ProductCustomizer
                        label="Carica la tua grafica"
                        onConfirm={(file) => {
                          setCustomizationFront(file);
                          setOriginalFront(file);
                        }}
                      />
                      {customizationFront && (
                        <div className="mt-2 flex items-center gap-2">
                          <img src={customizationFront} alt="Grafica" className="h-16 object-contain rounded-lg border bg-white" />
                          <p className="text-sm text-green-600 font-semibold">✓ Grafica confermata</p>
                        </div>
                      )}
                    </div>

                    {/* Retro — nascosto per adesivi */}
                    {!product.isSticker && product.backImage && (
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
            <div className="flex justify-between items-center mb-2">
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

            {product.isSticker && product.minOrderPrice > 0 && rawTotal < product.minOrderPrice && (
              <p className="text-xs text-gray-400 mb-4">
                Prezzo minimo d&apos;ordine applicato: €{product.minOrderPrice.toFixed(2)}
              </p>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full font-bold transition mt-4"
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