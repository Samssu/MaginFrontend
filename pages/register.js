import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.error("Password minimal 8 karakter.");
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
        toast.success("OTP telah dikirim ke email Anda.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        router.push({
          pathname: "/verify-otp",
          query: {
            email: form.email,
            token: data.token,
          },
        });
      } else {
        toast.error(data.message || "Registrasi gagal.");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
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
      <div className="flex items-center justify-center px-6 py-10 bg-white relative">
        <div className="w-full max-w-md space-y-6 border rounded-xl p-6 shadow-md text-black relative">
          {/* Tombol Kembali di Kiri Atas */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="absolute top-4 left-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:scale-105 transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali
          </button>

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
