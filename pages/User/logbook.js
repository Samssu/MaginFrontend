import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import jwt from "jsonwebtoken";
import Navbar2 from "@/components/Navbar2";
import Image from "next/image";
import { motion } from "framer-motion";
import Logbook from "@/components/fiturlogbook";
import Footer from "@/components/Footer";
import { User, BookOpen, UserCog, Building, GraduationCap } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

export default function FiturLogbook({ userId }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [riwayatData, setRiwayatData] = useState(null);
  const [pembimbing, setPembimbing] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const verifyTokenAndFetchData = async () => {
      try {
        const decoded = jwt.decode(token);
        if (!decoded?.role || decoded.role !== "user") {
          router.push("/");
          return;
        }

        setAuthorized(true);
        await Promise.all([
          fetchUserData(decoded.email),
          fetchRiwayatData(decoded.email),
        ]);
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/");
      }
    };

    verifyTokenAndFetchData();
  }, [router]);

  const fetchUserData = async (email) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/pendaftaran/email/${email}`
      );
      setUserData(response.data);
      if (response.data.pembimbingId) {
        await fetchPembimbingData(response.data.pembimbingId);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Gagal memuat data peserta");
    } finally {
      setLoading(false);
    }
  };

  const fetchRiwayatData = async (email) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/riwayat`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userId) {
        const selectedRiwayat = response.data.find(
          (item) => item._id === userId
        );
        setRiwayatData(selectedRiwayat);
        // Jika riwayat memiliki data pembimbing lengkap, gunakan itu
        if (selectedRiwayat?.pembimbing) {
          setPembimbing(selectedRiwayat.pembimbing);
        } else if (selectedRiwayat?.pembimbingId) {
          // Jika hanya ada ID, fetch data pembimbing
          await fetchPembimbingData(selectedRiwayat.pembimbingId);
        }
      } else {
        setRiwayatData(response.data[0]);
        // Jika riwayat memiliki data pembimbing lengkap, gunakan itu
        if (response.data[0]?.pembimbing) {
          setPembimbing(response.data[0].pembimbing);
        } else if (response.data[0]?.pembimbingId) {
          // Jika hanya ada ID, fetch data pembimbing
          await fetchPembimbingData(response.data[0].pembimbingId);
        }
      }
    } catch (error) {
      console.error("Error fetching riwayat data:", error);
      toast.error("Gagal memuat data riwayat");
    }
  };

  const fetchPembimbingData = async (pembimbingId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/pembimbing/${pembimbingId}`
      );
      setPembimbing(response.data);
    } catch (error) {
      console.error("Error fetching pembimbing data:", error);
      toast.error("Gagal memuat data pembimbing");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${date.getDate()} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  if (!authorized) return null;

  return (
    <>
      <Head>
        <title>Logbook Magang</title>
        <meta
          name="description"
          content="Kelola dan isi logbook kegiatan magang kamu"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar2 />

      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-4 w-full max-w-6xl mx-auto">
          <motion.h1
            className="text-3xl md:text-4xl font-bold"
            variants={fadeInVariant}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            Logbook Magang
          </motion.h1>
          <motion.p
            className="mt-3 text-md text-gray-200"
            variants={fadeInVariant}
            initial="hidden"
            animate="visible"
            custom={0.4}
          >
            Catat dan pantau perkembangan aktivitas magang kamu
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 max-w-5xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : userData || riwayatData ? (
          <>
            {/* User Information Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <User className="text-blue-200" size={18} />
                      <span className="text-sm md:text-base">
                        Informasi Magang
                      </span>
                    </h2>
                    <p className="text-blue-100 text-xs mt-1">
                      Detail singkat magang Anda
                    </p>
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-0 p-0">
                {/* Name */}
                <div className="bg-blue-50 p-4 border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="flex items-center gap-3 h-full">
                    <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                      <User className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500">
                        Nama
                      </h3>
                      <p className="text-sm font-medium text-gray-800">
                        {riwayatData?.nama || userData?.nama || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Institution */}
                <div className="bg-blue-50 p-4 border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="flex items-center gap-3 h-full">
                    <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                      <GraduationCap className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500">
                        Institusi
                      </h3>
                      <p className="text-sm font-medium text-gray-800">
                        {riwayatData?.institusi || userData?.institusi || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Division */}
                <div className="bg-blue-50 p-4 border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="flex items-center gap-3 h-full">
                    <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                      <Building className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500">
                        Divisi
                      </h3>
                      <p className="text-sm font-medium text-gray-800">
                        {riwayatData?.divisi ||
                          userData?.divisi ||
                          "Belum ditentukan"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Supervisor */}
                <div className="bg-blue-50 p-4">
                  <div className="flex items-center gap-3 h-full">
                    <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                      <UserCog className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500">
                        Pembimbing
                      </h3>
                      <p className="text-sm font-medium text-gray-800">
                        {riwayatData?.pembimbing?.nama ||
                          pembimbing?.nama ||
                          "Belum ditentukan"}
                      </p>
                      {riwayatData?.pembimbing?.divisi && (
                        <p className="text-xs text-gray-500 mt-1">
                          Divisi: {riwayatData.pembimbing.divisi}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Internship Period */}
                <div className="bg-blue-50 p-4 col-span-1 md:col-span-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                      <BookOpen className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500">
                        Periode Magang
                      </h3>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(riwayatData?.mulai || userData?.mulai)} -{" "}
                        {formatDate(riwayatData?.selesai || userData?.selesai)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logbook Component */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Logbook
                userId={riwayatData?._id || userData?._id}
                periodeMulai={riwayatData?.mulai || userData?.mulai}
                periodeSelesai={riwayatData?.selesai || userData?.selesai}
                onEntryAdded={() =>
                  fetchLogbookData(riwayatData?._id || userData?._id)
                }
              />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-sm text-gray-600">
              Tidak dapat memuat data peserta. Silakan coba lagi.
            </p>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
