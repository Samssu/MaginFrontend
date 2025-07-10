import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

const HeroSection = () => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); // ubah ukuran sesuai kebutuhan
    };

    handleResize(); // cek saat pertama kali render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Hero Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 lg:px-20 py-24 max-w-7xl mx-auto min-h-screen">
        <motion.div
          className="w-full md:w-1/2 text-left space-y-6 text-white"
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeInVariant}
            custom={0.2}
            className="text-sm sm:text-base uppercase tracking-widest text-sky-400 font-semibold"
          >
            📢 Pendaftaran Magang Kominfo Kota Palembang
          </motion.p>

          <motion.h1
            variants={fadeInVariant}
            custom={0.4}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          >
            Bangun Kariermu <br className="hidden sm:block" /> Lewat Pengalaman
            Magang.
          </motion.h1>

          <motion.p
            variants={fadeInVariant}
            custom={0.6}
            className="text-gray-200 text-base sm:text-lg"
          >
            Dapatkan kesempatan belajar langsung di lingkungan profesional dan
            tingkatkan kualitas dirimu bersama Dinas Komunikasi dan Informatika
            Kota Palembang.
          </motion.p>

          <motion.div
            variants={fadeInVariant}
            custom={0.8}
            className="flex flex-col sm:flex-row justify-start gap-4 mt-6"
          >
            <Link href="/register">
              <button className="bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90 text-white font-semibold py-2 px-6 rounded-full">
                Daftar Sekarang
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-40 sm:h-48 md:h-56"
        >
          <path fill="#ffffff">
            {isDesktop && (
              <animate
                attributeName="d"
                dur="5s"
                repeatCount="indefinite"
                values="
                  M0,160 C320,280 1120,40 1440,160 L1440,320 L0,320 Z;
                  M0,180 C400,40 1040,280 1440,140 L1440,320 L0,320 Z;
                  M0,140 C380,300 1080,60 1440,180 L1440,320 L0,320 Z;
                  M0,160 C320,280 1120,40 1440,160 L1440,320 L0,320 Z
                "
              />
            )}
          </path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
