export default function InternshipHero() {
  return (
    <section className="py-16 px-4 bg-white w-full">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Deskripsi Teks */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tingkatkan Kariermu Lewat Pengalaman Magang
          </h2>
          <p className="text-gray-600 mb-8">
            Program magang kami memberikan kesempatan untuk mengembangkan
            keterampilan praktis, memperluas jaringan profesional, dan merasakan
            langsung dinamika dunia kerja.
          </p>
        </div>

        {/* Gambar */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="/images/kokomi.png" // Pastikan path gambar sesuai
            alt="Ilustrasi Magang"
            className="w-3/4 sm:w-4/5 md:w-3/4 lg:w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
