export default function InternshipFeature() {
  return (
    <section className="py-16 px-4 bg-white w-full">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Gambar */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="/images/picture.png" // Ganti dengan path gambar yang sesuai
            alt="Illustrasi Magang"
            className="w-3/4 sm:w-4/5 md:w-3/4 lg:w-full object-contain"
          />
        </div>

        {/* Deskripsi Teks */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Tentang Program Magang Kami
          </h2>
          <p className="text-gray-600 mb-8">
            Program magang kami menawarkan pengalaman yang sangat berharga untuk
            mengembangkan keterampilan kerja, memperluas jaringan profesional,
            dan mempersiapkan kamu untuk karier yang sukses.
          </p>

          {/* Fitur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Pengalaman Nyata
                </h4>
                <p className="text-gray-600">
                  Dapatkan pengalaman langsung yang relevan dengan dunia kerja.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Koneksi Profesional
                </h4>
                <p className="text-gray-600">
                  Perluas koneksi profesional dengan orang-orang di industri
                  terkait.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4M12 16h.01M7 12a5 5 0 0110 0 5 5 0 01-10 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Pengembangan Diri
                </h4>
                <p className="text-gray-600">
                  Program magang ini memungkinkan kamu mengasah keterampilan
                  penting untuk kariermu.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Peluang Karier</h4>
                <p className="text-gray-600">
                  Tingkatkan peluang karier melalui pengalaman magang yang
                  relevan dengan industri.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
