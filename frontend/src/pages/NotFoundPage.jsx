import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { TokenContext } from "@/store/TokenContextProvider";
import { lightenColor } from "@/utils/colorUtils";

const NotFoundPage = ({ to, home, representatives = true }) => {
  const { setIsAuthenticated, primaryColor } = useContext(TokenContext);
  const lightPrimary = lightenColor(primaryColor, 60);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pt-16">
      <div className="text-center">
        <h1
          className={`text-9xl font-bold ${
            primaryColor ? "" : "text-blue-500"
          }`}
          style={{ color: primaryColor }}
        >
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mt-4 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={to}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: `linear-gradient(to right, ${lightPrimary}, ${primaryColor})`,
            }}
          >
            <Home size={18} className="mr-2" />
            {home}
          </Link>
          {representatives && (
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Search size={18} className="mr-2" />
              Find Representatives
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
