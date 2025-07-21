"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import jwt from "jsonwebtoken";
import Navbar2 from "@/components/Navbar2";
import Image from "next/image";
import { motion } from "framer-motion";
import { Bell, X, MoreVertical } from "lucide-react";
import clsx from "clsx";

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

const initialNotifications = [
  {
    id: 1,
    title: "Verifikasi Berhasil",
    content: "Dokumen magangmu telah diverifikasi oleh admin.",
    date: "2025-07-20",
    read: false,
  },
  {
    id: 2,
    title: "Pengisian Logbook",
    content: "Jangan lupa isi logbook harian kamu sebelum pukul 17.00.",
    date: "2025-07-19",
    read: false,
  },
];

export default function UserDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded = jwt.decode(token);
      if (!decoded?.role || decoded.role !== "user") {
        router.push("/");
        return;
      }
      setAuthorized(true);
    } catch (error) {
      router.push("/");
    }
  }, [router]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setDropdownOpen(false);
  };

  const markAllAsUnread = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: false })));
    setDropdownOpen(false);
  };

  const openModal = (notif) => setSelectedNotif(notif);
  const closeModal = () => setSelectedNotif(null);

  if (!authorized) return null;

  return (
    <>
      <Head>
        <title>Dashboard Pengguna | Pendaftaran Magang Kominfo</title>
        <meta
          name="description"
          content="Dashboard pengguna untuk mengelola pendaftaran magang dan logbook kegiatan."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Navbar2 />

        {/* Hero */}
        <section className="relative min-h-[50vh] flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero.jpg"
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative z-10 px-6 sm:px-10 max-w-4xl mx-auto text-white">
            <motion.h1
              variants={fadeInVariant}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4"
            >
              Selamat Datang di Dashboard
            </motion.h1>
            <motion.p
              variants={fadeInVariant}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="text-lg sm:text-xl text-gray-200"
            >
              Kelola pendaftaran magang dan logbook kegiatanmu dengan mudah dan
              profesional.
            </motion.p>
          </div>
        </section>

        {/* Notifikasi */}
        {notifications.length > 0 && (
          <section className="py-14 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Pemberitahuan Terbaru
                  </h2>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md border z-50">
                      <button
                        onClick={markAllAsRead}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Tandai semua dibaca
                      </button>
                      <button
                        onClick={markAllAsUnread}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Tandai belum dibaca
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full bg-white divide-y divide-gray-200">
                  <thead className="bg-gray-50 text-sm font-semibold text-gray-600 uppercase">
                    <tr>
                      <th className="px-6 py-4 text-left">Tanggal</th>
                      <th className="px-6 py-4 text-left">Judul</th>
                      <th className="px-6 py-4 text-left">Isi</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {notifications.map((notif) => (
                      <tr
                        key={notif.id}
                        className={clsx(
                          "hover:bg-gray-50 cursor-pointer",
                          notif.read ? "text-gray-500" : "font-semibold"
                        )}
                        onClick={() => openModal(notif)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {notif.date}
                        </td>
                        <td className="px-6 py-4">{notif.title}</td>
                        <td className="px-6 py-4 truncate">{notif.content}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Pop-up Notifikasi */}
        {selectedNotif && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="relative w-full max-w-xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedNotif.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{selectedNotif.date}</p>
              <p className="text-gray-800 text-base">{selectedNotif.content}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
