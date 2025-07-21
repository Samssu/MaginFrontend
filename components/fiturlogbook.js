"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Logbook() {
  const [logs, setLogs] = useState([]);
  const router = useRouter();

  const fetchLogs = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/logbook", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch {
      toast.error("Gagal mengambil data logbook.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!confirm("Yakin ingin menghapus logbook ini?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/logbook/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Logbook berhasil dihapus");
      fetchLogs();
    } catch {
      toast.error("Gagal menghapus logbook");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleNavigate = () => {
    router.push("/user/buatlogbook");
  };

  return (
    <div className="space-y-10 p-4">
      {/* Tombol Buat Logbook */}
      <div className="flex justify-end">
        <button
          onClick={handleNavigate}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Buat Logbook
        </button>
      </div>

      {/* Tabel Logbook */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-md">
        <table className="min-w-[1000px] w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-center">No</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Isi</th>
              <th className="px-4 py-3">Laporan (PDF)</th>
              <th className="px-4 py-3">Komentar</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, i) => (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-center font-semibold">{i + 1}</td>
                <td className="px-4 py-3">
                  {new Date(log.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3">{log?.user?.name || "-"}</td>
                <td className="px-4 py-3 font-semibold">{log?.title}</td>
                <td className="px-4 py-3 whitespace-pre-wrap">
                  {log?.content}
                </td>
                <td className="px-4 py-3">
                  {log?.report ? (
                    <a
                      href={`http://localhost:5000${log.report}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3">{log?.comment || "-"}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(log._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
