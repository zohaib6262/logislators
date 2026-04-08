import React from "react";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Wifi,
  AlertCircle,
} from "lucide-react";

const ErrorDisplay = ({
  type = "generic",
  title,
  message,
  error,
  onRetry,
  onGoHome,
  showRetry = true,
  showHome = false,
  className = "",
  compact = false,
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case "server":
        return {
          icon: AlertTriangle,
          iconColor: "text-red-600",
          iconBg: "bg-red-100",
          gradient: "from-red-50 to-red-100",
          title: title || "Server Error",
          message:
            message ||
            "We're experiencing server issues. Please try again later.",
        };
      case "network":
        return {
          icon: Wifi,
          iconColor: "text-orange-600",
          iconBg: "bg-orange-100",
          gradient: "from-orange-50 to-orange-100",
          title: title || "Connection Error",
          message:
            message || "Please check your internet connection and try again.",
        };
      case "validation":
        return {
          icon: AlertCircle,
          iconColor: "text-yellow-600",
          iconBg: "bg-yellow-100",
          gradient: "from-yellow-50 to-yellow-100",
          title: title || "Validation Error",
          message: message || "Please check your input and try again.",
        };
      default:
        return {
          icon: AlertTriangle,
          iconColor: "text-gray-600",
          iconBg: "bg-gray-100",
          gradient: "from-gray-50 to-gray-100",
          title: title || "Something went wrong",
          message: message || "An unexpected error occurred. Please try again.",
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  if (compact) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {config.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{config.message}</p>

            {(showRetry || showHome) && (
              <div className="flex gap-3">
                {showRetry && onRetry && (
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                )}

                {showHome && onGoHome && (
                  <button
                    onClick={onGoHome}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${config.gradient} flex items-center justify-center p-4 ${className}`}
    >
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div
          className={`w-20 h-20 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          <Icon className={`w-10 h-10 ${config.iconColor}`} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {config.title}
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">{config.message}</p>

        {error && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="text-sm text-gray-600">
              <strong>Error Details:</strong>
              <pre className="mt-2 whitespace-pre-wrap break-all text-xs">
                {error.message || JSON.stringify(error, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          )}

          {showHome && onGoHome && (
            <button
              onClick={onGoHome}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
