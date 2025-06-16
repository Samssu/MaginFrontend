import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify"; // Impor react-toastify
import { motion } from "framer-motion"; // Impor motion dari framer-motion

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarBg, setNavbarBg] = useState("bg-white");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State untuk menampilkan konfirmasi logout
  const router = useRouter();

  // Check login status and get user data from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }
  }, []);

  const handleScroll = (id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const handleLogout = () => {
    // Remove token and user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    toast.success("You have logged out successfully!", {
      position: "bottom-right",
      autoClose: 3000,
    });
    router.push("/login");
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu); // Toggle visibility of profile menu
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true); // Show logout confirmation modal
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false); // Hide logout confirmation modal
  };

  // Gunakan 'kokomi.png' sebagai default profile picture
  const profilePicture = user?.profilePicture || "/images/kokomi.png"; // Akses gambar dari /public/images

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${navbarBg}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <h1
          onClick={() => handleScroll("#home")}
          className="text-2xl sm:text-3xl font-bold cursor-pointer hover:text-blue-500 transition"
        >
          Magin
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => handleScroll("#home")}
            className="hover:text-blue-500 transition"
          >
            Beranda
          </button>
          <button
            onClick={() => handleScroll("#about")}
            className="hover:text-blue-500 transition"
          >
            Tentang Kami
          </button>
          <button
            onClick={() => handleScroll("#program")}
            className="hover:text-blue-500 transition"
          >
            Program Magang
          </button>

          {isLoggedIn ? (
            <div className="flex items-center space-x-4 relative">
              {/* Display profile picture */}
              <img
                src={profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={toggleProfileMenu}
              />

              {/* Dropdown menu for profile */}
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-20"
                >
                  <button
                    onClick={() => router.push("/profile/edit")}
                    className="w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100 transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={confirmLogout} // Show logout confirmation modal
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link href="/login">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl focus:outline-none"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white py-4 shadow-md flex flex-col items-center space-y-4">
          <button
            onClick={() => handleScroll("#home")}
            className="hover:text-blue-500 transition"
          >
            Beranda
          </button>
          <button
            onClick={() => handleScroll("#about")}
            className="hover:text-blue-500 transition"
          >
            Tentang Kami
          </button>
          <button
            onClick={() => handleScroll("#program")}
            className="hover:text-blue-500 transition"
          >
            Program Magang
          </button>
          {isLoggedIn ? (
            <div className="flex flex-col items-center">
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
                  className="absolute bg-white p-4 shadow-lg rounded-lg mt-2 w-48"
                >
                  <button
                    onClick={() => router.push("/profile/edit")}
                    className="w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100 transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={confirmLogout} // Show logout confirmation modal
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Link href="/login">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <motion.div
          className="fixed inset-0 bg-opacity-90 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-1/4 text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold">
              Apakah Anda yakin untuk keluar?
            </h3>
            <div className="mt-4 space-x-4">
              <button
                onClick={handleLogout} // Proceed with logout
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Ya, Logout
              </button>
              <button
                onClick={cancelLogout} // Cancel logout
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
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
