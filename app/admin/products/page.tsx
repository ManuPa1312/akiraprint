"use client";

import { useEffect, useState } from "react";

type Color = { name: string; hex: string };
type PriceTier = { minQty: number; maxQty: number | null; price: number };

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
  sizes: { id: number; name: string }[];
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
        price: parseFloat(form.price),
        backPrice: parseFloat(form.backPrice) || 0,
        colors,
        priceTiers,
        sizes,
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
    });
    setPreview(product.image);
    setPreviewBack(product.backImage);
    setColors(product.colors);
    setPriceTiers(product.priceTiers);
    setSizes(product.sizes.map((s) => s.name));
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
            placeholder="Prezzo base (es. 19.99)"
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
            <option value="personalizzati">Personalizzati</option>
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

        {/* Colori */}
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

        {/* Prezzi a scaglioni */}
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

        {/* Taglie */}
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
                  <p className="text-gray-500 text-sm">{product.category} — €{product.price.toFixed(2)}</p>
                  {product.customizable && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--accent)" }}>
                      Personalizzabile
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