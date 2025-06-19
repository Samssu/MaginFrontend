import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Gagal mengirim permintaan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Gambar Kiri */}
      <div className="hidden md:block w-full h-screen">
        <img
          src="/images/laptop.jpg"
          alt="Forgot Password"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Lupa Password */}
      <div className="flex items-center justify-center px-6 py-10 bg-white">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 border rounded-xl p-6 shadow-md text-black"
        >
          <h1 className="text-3xl font-bold text-center">Lupa Password</h1>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </button>

          <p className="text-sm text-center mt-4">
            Sudah ingat password?{" "}
            <Link href="/login" className="underline hover:text-blue-600">
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
