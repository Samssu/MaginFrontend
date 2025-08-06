import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

export default function VerifyOtp() {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  const { token: tokenFromQuery } = router.query;

  useEffect(() => {
    if (tokenFromQuery) setToken(tokenFromQuery);
  }, [tokenFromQuery]);

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otpDigits];
      newOtp[index] = value;
      setOtpDigits(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const newOtp = [...otpDigits];
      newOtp[index - 1] = "";
      setOtpDigits(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      toast.error("OTP harus terdiri dari 6 digit.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, token }),
      });

      if (res.ok) {
        toast.success(
          "🎉 Registrasi berhasil! Mengalihkan ke halaman login...",
          {
            position: "bottom-right",
            autoClose: 3000,
          }
        );
        setTimeout(() => router.push("/login"), 1000);
      } else if (res.status === 400) {
        toast.error("OTP tidak valid.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
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
    <>
      <Head>
        <title>Verifikasi OTP</title>
      </Head>

      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-blue-50 to-white">
        {/* Left Image with Overlay */}
        <div className="hidden md:block relative h-full w-full">
          <div className="absolute inset-0 bg-blue-900/10 z-10"></div>
          <img
            src="/images/pegangbuku.jpg"
            alt="Verify OTP"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Verification Form */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md space-y-6 border border-gray-100 rounded-xl p-8 shadow-lg bg-white animate-fade-in relative">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Kembali
            </button>

            {/* Logo/Icon */}
            <div className="flex justify-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-gray-800">
              Verifikasi OTP
            </h1>
            <p className="text-center text-gray-500">
              Masukkan 6 digit kode yang dikirim ke email Anda
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="flex justify-center gap-3">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md ${
                  loading ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Memverifikasi...
                  </span>
                ) : (
                  "Verifikasi OTP"
                )}
              </button>
            </form>

            <div className="text-center text-sm text-gray-500">
              Tidak menerima kode?{" "}
              <button className="text-blue-600 font-medium hover:text-blue-700">
                Kirim ulang
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
