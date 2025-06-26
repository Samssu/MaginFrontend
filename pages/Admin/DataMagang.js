import { useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayouts";

export default function DataPendaftaran() {
  const [mahasiswa, setMahasiswa] = useState([
    {
      id: 1,
      nama: "Ahmad Rafi",
      universitas: "Universitas Indonesia",
      semester: 6,
      prodi: "Teknik Informatika",
      email: "ahmad.rafi@example.com",
    },
    {
      id: 2,
      nama: "Nadia Putri",
      universitas: "Universitas Bina Darma",
      semester: 4,
      prodi: "Sistem Informasi",
      email: "nadia.putri@example.com",
    },
  ]);

  const [form, setForm] = useState({
    nama: "",
    universitas: "",
    semester: "",
    prodi: "",
    email: "",
  });

  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editId !== null) {
      // Update
      setMahasiswa(
        mahasiswa.map((mhs) => (mhs.id === editId ? { ...mhs, ...form } : mhs))
      );
      setEditId(null);
    } else {
      // Tambah baru
      const newData = {
        ...form,
        id: Date.now(),
      };
      setMahasiswa([...mahasiswa, newData]);
    }
    setForm({ nama: "", universitas: "", semester: "", prodi: "", email: "" });
  };

  const handleEdit = (data) => {
    setEditId(data.id);
    setForm(data);
  };

  const handleDelete = (id) => {
    setMahasiswa(mahasiswa.filter((mhs) => mhs.id !== id));
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Data Pendaftaran Mahasiswa</h2>

      {/* Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nama"
            placeholder="Nama Mahasiswa"
            className="border p-2 rounded w-full"
            value={form.nama}
            onChange={handleChange}
          />
          <input
            type="text"
            name="universitas"
            placeholder="Universitas"
            className="border p-2 rounded w-full"
            value={form.universitas}
            onChange={handleChange}
          />
          <input
            type="number"
            name="semester"
            placeholder="Semester"
            className="border p-2 rounded w-full"
            value={form.semester}
            onChange={handleChange}
          />
          <input
            type="text"
            name="prodi"
            placeholder="Program Studi"
            className="border p-2 rounded w-full"
            value={form.prodi}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border p-2 rounded w-full"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editId !== null ? "Update" : "Tambah"}
        </button>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Universitas</th>
              <th className="p-3 text-left">Semester</th>
              <th className="p-3 text-left">Prodi</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mahasiswa.map((mhs) => (
              <tr key={mhs.id} className="border-t">
                <td className="p-3">{mhs.nama}</td>
                <td className="p-3">{mhs.universitas}</td>
                <td className="p-3">{mhs.semester}</td>
                <td className="p-3">{mhs.prodi}</td>
                <td className="p-3">{mhs.email}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(mhs)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(mhs.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {mahasiswa.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Belum ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
