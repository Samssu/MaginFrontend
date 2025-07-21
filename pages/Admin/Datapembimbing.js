"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayouts";
import axios from "axios";
import { toast } from "react-toastify";
import { UserCircle2 } from "lucide-react";

export default function Pembimbing() {
  const [pembimbing, setPembimbing] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    divisi: "",
  });

  useEffect(() => {
    fetchPembimbing();
  }, []);

  const fetchPembimbing = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pembimbing");
      setPembimbing(res.data);
    } catch (error) {
      toast.error("Gagal memuat data pembimbing", {
        position: "bottom-right",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/pembimbing", {
        ...form,
        role: "pembimbing",
      });
      toast.success("Pembimbing berhasil ditambahkan");
      setShowModal(false);
      setForm({ nama: "", email: "", password: "", divisi: "" });
      fetchPembimbing();
    } catch (err) {
      toast.error("Gagal menambahkan pembimbing");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <UserCircle2 className="text-blue-600" size={28} />
            Data Pembimbing Magang
          </h2>
          <p className="text-gray-500 text-sm">
            Informasi lengkap pembimbing yang aktif di sistem.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Tambah Pembimbing
        </button>
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
                <td className="p-3 text-center">{item.jumlahMahasiswa || 0}</td>
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

      {/* Modal Tambah Pembimbing */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Tambah Pembimbing
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nama Pembimbing"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <select
                value={form.divisi}
                onChange={(e) => setForm({ ...form, divisi: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Pilih Divisi --</option>
                <option value="Jaringan">Jaringan</option>
                <option value="Akuntansi">Akuntansi</option>
                <option value="Programmer">Programmer</option>
                <option value="Multimedia">Multimedia</option>
                <option value="Administrasi">Administrasi</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
