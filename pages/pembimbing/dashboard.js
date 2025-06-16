import { useEffect } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken"; // Menggunakan JWT untuk decode token

const PembimbingDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect ke login jika tidak ada token
    } else {
      const decoded = jwt.decode(token); // Decode token untuk mendapatkan role
      if (decoded.role !== "pembimbing") {
        router.push("/login"); // Redirect jika bukan pembimbing
      }
    }
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Pembimbing Dashboard</h1>
      <p className="mt-4">
        Welcome to the Pembimbing Dashboard. You can manage students and provide
        guidance here.
      </p>
      <div className="mt-6">
        <h2 className="text-2xl">Pembimbing Controls:</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>View Students' Progress</li>
          <li>Provide Guidance</li>
          <li>Manage Assignments</li>
        </ul>
      </div>
    </div>
  );
};

export default PembimbingDashboard;
