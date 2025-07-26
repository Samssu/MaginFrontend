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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setName(storedUser.name || "");
      setEmail(storedUser.email || "");
      setPhone(storedUser.phone || "");
      setBirthDate(storedUser.birthDate || "");
      setGender(storedUser.gender || "");
      setAddress(storedUser.address || "");
      setProfilePicture(storedUser.profilePicture || "/images/kokomi.png");
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        name,
        email,
        phone,
        birthDate,
        gender,
        address,
        profilePicture,
      };

      // Simulasi API Update
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui profil.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Edit Profile
        </h2>

        <div className="flex justify-center">
          <label className="cursor-pointer relative group">
            <img
              src={preview || profilePicture}
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

        <form onSubmit={handleSave} className="space-y-4">
          {/* Name */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <FiUser className="text-gray-500 mr-2" />
            <input
              type="text"
              className="w-full outline-none"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email - readOnly */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <FiMail className="text-gray-500 mr-2" />
            <input
              type="email"
              className="w-full outline-none bg-gray-100 cursor-not-allowed"
              placeholder="Email"
              value={email}
              readOnly
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <FiPhone className="text-gray-500 mr-2" />
            <input
              type="tel"
              className="w-full outline-none"
              placeholder="No. Telepon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Birth Date */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <FiCalendar className="text-gray-500 mr-2" />
            <input
              type="date"
              className="w-full outline-none"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          {/* Gender */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <select
              className="w-full outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          {/* Address */}
          <div className="flex items-start border border-gray-300 rounded-lg px-3 py-2">
            <FiMapPin className="text-gray-500 mt-1 mr-2" />
            <textarea
              className="w-full outline-none resize-none"
              placeholder="Alamat Lengkap"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <FiSave className="text-xl" />
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
