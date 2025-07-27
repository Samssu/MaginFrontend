"use client";
import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaLaptopCode,
  FaShieldAlt,
  FaNetworkWired,
  FaChartPie,
  FaCode,
  FaCogs,
  FaRobot,
  FaDatabase,
  FaProjectDiagram,
  FaDesktop,
  FaCameraRetro,
  FaFileAlt,
} from "react-icons/fa";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const placeholder = "/images/tech.jpg";

const toSlug = (label) =>
  label
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const jurusanMagang = [
  {
    label: "Teknik Informatika",
    icon: <FaLaptopCode />,
    image: "/images/teknik-informatika.jpg",
  },
  {
    label: "Sistem Informasi",
    icon: <FaChartPie />,
    image: "/images/sistem-informasi.jpg",
  },
  {
    label: "Ilmu Komputer",
    icon: <FaCode />,
    image: "/images/ilmu-komputer.jpg",
  },
  {
    label: "Teknologi Informasi",
    icon: <FaCogs />,
    image: "/images/teknologi-informasi.jpg",
  },
  {
    label: "Manajemen Informatika",
    icon: <FaProjectDiagram />,
    image: "/images/management-informatika.jpg",
  },
  {
    label: "Teknik Komputer",
    icon: <FaDesktop />,
    image: "/images/teknik-komputer.jpg",
  },
  {
    label: "Rekayasa Perangkat Lunak",
    icon: <FaRobot />,
    image: "/images/rekayasa-perangkat-lunak.jpg",
  },
  {
    label: "Jaringan Komputer",
    icon: <FaNetworkWired />,
    image: "/images/jaringan-komputer.jpg",
  },
  {
    label: "Multimedia",
    icon: <FaCameraRetro />,
    image: "/images/multimedia.jpg",
  },
  {
    label: "Komputer Akuntansi",
    icon: <FaFileAlt />,
    image: "/images/komputer-akutansi.jpg",
  },
];

export default function ServiceCards() {
  const router = useRouter();
  const scrollRef = useRef();

  const handleClick = (label) => {
    const slug = toSlug(label);
    router.push(`/program-magang/${slug}`);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#F3F5FB] py-20 px-4 md:px-16">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-10 items-start gap-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
              Program Magang <br /> Bidang Komputer & Teknologi
            </h2>
          </div>
          <div className="md:max-w-[500px] text-gray-600 text-md leading-relaxed">
            Pilih jurusan yang sesuai dengan minat dan keahlian kamu. Setiap
            program magang dirancang untuk mendukung pengembangan karier di
            dunia digital.
          </div>
          <div className="flex gap-3">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-200 transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-200 transition"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Card List */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        >
          {jurusanMagang.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item.label)}
              className="min-w-[280px] max-w-sm flex-shrink-0 bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-56 w-full group-hover:scale-105 group-hover:rotate-[0.5deg] transition-transform duration-500 ease-out">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-500 ease-out"
                />
                <span className="absolute top-3 left-3 bg-[#21254D] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                  {item.icon}
                  <span className="ml-1">{item.label}</span>
                </span>
              </div>
              <div className="p-5 h-[180px] flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-600">
                  Program magang bidang {item.label.toLowerCase()} untuk
                  meningkatkan keahlianmu.
                </p>
                <span className="text-sm font-semibold text-black hover:text-blue-600 flex items-center gap-1 mt-4 transition-colors">
                  Lihat Selengkapnya <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
