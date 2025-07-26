"use client";

import {
  Laptop,
  Database,
  Cpu,
  Server,
  BarChart2,
  Monitor,
  Code2,
  Wifi,
  Camera,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

const jurusan = [
  { name: "Teknik Informatika", icon: Laptop },
  { name: "Sistem Informasi", icon: Database },
  { name: "Ilmu Komputer", icon: Cpu },
  { name: "Teknologi Informasi", icon: Server },
  { name: "Manajemen Informatika", icon: BarChart2 },
  { name: "Teknik Komputer", icon: Monitor },
  { name: "Rekayasa Perangkat Lunak", icon: Code2 },
  { name: "Jaringan Komputer", icon: Wifi },
  { name: "Multimedia", icon: Camera },
  { name: "Komputer Akuntansi", icon: FileText },
];

// Framer Motion Animation
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function JurusanKominfo() {
  return (
    <section className="bg-[#1E2235] text-white py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-16">
          Jurusan yang Diterima di Kominfo
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }} // animasi saat masuk 20% ke layar
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {jurusan.map(({ name, icon: Icon }, index) => {
            const isLastColumn = (index + 1) % 5 === 0;
            const isLastRow = index >= jurusan.length - 5;

            return (
              <motion.div
                variants={item}
                key={index}
                className={`group flex flex-col items-center justify-center gap-4 aspect-square border-white/20 
                  ${isLastColumn ? "" : "border-r"} 
                  ${isLastRow ? "" : "border-b"}`}
              >
                <Icon className="w-12 h-12 sm:w-14 sm:h-14 text-white transition-transform duration-300 group-hover:scale-110" />
                <p className="text-base sm:text-lg font-semibold transition-all duration-300 group-hover:text-blue-400 group-hover:translate-y-1">
                  {name}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
