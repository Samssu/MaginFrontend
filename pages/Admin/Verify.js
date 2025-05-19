import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { token: tokenFromQuery } = router.query;
  const [token, setToken] = useState("");

  useEffect(() => {
    if (tokenFromQuery) setToken(tokenFromQuery);
  }, [tokenFromQuery]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("http://localhost:5000/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp, token }),
    });
    const data = await res.json();

    if (data.message === "OTP verified successfully") {
      setMessage("Registrasi berhasil! Mengalihkan ke halaman login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000); // redirect setelah 2 detik
    } else {
      setMessage(data.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Verifikasi OTP
        </h2>
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            placeholder="Masukkan OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Memverifikasi..." : "Verifikasi OTP"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
