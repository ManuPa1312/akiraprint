import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="py-24 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Ordine confermato! 🎉</h1>
      <p className="text-gray-500 mb-8">
        Grazie per il tuo acquisto. Riceverai una email di conferma a breve.
      </p>
      <Link
        href="/shop"
        className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
      >
        Continua lo shopping
      </Link>
    </main>
  );
}