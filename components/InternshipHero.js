import Image from "next/image";
import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function IntershipHero() {
  return (
    <section className="relative h-[60vh] w-full flex items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/IntershipHero.jpg"
        alt="Background Magang"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Overlay blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      {/* Overlay Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        {/* Label */}
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-white/20 backdrop-blur px-4 py-1 rounded-full mb-4 w-fit mx-auto shadow-md">
          <Briefcase className="w-4 h-4" />
          Program Magang Terbaik untuk Mahasiswa
        </div>

        {/* Judul */}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6 drop-shadow-lg">
          Bangun Kariermu Lewat <br /> Pengalaman Magang Nyata
        </h1>

        {/* Tombol CTA */}
        <Link href="/register">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition">
            Daftar Magang Sekarang →
          </button>
        </Link>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-32 sm:h-40 md:h-48"
        >
          <path fill="#ffffff">
            <animate
              attributeName="d"
              dur="5s"
              repeatCount="indefinite"
              values="
                M0,160 C320,280 1120,40 1440,160 L1440,320 L0,320 Z;
                M0,180 C400,40 1040,280 1440,140 L1440,320 L0,320 Z;
                M0,140 C380,300 1080,60 1440,180 L1440,320 L0,320 Z;
                M0,160 C320,280 1120,40 1440,160 L1440,320 L0,320 Z
              "
            />
          </path>
        </svg>
      </div>
    </section>
  );
}
