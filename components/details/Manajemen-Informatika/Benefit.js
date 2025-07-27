"use client";

import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function ManagementInformaticsBenefitsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="uppercase text-blue-600 font-semibold mb-3 tracking-wide">
            KEUNTUNGAN JURUSAN
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-snug">
            Keunggulan Jurusan Manajemen Informatika
          </h2>
          <ul className="space-y-5 text-gray-700">
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Fokus pada integrasi manajemen dan teknologi informasi.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Cocok untuk peran analis sistem, IT support, dan manajer proyek
                TI.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Peluang kerja di berbagai sektor industri digital dan layanan.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>Kurikulum adaptif dengan kebutuhan bisnis modern.</span>
            </li>
          </ul>
        </div>

        <div className="relative">
          <Image
            src="/images/mi.jpg" // ganti gambar sesuai jurusan
            alt="Mahasiswa Manajemen Informatika"
            width={600}
            height={400}
            className="rounded-2xl object-cover shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
