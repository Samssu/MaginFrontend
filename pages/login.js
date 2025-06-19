import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        const decoded = jwt.decode(data.token);

        if (decoded.role === "user" && decoded.isVerified) {
          toast.success("Login berhasil!", {
            position: "bottom-right",
            autoClose: 3000,
          });
          router.push("/user/dashboard");
        } else {
          localStorage.removeItem("token");
          setMessage("Akses ditolak. Silakan verifikasi email.");
          toast.error("Akses ditolak. Silakan verifikasi email.", {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      } else {
        setMessage(data.message || "Email atau password salah.");
        toast.error(data.message || "Email atau password salah.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      setMessage("Terjadi kesalahan server.");
      toast.error("Terjadi kesalahan server.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Gambar Kiri */}
      <div className="hidden md:block w-full h-screen">
        <img
          src="/images/laptop.jpg"
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Login */}
      <div className="flex items-center justify-center px-6 py-10 bg-white relative">
        <div className="w-full max-w-md space-y-6 border rounded-xl p-6 shadow-md text-black relative">
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

          <h1 className="text-3xl font-bold text-center mt-4">Login</h1>

          <form onSubmit={handleLogin} className="space-y-4 mt-4">
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
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Login
            </button>

            <p className="text-sm text-center text-blue-600 hover:underline mt-2">
              <Link href="/forgot-password">Lupa Password?</Link>
            </p>
          </form>

          {message && (
            <p className="text-sm text-center mt-4 text-red-500">{message}</p>
          )}

          <p className="text-sm text-center mt-4">
            Belum punya akun?{" "}
            <Link href="/register" className="underline hover:text-blue-600">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
