"use client";

import React from "react";
import Head from "next/head";
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/Footer";
import HeroSection from "@/components/details/Multimedia/HeroSection";
import Informatif from "@/components/details/Multimedia/Informatif";
import Role from "@/components/details/Multimedia/Role";
import Benefit from "@/components/details/Multimedia/Benefit";
import Magangcard from "@/components/Magangcard";

const Multimedia = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Program Magang | Multimedia</title>
        <meta
          name="description"
          content="Program magang jurusan Multimedia di Dinas Kominfo Palembang. Pelajari peran, keuntungan, dan cara mendaftar."
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

export default Multimedia;
