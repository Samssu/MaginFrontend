"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import jwt from "jsonwebtoken";
import Navbar2 from "@/components/Navbar2";
import Image from "next/image";
import { motion } from "framer-motion";
import Logbook from "@/components/fiturlogbook";

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

export default function FiturLogbook() {
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
    } catch {
      router.push("/");
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <>
      <Head>
        <title>Logbook Magang</title>
        <meta
          name="description"
          content="Kelola dan isi logbook kegiatan magang kamu"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar2 />

      <section className="relative min-h-[40vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            className="text-4xl font-bold"
            variants={fadeInVariant}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            Logbook Magang
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-gray-200"
            variants={fadeInVariant}
            initial="hidden"
            animate="visible"
            custom={0.4}
          >
            Catat aktivitas harian magang kamu di sini.
          </motion.p>
        </div>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-6">
        <Logbook />
      </section>
    </>
  );
}
