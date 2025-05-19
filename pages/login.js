import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
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
        router.push("/dashboard");
      } else {
        setMessage(data.error || "Email atau password salah.");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan server.");
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
      <div className="flex items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-md space-y-6 border rounded-xl p-6 shadow-md text-black">
          <h1 className="text-3xl font-bold text-center">Login</h1>

          <form onSubmit={handleLogin} className="space-y-4">
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

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full border text-gray-700 py-2 rounded-md hover:bg-gray-100"
            >
              Kembali
            </button>
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
