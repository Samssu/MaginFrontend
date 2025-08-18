"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  User,
  GraduationCap,
  Building,
  UserCog,
} from "lucide-react";

export default function LogbookMagang() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mahasiswaId = searchParams.get("id");

  const [dataMagang, setDataMagang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${date.getDate()} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`/api/pembimbing/${user.id}/logbooks`);
        const data = response.data;

        setDataMagang(data);

        // Set mahasiswa yang dipilih berdasarkan ID dari URL atau mahasiswa pertama
        if (mahasiswaId && data.length > 0) {
          const selected = data.find(
            (item) => item.mahasiswa._id === mahasiswaId
          );
          setSelectedMahasiswa(selected || data[0]);
        } else if (data.length > 0) {
          setSelectedMahasiswa(data[0]);
        }
      } catch (error) {
        console.error("Error fetching logbooks:", error);
        toast.error("Gagal memuat data logbook");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, mahasiswaId]);

  const filteredLogbooks = selectedMahasiswa?.logbooks?.filter((l) =>
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

      {/* Informasi Magang */}
      {dataMagang.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="text-blue-200" size={18} />
                  <span className="text-sm md:text-base">Informasi Magang</span>
                </h2>
                <p className="text-blue-100 text-xs mt-1">
                  Detail peserta magang yang Anda bimbing
                </p>
              </div>
              {dataMagang.length > 1 && (
                <select
                  className="bg-blue-700 text-white rounded-md px-3 py-1 text-sm"
                  onChange={(e) => {
                    const selected = dataMagang[e.target.value];
                    setSelectedMahasiswa(selected);
                    router.push(
                      `/pembimbing/LogbookMagang?id=${selected.mahasiswa._id}`
                    );
                  }}
                  value={dataMagang.findIndex(
                    (item) =>
                      item.mahasiswa._id === selectedMahasiswa?.mahasiswa?._id
                  )}
                >
                  {dataMagang.map((item, index) => (
                    <option key={index} value={index}>
                      {item.mahasiswa.nama}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 p-0">
            {/* Nama */}
            <div className="bg-blue-50 p-4 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-3 h-full">
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <User className="text-blue-600" size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Nama</h3>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedMahasiswa?.mahasiswa?.nama || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Institusi */}
            <div className="bg-blue-50 p-4 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-3 h-full">
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <GraduationCap className="text-blue-600" size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">
                    Institusi
                  </h3>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedMahasiswa?.mahasiswa?.institusi || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Divisi */}
            <div className="bg-blue-50 p-4 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-3 h-full">
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <Building className="text-blue-600" size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Divisi</h3>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedMahasiswa?.mahasiswa?.divisi || "Belum ditentukan"}
                  </p>
                </div>
              </div>
            </div>

            {/* Pembimbing */}
            <div className="bg-blue-50 p-4">
              <div className="flex items-center gap-3 h-full">
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <UserCog className="text-blue-600" size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">
                    Pembimbing
                  </h3>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedMahasiswa?.pembimbing?.nama || "Anda"}
                  </p>
                  {selectedMahasiswa?.pembimbing?.divisi && (
                    <p className="text-xs text-gray-500 mt-1">
                      Divisi: {selectedMahasiswa.pembimbing.divisi}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Periode Magang */}
            <div className="bg-blue-50 p-4 col-span-1 md:col-span-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <BookOpen className="text-blue-600" size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">
                    Periode Magang
                  </h3>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(selectedMahasiswa?.periode?.mulai)} -{" "}
                    {formatDate(selectedMahasiswa?.periode?.selesai)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daftar Logbook */}
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

        {filteredLogbooks?.length > 0 ? (
          <div className="space-y-4">
            {filteredLogbooks.map((logbook) => (
              <div
                key={logbook.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
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
                        router.push(
                          `/pembimbing/LogbookMagang/${logbook.id}?id=${selectedMahasiswa.mahasiswa._id}`
                        )
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
