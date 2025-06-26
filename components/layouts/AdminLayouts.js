import { useRouter } from "next/router";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  UserPlus,
  LogOut,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 font-bold text-xl border-b">Admin Panel</div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/Admin/dashboard">
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                  <LayoutDashboard size={20} />
                  Dashboard
                </div>
              </Link>
            </li>
            <li>
              <Link href="/Admin/DataMagang">
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                  <FileText size={20} />
                  Data Pendaftaran
                </div>
              </Link>
            </li>
            <li>
              <Link href="/Admin/Datapembimbing">
                <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                  <Users size={20} />
                  Data Pembimbing
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">👤 Admin</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              <LogOut size={16} className="inline mr-1" />
              Logout
            </button>
          </div>
        </header>

        {/* Children */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
