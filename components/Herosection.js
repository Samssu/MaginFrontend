export default function HeroSection() { return (
<section className="bg-[#F8F9FB] min-h-[80vh] flex items-center">
  <div
    className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8"
  >
    {/* Kiri: Teks */}
    <div className="w-full md:w-1/2 ml-4 md:ml-8">
      <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
        Tingkatkan Kariermu Lewat Pengalaman Magang Nyata
      </h1>
      <p className="text-gray-700 text-base md:text-lg mb-6">
        Bangun portofolio nyata yang mencerminkan kemampuan dan dedikasimu,
        perluas koneksi profesional yang membuka berbagai peluang di masa depan,
        dan rasakan langsung dinamika dunia kerja melalui pengalaman magang yang
        intensif dan relevan di lapangan.
      </p>
      <a
        href="/daftar"
        className="inline-block bg-blue-600 text-white text-sm md:text-base px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
      >
        Daftar Sekarang!
      </a>
    </div>

    {/* Gambar Kanan */}
    <div className="flex justify-center items-start mt-16 md:mt-24">
      <img
        src="/kokomi1.jpg"
        alt="Ilustrasi Magang"
        className="w-[70%] md:w-[60%] object-contain"
      />
    </div>
  </div>
</section>
); }
