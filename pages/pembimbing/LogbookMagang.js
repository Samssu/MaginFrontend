"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import PembimbingLayout from "@/components/layouts/PembimbingLayout";
import {
  BookOpen,
  ChevronRight,
  Search,
  Frown,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function LogbookMagang() {
  const router = useRouter();
  const [logbooks, setLogbooks] = useState([]);
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

        const response = await axios.get(`/api/pembimbing/${user.id}/logbooks`);
        setLogbooks(response.data);
      } catch (error) {
        console.error("Error fetching logbooks:", error);
        toast.error("Gagal memuat data logbook");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const filteredLogbooks = logbooks.filter(
    (l) =>
      l.mahasiswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.kegiatan.toLowerCase().includes(searchTerm.toLowerCase())
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
          <BookOpen size={28} className="text-blue-600" />
          Logbook Magang
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Review dan verifikasi logbook peserta magang
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
              placeholder="Cari logbook..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredLogbooks.length > 0 ? (
          <div className="space-y-4">
            {filteredLogbooks.map((logbook) => (
              <div
                key={logbook.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {logbook.mahasiswa.nama}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {logbook.kegiatan}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      {new Date(logbook.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {logbook.status === "verified" ? (
                      <span className="flex items-center text-sm text-green-600">
                        <CheckCircle size={16} className="mr-1" /> Terverifikasi
                      </span>
                    ) : (
                      <span className="flex items-center text-sm text-yellow-600">
                        <XCircle size={16} className="mr-1" /> Belum
                        diverifikasi
                      </span>
                    )}
                    <button
                      onClick={() =>
                        router.push(`/pembimbing/LogbookMagang/${logbook.id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                    >
                      Review <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Frown className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Tidak ada logbook
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Tidak ditemukan hasil pencarian"
                : "Belum ada logbook yang perlu direview"}
            </p>
          </div>
        )}
      </div>
    </PembimbingLayout>
  );
}
