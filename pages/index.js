import Head from "next/head";
import Navbar from "../components/Navbar";
import HeroSection from "../components/Herosection";
import Status from "../components/Status";
import Feature from "../components/Feature";
import MagangSlider from "../components/MagangSlider";
import TestimonialSlider from "@/components/TestimoniSlider";
import InternshipHero from "../components/InternshipHero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Magin | Sistem Magang Kominfo Palembang</title>
        <meta
          name="description"
          content="Magin - Sistem Pendaftaran dan Pengelolaan Laporan Magang di Kominfo Kota Palembang"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <HeroSection />
      <Status />
      <Feature />
      <MagangSlider />
      <TestimonialSlider />
      <InternshipHero />
      <Footer />
    </>
  );
}
