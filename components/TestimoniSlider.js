// components/TestimonialSection.js
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { KanbanSquare, Users2, Database } from "lucide-react";

const testimonials = [
  {
    name: "Rizky Ananda",
    photo: "/images/pasfoto1.png",
    quote:
      "Magang ini benar-benar membuka mata saya terhadap dunia kerja. Dari teori di kampus ke praktik nyata, semuanya terasa menantang dan menyenangkan.",
  },
  {
    name: "Dewi Lestari",
    photo: "/images/pasfoto2.jpg",
    quote:
      "Saya berkesempatan terlibat dalam proyek-proyek besar dan belajar langsung dari mentor yang luar biasa. Pengalaman ini sangat berharga sebelum saya lulus.",
  },
  {
    name: "Arif Budiman",
    photo: "/images/pasfoto3.jpg",
    quote:
      "Di tempat magang ini, saya merasa benar-benar dilibatkan dan dihargai. Setiap hari membawa pengalaman baru yang memperkaya perspektif saya.",
  },
];

const features = [
  {
    name: "Manajemen Proyek",
    Icon: KanbanSquare,
    result: "Berhasil 98%",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Manajemen Tim",
    Icon: Users2,
    result: "Berhasil 95%",
    color: "bg-green-100 text-green-700",
  },
  {
    name: "Penyimpanan Aman",
    Icon: Database,
    result: "Berhasil 97%",
    color: "bg-purple-100 text-purple-700",
  },
];

export default function TestimonialSection() {
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
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 100 : -100 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -100 : 100 }),
  };

  return (
    <section className="relative py-14 px-4 sm:px-8 text-center overflow-hidden">
      {/* Background Image */}
      {/* Background Icon Besar */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 opacity-20">
        <Image
          src="/images/dunia.jpg"
          alt="Decorative background"
          width={1000}
          height={500}
          className="object-contain"
          priority
        />
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-12 relative z-10">
        Dipercaya oleh banyak orang
      </h2>

      {/* Testimoni Carousel */}
      <div className="max-w-3xl mx-auto relative mb-16 z-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-md">
              <Image
                src={testimonials[index].photo}
                alt={testimonials[index].name}
                fill
                className="object-cover"
                sizes="96px"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white text-2xl rounded-full flex items-center justify-center">
                ”
              </div>
            </div>

            <p className="text-base sm:text-lg text-gray-700 max-w-xl leading-relaxed italic">
              "{testimonials[index].quote}"
            </p>
            <p className="text-lg font-bold text-gray-900">
              {testimonials[index].name}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigasi */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <button
            onClick={prev}
            className="w-8 h-8 bg-white shadow rounded-full hover:bg-blue-100 transition"
            aria-label="Prev"
          >
            ←
          </button>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <button
            onClick={next}
            className="w-8 h-8 bg-white shadow rounded-full hover:bg-blue-100 transition"
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>

      {/* Feature Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col items-center"
          >
            <div
              className={`w-10 h-10 mb-3 flex items-center justify-center rounded-full ${feature.color}`}
            >
              <feature.Icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-gray-800 mb-1">
              {feature.name}
            </p>
            <p className="text-base font-bold">{feature.result}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
