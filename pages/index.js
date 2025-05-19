import Navbar from "../components/Navbar";
import HeroSection from "../components/Herosection";
import Status from "../components/Status";
import Feature from "../components/Feature";
import InternshipHero from "../components/InternshipHero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Status />
      <Feature />
      <InternshipHero />
      <Footer />
    </>
  );
}
