// components/program-magang/teknik-komputer.js

"use client";

import React from "react";
import Head from "next/head";
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/Footer";
import HeroSection from "@/components/details/Teknik-Komputer/HeroSection";
import Informatif from "@/components/details/Teknik-Komputer/Informatif";
import Role from "@/components/details/Teknik-Komputer/Role";
import Benefit from "@/components/details/Teknik-Komputer/Benefit";
import Magangcard from "@/components/Magangcard";

const TeknikKomputer = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Program Magang | Teknik Komputer</title>
        <meta
          name="description"
          content="Program magang jurusan Teknik Komputer di Dinas Kominfo Palembang. Pelajari peran, keuntungan, dan cara mendaftar."
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

export default TeknikKomputer;
