"use client";
import { BookOpenCheck, Clock, User, CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function FeatureStatsSection() {
  const features = [
    {
      icon: <BookOpenCheck className="w-8 h-8 text-blue-600" />,
      title: "Pembelajaran Praktis",
      description:
        "Terlibat langsung dalam pembukuan, analisis laporan keuangan, dan software akuntansi.",
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Waktu Fleksibel",
      description:
        "Jadwal magang dapat disesuaikan dengan kegiatan kuliah agar tidak mengganggu akademik.",
    },
    {
      icon: <User className="w-8 h-8 text-blue-600" />,
      title: "Pembimbing Profesional",
      description:
        "Dibimbing oleh staf keuangan berpengalaman di bidang akuntansi dan sistem informasi.",
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-blue-600" />,
      title: "Sertifikat & Pengalaman",
      description:
        "Mendapatkan pengalaman nyata dan sertifikat resmi dari instansi pemerintah.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
          Keunggulan Program Magang <br className="hidden sm:block" />
          Komputer Akuntansi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition duration-300"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-10 text-center text-gray-800 text-lg font-medium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-3xl font-bold text-black">4.8</p>
            <div className="flex justify-center items-center gap-1 text-blue-600">
              <Star fill="currentColor" className="w-5 h-5" />
              <Star fill="currentColor" className="w-5 h-5" />
              <Star fill="currentColor" className="w-5 h-5" />
              <Star fill="currentColor" className="w-5 h-5" />
              <Star fill="currentColor" className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 mt-1">300+ ulasan mahasiswa</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            viewport={{ once: true }}
          >
            <p className="text-3xl font-bold text-black">92%</p>
            <p className="text-sm text-gray-500 mt-1">
              Tingkat penyerapan kerja setelah magang.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            viewport={{ once: true }}
          >
            <p className="text-3xl font-bold text-black">200+</p>
            <p className="text-sm text-gray-500 mt-1">
              Mitra industri di bidang akuntansi & keuangan.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
