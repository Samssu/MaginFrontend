import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Magang Kominfo Palembang</h1>
          <nav className="space-x-4">
            <Link href="/">Beranda</Link>
            <Link href="/about">Tentang</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">register</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Selamat Datang di Website Magang
        </h2>
        <p className="text-lg mb-6">
          Program magang untuk mahasiswa di Dinas Komunikasi dan Informatika
          Kota Palembang.
        </p>
        <Link href="/about">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Lihat Detail Program
          </button>
        </Link>
      </main>

      <footer className="bg-gray-100 text-center p-4 text-sm mt-12">
        &copy; 2025 Dinas Kominfo Kota Palembang
      </footer>
    </div>
  );
}
