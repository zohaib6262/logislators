import React, { useContext } from "react";
import { TokenContext } from "@/store/TokenContextProvider";
import { lightenColor } from "@/utils/colorUtils"; // If needed

const LoadingScreen = () => {
  const { primaryColor } = useContext(TokenContext);
  console.log("Primary color", primaryColor);
  // Optional: use lighter variant for gradient end
  const lighterPrimary = lightenColor(primaryColor, 30);

  return (
    <>
      {primaryColor && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, ${lighterPrimary})`,
          }}
        >
          <div className="text-center">
            {/* Animated Spinner */}
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-white/40 rounded-full animate-spin mx-auto"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>

            {/* Loading Text */}
            <div className="text-white space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold animate-pulse">
                Loading...
              </h2>
              <p
                className="text-white/80 text-lg animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                Please wait while we prepare your content
              </p>
            </div>

            {/* Animated Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>

            {/* Pulsing Ring Animation */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-32 h-32 border border-white/10 rounded-full animate-ping"></div>
              <div
                className="absolute inset-0 w-32 h-32 border border-white/5 rounded-full animate-ping"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingScreen;
