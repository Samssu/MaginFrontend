import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password minimal 8 karakter.",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.token) {
        // Menampilkan notifikasi sukses menggunakan SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "OTP telah dikirim ke email Anda.",
        }).then(() => {
          // Navigasi ke halaman verifikasi dengan membawa email dan token
          router.push({
            pathname: "/verify-otp",
            query: {
              email: form.email,
              token: data.token,
            },
          });
        });
      } else {
        // Menampilkan pesan kesalahan jika registrasi gagal
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: data.message || "Registrasi gagal.",
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Gambar Kiri */}
      <div className="hidden md:block h-full w-full">
        <img
          src="/images/pegangbuku.jpg"
          alt="Register"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Register */}
      <div className="flex items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-md space-y-6 border rounded-xl p-6 shadow-md text-black">
          <h1 className="text-3xl font-bold text-center">Register</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama"
                className="w-full px-4 py-2 mt-1 border rounded-md"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="Masukkan email"
                className="w-full px-4 py-2 mt-1 border rounded-md"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                className="w-full px-4 py-2 mt-1 border rounded-md"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <p className="text-xs text-gray-600 mt-1">
                Minimal 8 karakter berupa huruf, angka, dan simbol.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Register
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full border text-gray-700 py-2 rounded-md hover:bg-gray-100"
            >
              Kembali
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Sudah punya akun?{" "}
            <Link href="/login" className="underline hover:text-blue-600">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
