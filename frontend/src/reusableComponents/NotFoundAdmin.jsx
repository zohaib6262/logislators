import { Link, useLocation } from "react-router-dom";

const NotFoundAdmin = () => {
  const location = useLocation();

  // Check if user is trying to access an admin route
  const isTryingAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        404 - Page Not Found
      </h1>

      {isTryingAdmin ? (
        <>
          <p className="text-lg text-gray-700 mb-6">
            You tried to access the admin page. Please login first to continue.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
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
