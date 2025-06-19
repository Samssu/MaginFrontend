import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        const decoded = JSON.parse(atob(data.token.split(".")[1]));

        if (decoded.role === "admin") {
          localStorage.setItem("token", data.token);
          toast.success("Login Admin berhasil!");
          router.push("/admin/dashboard");
        } else {
          toast.error("Akun ini bukan admin.");
        }
      } else {
        toast.error(data.message || "Email atau password salah.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukan Email Admin anda"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
          >
            {loading ? "Logging in..." : "Login Admin"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Kembali ke halaman utama?{" "}
          <span
            onClick={() => router.push("/")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Klik di sini
          </span>
        </p>
      </div>
    </div>
  );
}
