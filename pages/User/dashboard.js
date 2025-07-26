"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import jwt from "jsonwebtoken";
import Navbar2 from "@/components/Navbar2";
import Image from "next/image";
import { motion } from "framer-motion";
import LinkButtons from "@/components/LinkButtons";
import Footer from "@/components/Footer";

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

export default function UserDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded = jwt.decode(token);
      if (!decoded?.role || decoded.role !== "user") {
        router.push("/");
        return;
      }
      setAuthorized(true);
    } catch (error) {
      router.push("/");
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <>
      <Head>
        <title>Dashboard Pengguna | Pendaftaran Magang Kominfo</title>
        <meta
          name="description"
          content="Dashboard pengguna untuk mengelola pendaftaran magang dan logbook kegiatan."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Navbar2 />

        {/* Hero Section */}
        <section className="relative min-h-[50vh] w-full flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero.jpg"
              alt="Hero Background"
              fill
              className="object-cover object-center"
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
              Selamat Datang di Dashboard
            </motion.h1>

            <motion.p
              variants={fadeInVariant}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="text-lg sm:text-xl text-gray-200"
            >
              Kelola pendaftaran magang dan logbook kegiatanmu dengan mudah dan
              profesional.
            </motion.p>
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

        <LinkButtons />
        <Footer />
      </div>
    </>
  );
}
