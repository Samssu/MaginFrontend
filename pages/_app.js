import "../styles/globals.css"; // Gunakan path relatif
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
