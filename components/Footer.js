"use client";

import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InternshipFooter() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleProtectedRoute = (path) => {
    if (!isLoggedIn) {
      toast.warn("Silakan login terlebih dahulu", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
    } else {
      router.push(path);
    }
  };

  return (
    <div className="relative mt-0 overflow-hidden bg-white">
      <ToastContainer />

      {/* Footer */}
      <footer className="relative z-10 text-sm text-gray-800 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Deskripsi */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-2">Magin</h2>
            <p>
              Membantu mahasiswa mengembangkan keterampilan dan pengalaman kerja
              nyata melalui program magang terstruktur.
            </p>
          </div>

          {/* Program */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:col-span-2">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/program-magang/teknik-informatika"
                  className="hover:text-blue-600"
                >
                  Teknik Informatika
                </Link>
              </li>
              <li>
                <Link
                  href="/program-magang/sistem-informasi"
                  className="hover:text-blue-600"
                >
                  Sistem Informasi
                </Link>
              </li>
              <li>
                <Link
                  href="/program-magang/ilmu-komputer"
                  className="hover:text-blue-600"
                >
                  Ilmu Komputer
                </Link>
              </li>
              <li>
                <Link
                  href="/program-magang/teknologi-informasi"
                  className="hover:text-blue-600"
                >
                  Teknologi Informasi
                </Link>
              </li>
              <li>
                <Link
                  href="/program-magang/manajemen-informatika"
                  className="hover:text-blue-600"
                >
                  Manajemen Informatika
                </Link>
              </li>
              <li>
                <Link
                  href="/program-magang/teknik-komputer"
                  className="hover:text-blue-600"
                >
                  Teknik Komputer
                </Link>
              </li>
            </ul>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/program-magang/rekayasa-perangkat-lunak"
                  className="hover:text-blue-600"
                >
                  Rekayasa Perangkat Lunak
                </Link>
              </li>
              <li>
                <Link
                  href="/program-magang/jaringan-komputer"
                  className="hover:text-blue-600"
                >
                  Jaringan Komputer
                </Link>
              </li>
              <li>
                <Link
                  href="/program-magang/multimedia"
                  className="hover:text-blue-600"
                >
                  Multimedia
                </Link>
              </li>
              <li>
                <Link
                  href="/program-magang/komputer-akuntansi"
                  className="hover:text-blue-600"
                >
                  Komputer Akuntansi
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="font-semibold mb-3">Navigasi</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-600">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/program-magang" className="hover:text-blue-600">
                  Program Magang
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleProtectedRoute("/pendaftaran")}
                  className={`hover:text-blue-500 ${
                    !isLoggedIn && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  Pendaftaran
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProtectedRoute("/logbook")}
                  className={`hover:text-blue-500 ${
                    !isLoggedIn && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  Logbook
                </button>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-semibold mb-3">Hubungi Kami</h4>
            <p>
              Telp:{" "}
              <a href="tel:+62123456789" className="text-blue-600">
                (0711) 352271
              </a>
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:kominfo@palembang.go.id"
                className="text-blue-600"
              >
                kominfo@palembang.go.id
              </a>
            </p>
            <p className="mt-4 mb-2 font-semibold">Newsletter</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Alamat email"
                className="w-full border-b border-gray-400 py-2 pr-10 bg-transparent outline-none focus:border-blue-500"
              />
              <Mail className="absolute right-2 top-2.5 w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 text-center py-4 text-xs text-gray-600 px-4">
          © {new Date().getFullYear()} Magin. Semua Hak Dilindungi.
        </div>
      </footer>
    </div>
  );
}
