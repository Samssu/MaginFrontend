"use client";

import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function ComputerEngineeringBenefitsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left - Text Content */}
        <div>
          <p className="uppercase text-blue-600 font-semibold mb-3 tracking-wide">
            KEUNTUNGAN JURUSAN
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-snug">
            Keunggulan Jurusan Teknik Komputer
          </h2>
          <ul className="space-y-5 text-gray-700">
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Kombinasi keahlian perangkat keras dan perangkat lunak dalam
                satu jurusan.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Peluang karir di bidang sistem embedded, IoT, dan robotika.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Penguasaan arsitektur komputer, jaringan, dan pemrograman sistem
                tingkat rendah.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Kolaborasi dengan industri teknologi dan riset dalam
                pengembangan hardware-software.
              </span>
            </li>
          </ul>
        </div>

        {/* Right - Image */}
        <div className="relative">
          <Image
            src="/images/teknik-komputer.jpg" // Ganti sesuai gambar Teknik Komputer
            alt="Mahasiswa Teknik Komputer"
            width={600}
            height={400}
            className="rounded-2xl object-cover shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
