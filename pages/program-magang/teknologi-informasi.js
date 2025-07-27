// components/program-magang/teknologi-informasi.js

"use client";

import React from "react";
import Head from "next/head";
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/Footer";
import HeroSection from "@/components/details/Teknologi-Informasi/HeroSection";
import Informatif from "@/components/details/Teknologi-Informasi/Informatif";
import Role from "@/components/details/Teknologi-Informasi/Role";
import Benefit from "@/components/details/Teknologi-Informasi/Benefit";
import Magangcard from "@/components/Magangcard";

const TeknologiInformasi = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Program Magang | Teknologi Informasi</title>
        <meta
          name="description"
          content="Program magang jurusan Teknologi Informasi di Dinas Kominfo Palembang. Pelajari peran, keuntungan, dan cara mendaftar."
        />
      </Head>
      <Navbar2 />
      <main className="flex-grow">
        <HeroSection />
        <Informatif />
        <Role />
        <Benefit />
        <Magangcard />
      </main>
      <Footer />
    </div>
  );
};

export default TeknologiInformasi;
