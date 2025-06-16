import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateAdmin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in as an admin.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Admin account created successfully!");
      } else {
        setMessage(data.message || "Failed to create admin.");
      }
    } catch (err) {
      setMessage("Error occurred while creating admin.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Create Admin</h1>
      <form onSubmit={handleCreateAdmin} className="mt-4 space-y-4">
        <div>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 mt-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 mt-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 mt-4 rounded-md"
        >
          Create Admin
        </button>
      </form>
      {message && <p className="text-red-500 mt-4">{message}</p>}
    </div>
  );
}
