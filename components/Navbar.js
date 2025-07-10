"use client";

import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarStyle, setNavbarStyle] = useState("bg-transparent text-white");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();

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
      if (window.scrollY > 50) {
        setNavbarStyle("bg-white text-black shadow-md");
      } else {
        setNavbarStyle("bg-transparent text-white");
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const handleScroll = (id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

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

  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);
  const confirmLogout = () => setShowLogoutConfirm(true);
  const cancelLogout = () => setShowLogoutConfirm(false);
  const profilePicture = user?.profilePicture || "/images/kokomi.png";

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${navbarStyle}`}
    >
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center py-4 px-6 w-full">
        <h1
          onClick={() => handleScroll("#home")}
          className="text-2xl sm:text-3xl font-bold cursor-pointer hover:text-blue-500 transition"
        >
          Magin
        </h1>

        <div className="flex space-x-8">
          <button
            onClick={() => handleScroll("#home")}
            className="hover:text-blue-500"
          >
            Beranda
          </button>
          <button
            onClick={() => handleScroll("#about")}
            className="hover:text-blue-500"
          >
            Tentang Kami
          </button>
          <button
            onClick={() => handleScroll("#program")}
            className="hover:text-blue-500"
          >
            Program Magang
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={toggleProfileMenu}
              />
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full mt-2 right-0 w-64 bg-white border rounded-lg shadow-xl z-50 overflow-hidden text-black"
                >
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold">
                      {user?.name || "Pengguna"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || "email@example.com"}
                    </p>
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
                      onClick={confirmLogout}
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
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex justify-between items-center py-4 px-6">
        <h1
          onClick={() => handleScroll("#home")}
          className="text-2xl sm:text-3xl font-bold cursor-pointer hover:text-blue-500"
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
            onClick={() => handleScroll("#home")}
            className="hover:text-blue-500"
          >
            Beranda
          </button>
          <button
            onClick={() => handleScroll("#about")}
            className="hover:text-blue-500"
          >
            Tentang Kami
          </button>
          <button
            onClick={() => handleScroll("#program")}
            className="hover:text-blue-500"
          >
            Program Magang
          </button>

          {isLoggedIn ? (
            <div className="flex flex-col items-center space-y-2">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={toggleProfileMenu}
              />
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white w-64 rounded-lg shadow-lg p-4 text-left border"
                >
                  <p className="text-sm font-semibold">
                    {user?.name || "Pengguna"}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {user?.email || "email@example.com"}
                  </p>
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
                    onClick={confirmLogout}
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
                onClick={cancelLogout}
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
