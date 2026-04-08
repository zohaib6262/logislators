import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";

/**
 * Reusable school avatar: logo image or document icon fallback.
 * Used in results list (size="sm") and detail card (size="md").
 * Logos use object-contain + padding so they are not cropped; broken URLs fall back to icon.
 */
export default function SchoolAvatar({ school, size = "md" }) {
  const logoUrl = school?.logoUrl || school?.logo;
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  const showFallback = !logoUrl || imgError;
  const isSm = size === "sm";
  const wrapperClass = isSm
    ? "w-12 h-12 min-w-12 min-h-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-white bg-white shadow flex items-center justify-center"
    : "w-20 h-20 min-w-20 min-h-20 sm:w-24 sm:h-24 sm:min-w-24 sm:min-h-24 flex-shrink-0 rounded-full overflow-hidden border-4 border-white bg-white shadow-md";

  return (
    <div className={wrapperClass}>
      {showFallback ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          <FileText width={isSm ? 24 : 36} height={isSm ? 24 : 36} />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-2">
          <img
            src={logoUrl}
            alt={school?.schoolName || "School"}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        </div>
      )}
    </div>
  );
}
