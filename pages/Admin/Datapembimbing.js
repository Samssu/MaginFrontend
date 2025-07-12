"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayouts";
import axios from "axios";
import { toast } from "react-toastify";
import { UserCircle2 } from "lucide-react";

export default function Pembimbing() {
  const [pembimbing, setPembimbing] = useState([]);

  useEffect(() => {
    fetchPembimbing();
  }, []);

  const fetchPembimbing = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pembimbing"); // Ganti sesuai endpoint
      setPembimbing(res.data);
    } catch (error) {
      toast.error("Gagal memuat data pembimbing", {
        position: "bottom-right",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <UserCircle2 className="text-blue-600" size={28} />
          Data Pembimbing Magang
        </h2>
        <p className="text-gray-500 text-sm">
          Informasi lengkap pembimbing yang aktif di sistem.
        </p>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Divisi</th>
              <th className="p-3 text-left">Jumlah Mahasiswa</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {pembimbing.map((item) => (
              <tr
                key={item._id}
                className="border-t hover:bg-gray-50 transition-all duration-200"
              >
                <td className="p-3 font-medium">{item.nama}</td>
                <td className="p-3">{item.email}</td>
                <td className="p-3">{item.divisi}</td>
                <td className="p-3 text-center">{item.jumlahMahasiswa}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      item.status === "aktif"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            {pembimbing.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Tidak ada data pembimbing.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
