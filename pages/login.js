import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@example.com" && password === "admin") {
      setMsg("Login berhasil");
    } else {
      setMsg("Email atau password salah");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {msg && <p className="mb-2 text-red-500">{msg}</p>}
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 mb-4 rounded"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-4 rounded"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </>
  );
}
