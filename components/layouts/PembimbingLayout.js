import { useRouter } from "next/router";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookOpenCheck,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { label: "Dashboard", href: "/pembimbing/dashboard", icon: LayoutDashboard },
  {
    label: "Peserta Magang",
    href: "/pembimbing/PesertaMagang",
    icon: Users,
  },
  {
    label: "Logbook Magang",
    href: "/pembimbing/LogbookMagang",
    icon: BookOpenCheck,
  },
  {
    label: "Laporan Akhir",
    href: "/pembimbing/LaporanAkhir",
    icon: FileText,
  },
];

export default function PembimbingLayout({ children }) {
  const router = useRouter();
  const [activePath, setActivePath] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user) {
        toast.error("Anda harus login terlebih dahulu");
        router.replace("/login");
        return false;
      }

      if (user.role !== "pembimbing") {
        toast.error("Anda tidak memiliki akses ke halaman ini");
        router.replace("/");
        return false;
      }

      return true;
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    setActivePath(router.pathname);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    toast.success("Berhasil logout!", {
      position: "bottom-right",
      autoClose: 3000,
    });
    router.push("/login");
    setShowLogoutConfirm(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Mobile Header */}
      {isMobile && (
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">
            Dashboard Pembimbing Magang
          </h1>
          <button onClick={toggleMobileMenu} className="text-gray-700">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <aside
        className={`${
          isMobile ? "hidden md:block" : ""
        } w-64 bg-white shadow-lg flex flex-col`}
      >
        {!isMobile && (
          <div className="p-6 text-2xl font-bold text-blue-600 border-b border-gray-200">
            Dashboard Pembimbing Magang
          </div>
        )}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map(({ label, href, icon: Icon }) => (
            <Link href={href} key={href}>
              <div
                className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-lg transition-all cursor-pointer",
                  activePath === href
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-100"
                )}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                <Icon size={20} />
                {label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 text-2xl font-bold text-blue-600 border-b border-gray-200 flex justify-between items-center">
            Menu Pembimbing
            <button onClick={toggleMobileMenu} className="text-gray-700">
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map(({ label, href, icon: Icon }) => (
              <Link href={href} key={href}>
                <div
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all cursor-pointer",
                    activePath === href
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "hover:bg-gray-100"
                  )}
                  onClick={toggleMobileMenu}
                >
                  <Icon size={20} />
                  {label}
                </div>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isMobile && <div className="h-16" />}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-80 mx-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Konfirmasi Logout
              </h3>
              <p className="text-gray-600 mb-6">
                Anda yakin ingin keluar dari akun pembimbing?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Ya, Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
