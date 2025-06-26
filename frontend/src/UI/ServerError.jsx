import React from "react";
import { Server, RefreshCw, Home, AlertCircle } from "lucide-react";

const ServerError = ({
  error,
  onRetry,
  title = "Server Connection Error",
  message,
  showRetry = true,
  showHome = true,
}) => {
  const getErrorMessage = () => {
    if (message) return message;

    if (error?.statusCode) {
      switch (error.statusCode) {
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
    }

    return "We're having trouble connecting to our servers. Please check your internet connection and try again.";
  };

  const getStatusCode = () => {
    return error?.statusCode || error?.statusCode || "Unknown";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Server className="w-10 h-10 text-blue-600" />
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

        {/* Action Buttons */}
        <div className="space-y-2">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>

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
