/** @format */

import { Link, Outlet } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Finance Manager
                </span>
              </div>
            </Link>
            <div className="flex items-center">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          {["About", "Features", "Pricing", "Support", "Privacy", "Terms"].map(
            (item) => (
              <div key={item} className="px-5 py-2">
                <Link
                  to="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  {item}
                </Link>
              </div>
            )
          )}
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; 2025 Finance Manager. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
