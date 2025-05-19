export default function InternshipFooter() {
  return (
    <footer className="bg-gray-100 py-12 px-4">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between gap-8 text-gray-800">
        {/* Logo dan Deskripsi */}
        <div className="w-full md:w-1/4 text-center md:text-left">
          <h1 className="text-2xl font-bold">Magang</h1>
          <p className="text-gray-600 mt-2">
            Program magang yang membantu kamu mengembangkan keterampilan dan
            memperluas jaringan profesional untuk kesuksesan karier.
          </p>
          <div className="flex justify-center md:justify-start mt-4 gap-4">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <svg
                className="w-6 h-6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 8c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8z"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <svg
                className="w-6 h-6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 12l-9 4.5V3l9 4.5V12z"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <svg
                className="w-6 h-6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 12h4M10 16h4M10 8h4M6 12h4"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* About */}
        <div className="w-full md:w-1/4 text-center md:text-left">
          <h3 className="font-semibold text-lg">About</h3>
          <ul className="mt-4 text-gray-600">
            <li>
              <a href="#" className="hover:text-blue-600">
                How It Works
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Featured
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Partnership
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Business Relation
              </a>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div className="w-full md:w-1/4 text-center md:text-left">
          <h3 className="font-semibold text-lg">Community</h3>
          <ul className="mt-4 text-gray-600">
            <li>
              <a href="#" className="hover:text-blue-600">
                Events
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Podcast
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Invite a Friend
              </a>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div className="w-full md:w-1/4 text-center md:text-left">
          <h3 className="font-semibold text-lg">Socials</h3>
          <ul className="mt-4 text-gray-600">
            <li>
              <a href="#" className="hover:text-blue-600">
                Discord
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 text-center text-gray-600">
        <p>©2022 Magang. All rights reserved.</p>
        <div className="flex justify-center gap-8 mt-4">
          <a href="#" className="hover:text-blue-600">
            Privacy & Policy
          </a>
          <a href="#" className="hover:text-blue-600">
            Terms & Conditions
          </a>
        </div>
      </div>
    </footer>
  );
}
