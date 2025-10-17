import React, { useState, useEffect, useContext } from "react";
import { Menu, X, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useGetSiteSettings from "../hooks/siteSettingHooks/useGetSiteSettings";
import { TokenContext } from "@/store/TokenContextProvider";

const Header = () => {
  const { settings, loading, error } = useGetSiteSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { primaryColor } = useContext(TokenContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLinkStyle = (path) => {
    return location.pathname === path ? { color: primaryColor } : {};
  };

  const getLinkClass = (path) => {
    const base = "font-medium transition-colors";
    const inactive = isScrolled ? "text-gray-700" : "text-gray-600";
    return `${base} ${inactive}`;
  };

  const getMobileLinkStyle = (path) => {
    return location.pathname === path
      ? { color: primaryColor, fontWeight: "bold" }
      : {};
  };

  const getMobileLinkClass = () => {
    return "px-4 py-2 transition-colors hover:bg-gray-100";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled ? "shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo & Site Name */}
          <Link to="/" className="flex items-center space-x-2">
            {settings?.logoUrl && (
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="w-8 h-8 rounded-full"
              />
            )}
            <span
              className={`font-bold text-xl ${
                isScrolled ? "text-gray-800" : "text-gray-700"
              }`}
            >
              {settings?.siteName || ""}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={getLinkClass("/")}
              style={getLinkStyle("/")}
            >
              Home
            </Link>
            {settings?.enableAboutus && (
              <Link
                to="/about"
                className={getLinkClass("/about")}
                style={getLinkStyle("/about")}
              >
                About us
              </Link>
            )}
            {settings?.enableResources && (
              <Link
                to="/resources"
                className={getLinkClass("/resources")}
                style={getLinkStyle("/resources")}
              >
                Resources
              </Link>
            )}
            {settings?.enableLegislators && (
              <Link
                to="/nevada-legislators"
                className={getLinkClass("/nevada-legislators")}
                style={getLinkStyle("/nevada-legislators")}
              >
                Voting Records
              </Link>
            )}

            {/* Optional Login Button */}
            {/* 
            <Link
              to="/login"
              className="flex items-center space-x-1 px-4 py-2 rounded-lg text-white transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              <UserCircle size={18} />
              <span>Login</span>
            </Link> 
            */}
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
                className={getMobileLinkClass()}
                style={getMobileLinkStyle("/")}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {settings?.enableAboutus && (
                <Link
                  to="/about"
                  className={getMobileLinkClass()}
                  style={getMobileLinkStyle("/about")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              )}
              {settings?.enableResources && (
                <Link
                  to="/resources"
                  className={getMobileLinkClass()}
                  style={getMobileLinkStyle("/resources")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Resources
                </Link>
              )}
              {settings?.enableLegislators && (
                <Link
                  to="/nevada-legislators"
                  className={getLinkClass("/nevada-legislators")}
                  style={getLinkStyle("/nevada-legislators")}
                >
                  Voting Records
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
