import Image from "next/image";
import { motion } from "framer-motion";

export default function Feature() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Gambar Sejajar dengan Fade-in */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex gap-6">
            {/* Gambar 1 */}
            <motion.div
              className="relative w-64 h-80 rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Image
                src="/images/feature1.jpg"
                alt="Mahasiswa Magang"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Gambar 2 */}
            <motion.div
              className="relative w-64 h-80 rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Image
                src="/images/feature2.jpg"
                alt="Suasana Magang"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Deskripsi & Progress Bar dengan Fade-in */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="text-sm uppercase text-blue-600 font-semibold tracking-wider bg-blue-50 px-3 py-1 rounded-full">
            🧑‍💻 Program Magang
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
            Persiapkan Kariermu Lewat <br /> Pengalaman Magang Nyata
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Program magang ini memberikan kamu kesempatan untuk belajar langsung
            di lingkungan kerja profesional, membangun relasi, dan meningkatkan
            keterampilan praktis yang sangat dibutuhkan di dunia industri.
          </p>

          {/* Progress Bar */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-red-600">
                  Pengalaman Profesional
                </span>
                <span className="text-sm font-semibold text-red-600">98%</span>
              </div>
              <div className="w-full bg-red-100 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{ width: "98%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-600">
                  Peningkatan Skill
                </span>
                <span className="text-sm font-semibold text-blue-600">85%</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: "85%" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
