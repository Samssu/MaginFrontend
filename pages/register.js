import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simpan ke backend nanti
    setMsg("Registrasi berhasil!");
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4">Register</h2>
          {msg && <p className="mb-2 text-green-500">{msg}</p>}
          <input
            name="name"
            type="text"
            placeholder="Nama"
            className="w-full border p-2 mb-4 rounded"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border p-2 mb-4 rounded"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-4 rounded"
            onChange={handleChange}
            required
          />
          <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
            Register
          </button>
        </form>
      </div>
    </>
  );
}
