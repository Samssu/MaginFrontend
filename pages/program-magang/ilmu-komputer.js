// components/program-magang/ilmu-komputer.js

"use client";

import React from "react";
import Head from "next/head";
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/Footer";
import HeroSection from "@/components/details/Ilmu-Komputer/HeroSection";
import Informatif from "@/components/details/Ilmu-Komputer/Informatif";
import Role from "@/components/details/Ilmu-Komputer/Role";
import Benefit from "@/components/details/Ilmu-Komputer/Benefit";
import Magangcard from "@/components/Magangcard";

const IlmuKomputer = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Program Magang | Ilmu Komputer</title>
        <meta
          name="description"
          content="Program magang jurusan Ilmu Komputer di Dinas Kominfo Palembang. Pelajari peran, keuntungan, dan cara mendaftar."
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

export default IlmuKomputer;
