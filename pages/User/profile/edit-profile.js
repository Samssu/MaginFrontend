"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiImage,
  FiSave,
  FiPhone,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    address: "",
    profilePicture: "/images/kokomi.png",
  });
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load user data from localStorage
    const loadUserData = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setFormData({
          name: storedUser.name || "",
          email: storedUser.email || "",
          phone: storedUser.phone || "",
          birthDate: storedUser.birthDate || "",
          gender: storedUser.gender || "",
          address: storedUser.address || "",
          profilePicture: storedUser.profilePicture || "/images/kokomi.png",
        });
        setPreview(storedUser.profilePicture || "/images/kokomi.png");
      }
    };

    loadUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar, maksimal 5MB", {
        position: "bottom-right",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        profilePicture: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser || !token) {
        throw new Error("User not authenticated");
      }

      // Make sure we have the _id
      if (!storedUser._id) {
        throw new Error("User ID not found");
      }

      const response = await axios.put(
        `http://localhost:5000/api/user/${storedUser._id}/edit-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUser = response.data.user;

      // Update localStorage with new data
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          ...updatedUser, // Spread the updated fields
        })
      );

      toast.success("✅ Profil berhasil diperbarui!", {
        position: "bottom-right",
        autoClose: 2500,
        theme: "light",
      });

      setTimeout(() => {
        router.push("/user/dashboard");
      }, 2500);
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "❌ Gagal memperbarui profil.";

      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 3000,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-xl p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Edit Profile
        </h2>

        <div className="flex justify-center">
          <label className="cursor-pointer relative group">
            <img
              src={preview || formData.profilePicture}
              alt="Profile Preview"
              className="w-28 h-28 object-cover rounded-full border-4 border-blue-500"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <FiImage className="text-white text-2xl" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <FiUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="name"
              className="w-full outline-none"
              placeholder="Nama Lengkap"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <FiMail className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              className="w-full outline-none bg-gray-100 cursor-not-allowed"
              placeholder="Email"
              value={formData.email}
              readOnly
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <FiPhone className="text-gray-500 mr-2" />
            <input
              type="tel"
              name="phone"
              className="w-full outline-none"
              placeholder="No. Telepon"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <FiCalendar className="text-gray-500 mr-2" />
            <input
              type="date"
              name="birthDate"
              className="w-full outline-none"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <select
              name="gender"
              className="w-full outline-none"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div className="flex items-start border border-gray-300 rounded-lg px-3 py-2">
            <FiMapPin className="text-gray-500 mt-1 mr-2" />
            <textarea
              name="address"
              className="w-full outline-none resize-none"
              placeholder="Alamat Lengkap"
              value={formData.address}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-70"
          >
            <FiSave className="text-xl" />
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}
