// app/components/InternshipFooter.tsx

export default function InternshipFooter() {
  return (
    <footer className="bg-gray-100 py-6 px-4 text-gray-700 text-center">
      <div className="max-w-screen-xl mx-auto">
        {/* Logo dan Deskripsi */}
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Magang</h1>
        <p className="text-sm max-w-xl mx-auto mb-4">
          Program magang berbasis website untuk membantu mahasiswa membangun
          keterampilan dan pengalaman kerja nyata.
        </p>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm mb-4">
          <a href="#" className="hover:text-blue-600">
            Tentang Kami
          </a>
          <a href="#" className="hover:text-blue-600">
            Panduan
          </a>
          <a href="#" className="hover:text-blue-600">
            Kontak
          </a>
          <a href="#" className="hover:text-blue-600">
            Kebijakan Privasi
          </a>
        </div>

        {/* Footer Bottom */}
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Magang. Semua Hak Dilindungi.
        </p>
      </div>
    </footer>
  );
}
