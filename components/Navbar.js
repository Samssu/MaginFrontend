import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <nav
      className={`fixed w-full z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } bg-white/20 backdrop-blur-md`}
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
        <div className="md:hidden bg-white/80 backdrop-blur-md text-black py-4 shadow-md flex flex-col items-center space-y-4">
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
    </nav>
  );
}
