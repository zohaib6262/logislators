import React, { useContext, useRef } from "react";
import {
  Phone,
  Globe,
  MapPin,
  Download,
  Building2,
  ExternalLink,
  Instagram,
  Facebook,
} from "lucide-react";
import * as domtoimage from "dom-to-image";
import { Helmet } from "react-helmet-async";
import { TokenContext } from "@/store/TokenContextProvider";
import SchoolAvatar from "@/reusableComponents/SchoolAvatar";

/**
 * Format address for display. Never render [object Object].
 */
function formatAddress(school) {
  const addr = school.address;
  if (addr != null && typeof addr === "object" && !Array.isArray(addr)) {
    if (typeof addr.fullAddress === "string" && addr.fullAddress.trim()) {
      return addr.fullAddress.trim();
    }
    const parts = [
      addr.street,
      addr.city,
      addr.state,
      addr.zipCode ?? addr.zip,
    ].filter((p) => p != null && String(p).trim() !== "");
    return parts.length ? parts.join(", ") : "";
  }
  if (typeof addr === "string" && addr.trim()) return addr.trim();
  const flat = [school.address, school.city, school.state, school.zip].filter(
    (p) => p != null && String(p).trim() !== "" && typeof p !== "object"
  );
  return flat.length ? flat.join(", ") : "";
}

const SchoolFinderDetail = ({ school, primaryColor, radiusMiles }) => {
  const cardRef = useRef(null);
  const { primaryColor: contextPrimary } = useContext(TokenContext);
  const primary = primaryColor || contextPrimary;

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await domtoimage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `${(school.schoolName || "School").replace(/\s+/g, "-")}-profile.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      alert("Download failed. Please try again or take a screenshot instead.");
    }
  };

  const distMi = school.distanceMiles != null ? Number(school.distanceMiles) : null;
  const radiusNum = radiusMiles != null && radiusMiles !== "" ? Number(radiusMiles) : 25;
  const distanceBarPct =
    distMi != null && radiusNum > 0
      ? Math.min(100, Math.max(0, (1 - distMi / radiusNum) * 100))
      : 0;

  const addressStr = formatAddress(school);
  const costDisplay =
    school.costValue != null && school.costValue !== ""
      ? school.costValue
      : school.costText || school.cost;
  const gradesLabel =
    school.gradesServed?.length > 0
      ? Array.isArray(school.gradesServed)
        ? school.gradesServed.join(", ")
        : school.gradesServed
      : school.gradesMin != null && school.gradesMax != null
        ? `${school.gradesMin === 0 ? "K" : school.gradesMin}-${school.gradesMax}`
        : "";

  const detailRows = [];
  if (school.enrollment != null && school.enrollment !== "")
    detailRows.push({ label: "Enrollment", value: String(school.enrollment) });
  if (school.averageClassSize != null && school.averageClassSize !== "")
    detailRows.push({ label: "Average Class Size", value: String(school.averageClassSize) });
  if (gradesLabel) detailRows.push({ label: "Grades Served", value: gradesLabel });
  if (costDisplay != null && costDisplay !== "")
    detailRows.push({ label: "Cost", value: String(costDisplay) });

  return (
    <>
      <Helmet>
        <title>{school.schoolName || "School"} - School Profile</title>
        <meta
          name="description"
          content={(school.shortDescription || "").slice(0, 160) || `${school.schoolName || "School"} profile`}
        />
        <meta property="og:title" content={`${school.schoolName || "School"} - School Profile`} />
        <meta property="og:image" content={school.logoUrl || school.logo || "/default-profile.jpg"} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div ref={cardRef} className="flex flex-col">
        {/* Hero card */}
        <div
          className="rounded-xl shadow-lg overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, ${primary}dd 100%)`,
          }}
        >
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex justify-center sm:justify-start">
                <div className="ring-4 ring-white/30 rounded-xl overflow-hidden shadow-lg">
                  <SchoolAvatar school={school} />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-white/90 text-sm font-medium uppercase tracking-wide flex items-center justify-center sm:justify-start gap-2">
                  <Building2 size={18} className="shrink-0" />
                  School
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  {school.schoolName || "School"}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  {school.schoolType && (
                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30">
                      {school.schoolType}
                    </span>
                  )}
                  {distMi != null && (
                    <span className="inline-flex items-center gap-1.5 text-white/95 text-sm">
                      <MapPin size={16} />
                      {distMi.toFixed(1)} mi away
                    </span>
                  )}
                </div>
                {distMi != null && radiusNum > 0 && (
                  <div className="mt-4 max-w-xs">
                    <p className="text-white/80 text-xs font-medium mb-1">Distance from your search</p>
                    <div className="w-full bg-white/25 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          distanceBarPct >= 80 ? "bg-green-400" : distanceBarPct >= 50 ? "bg-amber-300" : "bg-red-300"
                        }`}
                        style={{ width: `${distanceBarPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact strip */}
        <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Contact & location</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {school?.phone && (
                <a
                  href={`tel:${school.phone}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-gray-900 font-medium group-hover:underline">{school.phone}</span>
                </a>
              )}
              {school?.website && (
                <a
                  href={school.website.startsWith("http") ? school.website : `https://${school.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200">
                    <Globe className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-gray-900 font-medium group-hover:underline truncate">Website</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-auto" />
                </a>
              )}
              {(addressStr && addressStr !== "[object Object]") && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 sm:col-span-2">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200">
                    <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">{addressStr}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* About / Description */}
        {school?.shortDescription && (
          <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-5">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
              <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {school.shortDescription}
              </div>
            </div>
          </div>
        )}

        {/* School details table */}
        {detailRows.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div
              className="px-6 py-4 text-white font-semibold"
              style={{ backgroundColor: primary }}
            >
              <h2 className="text-lg">School details</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"
                >
                  <dt className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">{row.label}</dt>
                  <dd className="text-gray-900 font-medium sm:font-normal">{row.value}</dd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media: logo & video */}
        {(school?.logoUrl || school?.videoUrl) && (
          <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Media</h2>
              <div className="flex flex-wrap gap-6">
                {school.logoUrl && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Logo</p>
                    <img
                      src={school.logoUrl}
                      alt={`${school.schoolName || "School"} logo`}
                      className="h-24 w-auto object-contain rounded-lg border border-gray-200 bg-gray-50 p-2"
                    />
                  </div>
                )}
                {school.videoUrl && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Video</p>
                    <a
                      href={school.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors"
                    >
                      <ExternalLink size={18} />
                      Watch video
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Highlights */}
        {school?.schoolHighlights && school.schoolHighlights.length > 0 && (
          <div className="mt-6 rounded-xl overflow-hidden shadow-md border border-gray-100">
            <div
              className="px-6 py-4 text-white font-semibold"
              style={{ backgroundColor: primary }}
            >
              <h2 className="text-lg">Highlights</h2>
            </div>
            <div className="bg-white px-6 py-5">
              <ul className="space-y-2">
                {school.schoolHighlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1 shrink-0">✓</span>
                    <span className="text-gray-700">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-white shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: primary }}
            >
              <Download className="w-5 h-5" />
              Download image
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleShare()}
                className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white transition-colors"
                aria-label="Share"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                onClick={() => handleShare()}
                className="p-2.5 rounded-xl bg-gray-900 hover:bg-gray-950 text-white transition-colors"
                aria-label="Share"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </button>
              <button
                onClick={() => handleShare()}
                className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors"
                aria-label="Share"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>
              <button onClick={() => handleShare()} className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-colors" aria-label="Share">
                <Instagram className="w-5 h-5" />
              </button>
              <button onClick={() => handleShare()} className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors" aria-label="Share">
                <Facebook className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolFinderDetail;
