import React, { useState, useEffect } from "react";
import { Menu, X, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useGetSiteSettings from "../hooks/siteSettingHooks/useGetSiteSettings";

const Header = () => {
  const { settings, loading, error } = useGetSiteSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLinkClass = (path) => {
    const base = "font-medium transition-colors hover:text-blue-600";
    const active = "text-blue-600";
    const inactive = isScrolled ? "text-gray-700" : "text-gray-600";
    return `${base} ${location.pathname === path ? active : inactive}`;
  };

  const getMobileLinkClass = (path) => {
    const base =
      "px-4 py-2 transition-colors hover:bg-gray-100 hover:text-blue-600";
    const active = "text-blue-600 font-semibold";
    const inactive = "text-gray-700";
    return `${base} ${location.pathname === path ? active : inactive}`;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            {settings?.logoUrl && (
              <img
                src={settings.logoUrl}
                color="yellow"
                className="w-8 h-8 rounded-full"
              />
            )}
            <span
              className={`font-bold text-xl ${
                isScrolled ? "text-gray-800" : "text-gray-700"
              }`}
            >
              {settings?.siteName && settings.siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={getLinkClass("/")}>
              Home
            </Link>
            {settings?.enableAboutus && (
              <Link to="/about" className={getLinkClass("/about")}>
                About us
              </Link>
            )}
            {settings?.enableResources && (
              <Link to="/resources" className={getLinkClass("/resources")}>
                Resources
              </Link>
            )}
            {/* <Link
              to="/login"
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserCircle size={18} />
              <span>Login</span>
            </Link> */}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={getMobileLinkClass("/")}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={getMobileLinkClass("/about")}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/resources"
                className={getMobileLinkClass("/resources")}
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
