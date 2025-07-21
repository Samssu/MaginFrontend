import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      const { token, message } = data;

      if (res.ok && token) {
        localStorage.setItem("token", token);
        const decoded = jwt.decode(token);

        if (decoded?.role === "user" && decoded?.isVerified) {
          toast.success("Login berhasil!");
          router.push("/user/dashboard");
        } else {
          localStorage.removeItem("token");
          toast.error("Akses ditolak. Verifikasi email Anda.");
        }
      } else {
        toast.error(message || "Email atau password salah.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan server.");
    }
  };

  return (
    <>
      <Head>
        <title>Login | Pendaftaran Magang Kominfo</title>
      </Head>

      <div className="relative min-h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Gambar background absolute */}
        <div className="hidden md:block relative">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/laptop.jpg"
              alt="Gambar Login"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Form login */}
        <div className="flex items-center justify-center px-8 py-12 bg-white relative z-10">
          <div className="w-full max-w-md">
            {/* Tombol Kembali */}
            <button
              onClick={() => window.history.back()}
              className="mb-4 text-sm text-black-600 hover:underline flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Kembali
            </button>
            <h1 className="text-4xl font-bold mb-8 text-gray-900 text-left">
              Masuk
            </h1>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Alamat Email
                </label>
                <input
                  type="email"
                  placeholder="Masukkan email anda"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      // Eye-off icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.978 0-9.214-3.014-11-7 1.055-2.29 2.951-4.195 5.241-5.25m3.52-.795A9.956 9.956 0 0112 5c4.978 0 9.214 3.014 11 7a10.052 10.052 0 01-4.273 4.703M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      // Eye icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimal 8 karakter, gunakan kombinasi huruf, angka, dan
                  simbol.
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                    className="accent-blue-600"
                  />
                  Ingat saya
                </label>

                <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Masuk
              </button>
            </form>

            <div className="mt-8 text-sm text-center">
              Belum punya akun?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Daftar di sini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
