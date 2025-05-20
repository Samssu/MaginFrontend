import { useState } from "react";
import { FaHome, FaUser, FaCog } from "react-icons/fa";
import Link from "next/link";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <ul className="space-y-4 p-6">
          <li
            className={`flex items-center space-x-2 cursor-pointer ${
              activeTab === "home" ? "bg-blue-700" : ""
            }`}
            onClick={() => setActiveTab("home")}
          >
            <FaHome />
            <span>Home</span>
          </li>
          <li
            className={`flex items-center space-x-2 cursor-pointer ${
              activeTab === "profile" ? "bg-blue-700" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser />
            <span>Profile</span>
          </li>
          <li
            className={`flex items-center space-x-2 cursor-pointer ${
              activeTab === "settings" ? "bg-blue-700" : ""
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog />
            <span>Settings</span>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Welcome to the Dashboard</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Logout
          </button>
        </header>

        {/* Main Content */}
        <div className="space-y-4">
          {activeTab === "home" && (
            <div className="bg-gray-100 p-6 rounded-md shadow-md">
              <h3 className="text-xl font-semibold">Home</h3>
              <p>This is the Home section of your dashboard.</p>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-gray-100 p-6 rounded-md shadow-md">
              <h3 className="text-xl font-semibold">Profile</h3>
              <p>This is the Profile section of your dashboard.</p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-gray-100 p-6 rounded-md shadow-md">
              <h3 className="text-xl font-semibold">Settings</h3>
              <p>This is the Settings section of your dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
