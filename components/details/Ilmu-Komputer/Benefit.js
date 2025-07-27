"use client";

import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function ComputerScienceBenefitsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left - Text Content */}
        <div>
          <p className="uppercase text-blue-600 font-semibold mb-3 tracking-wide">
            KEUNTUNGAN JURUSAN
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-snug">
            Keunggulan Jurusan Ilmu Komputer
          </h2>
          <ul className="space-y-5 text-gray-700">
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Memahami dasar algoritma, pemrograman, dan komputasi yang kuat.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Peluang karir di bidang kecerdasan buatan, big data, dan
                keamanan siber.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Terbuka untuk riset teknologi terbaru dan pengembangan software
                skala besar.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Kurikulum fleksibel mendukung spesialisasi seperti machine
                learning & cloud computing.
              </span>
            </li>
          </ul>
        </div>

        {/* Right - Image */}
        <div className="relative">
          <Image
            src="/images/ilmu-komputer.jpg" // Ganti gambar sesuai jurusan
            alt="Mahasiswa Ilmu Komputer"
            width={600}
            height={400}
            className="rounded-2xl object-cover shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
