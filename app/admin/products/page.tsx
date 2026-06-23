"use client";

import { useEffect, useState } from "react";

type Color = { name: string; hex: string };
type PriceTier = { minQty: number; maxQty: number | null; price: number };
type StickerDiscount = { minQty: number; discount: number };

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
  sizes: { id: number; name: string }[];
  stickerDiscounts: StickerDiscount[];
};

const emptyForm = {
  name: "",
  price: "",
  category: "maglie",
  description: "",
  image: "",
  backImage: "",
  backPrice: "",
  customizable: false,
  hasShapeOption: false,
  isSticker: false,
  pricePerCm2: "",
  laminationPrice: "",
  minOrderPrice: "",
  minSizeCm: "3",
  maxSizeCm: "30",
  hasTechniqueOption: false,
  embroideryPrice: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [previewBack, setPreviewBack] = useState<string>("");
  const [colors, setColors] = useState<Color[]>([]);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [newColor, setNewColor] = useState<Color>({ name: "", hex: "#ffffff" });
  const [newTier, setNewTier] = useState<PriceTier>({ minQty: 1, maxQty: null, price: 0 });
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState("");
  const [stickerDiscounts, setStickerDiscounts] = useState<StickerDiscount[]>([]);
  const [newDiscount, setNewDiscount] = useState<StickerDiscount>({ minQty: 1, discount: 0 });

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${window.location.origin}/api/products`);
      if (!res.ok) throw new Error("Errore API");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Errore caricamento prodotti:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setForm((prev) => ({ ...prev, image: data.url }));
    setUploading(false);
  };

  const handleBackImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setPreviewBack(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setForm((prev) => ({ ...prev, backImage: data.url }));
    setUploading(false);
  };

  const handleSubmit = async () => {
    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(`${window.location.origin}${url}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price) || 0,
        backPrice: parseFloat(form.backPrice) || 0,
        pricePerCm2: parseFloat(form.pricePerCm2) || 0,
        laminationPrice: parseFloat(form.laminationPrice) || 0,
        minOrderPrice: parseFloat(form.minOrderPrice) || 0,
        minSizeCm: parseFloat(form.minSizeCm) || 3,
        maxSizeCm: parseFloat(form.maxSizeCm) || 30,
        colors,
        priceTiers,
        sizes,
        stickerDiscounts,
        hasTechniqueOption: form.hasTechniqueOption,
        embroideryPrice: parseFloat(form.embroideryPrice) || 0,
      }),
    });

    if (res.ok) {
      setMessage(editingId ? "Prodotto modificato!" : "Prodotto aggiunto!");
      setForm(emptyForm);
      setPreview("");
      setPreviewBack("");
      setColors([]);
      setPriceTiers([]);
      setSizes([]);
      setStickerDiscounts([]);
      setEditingId(null);
      fetchProducts();
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: product.image,
      backImage: product.backImage,
      backPrice: product.backPrice.toString(),
      customizable: product.customizable,
      hasShapeOption: product.hasShapeOption,
      isSticker: product.isSticker,
      pricePerCm2: product.pricePerCm2.toString(),
      laminationPrice: product.laminationPrice.toString(),
      minOrderPrice: product.minOrderPrice.toString(),
      minSizeCm: product.minSizeCm.toString(),
      maxSizeCm: product.maxSizeCm.toString(),
      hasTechniqueOption: product.hasTechniqueOption,
      embroideryPrice: product.embroideryPrice.toString(),
    });
    setPreview(product.image);
    setPreviewBack(product.backImage);
    setColors(product.colors);
    setPriceTiers(product.priceTiers);
    setSizes(product.sizes.map((s) => s.name));
    setStickerDiscounts(product.stickerDiscounts || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;
    await fetch(`${window.location.origin}/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPreview("");
    setPreviewBack("");
    setColors([]);
    setPriceTiers([]);
    setSizes([]);
    setStickerDiscounts([]);
  };

  return (
    <main className="py-16 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-10">Gestione Prodotti</h1>

      {/* Form */}
      <div className="border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Modifica prodotto" : "Aggiungi prodotto"}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
          <input
            placeholder="Prezzo base (es. 19.99) — ignorato se è un adesivo"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
       <select
  value={form.category}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
  className="border rounded-lg px-4 py-2"
>
  <option value="maglie">Maglie</option>
  <option value="cappellini">Cappellini</option>
  <option value="gadget">Gadget</option>
  <option value="adesivi">Adesivi</option>
  <option value="roll-up">Roll Up</option>
  <option value="banner">Banner</option>
  <option value="pet-lover">Pet Lover 🐾</option>
</select>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Immagine fronte</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border rounded-lg px-4 py-2 w-full"
            />
            {uploading && <p className="text-sm text-gray-400 mt-1">Caricamento...</p>}
          </div>
          {preview && (
            <div className="md:col-span-2">
              <img src={preview} alt="Preview fronte" className="h-40 object-contain rounded-lg border" />
            </div>
          )}
          <textarea
            placeholder="Descrizione"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded-lg px-4 py-2 md:col-span-2"
            rows={3}
          />

          {/* Toggle personalizzabile */}
          <div className="md:col-span-2 flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
            <input
              type="checkbox"
              id="customizable"
              checked={form.customizable}
              onChange={(e) => setForm({ ...form, customizable: e.target.checked })}
              className="w-5 h-5 cursor-pointer"
              style={{ accentColor: "var(--accent)" }}
            />
            <label htmlFor="customizable" className="font-medium cursor-pointer">
              Prodotto personalizzabile — il cliente può caricare la sua grafica
            </label>
          </div>

          {/* Toggle è un adesivo (preventivatore cm²) */}
          {form.customizable && (
            <div className="md:col-span-2 flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
              <input
                type="checkbox"
                id="isSticker"
                checked={form.isSticker}
                onChange={(e) => setForm({ ...form, isSticker: e.target.checked })}
                className="w-5 h-5 cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
              <label htmlFor="isSticker" className="cursor-pointer font-medium">
                È un adesivo — usa il calcolo prezzo a cm² (dimensioni libere)
              </label>
            </div>
          )}

          {/* Parametri preventivatore adesivo */}
          {form.isSticker && (
            <div className="md:col-span-2 grid md:grid-cols-2 gap-4 p-4 border rounded-lg bg-yellow-50">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Prezzo al cm² (€)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Es. 0.12"
                  value={form.pricePerCm2}
                  onChange={(e) => setForm({ ...form, pricePerCm2: e.target.value })}
                  className="border rounded-lg px-4 py-2 w-full bg-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Prezzo plastificazione al cm² (€)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Es. 0.03"
                  value={form.laminationPrice}
                  onChange={(e) => setForm({ ...form, laminationPrice: e.target.value })}
                  className="border rounded-lg px-4 py-2 w-full bg-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Ordine minimo (€)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Es. 8.00"
                  value={form.minOrderPrice}
                  onChange={(e) => setForm({ ...form, minOrderPrice: e.target.value })}
                  className="border rounded-lg px-4 py-2 w-full bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Lato min (cm)</label>
                  <input
                    type="number"
                    value={form.minSizeCm}
                    onChange={(e) => setForm({ ...form, minSizeCm: e.target.value })}
                    className="border rounded-lg px-4 py-2 w-full bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Lato max (cm)</label>
                  <input
                    type="number"
                    value={form.maxSizeCm}
                    onChange={(e) => setForm({ ...form, maxSizeCm: e.target.value })}
                    className="border rounded-lg px-4 py-2 w-full bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sconti quantità per adesivi */}
          {form.isSticker && (
            <div className="md:col-span-2 p-4 border rounded-lg bg-yellow-50">
              <h3 className="font-semibold mb-3">Sconti per quantità (adesivi)</h3>
              <div className="space-y-2 mb-3">
                {stickerDiscounts.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm border rounded-lg px-3 py-2 bg-white">
                    <span>Da {d.minQty} pezzi → sconto {d.discount}%</span>
                    <button onClick={() => setStickerDiscounts(stickerDiscounts.filter((_, j) => j !== i))} className="text-red-400 ml-auto">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="number"
                  placeholder="Qty minima"
                  value={newDiscount.minQty || ""}
                  onChange={(e) => setNewDiscount({ ...newDiscount, minQty: parseInt(e.target.value) || 0 })}
                  className="border rounded-lg px-3 py-2 text-sm w-32 bg-white"
                />
                <input
                  type="number"
                  placeholder="Sconto %"
                  value={newDiscount.discount || ""}
                  onChange={(e) => setNewDiscount({ ...newDiscount, discount: parseFloat(e.target.value) || 0 })}
                  className="border rounded-lg px-3 py-2 text-sm w-28 bg-white"
                />
                <button
                  onClick={() => {
                    if (newDiscount.minQty && newDiscount.discount) {
                      setStickerDiscounts([...stickerDiscounts, newDiscount]);
                      setNewDiscount({ minQty: 1, discount: 0 });
                    }
                  }}
                  className="border px-4 py-2 rounded-full text-sm hover:bg-gray-100 bg-white"
                >
                  + Aggiungi
                </button>
              </div>
            </div>
          )}

          {/* Scelta forma */}
          {form.customizable && (
            <div className="md:col-span-2 flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
              <input
                type="checkbox"
                id="hasShapeOption"
                checked={form.hasShapeOption}
                onChange={(e) => setForm({ ...form, hasShapeOption: e.target.checked })}
                className="w-5 h-5 cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
              <label htmlFor="hasShapeOption" className="cursor-pointer font-medium">
                Permetti scelta forma (quadrato / rotondo / sagomato) — utile per adesivi
              </label>
            </div>
          )}


          {/* Toggle ricamo */}
{form.customizable && (
  <div className="md:col-span-2 grid md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        id="hasTechniqueOption"
        checked={form.hasTechniqueOption}
        onChange={(e) => setForm({ ...form, hasTechniqueOption: e.target.checked })}
        className="w-5 h-5 cursor-pointer"
        style={{ accentColor: "var(--accent)" }}
      />
      <label htmlFor="hasTechniqueOption" className="cursor-pointer font-medium">
        Permetti scelta tra stampa e ricamo
      </label>
    </div>
    {form.hasTechniqueOption && (
      <div>
        <label className="block text-sm text-gray-500 mb-1">Sovrapprezzo ricamo (€)</label>
        <input
          type="number"
          step="0.01"
          placeholder="Es. 5.00 (0 se stesso prezzo della stampa)"
          value={form.embroideryPrice}
          onChange={(e) => setForm({ ...form, embroideryPrice: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full bg-white"
        />
      </div>
    )}
  </div>
)}


          {/* Immagine retro e prezzo aggiuntivo */}
          {form.customizable && (
            <div className="md:col-span-2 grid md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Immagine retro (opzionale)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackImageUpload}
                  className="border rounded-lg px-4 py-2 w-full bg-white"
                />
                {previewBack && (
                  <img src={previewBack} alt="Preview retro" className="h-32 object-contain mt-2 rounded-lg border" />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Prezzo aggiuntivo retro (€)</label>
                <input
                  type="number"
                  placeholder="Es. 5.00"
                  value={form.backPrice}
                  onChange={(e) => setForm({ ...form, backPrice: e.target.value })}
                  className="border rounded-lg px-4 py-2 w-full bg-white"
                />
                <p className="text-xs text-gray-400 mt-1">Lascia 0 se il retro è incluso nel prezzo</p>
              </div>
            </div>
          )}
        </div>

        {/* Colori — nascosti per adesivi */}
        {!form.isSticker && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Colori disponibili</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {colors.map((color, i) => (
                <div key={i} className="flex items-center gap-2 border rounded-full px-3 py-1 text-sm">
                  <div className="w-4 h-4 rounded-full border" style={{ background: color.hex }}></div>
                  <span>{color.name}</span>
                  <button onClick={() => setColors(colors.filter((_, j) => j !== i))} className="text-red-400 ml-1">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                placeholder="Nome colore (es. Bianco)"
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[150px]"
              />
              <input
                type="color"
                value={newColor.hex}
                onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                className="border rounded-lg px-2 py-1 h-10 w-16 cursor-pointer"
              />
              <button
                onClick={() => {
                  if (newColor.name) {
                    setColors([...colors, newColor]);
                    setNewColor({ name: "", hex: "#ffffff" });
                  }
                }}
                className="border px-4 py-2 rounded-full text-sm hover:bg-gray-100"
              >
                + Aggiungi
              </button>
            </div>
          </div>
        )}

        {/* Prezzi a scaglioni — nascosti per adesivi (gestiti diversamente) */}
        {!form.isSticker && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Prezzi a scaglioni</h3>
            <div className="space-y-2 mb-3">
              {priceTiers.map((tier, i) => (
                <div key={i} className="flex items-center gap-2 text-sm border rounded-lg px-3 py-2">
                  <span>Da {tier.minQty} {tier.maxQty ? `a ${tier.maxQty}` : "+"} pezzi → €{tier.price.toFixed(2)} cad.</span>
                  <button onClick={() => setPriceTiers(priceTiers.filter((_, j) => j !== i))} className="text-red-400 ml-auto">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="number"
                placeholder="Qty min"
                value={newTier.minQty || ""}
                onChange={(e) => setNewTier({ ...newTier, minQty: parseInt(e.target.value) || 0 })}
                className="border rounded-lg px-3 py-2 text-sm w-24"
              />
              <input
                type="number"
                placeholder="Qty max (vuoto = illimitato)"
                value={newTier.maxQty || ""}
                onChange={(e) => setNewTier({ ...newTier, maxQty: e.target.value ? parseInt(e.target.value) : null })}
                className="border rounded-lg px-3 py-2 text-sm w-48"
              />
              <input
                type="number"
                placeholder="Prezzo €"
                value={newTier.price || ""}
                onChange={(e) => setNewTier({ ...newTier, price: parseFloat(e.target.value) || 0 })}
                className="border rounded-lg px-3 py-2 text-sm w-28"
              />
              <button
                onClick={() => {
                  if (newTier.minQty && newTier.price) {
                    setPriceTiers([...priceTiers, newTier]);
                    setNewTier({ minQty: 1, maxQty: null, price: 0 });
                  }
                }}
                className="border px-4 py-2 rounded-full text-sm hover:bg-gray-100"
              >
                + Aggiungi
              </button>
            </div>
          </div>
        )}

        {/* Taglie — nascoste per adesivi (usano dimensioni libere) */}
        {!form.isSticker && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Taglie disponibili</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {sizes.map((size, i) => (
                <div key={i} className="flex items-center gap-2 border rounded-full px-3 py-1 text-sm">
                  <span>{size}</span>
                  <button onClick={() => setSizes(sizes.filter((_, j) => j !== i))} className="text-red-400 ml-1">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                placeholder="Es. S, M, L, XL, unica..."
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[150px]"
              />
              <button
                onClick={() => {
                  if (newSize.trim()) {
                    setSizes([...sizes, newSize.trim().toUpperCase()]);
                    setNewSize("");
                  }
                }}
                className="border px-4 py-2 rounded-full text-sm hover:bg-gray-100"
              >
                + Aggiungi
              </button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["XS", "S", "M", "L", "XL", "XXL", "UNICA"].map((s) => (
                <button
                  key={s}
                  onClick={() => { if (!sizes.includes(s)) setSizes([...sizes, s]); }}
                  className="text-xs border px-3 py-1 rounded-full hover:bg-gray-100 transition"
                  style={sizes.includes(s) ? { background: "var(--accent)", borderColor: "var(--accent)" } : {}}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {message && <p className="text-green-600 mt-3">{message}</p>}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="text-white px-6 py-2 rounded-full transition disabled:opacity-50"
            style={{ background: "var(--accent)" }}
          >
            {editingId ? "Salva modifiche" : "Aggiungi"}
          </button>
          {editingId && (
            <button onClick={handleCancel} className="border px-6 py-2 rounded-full hover:bg-gray-100 transition">
              Annulla
            </button>
          )}
        </div>
      </div>

      {/* Lista prodotti */}
      <h2 className="text-xl font-semibold mb-4">Prodotti nel catalogo</h2>
      {loading ? (
        <p className="text-gray-500">Caricamento...</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex justify-between items-center border rounded-xl px-6 py-4">
              <div className="flex items-center gap-4">
                {product.image && (
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                )}
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {product.category} — {product.isSticker ? `€${product.pricePerCm2}/cm²` : `€${product.price.toFixed(2)}`}
                  </p>
                  {product.customizable && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full mr-1" style={{ background: "var(--accent)" }}>
                      Personalizzabile
                    </span>
                  )}
                  {product.isSticker && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-200">
                      Adesivo (cm²)
                    </span>
                  )}
                  <div className="flex gap-1 mt-1">
                    {product.colors.map((c, i) => (
                      <div key={i} title={c.name} className="w-4 h-4 rounded-full border" style={{ background: c.hex }}></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleEdit(product)} className="text-sm hover:underline" style={{ color: "var(--accent)" }}>
                  Modifica
                </button>
                <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:underline text-sm">
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}