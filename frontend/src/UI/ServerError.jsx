import React, { useContext } from "react";
import { Server, RefreshCw, AlertCircle } from "lucide-react";
import { TokenContext } from "@/store/TokenContextProvider";
import { lightenColor } from "@/utils/colorUtils"; // Create this if not already

const ServerError = ({
  error,
  onRetry,
  title = "Server Connection Error",
  message,
  showRetry = true,
}) => {
  const { primaryColor } = useContext(TokenContext);
  const lightPrimary = lightenColor(primaryColor || "#3b82f6", 70);

  const getErrorMessage = () => {
    if (message) return message;
    switch (error?.statusCode) {
      case 500:
        return "Our servers are experiencing some issues. Please try again in a few moments.";
      case 503:
        return "The service is temporarily unavailable. We're working to restore it quickly.";
      case 404:
        return "The requested resource could not be found on our servers.";
      case 403:
        return "You don't have permission to access this resource.";
      case 401:
        return "Your session has expired. Please log in again.";
      default:
        return "We're having trouble connecting to our servers. Please check your internet connection and try again.";
    }
  };

  const getStatusCode = () => error?.statusCode || "Unknown";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(to bottom right, ${lightPrimary}, #f5f5ff)`,
      }}
    >
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: lightPrimary }}
        >
          <Server className="w-10 h-10" style={{ color: primaryColor }} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>

        {/* Error Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {getErrorMessage()}
        </p>

        {/* Error Details */}
        {error && (
          <div className="bg-gray-50 rounded-lg p-3 mb-6 text-sm">
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
              <AlertCircle className="w-4 h-4" />
              Error Details
            </div>
            <div className="space-y-1">
              <div className="text-gray-700">
                <span className="font-medium">Status:</span> {getStatusCode()}
              </div>
              {error?.message && (
                <div className="text-gray-700">
                  <span className="font-medium">Message:</span> {error.message}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Retry Button */}
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            style={{ backgroundColor: primaryColor }}
            className="w-full text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:opacity-90"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}

        {/* Support Message */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            If the problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
