import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        router.push("/login");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Gagal mereset password.");
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
          alt="Reset Password"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Reset Password */}
      <div className="flex items-center justify-center px-6 py-10 bg-white">
        <form
          onSubmit={handleReset}
          className="w-full max-w-md space-y-6 border rounded-xl p-6 shadow-md text-black"
        >
          <h1 className="text-3xl font-bold text-center">Reset Password</h1>

          <div>
            <label className="text-sm font-medium">Password Baru</label>
            <input
              type="password"
              placeholder="Masukkan password baru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            {loading ? "Mengubah..." : "Ubah Password"}
          </button>

          <p className="text-sm text-center mt-4">
            Ingat password?{" "}
            <Link href="/login" className="underline hover:text-blue-600">
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
