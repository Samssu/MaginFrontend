"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/layouts/AdminLayouts";
import { toast } from "react-toastify";
import { Edit, CheckCircle, XCircle } from "lucide-react";

export default function DataPendaftaran() {
  const [pendaftar, setPendaftar] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    institusi: "",
    semester: "",
    prodi: "",
    email: "",
    jenisKelamin: "",
    alamat: "",
    telepon: "",
    tanggalLahir: "",
    filePdf: "", // jika Anda menyimpan URL file
  });

  const [editId, setEditId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pendaftaran");
      setPendaftar(res.data);
    } catch (error) {
      toast.error("Gagal memuat data pendaftar", { position: "bottom-right" });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId !== null) {
        await axios.put(
          `http://localhost:5000/api/pendaftaran/${editId}`,
          form
        );
        toast.success("Data berhasil diperbarui", { position: "bottom-right" });
        fetchData();
        setEditId(null);
        setForm({
          nama: "",
          institusi: "",
          semester: "",
          prodi: "",
          email: "",
        });
      }
    } catch (error) {
      toast.error("Gagal menyimpan perubahan", { position: "bottom-right" });
    }
  };

  const handleEdit = (data) => {
    setEditId(data._id);
    setForm({
      nama: data.nama || "",
      institusi: data.institusi || "",
      semester: data.semester || "",
      prodi: data.prodi || "",
      email: data.email || "",
      jenisKelamin: data.jenisKelamin || "",
      alamat: data.alamat || "",
      telepon: data.telepon || "",
      tanggalLahir: data.tanggalLahir || "",
      filePdf: data.filePdf || "",
    });
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/pendaftaran/${id}/status`, {
        status,
      });
      toast.success(`Status diubah menjadi ${status}`, {
        position: "bottom-right",
      });
      fetchData();
    } catch (error) {
      toast.error("Gagal mengubah status", { position: "bottom-right" });
    }
  };

  const handleShowDetail = (data) => {
    setSelectedDetail(data);
  };

  const closeModal = () => {
    setSelectedDetail(null);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          📋 Data Pendaftaran Magang
        </h2>
        <p className="text-gray-500">
          Pantau dan kelola data pendaftar magang.
        </p>
      </div>

      {/* Form Edit */}
      {editId && (
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            ✏️ Edit Data Lengkap Pendaftar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Nama Lengkap"
              className="border p-2 rounded"
            />
            <input
              name="institusi"
              value={form.institusi}
              onChange={handleChange}
              placeholder="Institusi"
              className="border p-2 rounded"
            />
            <input
              name="semester"
              value={form.semester}
              onChange={handleChange}
              placeholder="Semester"
              className="border p-2 rounded"
            />
            <input
              name="prodi"
              value={form.prodi}
              onChange={handleChange}
              placeholder="Program Studi"
              className="border p-2 rounded"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded"
            />
            <input
              name="jenisKelamin"
              value={form.jenisKelamin}
              onChange={handleChange}
              placeholder="Jenis Kelamin"
              className="border p-2 rounded"
            />
            <input
              name="telepon"
              value={form.telepon}
              onChange={handleChange}
              placeholder="Nomor HP"
              className="border p-2 rounded"
            />
            <input
              type="date"
              name="tanggalLahir"
              value={form.tanggalLahir}
              onChange={handleChange}
              placeholder="Tanggal Lahir"
              className="border p-2 rounded"
            />
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              placeholder="Alamat Lengkap"
              className="border p-2 rounded md:col-span-2"
              rows={2}
            />

            {/* Tombol lihat file PDF */}
            {form.filePdf && (
              <a
                href={form.filePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                📄 Lihat Surat Pengantar (PDF)
              </a>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Simpan Perubahan
          </button>
        </div>
      )}

      {/* Tabel */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Institusi</th>
              <th className="p-3 text-left">Semester</th>
              <th className="p-3 text-left">Prodi</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pendaftar.map((item) => (
              <tr
                key={item._id}
                className="border-t hover:bg-gray-50 transition-all duration-200"
              >
                <td
                  className="p-3 text-blue-600 hover:underline cursor-pointer"
                  onClick={() => handleShowDetail(item)}
                >
                  {item.nama}
                </td>
                <td className="p-3">{item.institusi}</td>
                <td className="p-3">{item.semester}</td>
                <td className="p-3">{item.prodi}</td>
                <td className="p-3">{item.email}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      item.status === "disetujui"
                        ? "bg-green-100 text-green-800"
                        : item.status === "ditolak"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status || "pending"}
                  </span>
                </td>
                <td className="p-3 flex gap-3 justify-center items-center text-sm">
                  <button
                    onClick={() => handleEdit(item)}
                    title="Edit"
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(item._id, "disetujui")}
                    title="Setujui"
                    className="text-green-600 hover:text-green-800 transition"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(item._id, "ditolak")}
                    title="Tolak"
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <XCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {pendaftar.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Tidak ada data pendaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Detail Pendaftar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {Object.entries(selectedDetail).map(([key, value]) => (
                <div key={key}>
                  <p className="font-semibold capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="text-gray-700">{value || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
