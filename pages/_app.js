import "@/styles/globals.css"; // Gaya global Anda
import { ToastContainer } from "react-toastify"; // Impor ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Mengimpor CSS untuk Toastify

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      {/* Menambahkan ToastContainer untuk menampilkan notifikasi */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
