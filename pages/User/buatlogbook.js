"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function BuatLogbook() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pdf, setPdf] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("title", title);
    form.append("content", content);
    if (pdf) form.append("report", pdf);

    try {
      await axios.post("http://localhost:5000/api/logbook", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Logbook berhasil disimpan!");
      router.push("/user/logbook");
    } catch (error) {
      toast.error("Gagal menyimpan logbook.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Buat Logbook Baru
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Judul</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="Judul logbook"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Isi Laporan
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="Deskripsi kegiatan magang..."
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Upload PDF (max 10MB)
          </label>
          <input type="file" accept="application/pdf" onChange={handlePdf} />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Simpan Logbook
        </button>
      </form>
    </div>
  );
}
