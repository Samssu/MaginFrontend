import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import AdminLayout from "../../components/layouts/AdminLayouts";

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      try {
        const decoded = jwt.decode(token);
        if (decoded?.role !== "admin") {
          router.replace("/login");
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        router.replace("/login");
      }
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Selamat Datang, Admin</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-sm">Jumlah Mahasiswa</p>
          <p className="text-3xl font-bold text-gray-800">134</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-sm">Pengajuan Baru</p>
          <p className="text-3xl font-bold text-gray-800">18</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-sm">Pembimbing Aktif</p>
          <p className="text-3xl font-bold text-gray-800">5</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-sm">Total Laporan</p>
          <p className="text-3xl font-bold text-gray-800">97</p>
        </div>
      </div>
    </AdminLayout>
  );
}
