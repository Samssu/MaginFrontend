"use client";

import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function SoftwareEngineeringBenefitsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left - Text Content */}
        <div>
          <p className="uppercase text-blue-600 font-semibold mb-3 tracking-wide">
            KEUNTUNGAN JURUSAN
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-snug">
            Keunggulan Jurusan Rekayasa Perangkat Lunak
          </h2>
          <ul className="space-y-5 text-gray-700">
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Fokus pada pengembangan perangkat lunak yang efisien dan
                berkualitas tinggi.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Peluang karir sebagai software engineer, developer, dan QA
                tester.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Pembelajaran tentang siklus hidup perangkat lunak: analisis,
                desain, implementasi, dan pemeliharaan.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Keterampilan dalam pemrograman, manajemen proyek, dan agile
                development.
              </span>
            </li>
          </ul>
        </div>

        {/* Right - Image */}
        <div className="relative">
          <Image
            src="/images/rekayasa-perangkat-lunak.jpg" // Ganti dengan gambar RPL jika tersedia
            alt="Mahasiswa Rekayasa Perangkat Lunak"
            width={600}
            height={400}
            className="rounded-2xl object-cover shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
