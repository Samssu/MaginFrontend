"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const pertanyaanData = [
  {
    pertanyaan: "Apa itu program magang?",
    jawaban:
      "Program magang adalah kegiatan pembelajaran di dunia kerja nyata yang bertujuan menambah pengalaman, wawasan, dan keterampilan mahasiswa.",
  },
  {
    pertanyaan: "Siapa saja yang bisa mendaftar?",
    jawaban:
      "Mahasiswa aktif dari perguruan tinggi yang bekerja sama atau memenuhi syarat administrasi yang telah ditentukan.",
  },
  {
    pertanyaan: "Berapa lama durasi magang?",
    jawaban:
      "Durasi magang biasanya berlangsung antara 1 hingga 6 bulan tergantung kebutuhan instansi dan kebijakan kampus.",
  },
  {
    pertanyaan: "Apa saja syarat dokumen yang dibutuhkan?",
    jawaban:
      "CV, surat pengantar dari kampus, transkrip nilai sementara, dan dokumen pendukung lainnya sesuai dengan syarat instansi.",
  },
];

export default function PertanyaanSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`w-full py-12 bg-white px-4 md:px-16 transition-all duration-700 ease-out
        ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
        Pertanyaan Seputar Magang
      </h2>

      <div className="max-w-5xl mx-auto space-y-4">
        {pertanyaanData.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border border-gray-300 rounded-xl p-5 shadow-md bg-gray-50 transition duration-300"
            >
              <button
                onClick={() => toggleOpen(index)}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="text-lg md:text-xl font-semibold text-gray-700">
                  {item.pertanyaan}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-6 h-6 text-gray-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-500" />
                )}
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? "max-h-96 mt-4 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  {item.jawaban}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
