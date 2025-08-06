// components/program-magang/manajemen-informatika.js

"use client";

import React from "react";
import Head from "next/head";
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/Footer";
import HeroSection from "@/components/details/Managemen-Informatika/HeroSection";
import Informatif from "@/components/details/Managemen-Informatika/Informatif";
import Role from "@/components/details/Managemen-Informatika/Role";
import Benefit from "@/components/details/Managemen-Informatika/Benefit";
import Magangcard from "@/components/Magangcard";

const ManajemenInformatika = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Program Magang | Manajemen Informatika</title>
        <meta
          name="description"
          content="Program magang jurusan Manajemen Informatika di Dinas Kominfo Palembang. Pelajari peran, keuntungan, dan cara mendaftar."
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

export default ManajemenInformatika;
