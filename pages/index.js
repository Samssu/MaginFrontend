import Head from "next/head";
import Navbar2 from "../components/Navbar2";
import HeroSection from "../components/Herosection";
import Status from "../components/Status";
import Feature from "../components/Feature";
import MagangSlider from "../components/MagangSlider";
import TestimonialSlider from "../components/TestimoniSlider";
import Magangcard from "../components/Magangcard";
import InternshipHero from "../components/InternshipHero";
import SectionPertanyaan from "../components/SectionPertanyaan";
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
      <Navbar2 />
      <HeroSection />
      <Status />
      <Feature />
      <MagangSlider />
      <Magangcard />
      <TestimonialSlider />
      <SectionPertanyaan />
      <InternshipHero />
      <Footer />
    </>
  );
}
