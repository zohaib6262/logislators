import { TokenContext } from "@/store/TokenContextProvider";
import { lightenColor } from "@/utils/colorUtils";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFoundAdmin = () => {
  const location = useLocation();
  const { setIsAuthenticated, primaryColor } = useContext(TokenContext);
  const lightPrimary = lightenColor(primaryColor, 60); // 60% lighter

  // Check if user is trying to access an admin route
  const isTryingAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-4" style={{ color: primaryColor }}>
        404 - Page Not Found
      </h1>

      {isTryingAdmin ? (
        <>
          <p className="text-lg text-gray-700 mb-6">
            You tried to access the admin page. Please login first to continue.
          </p>
          <Link
            to="/login"
            className="inline-block text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            style={{
              background: `linear-gradient(to right, ${lightPrimary}, ${primaryColor})`,
            }}
          >
            Go to Login
          </Link>
        </>
      ) : (
        <>
          <p className="text-lg text-gray-700 mb-6">
            Sorry! The page you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
        </>
      )}
    </div>
  );
};

export default NotFoundAdmin;
