"use client";

import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function KomputerAkuntansiBenefitsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="uppercase text-blue-600 font-semibold mb-3 tracking-wide">
            KEUNTUNGAN JURUSAN
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-snug">
            Keunggulan Jurusan Komputer Akuntansi
          </h2>
          <ul className="space-y-5 text-gray-700">
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Menggabungkan keahlian akuntansi dengan teknologi komputer.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Membuka peluang karier sebagai staf keuangan, auditor, dan
                analis data akuntansi.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Dibutuhkan di berbagai instansi pemerintahan dan perusahaan
                swasta.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-1" />
              <span>
                Penguasaan software akuntansi seperti MYOB, Accurate, dan Excel
                tingkat lanjut.
              </span>
            </li>
          </ul>
        </div>

        <div className="relative">
          <Image
            src="/images/komputer-akuntansi.jpg" // Ganti dengan gambar jurusan komputer akuntansi
            alt="Mahasiswa Komputer Akuntansi"
            width={600}
            height={400}
            className="rounded-2xl object-cover shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
