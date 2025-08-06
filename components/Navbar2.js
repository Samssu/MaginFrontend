"use client";

import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaLaptopCode,
  FaNetworkWired,
  FaBook,
  FaCogs,
  FaCamera,
  FaDatabase,
  FaChartPie,
  FaServer,
  FaDesktop,
  FaFileAlt,
} from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [navbarStyle, setNavbarStyle] = useState("bg-transparent text-white");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [statusMagang, setStatusMagang] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const profilePicture = user?.profilePicture || "/images/Profile-Blank.jpg";

  const jurusanList = [
    "Teknik Informatika",
    "Sistem Informasi",
    "Ilmu Komputer",
    "Teknologi Informasi",
    "Manajemen Informatika",
    "Teknik Komputer",
    "Rekayasa Perangkat Lunak",
    "Jaringan Komputer",
    "Multimedia",
    "Komputer Akuntansi",
  ];

  const getIconForJurusan = (jurusan) => {
    const mapping = {
      "Teknik Informatika": <FaLaptopCode className="text-black" />,
      "Sistem Informasi": <FaDatabase className="text-black" />,
      "Ilmu Komputer": <FaServer className="text-black" />,
      "Teknologi Informasi": <FaCogs className="text-black" />,
      "Manajemen Informatika": <FaChartPie className="text-black" />,
      "Teknik Komputer": <FaDesktop className="text-black" />,
      "Rekayasa Perangkat Lunak": <FaLaptopCode className="text-black" />,
      "Jaringan Komputer": <FaNetworkWired className="text-black" />,
      Multimedia: <FaCamera className="text-black" />,
      "Komputer Akuntansi": <FaFileAlt className="text-black" />,
    };

    return mapping[jurusan] || <FaBook className="text-black" />;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.innerWidth >= 768) {
        setNavbarStyle(
          window.scrollY > 50
            ? "bg-white text-black shadow-md"
            : "bg-transparent text-white"
        );
      }
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setNavbarStyle("bg-white text-black");
    }
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user?.email) return;

      if (user?.role === "admin") {
        setStatusMagang({
          text: "Admin Maha Kuasa",
          class: "text-purple-600 font-bold",
        });
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/pendaftaran");
        const data = await res.json();
        const dataUser = data.find((item) => item.email === user.email);

        if (dataUser) {
          let statusText = "Belum Terdaftar";
          let statusClass = "text-red-600";

          if (dataUser.status === "disetujui") {
            statusText = "Terdaftar";
            statusClass = "text-green-600";
          } else if (dataUser.status === "ditolak") {
            statusText = "Ditolak";
            statusClass = "text-red-600";
          } else if (dataUser.status === "perbaiki") {
            statusText = "Perlu Perbaikan";
            statusClass = "text-yellow-600";
          } else if (dataUser.status === "pending") {
            statusText = "Menunggu Review";
            statusClass = "text-blue-600";
          }

          setStatusMagang({ text: statusText, class: statusClass });
        } else {
          setStatusMagang({ text: "Belum Terdaftar", class: "text-red-600" });
        }
      } catch (err) {
        console.error("Gagal mengambil status pendaftaran:", err);
      }
    };

    fetchStatus();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsLoggedIn(false);
    setUser(null);
    setShowProfileMenu(false);
    setShowLogoutConfirm(false);
    toast.success("Berhasil logout!", {
      position: "bottom-right",
      autoClose: 3000,
    });
    router.push("/login");
  };

  const handleLogbookClick = () => {
    if (!isLoggedIn) {
      toast.warn("Silakan login terlebih dahulu", {
        position: "bottom-right",
      });
      return;
    }

    if (statusMagang?.text !== "Terdaftar") {
      toast.error("Hanya peserta yang sudah terdaftar bisa mengakses Logbook", {
        position: "bottom-right",
      });
      return;
    }

    router.push("/user/logbook");
  };

  const renderJurusanButtons = () => {
    const half = Math.ceil(jurusanList.length / 2);
    const leftColumn = jurusanList.slice(0, half);
    const rightColumn = jurusanList.slice(half);

    const renderColumn = (items) =>
      items.map((jurusan, index) => {
        const slug = jurusan.toLowerCase().replace(/\s+/g, "-");
        return (
          <button
            key={index}
            onClick={() => {
              router.push(`/program-magang/${slug}`);
              setIsOpen(false);
              setShowDropdown(false);
            }}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-black w-full text-left transition duration-200 rounded-md"
          >
            {getIconForJurusan(jurusan)}
            <span>{jurusan}</span>
          </button>
        );
      });

    return (
      <div className="grid grid-cols-2 gap-x-2">
        <div>{renderColumn(leftColumn)}</div>
        <div>{renderColumn(rightColumn)}</div>
      </div>
    );
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${navbarStyle}`}
    >
      {/* Desktop View */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center py-4 px-6">
        <h1
          onClick={() => router.push("/user/dashboard")}
          className="text-2xl font-bold cursor-pointer hover:text-blue-500"
        >
          Magin
        </h1>

        <div className="flex space-x-8 items-center">
          <button
            onClick={() => router.push("/user/dashboard")}
            className="hover:text-blue-500"
          >
            Beranda
          </button>

          <div className="relative">
            <button
              className="hover:text-blue-500 flex items-center gap-1"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Daftar Jurusan Tersedia ▾
            </button>
            {showDropdown && (
              <div
                className="absolute top-full mt-2 bg-white text-black shadow-2xl rounded-xl w-[28rem] z-50 overflow-hidden py-4 px-3"
                onMouseLeave={() => setShowDropdown(false)}
              >
                {renderJurusanButtons()}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              isLoggedIn
                ? router.push("/user/pendaftaran")
                : toast.warn("Silakan login terlebih dahulu", {
                    position: "bottom-right",
                  });
            }}
            className={`hover:text-blue-500 ${
              !isLoggedIn && "opacity-50 cursor-not-allowed"
            }`}
          >
            Pendaftaran
          </button>

          <button
            onClick={handleLogbookClick}
            className={`hover:text-blue-500 ${
              !isLoggedIn || statusMagang?.text !== "Terdaftar"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Logbook
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <div className="relative">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                />

                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 w-64 bg-white text-black border rounded-md shadow-lg z-50"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold">
                        Hi, {user?.name || "User"}
                        {user?.role === "admin" && (
                          <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            Admin
                          </span>
                        )}
                        {user?.role === "pembimbing" && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Pembimbing
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="mt-2 text-sm">
                        Status:
                        <span
                          className={`ml-2 font-medium ${
                            statusMagang?.class || "text-red-600"
                          }`}
                        >
                          {user?.role === "admin"
                            ? "👑 Admin Maha Kuasa"
                            : user?.role === "pembimbing"
                            ? "🔵 Pembimbing"
                            : statusMagang?.text === "Terdaftar"
                            ? "🟢 Terdaftar"
                            : "🔴 Belum Terdaftar"}
                        </span>
                      </p>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => {
                          router.push(
                            user?.role === "admin"
                              ? "/Admin/dashboard"
                              : user?.role === "pembimbing"
                              ? "/Pembimbing/dashboard"
                              : "/user/dashboard"
                          );
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {user?.role === "admin"
                          ? "Admin Dashboard"
                          : user?.role === "pembimbing"
                          ? "Dashboard Pembimbing"
                          : "User Dashboard"}
                      </button>
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Masuk
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Daftar
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex justify-between items-center py-4 px-6">
        <h1
          onClick={() => router.push("/user/dashboard")}
          className="text-2xl font-bold cursor-pointer hover:text-blue-500"
        >
          Magin
        </h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white text-black py-4 shadow-md flex flex-col items-center space-y-4">
          <button
            onClick={() => {
              router.push("/user/dashboard");
              setIsOpen(false);
            }}
            className="hover:text-blue-500"
          >
            Beranda
          </button>

          <div className="w-full text-center">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="hover:text-blue-500"
            >
              Daftar Jurusan Tersedia ▾
            </button>
            {showDropdown && (
              <div className="absolute top-full mt-2 bg-gray-900 text-white shadow-2xl rounded-xl w-[28rem] z-50 overflow-hidden py-4 px-3">
                {renderJurusanButtons()}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              router.push("/user/pendaftaran");
              setIsOpen(false);
            }}
            className="hover:text-blue-500"
          >
            Pendaftaran
          </button>

          <button
            onClick={() => {
              if (!isLoggedIn) {
                toast.warn("Silakan login terlebih dahulu", {
                  position: "bottom-right",
                });
                return;
              }
              if (statusMagang?.text !== "Terdaftar") {
                toast.error(
                  "Hanya peserta yang sudah terdaftar bisa mengakses Logbook",
                  {
                    position: "bottom-right",
                  }
                );
                return;
              }
              router.push("/user/logbook");
              setIsOpen(false);
            }}
            className={`hover:text-blue-500 ${
              !isLoggedIn || statusMagang?.text !== "Terdaftar"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Logbook
          </button>

          {isLoggedIn ? (
            <div className="flex flex-col items-center space-y-2">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p>
                {user?.name}
                {user?.role === "admin" && (
                  <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
                {user?.role === "pembimbing" && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Pembimbing
                  </span>
                )}
              </p>
              <button
                onClick={() => {
                  router.push(
                    user?.role === "admin"
                      ? "/admin/dashboard"
                      : user?.role === "pembimbing"
                      ? "/Pembimbing/dashboard"
                      : "/user/dashboard"
                  );
                  setIsOpen(false);
                }}
                className="hover:text-blue-500"
              >
                {user?.role === "admin"
                  ? "Admin Dashboard"
                  : user?.role === "pembimbing"
                  ? "Dashboard Pembimbing"
                  : "User Dashboard"}
              </button>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      )}

      {showLogoutConfirm && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-80 text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h3 className="text-lg font-semibold text-black">
              Apakah Anda yakin ingin keluar?
            </h3>
            <div className="mt-4 space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Ya, Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </nav>
  );
}
