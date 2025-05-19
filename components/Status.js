import { FaSmile, FaCheckDouble, FaLayerGroup, FaUsers } from "react-icons/fa";

export default function InternshipStats() {
  return (
    <section className="py-12 px-4 bg-white w-full">
      <div className="max-w-full mx-auto text-center">
        {/* Judul dan Deskripsi */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Bangun Karier Lewat Pengalaman Magang
        </h2>
        <p className="text-gray-600 mb-4 max-w-4xl mx-auto">
          Program magang kami dirancang untuk memberikan pengalaman dunia kerja
          yang nyata, memperluas koneksi profesional, dan mengembangkan
          keterampilan praktis yang dibutuhkan di industri.
        </p>

        {/* Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
          {/* Item 1 */}
          <div className="flex flex-col items-center">
            <FaSmile className="text-6xl text-gray-400 mb-2" />{" "}
            {/* Reduced margin */}
            <h3 className="text-2xl font-semibold">250+</h3>
            <p className="text-gray-500 text-lg">Peserta Puas</p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center">
            <FaCheckDouble className="text-6xl text-gray-400 mb-2" />{" "}
            {/* Reduced margin */}
            <h3 className="text-2xl font-semibold">600+</h3>
            <p className="text-gray-500 text-lg">Proyek Diselesaikan</p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center">
            <FaLayerGroup className="text-6xl text-gray-400 mb-2" />{" "}
            {/* Reduced margin */}
            <h3 className="text-2xl font-semibold">1.8K+</h3>
            <p className="text-gray-500 text-lg">Materi Magang</p>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col items-center">
            <FaUsers className="text-6xl text-gray-400 mb-2" />{" "}
            {/* Reduced margin */}
            <h3 className="text-2xl font-semibold">11K+</h3>
            <p className="text-gray-500 text-lg">Pendaftar</p>
          </div>
        </div>
      </div>
    </section>
  );
}
