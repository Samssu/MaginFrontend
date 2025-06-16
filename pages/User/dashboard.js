import { useEffect } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import Navbar from "../../components/Navbar"; // Dua tingkat ke atas dari /pages/user

const UserDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Raw token from localStorage:", token);

    if (!token) {
      console.log("Token not found, redirecting to login...");
      router.push("/login");
      return;
    }

    const decoded = jwt.decode(token);
    console.log("Decoded token:", decoded);

    // Cek apakah properti role ada dan nilainya
    if (!decoded?.role) {
      console.warn("Role not found in token! Redirecting to login...");
      router.push("/login");
      return;
    }

    const userRole = decoded.role;
    console.log("User role from token:", userRole);

    if (userRole !== "user") {
      console.warn("Role is not 'user', redirecting to login...");
      router.push("/login");
      return;
    }
  }, [router]);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <p className="mt-4">
          Welcome to your dashboard. Here you can manage your profile and view
          your activities.
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
