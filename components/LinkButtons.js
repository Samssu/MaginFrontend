"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FilePlus2, BookOpenCheck, History, Bell } from "lucide-react";

export default function LinkButtons() {
  return (
    <div className="w-full flex flex-col md:flex-row justify-center items-center gap-6 mt-12 px-4 flex-wrap">
      {/* Tombol Daftar Magang */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full sm:w-64"
      >
        <Link
          href="/user/pendaftaran"
          className="block bg-blue-600 text-white text-center py-4 px-6 rounded-2xl shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-2 text-lg font-semibold">
            <FilePlus2 size={24} />
            Daftar Magang
          </div>
        </Link>
      </motion.div>

      {/* Tombol LogBook Magang */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full sm:w-64"
      >
        <Link
          href="/user/logbook"
          className="block bg-green-600 text-white text-center py-4 px-6 rounded-2xl shadow-lg hover:bg-green-700 transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-2 text-lg font-semibold">
            <BookOpenCheck size={24} />
            LogBook Magang
          </div>
        </Link>
      </motion.div>

      {/* Tombol Riwayat */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full sm:w-64"
      >
        <Link
          href="/user/riwayat"
          className="block bg-yellow-500 text-white text-center py-4 px-6 rounded-2xl shadow-lg hover:bg-yellow-600 transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-2 text-lg font-semibold">
            <History size={24} />
            Riwayat
          </div>
        </Link>
      </motion.div>

      {/* Tombol Pemberitahuan */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full sm:w-64"
      >
        <Link
          href="/user/pemberitahuan"
          className="block bg-purple-600 text-white text-center py-4 px-6 rounded-2xl shadow-lg hover:bg-purple-700 transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-2 text-lg font-semibold">
            <Bell size={24} />
            Pemberitahuan
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
