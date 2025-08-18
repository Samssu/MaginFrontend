// pages/admin/logbook-mahasiswa/[id].js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "@/components/layouts/AdminLayouts";
import { BookOpen, ChevronLeft } from "lucide-react";

export default function LogbookMahasiswa() {
  const router = useRouter();
  const { id } = router.query;
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mahasiswa, setMahasiswa] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/mahasiswa/${id}/logbooks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMahasiswa(response.data.mahasiswa);
        setLogbooks(response.data.logbooks);
      } catch (error) {
        console.error("Error fetching logbooks:", error);
        toast.error("Gagal memuat logbook");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ChevronLeft size={18} className="mr-1" />
          Kembali
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Logbook {mahasiswa?.nama}
            </h1>
            <p className="text-gray-500 text-sm">
              {mahasiswa?.institusi} - {mahasiswa?.divisi}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* Tampilkan daftar logbook di sini */}
        {logbooks.length > 0 ? (
          <div className="space-y-4">
            {logbooks.map((logbook) => (
              <div
                key={logbook._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{logbook.kegiatan}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {logbook.deskripsi}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      {new Date(logbook.tanggal).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                  <div>
                    {logbook.status === "verified" ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={14} className="mr-1" />
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock size={14} className="mr-1" />
                        Menunggu
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <Frown size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Tidak ada logbook
            </h3>
            <p className="text-sm text-gray-500">
              Belum ada logbook yang dicatat
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
