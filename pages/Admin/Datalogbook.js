// DataLogbook.js
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayouts";
import axios from "axios";
import { toast } from "react-toastify";
import { BookOpen, FileText, Search } from "lucide-react";
import Head from "next/head";

export default function DataLogbook() {
  const [logbooks, setLogbooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogbook();
  }, []);

  const fetchLogbook = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/logbook/admin");
      setLogbooks(res.data);
    } catch (error) {
      toast.error("Gagal memuat data logbook", {
        position: "bottom-right",
      });
      console.error("Error fetching logbooks:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogbooks = logbooks.filter((log) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      log.title?.toLowerCase().includes(searchLower) ||
      log.content?.toLowerCase().includes(searchLower) ||
      log.user?.name?.toLowerCase().includes(searchLower) ||
      log.pendaftaran?.namaLengkap?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminLayout>
      <Head>
        <title>Data Logbook Magang | Kominfo Palembang</title>
      </Head>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="text-blue-600" size={28} />
              Data Logbook Magang
            </h2>
            <p className="text-gray-500 text-sm">
              Daftar kegiatan magang yang dilaporkan oleh mahasiswa.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari logbook..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabel Data Logbook */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        {loading ? (
          <div className="p-8 text-center">
            <p>Memuat data logbook...</p>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Nama Mahasiswa</th>
                <th className="p-3 text-left">Judul</th>
                <th className="p-3 text-left">Isi</th>
                <th className="p-3 text-left">Laporan PDF</th>
                <th className="p-3 text-left">Komentar Pembimbing</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogbooks.map((log, index) => (
                <tr
                  key={log._id}
                  className="border-t hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="p-3 font-semibold">{index + 1}</td>
                  <td className="p-3">
                    {new Date(log.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-3">
                    {log.pendaftaran?.namaLengkap || log.user?.name || "-"}
                  </td>
                  <td className="p-3">{log.title}</td>
                  <td className="p-3 line-clamp-2 max-w-xs">{log.content}</td>
                  <td className="p-3">
                    {log.report ? (
                      <a
                        href={`http://localhost:5000${log.report}`}
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
                  <td className="p-3">{log.comment || "-"}</td>
                </tr>
              ))}
              {filteredLogbooks.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    {searchTerm
                      ? "Tidak ditemukan logbook yang sesuai"
                      : "Tidak ada data logbook"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
