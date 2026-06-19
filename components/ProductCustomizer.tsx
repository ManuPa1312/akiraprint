"use client";

import { useRef, useState } from "react";

type Props = {
  label: string;
  onConfirm: (originalFile: string) => void;
};

export default function ProductCustomizer({ label, onConfirm }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileLoaded, setFileLoaded] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const fileRef = useRef<string>("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File troppo grande! Max 10MB. Per file più grandi contattaci via email a info@akiraprint.it");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setFileLoaded(false);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) { clearInterval(interval); return 90; }
        return prev + 10;
      });
    }, 100);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      fileRef.current = dataUrl;
      setPreview(dataUrl);
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        setFileLoaded(true);
      }, 300);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-sm text-gray-500">{label}</p>

      {preview && (
        <div className="border rounded-xl overflow-hidden bg-gray-50">
          <img src={preview} alt="Preview" className="w-full h-48 object-contain" />
        </div>
      )}

      <label className={`cursor-pointer px-5 py-3 rounded-full font-semibold text-sm transition text-center ${uploading ? "opacity-50 bg-gray-300 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}>
        {uploading ? "Caricamento..." : preview ? "📁 Cambia file" : "📁 Carica la tua grafica"}
        <input
          type="file"
          accept="image/*,.pdf,.ai,.eps,.svg"
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {uploading && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Caricamento...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%`, background: "var(--accent)" }}
            />
          </div>
        </div>
      )}

      <button
        onClick={() => onConfirm(fileRef.current)}
        disabled={uploading || !fileLoaded}
        className="w-full py-3 rounded-full font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: fileLoaded ? "var(--accent)" : "#e0e0e0", color: "black" }}
      >
        {uploading ? "Attendi..." : fileLoaded ? "✓ Conferma grafica" : "Carica prima un file"}
      </button>

      <p className="text-xs text-gray-400">
        Formati accettati: JPG, PNG, PDF, AI, EPS, SVG — Max 10MB.<br />
        Per file più grandi scrivi a <span style={{ color: "var(--accent)" }}>info@akiraprint.it</span>
      </p>
    </div>
  );
}