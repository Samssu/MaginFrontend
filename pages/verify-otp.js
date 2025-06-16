import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify"; // Impor toast untuk menampilkan notifikasi
import "react-toastify/dist/ReactToastify.css"; // Impor CSS untuk Toastify

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  const { token: tokenFromQuery } = router.query;

  useEffect(() => {
    if (tokenFromQuery) setToken(tokenFromQuery);
  }, [tokenFromQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, token }),
      });

      if (res.ok) {
        // Jika status HTTP 200, berarti OTP berhasil diverifikasi
        toast.success(
          "🎉 Registrasi berhasil! Mengalihkan ke halaman login...",
          {
            position: "bottom-right",
            autoClose: 3000,
          }
        );

        // Setelah menampilkan notifikasi sukses, baru alihkan ke halaman login
        setTimeout(() => {
          router.push("/login"); // Redirect ke halaman login setelah sukses
        }, 1000); // Tunda selama 1 detik untuk memberi waktu notifikasi tampil
      } else if (res.status === 400) {
        // Jika status HTTP 400, berarti OTP tidak valid
        toast.error("OTP tidak valid.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
        // Jika status HTTP lainnya, anggap sebagai kesalahan server
        toast.error("Terjadi kesalahan server.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan server.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Gambar Kiri */}
      <div className="hidden md:block h-full w-full">
        <img
          src="/images/pegangbuku.jpg"
          alt="Verify OTP"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Verify OTP */}
      <div className="flex items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-md space-y-6 border rounded-xl p-6 shadow-md text-black">
          <h1 className="text-3xl font-bold text-center">Verifikasi OTP</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Masukkan kode OTP"
              className="w-full px-4 py-2 mt-1 border rounded-md text-center text-xl tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              autoFocus
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Memverifikasi..." : "Verifikasi OTP"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="w-full border text-gray-700 py-2 rounded-md hover:bg-gray-100"
            >
              Kembali ke Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
