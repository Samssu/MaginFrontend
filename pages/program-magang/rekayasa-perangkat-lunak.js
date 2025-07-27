"use client";

import React from "react";
import Head from "next/head";
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/Footer";
import HeroSection from "@/components/details/Rekayasa-Perangkat-Lunak/HeroSection";
import Informatif from "@/components/details/Rekayasa-Perangkat-Lunak/Informatif";
import Role from "@/components/details/Rekayasa-Perangkat-Lunak/Role";
import Benefit from "@/components/details/Rekayasa-Perangkat-Lunak/Benefit";
import Magangcard from "@/components/Magangcard";

const RekayasaPerangkatLunak = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Program Magang | Rekayasa Perangkat Lunak</title>
        <meta
          name="description"
          content="Program magang jurusan Rekayasa Perangkat Lunak di Dinas Kominfo Palembang. Pelajari peran, keuntungan, dan cara mendaftar."
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

export default RekayasaPerangkatLunak;
