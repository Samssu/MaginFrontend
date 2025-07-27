import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBullhorn } from "react-icons/fa";

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
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative min-h-[50vh] w-full flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/jaringan-komputer.jpg" // ✅ Ganti gambar
          alt="Hero Background Jaringan Komputer"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 px-6 sm:px-10 max-w-4xl mx-auto text-white">
        {/* Icon & Subheading */}
        <motion.div
          variants={fadeInVariant}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="flex items-center justify-center gap-2 mb-2 text-sm uppercase font-semibold text-white/80"
        >
          <FaBullhorn className="text-yellow-400" />
          Program Magang Jurusan
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={fadeInVariant}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4"
        >
          Jaringan Komputer
        </motion.h1>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-32 sm:h-40"
        >
          <path fill="#ffffff">
            <animate
              attributeName="d"
              dur="5s"
              repeatCount="indefinite"
              values="M0,160 C320,280 1120,40 1440,160 L1440,320 L0,320 Z;
                      M0,180 C400,40 1040,280 1440,140 L1440,320 L0,320 Z;
                      M0,140 C380,300 1080,60 1440,180 L1440,320 L0,320 Z;
                      M0,160 C320,280 1120,40 1440,160 L1440,320 L0,320 Z"
            />
          </path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
