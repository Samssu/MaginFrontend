import { useRouter } from "next/router";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  BookOpenCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

const menuItems = [
  { label: "Dashboard", href: "/Admin/dashboard", icon: LayoutDashboard },
  { label: "Data Pendaftaran", href: "/Admin/DataMagang", icon: FileText },
  { label: "Data Pembimbing", href: "/Admin/Datapembimbing", icon: Users },
  {
    label: "Data Logbook Magang",
    href: "/Admin/Datalogbook",
    icon: BookOpenCheck,
  },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    setActivePath(router.pathname);
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 text-2xl font-bold text-blue-600 border-b border-gray-200">
          Admin Panel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map(({ label, href, icon: Icon }) => (
            <Link href={href} key={href}>
              <div
                className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-lg transition-all cursor-pointer",
                  activePath === href
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-100"
                )}
              >
                <Icon size={20} />
                {label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b">
          <h1 className="text-xl font-semibold tracking-tight">
            Dashboard Admin
          </h1>
          <div className="flex items-center space-x-3 text-gray-600">
            <span>👤 Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
