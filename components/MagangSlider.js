"use client";

import {
  Laptop,
  Database,
  Cpu,
  Server,
  BarChart2,
  Monitor,
  Code2,
  PieChart,
  Wifi,
  Shield,
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
  { name: "Sains Data", icon: PieChart },
  { name: "Jaringan Komputer", icon: Wifi },
  { name: "Keamanan Siber", icon: Shield },
  { name: "Multimedia", icon: Camera },
  { name: "Komputer Akuntansi", icon: FileText },
];

// Animation variants
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function JurusanKominfo() {
  return (
    <section className="bg-[#1E2235] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          Jurusan yang Diterima di Kominfo
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8"
        >
          {jurusan.map((itemData, index) => {
            const Icon = itemData.icon;
            return (
              <motion.div
                variants={item}
                key={index}
                className="flex flex-col items-center justify-center gap-4 px-4 py-6 bg-white/5 rounded-lg hover:bg-white/10 transition"
              >
                <Icon className="w-10 h-10 text-white" />
                <p className="text-sm text-center font-semibold">
                  {itemData.name}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
