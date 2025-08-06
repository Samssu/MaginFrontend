import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Cek di client-side
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user) {
        toast.error("Anda harus login terlebih dahulu");
        router.replace("/login");
        return false;
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        toast.error("Anda tidak memiliki akses ke halaman ini");
        router.replace("/");
        return false;
      }

      return true;
    };

    const authResult = checkAuth();
    setIsAuthorized(authResult);
  }, [router, allowedRoles]);

  if (typeof window === "undefined") {
    // Render nothing on server
    return null;
  }

  if (!isAuthorized) {
    // Tampilkan loading atau null saat mengecek auth
    return null;
  }

  return children;
};

export default ProtectedRoute;
