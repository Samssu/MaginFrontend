"use client";

import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function SistemInformasiBenefitsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left - Text Content */}
        <div>
          <p className="uppercase text-blue-600 font-semibold mb-3 tracking-wide">
            KEUNTUNGAN JURUSAN
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-snug">
            Keunggulan Jurusan Sistem Informasi
          </h2>
          <ul className="space-y-5 text-gray-700">
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Memadukan ilmu komputer dan bisnis untuk solusi sistem
                informasi.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Diperlukan di berbagai sektor: pemerintahan, perbankan, dan
                industri.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Fokus pada analisis data, pengembangan sistem, dan manajemen
                proyek TI.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Siap berkarier sebagai system analyst, data analyst, atau IT
                consultant.
              </span>
            </li>
          </ul>
        </div>

        {/* Right - Image */}
        <div className="relative">
          <Image
            src="/images/sistem-informasi.jpg" // 🔁 Ganti dengan gambar SI (pastikan tersedia di /public/images/)
            alt="Mahasiswa Sistem Informasi"
            width={600}
            height={400}
            className="rounded-2xl object-cover shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
