import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white hidden md:block h-full">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Magang
      </div>
      <nav className="mt-4 flex flex-col space-y-2 px-4">
        <Link href="/user" className="hover:bg-gray-700 p-2 rounded">
          Dashboard
        </Link>
        <Link
          href="/user/pendaftaran"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Pendaftaran Magang
        </Link>
        <Link href="/user/logbook" className="hover:bg-gray-700 p-2 rounded">
          Logbook Magang
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
