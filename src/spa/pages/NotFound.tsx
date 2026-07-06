"use client";

import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import navBarEn from "@/language/en/components/navBar";
import notFoundEn from "@/language/en/pages/notFound";
import navBarFa from "@/language/fa/components/navBar";
import notFoundFa from "@/language/fa/pages/notFound";
import { Link, useLocation } from "@/lib/router";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const lang = document.documentElement.dir === "rtl" ? "fa" : "en";
  const notFoundLang = lang === "fa" ? notFoundFa : notFoundEn;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-200">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-800">{notFoundLang.title}</h1>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <p className="text-lg text-gray-600">{notFoundLang.description}</p>
          <p className="text-sm text-gray-500">
            {notFoundLang.pathLabel}{" "}
            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{location.pathname}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-purple/90 transition-colors"
          >
            {notFoundLang.backToHome}
          </Link>

          <Link
            to="/contact"
            className="px-6 py-3 border border-gray-300 rounded-md hover:border-brand-purple hover:text-brand-purple transition-colors"
          >
            {notFoundLang.contactSupport}
          </Link>
        </div>
      </div>
      <NavBar lang={lang === "fa" ? navBarFa : navBarEn} />
    </div>
  );
};

export default NotFound;
