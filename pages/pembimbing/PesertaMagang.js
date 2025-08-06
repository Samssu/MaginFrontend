"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import PembimbingLayout from "@/components/layouts/PembimbingLayout";
import {
  Users,
  ChevronRight,
  Search,
  Frown,
  Calendar,
  Clock,
} from "lucide-react";

export default function PesertaMagang() {
  const router = useRouter();
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `/api/pembimbing/${user.id}/mahasiswa`
        );
        setPeserta(response.data);
      } catch (error) {
        console.error("Error fetching peserta magang:", error);
        toast.error("Gagal memuat data peserta magang");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const filteredPeserta = peserta.filter(
    (p) =>
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nim.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <PembimbingLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PembimbingLayout>
    );
  }

  return (
    <PembimbingLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Users size={28} className="text-blue-600" />
          Daftar Peserta Magang
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola dan pantau peserta magang yang Anda bimbing
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari peserta..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredPeserta.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Universitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPeserta.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {p.nama}
                          </div>
                          <div className="text-sm text-gray-500">{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.nim}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.universitas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          new Date(p.selesai) > new Date()
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {new Date(p.selesai) > new Date() ? "Aktif" : "Selesai"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          router.push(`/pembimbing/PesertaMagang/${p.id}`)
                        }
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        Detail <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Frown className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Tidak ada peserta magang
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Tidak ditemukan hasil pencarian"
                : "Belum ada peserta magang yang dibimbing"}
            </p>
          </div>
        )}
      </div>
    </PembimbingLayout>
  );
}
