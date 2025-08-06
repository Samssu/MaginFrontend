"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import jwt from "jsonwebtoken";
import Navbar2 from "@/components/Navbar2";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  AlertTriangle,
  PartyPopper,
} from "lucide-react";
import clsx from "clsx";

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

const notificationTypes = {
  welcome: {
    icon: <Mail className="text-blue-500" size={20} />,
    bgColor: "bg-blue-50",
  },
  verification: {
    icon: <UserCheck className="text-yellow-500" size={20} />,
    bgColor: "bg-yellow-50",
  },
  rejected: {
    icon: <UserX className="text-red-500" size={20} />,
    bgColor: "bg-red-50",
  },
  need_correction: {
    icon: <AlertTriangle className="text-orange-500" size={20} />,
    bgColor: "bg-orange-50",
  },
  accepted: {
    icon: <PartyPopper className="text-green-500" size={20} />,
    bgColor: "bg-green-50",
  },
  info: {
    icon: <Mail className="text-blue-500" size={20} />,
    bgColor: "bg-blue-50",
  },
};

// Initial notifications including registration status updates
const getInitialNotifications = (userStatus) => {
  const baseNotifications = [
    {
      id: 1,
      title: "Selamat Datang",
      content:
        "Selamat Anda telah mendaftar akun di sistem magang. Silakan lengkapi profil dan dokumen pendaftaran Anda.",
      date: new Date().toISOString().split("T")[0],
      read: false,
      type: "welcome",
    },
  ];

  // Menambahkan pemberitahuan sesuai status pendaftaran
  if (userStatus) {
    let statusNotification;
    const today = new Date().toISOString().split("T")[0];

    switch (userStatus) {
      case "pending":
        statusNotification = {
          id: 2,
          title: "Pendaftaran Terkirim",
          content:
            "Pendaftaran Anda telah terkirim. Silakan tunggu konfirmasi lebih lanjut.",
          date: today,
          read: false,
          type: "verification",
        };
        break;
      case "ditolak":
        statusNotification = {
          id: 3,
          title: "Pendaftaran Ditolak",
          content:
            "Pendaftaran Anda ditolak. Silakan cek riwayat dan perbaiki data yang diperlukan.",
          date: today,
          read: false,
          type: "rejected",
          action: {
            label: "Perbaiki Pendaftaran",
            onClick: () => console.log("Navigate to registration form"),
          },
        };
        break;
      case "perbaiki":
        statusNotification = {
          id: 4,
          title: "Pendaftaran Perlu Perbaikan",
          content:
            "Pendaftaran Anda perlu diperbaiki. Silakan cek riwayat untuk memperbaiki data yang diperlukan.",
          date: today,
          read: false,
          type: "need_correction",
          action: {
            label: "Perbaiki Pendaftaran",
            onClick: () => console.log("Navigate to registration form"),
          },
        };
        break;
      case "disetujui":
        statusNotification = {
          id: 5,
          title: "Selamat! Pendaftaran Diterima",
          content:
            "Pendaftaran Anda telah disetujui! Selamat bergabung dalam program magang Kominfo.",
          date: today,
          read: false,
          type: "accepted",
          action: {
            label: "Lihat Panduan",
            onClick: () => console.log("Navigate to guide"),
          },
        };
        break;
      default:
        return baseNotifications;
    }

    return [...baseNotifications, statusNotification];
  }

  return baseNotifications;
};

export default function UserDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [userStatus, setUserStatus] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const checkAuth = async () => {
      try {
        const decoded = jwt.decode(token);
        if (!decoded?.role || decoded.role !== "user") {
          router.push("/");
          return;
        }

        // Fetch user status from API
        const res = await fetch(
          "http://localhost:5000/api/pendaftaran/status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setUserStatus(data.status);
          setNotifications(getInitialNotifications(data.status));
        } else {
          setNotifications(getInitialNotifications());
        }

        setAuthorized(true);
      } catch (error) {
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setDropdownOpen(false);
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const closeModal = () => {
    setSelectedNotif(null);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!authorized) return null;

  return (
    <>
      <Head>
        <title>Pemberitahuan | Pendaftaran Magang Kominfo</title>
        <meta
          name="description"
          content="Dashboard pengguna untuk mengelola pendaftaran magang dan logbook kegiatan."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar2 />

        {/* Hero Section */}
        <section className="relative min-h-[40vh] flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/bggallery.png"
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
              Pemberitahuan
            </motion.h1>
            <motion.p
              variants={fadeInVariant}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto"
            >
              {unreadCount > 0
                ? `Anda memiliki ${unreadCount} pemberitahuan belum dibaca`
                : "Tidak ada pemberitahuan baru"}
            </motion.p>
          </div>

          {/* Animated Wave */}
          <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
            <svg
              viewBox="0 0 1440 320"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="w-full h-24 sm:h-32"
            >
              <path fill="#ffffff">
                <animate
                  attributeName="d"
                  dur="6s"
                  repeatCount="indefinite"
                  values="
                    M0,160 C320,280 1120,40 1440,160 L1440,320 L0,320 Z;
                    M0,180 C400,40 1040,280 1440,140 L1440,320 L0,320 Z;
                    M0,140 C380,300 1080,60 1440,180 L1440,320 L0,320 Z;
                    M0,160 C320,280 1120,40 1440,160 L1440,320 L0,320 Z
                  "
                />
              </path>
            </svg>
          </div>
        </section>

        {/* Notification Section */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex items-center gap-3">
                <Bell className="text-indigo-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">
                  Pemberitahuan Anda
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {unreadCount} baru
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  >
                    <option value="all">Semua</option>
                    <option value="unread">Belum dibaca</option>
                    <option value="read">Sudah dibaca</option>
                  </select>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 border border-gray-200"
                  >
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50"
                    >
                      <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        <CheckCircle size={16} />
                        Tandai semua dibaca
                      </button>
                      <button
                        onClick={() => {
                          if (selectedNotif) {
                            deleteNotification(selectedNotif.id);
                            setSelectedNotif(null);
                          }
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                      >
                        <X size={16} />
                        Hapus pemberitahuan
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  Tidak ada pemberitahuan
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === "unread"
                    ? "Tidak ada pemberitahuan belum dibaca"
                    : filter === "read"
                    ? "Tidak ada pemberitahuan yang sudah dibaca"
                    : "Anda belum memiliki pemberitahuan"}
                </p>
              </motion.div>
            ) : (
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
                className="space-y-3"
              >
                {filteredNotifications.map((notif) => (
                  <motion.li
                    key={notif.id}
                    variants={fadeInVariant}
                    className={clsx(
                      "rounded-lg border overflow-hidden transition-all duration-200",
                      notif.read
                        ? "border-gray-200 bg-white"
                        : "border-indigo-200 bg-indigo-50",
                      notificationTypes[notif.type]?.bgColor
                    )}
                  >
                    <button
                      onClick={() => {
                        setSelectedNotif(notif);
                        markAsRead(notif.id);
                      }}
                      className="w-full text-left p-4 flex items-start gap-4"
                    >
                      <div className="flex-shrink-0 pt-1">
                        {notificationTypes[notif.type]?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3
                            className={clsx(
                              "text-base font-medium truncate",
                              notif.read ? "text-gray-700" : "text-gray-900"
                            )}
                          >
                            {notif.title}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {notif.date}
                          </span>
                        </div>
                        <p
                          className={clsx(
                            "mt-1 text-sm",
                            notif.read ? "text-gray-500" : "text-gray-700"
                          )}
                        >
                          {notif.content}
                        </p>
                      </div>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>
        </section>

        {/* Notification Detail Modal */}
        <AnimatePresence>
          {selectedNotif && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {notificationTypes[selectedNotif.type]?.icon}
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedNotif.title}
                      </h3>
                    </div>
                    <button
                      onClick={closeModal}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={16} />
                    <span>{selectedNotif.date}</span>
                  </div>

                  <div className="mt-4 text-gray-700">
                    <p>{selectedNotif.content}</p>
                  </div>

                  {selectedNotif.action && (
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          selectedNotif.action.onClick();
                          closeModal();
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        {selectedNotif.action.label}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
