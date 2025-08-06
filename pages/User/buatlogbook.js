"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Navbar2 from "@/components/Navbar2";

// Animasi framer-motion
const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  }),
};

export default function BuatLogbook() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pdf, setPdf] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handlePdf = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Hanya file PDF yang diperbolehkan.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran maksimal 10MB.");
      return;
    }

    setPdf(file);
  };

  const removePdf = () => {
    setPdf(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Judul dan deskripsi harus diisi.");
      return;
    }

    setIsUploading(true);

    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("title", title);
    form.append("content", content);
    if (pdf) form.append("report", pdf);

    try {
      await axios.post("http://localhost:5000/api/logbook", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Logbook berhasil disimpan!");
      router.push("/user/logbook");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal menyimpan logbook.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Navbar2 />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            className="text-4xl font-bold"
            variants={fadeInVariant}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            Logbook Magang
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-gray-200"
            variants={fadeInVariant}
            initial="hidden"
            animate="visible"
            custom={0.4}
          >
            Catat aktivitas harian magang kamu di sini.
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <h2 className="text-2xl font-bold">Buat Logbook Baru</h2>
            <p className="opacity-90 mt-1">
              Catat perkembangan magang Anda hari ini
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Judul */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">
                Judul Kegiatan <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Contoh: Pembuatan Dashboard Admin"
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">
                Deskripsi Kegiatan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Jelaskan detail kegiatan yang dilakukan hari ini..."
              />
            </div>

            {/* Upload PDF */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">
                Lampiran Laporan (PDF)
              </label>

              {!pdf ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <div className="flex justify-center">
                      <UploadCloud className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="pdf-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload file PDF</span>
                        <input
                          id="pdf-upload"
                          name="pdf-upload"
                          type="file"
                          accept="application/pdf"
                          onChange={handlePdf}
                          className="sr-only"
                          ref={fileInputRef}
                        />
                      </label>
                      <p className="pl-1">atau drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF maksimal 10MB</p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{pdf.name}</p>
                        <p className="text-sm text-gray-500">
                          {(pdf.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removePdf}
                      className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tombol Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isUploading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Logbook"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Membuat Logbook */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-3">
            Tips Membuat Logbook yang Baik:
          </h3>
          <ul className="space-y-2 text-blue-700">
            {[
              "Gunakan judul yang spesifik dan deskriptif",
              "Tulis kegiatan secara kronologis dan detail",
              "Sertakan tantangan yang dihadapi dan solusinya",
              "Lampirkan dokumen pendukung jika diperlukan",
            ].map((tip, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
}
