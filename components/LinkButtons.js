"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, ClipboardList, BookOpenCheck, Mail, Clock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

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
    title: "Riwayat",
    description: "Lihat status pendaftaran dan aktivitas magang terbaru.",
    icon: Bell,
    href: "/user/riwayat",
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
  const [statusMagang, setStatusMagang] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [hasNewPendaftaran, setHasNewPendaftaran] = useState(false);
  const LogbookIcon = cards[2].icon;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchStatusMagang();
      checkFirstTimePendaftaran();
    }
  }, []);

  const checkFirstTimePendaftaran = () => {
    const hasAccessedBefore = localStorage.getItem("hasAccessedPendaftaran");
    if (!hasAccessedBefore) {
      setHasNewPendaftaran(true);
    }
  };

  const fetchStatusMagang = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.email) return;

      const res = await fetch("http://localhost:5000/api/pendaftaran", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const dataUser = data.find((item) => item.email === user.email);

      if (dataUser) {
        let statusText = "Belum Terdaftar";
        let statusClass = "text-red-600";
        let isNewStatus = false;

        if (dataUser.status === "disetujui") {
          statusText = "Terdaftar";
          statusClass = "text-green-600";
          isNewStatus = checkNewStatus(statusText);
        } else if (dataUser.status === "ditolak") {
          statusText = "Ditolak";
          statusClass = "text-red-600";
          isNewStatus = checkNewStatus(statusText);
        } else if (dataUser.status === "perbaiki") {
          statusText = "Perlu Perbaikan";
          statusClass = "text-yellow-600";
          isNewStatus = checkNewStatus(statusText);
        } else if (dataUser.status === "pending") {
          statusText = "Menunggu Review";
          statusClass = "text-blue-600";
          isNewStatus = checkNewStatus(statusText);
        }

        setStatusMagang({ text: statusText, class: statusClass });
        setHasNewNotification(isNewStatus);
      } else {
        const newStatus = "Belum Terdaftar";
        setStatusMagang({ text: newStatus, class: "text-red-600" });
        setHasNewNotification(checkNewStatus(newStatus));
      }
    } catch (err) {
      console.error("Gagal mengambil status pendaftaran:", err);
    }
  };

  const checkNewStatus = (currentStatus) => {
    const lastSeenStatus = localStorage.getItem("lastSeenStatus");
    return currentStatus !== lastSeenStatus;
  };

  const handleLogbookClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.warn("Silakan login terlebih dahulu", {
        position: "bottom-right",
      });
      return;
    }

    if (statusMagang?.text !== "Terdaftar") {
      e.preventDefault();
      toast.error("Hanya peserta yang sudah terdaftar bisa mengakses Logbook", {
        position: "bottom-right",
      });
      return;
    }
  };

  const handleRiwayatClick = () => {
    if (statusMagang?.text) {
      localStorage.setItem("lastSeenStatus", statusMagang.text);
      setHasNewNotification(false);
    }
  };

  const handlePendaftaranClick = () => {
    localStorage.setItem("hasAccessedPendaftaran", "true");
    setHasNewPendaftaran(false);
  };

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
        {/* Pemberitahuan Card */}
        {cards.slice(0, 1).map((card, idx) => {
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

        {/* Pendaftaran Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative"
        >
          <Link
            href="/user/pendaftaran"
            onClick={handlePendaftaranClick}
            className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 flex items-center gap-5"
          >
            {/* Notification Badge */}
            {hasNewPendaftaran && (
              <>
                <span className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-red-500 animate-ping"></span>
                <span className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-red-500"></span>
              </>
            )}

            <div className="p-4 rounded-xl bg-blue-100 text-blue-600">
              <ClipboardList size={32} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Pendaftaran
              </h3>
              <p className="text-gray-600 text-sm">
                Lengkapi formulir pendaftaran magang secara online dan ikuti
                proses verifikasi.
              </p>
              {hasNewPendaftaran && (
                <p className="text-xs text-red-500 mt-2">
                  *Silakan lengkapi formulir pendaftaran
                </p>
              )}
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Logbook */}
      <motion.div
        whileHover={{ scale: statusMagang?.text === "Terdaftar" ? 1.02 : 1 }}
        whileTap={{ scale: statusMagang?.text === "Terdaftar" ? 0.98 : 1 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-6"
      >
        <Link
          href={statusMagang?.text === "Terdaftar" ? cards[2].href : "#"}
          onClick={handleLogbookClick}
          className={`block ${
            statusMagang?.text === "Terdaftar"
              ? "bg-blue-50 hover:shadow-xl"
              : "bg-gray-100 cursor-not-allowed"
          } rounded-2xl shadow-md transition duration-300 p-6 flex items-center gap-5`}
        >
          <div
            className={`p-4 rounded-xl ${
              statusMagang?.text === "Terdaftar"
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            <LogbookIcon size={32} />
          </div>
          <div>
            <h3
              className={`text-xl font-semibold ${
                statusMagang?.text === "Terdaftar"
                  ? "text-gray-900"
                  : "text-gray-500"
              } mb-1`}
            >
              {cards[2].title}
            </h3>
            <p
              className={`text-sm ${
                statusMagang?.text === "Terdaftar"
                  ? "text-gray-700"
                  : "text-gray-500"
              }`}
            >
              {cards[2].description}
            </p>
            {statusMagang?.text !== "Terdaftar" && (
              <p className="text-xs text-red-500 mt-2">
                *Hanya tersedia untuk peserta yang sudah terdaftar
              </p>
            )}
          </div>
        </Link>
      </motion.div>

      {/* Riwayat & Coming Soon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Riwayat Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          <Link
            href="/user/riwayat"
            onClick={handleRiwayatClick}
            className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 flex items-center gap-5"
          >
            {/* Notification Badge */}
            {hasNewNotification && (
              <>
                <span className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-red-500 animate-ping"></span>
                <span className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-red-500"></span>
              </>
            )}

            <div className="p-4 rounded-xl bg-blue-100 text-blue-600">
              <Bell size={32} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Riwayat
              </h3>
              <p className="text-gray-600 text-sm">
                Lihat status pendaftaran dan aktivitas magang terbaru.
              </p>
              {statusMagang && (
                <div className="mt-2 flex items-center">
                  <span className={`text-sm font-medium ${statusMagang.class}`}>
                    Status: {statusMagang.text}
                  </span>
                  {hasNewNotification && (
                    <span className="ml-2 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </div>
              )}
            </div>
          </Link>
        </motion.div>

        {/* Coming Soon Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <button
            onClick={() =>
              toast.warn("Fitur belum tersedia", {
                style: {
                  background: "#FFF3CD",
                  color: "#856404",
                  border: "1px solid #FFECB5",
                  borderRadius: "10px",
                },
                icon: "🛠️",
              })
            }
            className="w-full text-left bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 flex items-center gap-5"
          >
            <div className="p-4 rounded-xl bg-blue-100 text-blue-600">
              <Clock size={32} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Coming Soon
              </h3>
              <p className="text-gray-600 text-sm">
                Fitur tambahan akan segera hadir untuk menunjang pengalaman
                magang lebih baik.
              </p>
            </div>
          </button>
        </motion.div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </section>
  );
}
