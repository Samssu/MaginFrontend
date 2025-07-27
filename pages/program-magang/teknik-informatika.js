// components/program-magang/teknikinformatika.js

"use client";

import React from "react";
import Head from "next/head";
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/Footer";
import HeroSection from "@/components/details/Teknik-Informatika/HeroSection";
import Informatif from "@/components/details/Teknik-Informatika/Informatif";
import Role from "@/components/details/Teknik-Informatika/Role";
import Benefit from "@/components/details/Teknik-Informatika/Benefit";
import Magangcard from "@/components/Magangcard";

const TeknikInformatika = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Tambahkan judul halaman di sini */}
      <Head>
        <title>Program Magang | Teknik Informatika</title>
        <meta
          name="description"
          content="Program magang jurusan Teknik Informatika di Dinas Kominfo Palembang. Pelajari peran, keuntungan, dan cara mendaftar."
        />
      </Head>
      <Navbar2 /> {/* Navbar di atas */}
      <main className="flex-grow">
        <HeroSection />
        <Informatif />
        <Role />
        <Benefit />
        <Magangcard />
      </main>
      <Footer /> {/* Footer di bawah */}
    </div>
  );
};

export default TeknikInformatika;
