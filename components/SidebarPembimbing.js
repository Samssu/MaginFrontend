"use client";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export default function SidebarPembimbing({ user }) {
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/pembimbing/dashboard",
    },
    {
      name: "Mahasiswa Bimbingan",
      icon: <Users size={18} />,
      path: "/pembimbing/mahasiswa",
    },
    {
      name: "Logbook",
      icon: <BookOpen size={18} />,
      path: "/pembimbing/logbook",
    },
    {
      name: "Laporan Akhir",
      icon: <FileText size={18} />,
      path: "/pembimbing/laporan",
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="w-64 bg-white shadow-md hidden md:block">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">Pembimbing {user?.divisi}</p>
          </div>
        </div>
      </div>

      <nav className="p-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg mb-1 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              router.pathname === item.path
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg mb-1 text-red-600 hover:bg-red-50 mt-4"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
