"use client";

import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroSection() {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [8, -8]);
  const rotateY = useTransform(x, [-50, 50], [-8, 8]);

  const handleMouseMove = (e) => {
    const bounds = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - bounds.left - bounds.width / 2;
    const offsetY = e.clientY - bounds.top - bounds.height / 2;
    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="bg-white py-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* ✅ Breadcrumb */}
        <nav className="text-xl md:text-2xl text-gray-600 mb-8">
          <ol className="flex items-center space-x-3">
            <li>
              <Link
                href="/"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Beranda
              </Link>
            </li>
            <li>{">"}</li>
            <li>
              <Link
                href="/program-magang"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Program Magang
              </Link>
            </li>
            <li>{">"}</li>
            <li className="text-gray-800 font-semibold">Teknik Informatika</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image + Badge */}
          <motion.div
            className="relative"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="overflow-hidden rounded-xl shadow-md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src="/images/teknik-informatika.jpg"
                alt="Teknik Informatika"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </motion.div>

            <motion.div
              className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg px-6 py-4 flex flex-col items-center w-40"
              style={{ rotateX, rotateY }}
            >
              <div className="bg-blue-600 text-white text-3xl font-bold px-4 py-2 rounded-md">
                15
              </div>
              <p className="mt-2 text-base text-gray-700 text-center">
                Years of experience
              </p>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="uppercase text-blue-600 font-semibold tracking-wider text-base">
              Teknik Informatika
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
              Profesional dan <br /> Berdedikasi di Dunia Digital.
            </h1>
            <p className="text-gray-600 text-xl mb-6 leading-relaxed">
              Kami berpengalaman lebih dari 15 tahun dalam membentuk talenta
              unggul di bidang teknologi. Program kami dirancang untuk mendukung
              inovasi, pengembangan software, dan keterampilan IT modern.
            </p>

            <div className="flex items-center gap-3 bg-gray-100 p-5 rounded-lg w-fit">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-base font-medium text-gray-800">
                10k+ mahasiswa telah bergabung.
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
