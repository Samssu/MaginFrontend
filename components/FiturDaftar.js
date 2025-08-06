"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  BookOpen,
  Briefcase,
  FileText,
  CheckCircle,
  AlertCircle,
  File,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PendaftaranMagang() {
  const router = useRouter();
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
  const [filePreviews, setFilePreviews] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  // Check if user has already registered
  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Silakan login terlebih dahulu");
          router.push("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/riwayat", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.length > 0) {
          setHasRegistered(true);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Sesi Anda telah berakhir. Silakan login ulang.");
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          console.error("Error checking registration:", error);
          toast.error("Gagal memeriksa status pendaftaran");
        }
      }
    };
    checkRegistration();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (!file) return;

    // Check file type (must be PDF)
    if (file.type !== "application/pdf") {
      toast.error("Hanya file PDF yang diperbolehkan.", {
        position: "top-center",
      });
      e.target.value = "";
      return;
    }

    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      toast.error("Ukuran file maksimal 1MB.", { position: "top-center" });
      e.target.value = "";
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setFiles((prev) => ({ ...prev, [name]: file }));
    setFilePreviews((prev) => ({ ...prev, [name]: previewUrl }));
  };

  const removeFile = (name) => {
    // Revoke the object URL to avoid memory leaks
    if (filePreviews[name]) {
      URL.revokeObjectURL(filePreviews[name]);
    }

    setFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[name];
      return newFiles;
    });

    setFilePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[name];
      return newPreviews;
    });

    // Reset the file input
    const fileInput = document.querySelector(`input[name="${name}"]`);
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required files are uploaded
    const requiredFiles = ["suratPengantar", "cv", "foto", "ktm"];
    const missingFiles = requiredFiles.filter((file) => !files[file]);

    if (missingFiles.length > 0) {
      toast.error(
        `Harap unggah semua dokumen wajib: ${missingFiles.join(", ")}`,
        {
          position: "top-center",
        }
      );
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    setIsSubmitting(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      Object.entries(files).forEach(([key, file]) => {
        if (file) form.append(key, file);
      });

      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/pendaftaran", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        <div>
          <div className="font-bold">✅ Pendaftaran Berhasil!</div>
          <div className="text-sm">Data magang Anda telah terkirim.</div>
          <div className="text-sm mt-1">
            Anda akan diarahkan ke halaman riwayat.
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          onClose: () => router.push("/user/riwayat"),
        }
      );

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

      // Clean up file preview URLs
      Object.values(filePreviews).forEach((url) => URL.revokeObjectURL(url));

      setFiles({});
      setFilePreviews({});
      setShowConfirmation(false);
      setHasRegistered(true);

      // Redirect after 5 seconds
      setTimeout(() => {
        router.push("/user/riwayat");
      }, 5000);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Sesi Anda telah berakhir. Silakan login ulang.");
        localStorage.removeItem("token");
        router.push("/login");
      } else if (
        err.response?.status === 400 &&
        err.response.data?.message === "Anda sudah terdaftar"
      ) {
        toast.error(
          <div>
            <div className="font-bold">❌ Pendaftaran Gagal</div>
            <div className="text-sm">
              Anda sudah melakukan pendaftaran sebelumnya.
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: 5000,
            onClose: () => router.push("/user/riwayat"),
          }
        );
        setHasRegistered(true);
      } else {
        toast.error(
          <div>
            <div className="font-bold">❌ Pendaftaran Gagal</div>
            <div className="text-sm">Cek kembali data yang Anda masukkan.</div>
            {err.response?.data?.message && (
              <div className="text-sm">Error: {err.response.data.message}</div>
            )}
          </div>,
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-6 text-center">
            <CheckCircle className="mx-auto text-white" size={48} />
            <h2 className="text-2xl font-bold text-white mt-4">
              Pendaftaran Sudah Dilakukan
            </h2>
          </div>
          <div className="p-8 text-center">
            <p className="text-gray-700 mb-6">
              Anda sudah melakukan pendaftaran sebelumnya. Silakan cek status
              pendaftaran Anda di halaman riwayat.
            </p>
            <button
              onClick={() => router.push("/user/riwayat")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition w-full"
            >
              Lihat Riwayat Pendaftaran
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-blue-600 p-6 text-center">
              <AlertCircle className="mx-auto text-white" size={48} />
              <h2 className="text-2xl font-bold text-white mt-4">
                Konfirmasi Pendaftaran
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Apakah Anda yakin data yang diisi sudah benar? Pendaftaran hanya
                bisa dilakukan 1 kali.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-3 rounded-lg transition"
                >
                  Periksa Kembali
                </button>
                <button
                  onClick={confirmSubmission}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg transition disabled:opacity-50"
                >
                  {isSubmitting ? "Mengirim..." : "Ya, Kirim Sekarang"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Formulir Pendaftaran Magang
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lengkapi formulir berikut dengan data yang valid untuk mengajukan
            permohonan magang
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
          encType="multipart/form-data"
        >
          {/* Section 1: Informasi Pribadi */}
          <section className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <User className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Informasi Pribadi
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    required={required}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              ))}

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <select
                  name="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option>Laki-laki</option>
                  <option>Perempuan</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Informasi Pendidikan */}
          <section className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Informasi Pendidikan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                  </label>
                  {isSelect ? (
                    <select
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      required={required}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Detail Magang */}
          <section className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Briefcase className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Detail Magang
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "mulai",
                  label: "Tanggal Mulai",
                  type: "date",
                  required: true,
                },
                {
                  name: "selesai",
                  label: "Tanggal Selesai",
                  type: "date",
                  required: true,
                },
              ].map(({ name, label, type, required }) => (
                <div key={name}>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    required={required}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Tujuan Magang <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="tujuan"
                  value={formData.tujuan}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Divisi <span className="text-red-500">*</span>
                </label>
                <select
                  name="divisi"
                  value={formData.divisi}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Pilih Divisi</option>
                  <option>Teknik Informatika</option>
                  <option>Sistem Informasi</option>
                  <option>Ilmu Komputer</option>
                  <option>Teknologi Informasi</option>
                  <option>Manajemen Informatika</option>
                  <option>Teknik Komputer</option>
                  <option>Rekayasa Perangkat Lunak</option>
                  <option>Jaringan Komputer</option>
                  <option>Multimedia</option>
                  <option>Komputer Akuntansi</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Surat Pengantar <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-blue-400 transition">
                  <input
                    type="file"
                    name="suratPengantar"
                    onChange={handleFileChange}
                    accept=".pdf"
                    required={!files.suratPengantar}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:rounded-lg file:cursor-pointer"
                  />
                  {files.suratPengantar && (
                    <div className="mt-3 flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <File className="text-blue-600 mr-2" size={18} />
                        <a
                          href={filePreviews.suratPengantar}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {files.suratPengantar.name}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("suratPengantar")}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Format: PDF, maks. 1MB
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Dokumen Pendukung */}
          <section className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FileText className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Dokumen Pendukung
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "cv", label: "Curriculum Vitae (CV)", required: true },
                { name: "foto", label: "Pas Foto", required: true },
                {
                  name: "ktm",
                  label: "Kartu Tanda Mahasiswa (KTM) / KIS",
                  required: true,
                },
                { name: "transkrip", label: "Transkrip Nilai (opsional)" },
                { name: "rekomendasi", label: "Surat Rekomendasi (opsional)" },
              ].map(({ name, label, required }) => (
                <div key={name}>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-blue-400 transition">
                    <input
                      type="file"
                      name={name}
                      onChange={handleFileChange}
                      accept=".pdf"
                      required={required && !files[name]}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:rounded-lg file:cursor-pointer"
                    />
                    {files[name] && (
                      <div className="mt-3 flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <File className="text-blue-600 mr-2" size={18} />
                          <a
                            href={filePreviews[name]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {files[name].name}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(name)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Format: PDF, maks. 1MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Persetujuan */}
          <section className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Persetujuan
            </h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  Saya menyatakan bahwa data yang saya isi adalah benar dan
                  dapat dipertanggungjawabkan.
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  Saya menyetujui seluruh kebijakan privasi dan ketentuan magang
                  yang berlaku.
                </span>
              </label>
            </div>
          </section>

          {/* Submit Button */}
          <div className="px-8 pb-8">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
            >
              Kirim Pendaftaran Magang
            </button>
          </div>
        </form>
      </div>

      {/* Notifikasi Toastify */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
