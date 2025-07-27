"use client";
import { Server, ShieldCheck, Users, Cpu, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function FeatureStatsSection() {
  const features = [
    {
      icon: <Server className="w-8 h-8 text-blue-600" />,
      title: "Administrasi Jaringan",
      description:
        "Mahasiswa dilatih mengelola dan mengonfigurasi jaringan komputer, termasuk server dan perangkat jaringan.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      title: "Keamanan Siber",
      description:
        "Fokus pada perlindungan data dan jaringan dari ancaman siber melalui berbagai teknik dan tools keamanan.",
    },
    {
      icon: <Cpu className="w-8 h-8 text-blue-600" />,
      title: "Infrastruktur TI",
      description:
        "Mempelajari infrastruktur teknologi informasi untuk mendukung kebutuhan jaringan skala kecil hingga besar.",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Kerja Tim Teknologi",
      description:
        "Berkolaborasi dalam tim teknis untuk membangun, menguji, dan memelihara sistem jaringan yang handal.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
          Keunggulan Program Magang <br className="hidden sm:block" />
          Jaringan Komputer
        </h2>

        {/* Features */}
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
            <p className="text-3xl font-bold text-black">4.8</p>
            <div className="flex justify-center items-center gap-1 text-blue-600">
              <Star fill="currentColor" className="w-5 h-5" />
              <Star fill="currentColor" className="w-5 h-5" />
              <Star fill="currentColor" className="w-5 h-5" />
              <Star fill="currentColor" className="w-5 h-5" />
              <Star fill="currentColor" className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 mt-1">400+ ulasan mahasiswa</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            viewport={{ once: true }}
          >
            <p className="text-3xl font-bold text-black">92%</p>
            <p className="text-sm text-gray-500 mt-1">
              Lulusan bekerja di bidang jaringan & IT support.
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
              Mitra industri bidang jaringan dan keamanan TI.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
