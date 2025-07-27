"use client";
import {
  Image as ImageIcon,
  Video,
  PenTool,
  CheckCircle2,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

export default function FeatureStatsSection() {
  const features = [
    {
      icon: <ImageIcon className="w-8 h-8 text-blue-600" />,
      title: "Desain Grafis Profesional",
      description:
        "Pelatihan intensif menggunakan software desain seperti Adobe Photoshop dan Illustrator.",
    },
    {
      icon: <Video className="w-8 h-8 text-blue-600" />,
      title: "Produksi Video & Animasi",
      description:
        "Belajar membuat konten video, animasi 2D/3D, dan motion graphic untuk kebutuhan industri.",
    },
    {
      icon: <PenTool className="w-8 h-8 text-blue-600" />,
      title: "Proyek UI/UX",
      description:
        "Mahasiswa terlibat dalam pembuatan prototype dan interface untuk aplikasi & web interaktif.",
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-blue-600" />,
      title: "Sertifikasi & Portofolio",
      description:
        "Program magang memberikan sertifikat resmi dan hasil karya yang siap ditampilkan di portofolio.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
          Keunggulan Program Magang <br className="hidden sm:block" />
          Multimedia
        </h2>

        {/* Features with animation */}
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

        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-center gap-10 text-center text-gray-800 text-lg font-medium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-3xl font-bold text-black">4.9</p>
            <div className="flex justify-center items-center gap-1 text-blue-600">
              <Star fill="currentColor" className="w-5 h-5" />
              <Star fill="currentColor" className="w-5 h-5" />
              <Star fill="currentColor" className="w-5 h-5" />
              <Star fill="currentColor" className="w-5 h-5" />
              <Star fill="currentColor" className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 mt-1">1.000+ ulasan peserta</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            viewport={{ once: true }}
          >
            <p className="text-3xl font-bold text-black">92%</p>
            <p className="text-sm text-gray-500 mt-1">
              Alumni bekerja di industri kreatif dan media digital.
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
              Mitra industri seperti studio, agensi, dan startup.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
