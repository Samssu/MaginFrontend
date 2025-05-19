export default function HeroSection() {
  return (
    <section
      className="min-h-[70vh] flex items-center pt-16 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/Herossection.png')" }}
    >
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
        {/* Kiri: Teks */}
        <div className="w-full md:w-1/2 pl-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Tingkatkan Kariermu Lewat Pengalaman Magang Nyata
          </h1>
          <p className="text-base md:text-lg mb-6">
            Bangun portofolio nyata yang mencerminkan kemampuan dan dedikasimu,
            perluas koneksi profesional yang membuka berbagai peluang di masa
            depan, dan rasakan langsung dinamika dunia kerja melalui pengalaman
            magang yang intensif dan relevan di lapangan.
          </p>
          <a
            href="/daftar"
            className="inline-block bg-blue-600 text-white text-sm md:text-base px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Daftar Sekarang!
          </a>
        </div>
      </div>
    </section>
  );
}
