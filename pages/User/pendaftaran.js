"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import jwt from "jsonwebtoken";
import Navbar2 from "@/components/Navbar2";
import Image from "next/image";
import { motion } from "framer-motion";
import FormPendaftaran from "@/components/FiturDaftar"; // ✅ Ganti nama import

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

export default function FiturDaftarPage() {
  // ✅ Ubah nama komponen halaman
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
        <title>Formulir Pendaftaran Magang</title>
        <meta name="description" content="Isi formulir pendaftaran magang" />
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
            Formulir Pendaftaran Magang
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-gray-200"
            variants={fadeInVariant}
            initial="hidden"
            animate="visible"
            custom={0.4}
          >
            Silakan isi data dan unggah dokumen kamu untuk mendaftar magang.
          </motion.p>
        </div>
      </section>

      <section className="py-12 max-w-4xl mx-auto px-6">
        <FormPendaftaran /> {/* ✅ Nama baru, aman */}
      </section>
    </>
  );
}
