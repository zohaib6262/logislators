import React, { useContext } from "react";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import useGetSiteSettings from "../hooks/siteSettingHooks/useGetSiteSettings";
import { TokenContext } from "@/store/TokenContextProvider";

const Footer = () => {
  const { settings, setSettings, loading, error } = useGetSiteSettings();
  const { primaryColor } = useContext(TokenContext);
  return (
    <footer className="text-white" style={{ backgroundColor: primaryColor }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              {settings?.siteName && settings.siteName}
            </h3>
            <p className="text-gray-300 mb-4">
              {settings?.siteDescription && settings.siteDescription}
            </p>
            <div className="flex space-x-4">
              {settings?.socialLinks?.facebook && (
                <a
                  href={settings?.socialLinks.facebook}
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-6 h-6">
                    <svg
                      className="w-full h-full block"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                    </svg>
                  </div>
                </a>
              )}

              {settings?.socialLinks?.twitter && (
                <a
                  href={settings?.socialLinks.twitter}
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg
                      className="w-full h-full block scale-75"
                      fill="currentColor"
                      viewBox="0 0 1200 1227"
                    >
                      <path d="M714.7 556.8L1160.3 0H1054.2L667.5 484.6 345.6 0H0l474.6 700.9L0 1227h106.1l412.6-523.8L866.7 1227H1200L714.7 556.8z" />
                    </svg>
                  </div>
                </a>
              )}

              {settings?.socialLinks?.instagram && (
                <a
                  href={settings?.socialLinks.instagram}
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-6 h-6">
                    <svg
                      className="w-full h-full block"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </div>
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              {settings?.enableAboutus && (
                <li>
                  <Link
                    to="/about"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
              )}
              {settings?.enableResources && (
                <li>
                  <Link
                    to="/resources"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Resources
                  </Link>
                </li>
              )}
              {settings?.enableLegislators && (
                <li>
                  <Link
                    to="/nevada-legislators"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Nevada Legislators
                  </Link>
                </li>
              )}
              {/* <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li> */}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              {settings?.contactPhone && (
                <li className="flex items-start">
                  <Phone className="w-5 h-5 mr-2 text-blue-400 mt-0.5" />
                  <span>{settings?.contactPhone}</span>
                </li>
              )}
              {settings?.contactEmail && (
                <li className="flex items-start">
                  <Mail className="w-5 h-5 mr-2 text-blue-400 mt-0.5" />
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {/* <li className="flex items-start">
                <ExternalLink className="w-5 h-5 mr-2 text-blue-400 mt-0.5" />
                <a
                  href="https://developers.google.com/civic-information"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Powered by Google Civic API
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white-700 text-center text-white-400">
          <p>
            &copy; {new Date().getFullYear()} Nevada Rep Finder. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
