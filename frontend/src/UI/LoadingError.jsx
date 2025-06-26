import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

const LoadingError = ({
  message = "Failed to load data",
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Loading Failed
      </h3>

      <p className="text-gray-600 mb-6 max-w-sm">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          <RefreshCw
            className={`w-5 h-5 ${isRetrying ? "animate-spin" : ""}`}
          />
          {isRetrying ? "Retrying..." : "Try Again"}
        </button>
      )}
    </div>
  );
};

export default LoadingError;
