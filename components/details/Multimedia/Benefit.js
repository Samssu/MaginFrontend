"use client";

import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function MultimediaBenefitsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left - Text Content */}
        <div>
          <p className="uppercase text-blue-600 font-semibold mb-3 tracking-wide">
            KEUNTUNGAN JURUSAN
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-snug">
            Keunggulan Jurusan Multimedia
          </h2>
          <ul className="space-y-5 text-gray-700">
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Menguasai berbagai software desain grafis, animasi, dan editing
                video.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Peluang karir sebagai content creator, animator, videografer,
                dan desainer UI/UX.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Keterampilan visual yang dibutuhkan di berbagai industri kreatif
                dan digital.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Proyek nyata dan kolaborasi dengan industri kreatif serta
                portofolio profesional.
              </span>
            </li>
          </ul>
        </div>

        {/* Right - Image */}
        <div className="relative">
          <Image
            src="/images/multimedia.jpg" // Ganti dengan gambar relevan untuk jurusan Multimedia
            alt="Mahasiswa Jurusan Multimedia"
            width={600}
            height={400}
            className="rounded-2xl object-cover shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
