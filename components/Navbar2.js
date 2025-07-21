"use client";

import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [navbarStyle, setNavbarStyle] = useState("bg-transparent text-white");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [statusMagang, setStatusMagang] = useState(null);
  const router = useRouter();

  const profilePicture = user?.profilePicture || "/images/kokomi.png";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);

  // ✅ Scroll only affects desktop navbar
  useEffect(() => {
    const controlNavbar = () => {
      if (window.innerWidth >= 768) {
        if (window.scrollY > 50) {
          setNavbarStyle("bg-white text-black shadow-md");
        } else {
          setNavbarStyle("bg-transparent text-white");
        }
      }
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  // ✅ Atur default style untuk mobile (selalu putih)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setNavbarStyle("bg-white text-black");
    }
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch("http://localhost:5000/api/pendaftaran");
        const data = await res.json();
        const dataUser = data.find((item) => item.email === user.email);
        setStatusMagang(dataUser ? dataUser.status : "belum_mendaftar");
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

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${navbarStyle}`}
    >
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center py-4 px-6">
        <h1
          onClick={() => router.push("/user/dashboard")}
          className="text-2xl font-bold cursor-pointer hover:text-blue-500"
        >
          Magin
        </h1>

        <div className="flex space-x-8">
          <button
            onClick={() => router.push("/user/dashboard")}
            className="hover:text-blue-500"
          >
            Beranda
          </button>
          <button
            onClick={() => router.push("/user/pendaftaran")}
            className="hover:text-blue-500"
          >
            Program Magang
          </button>
          <button
            onClick={() => router.push("/user/pendaftaran")}
            className="hover:text-blue-500"
          >
            Tentang Kami
          </button>
          <button
            onClick={() => {
              if (isLoggedIn) {
                router.push("/user/pendaftaran");
              } else {
                toast.warn("Silakan login terlebih dahulu");
              }
            }}
            className={`hover:text-blue-500 ${
              !isLoggedIn && "opacity-50 cursor-not-allowed"
            }`}
          >
            Pendaftaran
          </button>

          <button
            onClick={() => {
              if (isLoggedIn) {
                router.push("/user/logbook");
              } else {
                toast.warn("Silakan login terlebih dahulu");
              }
            }}
            className={`hover:text-blue-500 ${
              !isLoggedIn && "opacity-50 cursor-not-allowed"
            }`}
          >
            Logbook
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full aspect-square object-cover cursor-pointer"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              />
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full mt-2 right-0 w-64 bg-white text-black border rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold">Hi, {user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs font-medium">Status:</span>
                      {statusMagang === "disetujui" ? (
                        <span className="text-green-600 text-sm font-semibold">
                          🟢 Terdaftar
                        </span>
                      ) : (
                        <span className="text-red-600 text-sm font-semibold">
                          🔴 Belum Terdaftar
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => router.push("/user/dashboard")}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => router.push("/profile/edit")}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
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

      {/* Mobile */}
      <div className="md:hidden flex justify-between items-center py-4 px-6">
        <h1
          onClick={() => router.push("/user/dashboard")}
          className="text-2xl font-bold cursor-pointer hover:text-blue-500"
        >
          Magin
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl focus:outline-none"
        >
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
              router.push("/user/logbook");
              setIsOpen(false);
            }}
            className="hover:text-blue-500"
          >
            Logbook
          </button>

          {isLoggedIn ? (
            <div className="flex flex-col items-center space-y-2">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full aspect-square object-cover cursor-pointer"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              />
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white w-64 rounded-lg shadow-lg p-4 text-left border"
                >
                  <p className="text-sm font-semibold">Hi, {user?.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{user?.email}</p>
                  <button
                    onClick={() => router.push("/user/dashboard")}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => router.push("/profile/edit")}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="block w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
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

      {/* Logout Modal */}
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
