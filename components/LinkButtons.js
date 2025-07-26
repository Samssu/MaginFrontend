"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, ClipboardList, BookOpenCheck, Mail, Clock } from "lucide-react";

const cards = [
  {
    title: "Pemberitahuan",
    description:
      "Lihat pengumuman terbaru dan informasi penting selama program magang berlangsung.",
    icon: Mail,
    href: "/user/pemberitahuan",
  },
  {
    title: "Pendaftaran",
    description:
      "Lengkapi formulir pendaftaran magang secara online dan ikuti proses verifikasi.",
    icon: ClipboardList,
    href: "/user/pendaftaran",
  },
  {
    title: "Logbook",
    description:
      "Catat seluruh aktivitas harian selama magang, unggah dokumentasi, dan pantau progres.",
    icon: BookOpenCheck,
    href: "/user/logbook",
  },
  {
    title: "Notifikasi",
    description:
      "Dapatkan notifikasi real-time mengenai status pendaftaran dan aktivitas magang.",
    icon: Bell,
    href: "/user/pemberitahuan",
  },
  {
    title: "Coming Soon",
    description:
      "Fitur tambahan akan segera hadir untuk menunjang pengalaman magang lebih baik.",
    icon: Clock,
    href: "#",
  },
];

export default function BerandaCards() {
  const LogbookIcon = cards[2].icon;

  return (
    <section className="px-6 py-12 max-w-6xl mx-auto">
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Beranda
      </motion.h1>

      {/* Pemberitahuan & Pendaftaran */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.slice(0, 2).map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Link
                href={card.href}
                className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 flex items-center gap-5"
              >
                <div className="p-4 rounded-xl bg-blue-100 text-blue-600">
                  <Icon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Logbook */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-6"
      >
        <Link
          href={cards[2].href}
          className="block bg-blue-50 rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 flex items-center gap-5"
        >
          <div className="p-4 rounded-xl bg-blue-200 text-blue-700">
            <LogbookIcon size={32} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {cards[2].title}
            </h3>
            <p className="text-gray-700 text-sm">{cards[2].description}</p>
          </div>
        </Link>
      </motion.div>

      {/* Notifikasi & Coming Soon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {cards.slice(3).map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Link
                href={card.href}
                className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 flex items-center gap-5"
              >
                <div className="p-4 rounded-xl bg-blue-100 text-blue-600">
                  <Icon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
