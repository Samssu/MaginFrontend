"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Herman Miller",
    photo: "/images/pasfoto1.jpg",
    quote:
      "Program magang ini membantu saya memahami dunia kerja nyata di bidang teknologi informasi. Terima kasih atas bimbingan dan ilmunya!",
  },
  {
    name: "Dewi Lestari",
    photo: "/images/pasfoto2.jpg",
    quote:
      "Saya belajar langsung dari mentor yang profesional. Ini pengalaman yang sangat berharga bagi masa depan karier saya.",
  },
  {
    name: "Arif Budiman",
    photo: "/images/pasfoto3.jpg",
    quote:
      "Lingkungan kerjanya sangat mendukung. Saya jadi lebih percaya diri menghadapi dunia kerja yang sesungguhnya.",
  },
  {
    name: "Putri Aulia",
    photo: "/images/pasfoto4.jpg",
    quote:
      "Saya tidak hanya belajar teori, tetapi juga praktik langsung bersama tim profesional Kominfo. Luar biasa!",
  },
  {
    name: "Fajar Ramadhan",
    photo: "/images/pasfoto5.jpg",
    quote:
      "Terima kasih Kominfo! Pengalaman magang ini membuka wawasan dan relasi saya di dunia IT.",
  },
];

export default function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto text-center relative">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-gray-800 leading-tight">
          Dipercaya oleh Mahasiswa Terbaik <br />
          dari Berbagai Universitas
        </h2>

        <div className="relative">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="bg-white p-6 sm:p-8 rounded-[80px] shadow-xl flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10"
            >
              {/* Avatar */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-lg ring-4 ring-blue-200 shrink-0">
                <Image
                  src={testimonials[index].photo}
                  alt={testimonials[index].name}
                  fill
                  className="object-cover"
                />
                <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow">
                  “
                </div>
              </div>

              {/* Isi */}
              <div className="text-left max-w-md">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 italic">
                  {testimonials[index].quote}
                </p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">
                  {testimonials[index].name}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigasi */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden sm:block">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white shadow-md hover:bg-blue-100 text-xl transition"
              aria-label="Sebelumnya"
            >
              ←
            </button>
          </div>
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden sm:block">
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white shadow-md hover:bg-blue-100 text-xl transition"
              aria-label="Selanjutnya"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
