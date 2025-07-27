"use client";

import React from "react";
import Head from "next/head";
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/Footer";
import HeroSection from "@/components/details/Komputer-Akutansi/HeroSection";
import Informatif from "@/components/details/Komputer-Akutansi/Informatif";
import Role from "@/components/details/Komputer-Akutansi/Role";
import Benefit from "@/components/details/Komputer-Akutansi/Benefit";
import Magangcard from "@/components/Magangcard";

const KomputerAkuntansi = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Program Magang | Komputer Akuntansi</title>
        <meta
          name="description"
          content="Program magang jurusan Komputer Akuntansi di Dinas Kominfo Palembang. Pelajari peran, keuntungan, dan cara mendaftar."
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

export default KomputerAkuntansi;
