// DataLogbook.js
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayouts";
import axios from "axios";
import { toast } from "react-toastify";
import { BookOpen, FileText } from "lucide-react";

export default function DataLogbook() {
  const [logbooks, setLogbooks] = useState([]);

  useEffect(() => {
    fetchLogbook();
  }, []);

  const fetchLogbook = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/logbook");
      setLogbooks(res.data);
    } catch (error) {
      toast.error("Gagal memuat data logbook", {
        position: "bottom-right",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" size={28} />
            Data Logbook Magang
          </h2>
          <p className="text-gray-500 text-sm">
            Daftar kegiatan magang yang dilaporkan oleh mahasiswa.
          </p>
        </div>
      </div>

      {/* Tabel Data Logbook */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
              <th className="p-3 text-left">No</th>
              <th className="p-3 text-left">Tanggal</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Judul</th>
              <th className="p-3 text-left">Isi</th>
              <th className="p-3 text-left">Laporan PDF</th>
              <th className="p-3 text-left">Komentar Pembimbing</th>
            </tr>
          </thead>
          <tbody>
            {logbooks.map((log, index) => (
              <tr
                key={log._id}
                className="border-t hover:bg-gray-50 transition-all duration-200"
              >
                <td className="p-3 font-semibold">{index + 1}</td>
                <td className="p-3">
                  {new Date(log.tanggal).toLocaleDateString()}
                </td>
                <td className="p-3">{log.namaMahasiswa}</td>
                <td className="p-3">{log.judul}</td>
                <td className="p-3 line-clamp-2 max-w-xs">{log.isi}</td>
                <td className="p-3">
                  {log.laporanPdf ? (
                    <a
                      href={`http://localhost:5000/uploads/${log.laporanPdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText size={16} />
                      Lihat PDF
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Tidak ada</span>
                  )}
                </td>
                <td className="p-3">{log.komentarPembimbing || "-"}</td>
              </tr>
            ))}
            {logbooks.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  Tidak ada data logbook.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
