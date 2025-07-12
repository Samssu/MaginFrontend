"use client";

import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PendaftaranMagang() {
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    ttl: "",
    tanggalLahir: "",
    jenisKelamin: "",
    alamat: "",
    noHp: "",
    email: "",
    institusi: "",
    prodi: "",
    jenjang: "",
    semester: "",
    ipk: "",
    mulai: "",
    selesai: "",
    tujuan: "",
    divisi: "",
  });

  const [files, setFiles] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (file && file.size > 1024 * 1024) {
      toast.error("Ukuran file maksimal 1MB.", { position: "bottom-right" });
      e.target.value = "";
      return;
    }

    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });
    Object.entries(files).forEach(([key, file]) => {
      if (file) form.append(key, file);
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/pendaftaran", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Pendaftaran berhasil!", {
        position: "bottom-right",
        autoClose: 3000,
      });

      // Reset form
      setFormData({
        nama: "",
        nik: "",
        ttl: "",
        tanggalLahir: "",
        jenisKelamin: "",
        alamat: "",
        noHp: "",
        email: "",
        institusi: "",
        prodi: "",
        jenjang: "",
        semester: "",
        ipk: "",
        mulai: "",
        selesai: "",
        tujuan: "",
        divisi: "",
      });
      setFiles({});
    } catch (err) {
      toast.error(
        "❌ Pendaftaran gagal. Cek kembali data atau sudah pernah mendaftar.",
        {
          position: "bottom-right",
          autoClose: 5000,
        }
      );
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg space-y-8"
        encType="multipart/form-data"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Form Pendaftaran Magang
        </h1>

        {/* Informasi Pribadi */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-1">
            1. Informasi Pribadi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "nama", label: "Nama Lengkap", required: true },
              { name: "nik", label: "NIK / NIM", required: true },
              { name: "ttl", label: "Tempat Lahir", required: true },
              {
                name: "tanggalLahir",
                label: "Tanggal Lahir",
                type: "date",
                required: true,
              },
              { name: "noHp", label: "Nomor HP", required: true },
              {
                name: "email",
                label: "Email Aktif",
                type: "email",
                required: true,
              },
            ].map(({ name, label, type = "text", required }) => (
              <div key={name}>
                <label className="block mb-1 font-medium text-gray-600">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  required={required}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            ))}

            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-gray-600">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        </section>

        {/* Informasi Pendidikan */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-1">
            2. Informasi Pendidikan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "institusi", label: "Nama Institusi", required: true },
              { name: "prodi", label: "Program Studi", required: true },
              {
                name: "jenjang",
                label: "Jenjang",
                required: true,
                isSelect: true,
              },
              {
                name: "semester",
                label: "Semester Saat Ini",
                type: "number",
                required: true,
              },
              { name: "ipk", label: "IPK Terakhir (opsional)", type: "text" },
            ].map(({ name, label, type = "text", required, isSelect }) => (
              <div key={name}>
                <label className="block mb-1 font-medium text-gray-600">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                {isSelect ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={required}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Pilih Jenjang</option>
                    <option>SMA/SMK</option>
                    <option>D3</option>
                    <option>S1</option>
                    <option>S2</option>
                  </select>
                ) : (
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    required={required}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Detail Magang */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-1">
            3. Detail Magang
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "mulai", label: "Tanggal Mulai", required: true },
              { name: "selesai", label: "Tanggal Selesai", required: true },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block mb-1 font-medium text-gray-600">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  name={name}
                  type="date"
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-gray-600">
                Tujuan Magang <span className="text-red-500">*</span>
              </label>
              <textarea
                name="tujuan"
                value={formData.tujuan}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Divisi Tujuan <span className="text-red-500">*</span>
              </label>
              <select
                name="divisi"
                value={formData.divisi}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Pilih Divisi</option>
                <option>IT</option>
                <option>Humas</option>
                <option>Keuangan</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">
                Surat Pengantar <span className="text-red-500">*</span>
              </label>
              <div className="border border-dashed border-gray-400 rounded-lg px-4 py-3 bg-gray-50 hover:border-blue-400 transition">
                <input
                  type="file"
                  name="suratPengantar"
                  onChange={handleFileChange}
                  required
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:border file:rounded file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">Ukuran maks. 1MB</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dokumen Pendukung */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-1">
            4. Dokumen Pendukung
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "cv", label: "Curriculum Vitae (CV)" },
              { name: "foto", label: "Pas Foto" },
              { name: "ktm", label: "Kartu Tanda Mahasiswa (KTM) / KIS" },
              { name: "transkrip", label: "Transkrip Nilai (opsional)" },
              { name: "rekomendasi", label: "Surat Rekomendasi (opsional)" },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block mb-1 font-medium text-gray-700">
                  {label}
                </label>
                <div className="border border-dashed border-gray-400 rounded-lg px-4 py-3 bg-gray-50 hover:border-blue-400 transition">
                  <input
                    type="file"
                    name={name}
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:border file:rounded file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ukuran maks. 1MB</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Persetujuan */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-1">
            5. Persetujuan
          </h2>
          <div className="space-y-2">
            <label className="flex items-start gap-2">
              <input type="checkbox" required />
              <span>
                Saya menyatakan bahwa data yang saya isi adalah benar.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" required />
              <span>
                Saya menyetujui kebijakan privasi dan ketentuan magang.
              </span>
            </label>
          </div>
        </section>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Kirim Pendaftaran
          </button>
        </div>
      </form>

      {/* Notifikasi Toastify */}
      <ToastContainer />
    </>
  );
}
