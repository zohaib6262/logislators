import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  ArrowLeft,
  FileText,
  Award,
  Download,
  Info,
  Building2,
  Instagram,
  Facebook,
} from "lucide-react";
import VotingRecord from "./VotingRecord";
import * as domtoimage from "dom-to-image";
import ShareButtons from "./ShareButtons";
import { BadgesList } from "./Badge";
import { generatePDF } from "@/utils/generatePDF";
import { jsPDF } from "jspdf";
import { Helmet } from "react-helmet-async";
import { TokenContext } from "@/store/TokenContextProvider";
import { getTotalPoints } from "@/utils/getTotalScores";

const RepresentativeDetails = ({ id, representative }) => {
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { primaryColor } = useContext(TokenContext);
  const handleDownload = (representative) => {
    generatePDF(representative, primaryColor);
  };
  const handleShare = async () => {
    if (!cardRef.current) return;
    let dataUrl;
    try {
      // Increase pixel ratio for better quality on mobile devices
      dataUrl = await domtoimage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2, // Increased from 1 to 2 for better quality on high-DPI screens
        backgroundColor: "#ffffff",
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `${representative.name.replace(/\s+/g, "-")}-profile.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      alert("Download failed. Please try again or take a screenshot instead.");
    }
  };

  let grade = representative?.extras?.grade || 0;
  let gradeColor =
    grade >= 80 ? "bg-green-600" : grade >= 50 ? "bg-yellow-500" : "bg-red-600";
  const partyColorClass = (party) => {
    return party === "Republican"
      ? "bg-red-100 text-red-800"
      : party === "Democratic"
      ? "bg-blue-100 text-blue-800"
      : party === "Independent"
      ? "bg-gray-100 text-gray-800 border border-gray-300"
      : party === "Libertarian"
      ? "bg-yellow-100 text-yellow-800"
      : party === "Green"
      ? "bg-green-100 text-green-800"
      : "bg-purple-100 text-purple-800";
  };

  if (loading && !representative) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="rounded-full bg-slate-200 h-24 w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-48"></div>
          <div className="h-3 bg-slate-200 rounded w-32"></div>
          <div className="h-64 bg-slate-200 rounded w-full max-w-3xl mt-8"></div>
        </div>
      </div>
    );
  }

  if (error || !representative) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <h3 className="text-sm font-medium text-red-800">
            Error loading representative
          </h3>
          <p className="mt-2 text-sm text-red-700">
            {error || "Representative not found"}
          </p>
        </div>
      </div>
    );
  }

  function checkStateOrFederal(value) {
    if (value === "") {
      return "State Level";
    } else if (value !== "state") {
      return "Federal Level";
    } else {
      return "State Level";
    }
  }
  return (
    <>
      <Helmet>
        <title>{representative.name} - Legislative Profile</title>
        <meta
          name="description"
          content={`${representative.name}'s legislative voting record and performance metrics`}
        />
        <meta
          property="og:title"
          content={`${representative.name} - Legislative Report Card`}
        />
        <meta
          property="og:description"
          content={`View ${representative.name}'s voting record, grades, and legislative performance`}
        />
        <meta
          property="og:image"
          content={representative.image || "/default-profile.jpg"}
        />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className={` bg-white shadow-md rounded-lg overflow-hidden`}>
        <div ref={cardRef} className="bg-white">
          {/* Header */}
          <div
            className="px-6 py-8"
            style={{
              background: `linear-gradient(to right, ${primaryColor}, ${primaryColor})`,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-6">
              {/* Image & Info */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-white shadow-md">
                  {representative.image ? (
                    <img
                      src={representative.image}
                      alt={representative.name}
                      className="w-full h-full object-cover"
                      id={representative.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <FileText size={36} />
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left">
                  <p className="text-white opacity-90 text-xl sm:text-2xl dark:text-gray-300 flex items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
                    <Building2 size={20} className="shrink-0" />
                    {representative.current_role.title}
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {representative.name.toUpperCase()}
                  </h1>

                  <div
                    className={`inline-block sm:align-self-start mt-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${partyColorClass(
                      representative.party
                    )}`}
                  >
                    {`${representative?.party} Party` || "Independent"}
                  </div>
                  {
                    <p className="text-white dark:text-gray-300 flex items-center my-1">
                      {representative?.extras?.highlights?.session &&
                        `${representative?.extras?.highlights?.session} Report Card`}
                      {representative?.county}
                    </p>
                  }
                  {representative?.county && (
                    <p className="text-white dark:text-gray-300 flex items-center my-1">
                      County - {representative?.county}
                    </p>
                  )}
                  <p className="text-white dark:text-gray-300 flex items-center my-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    {`District ${
                      representative.current_role.district
                    } (${checkStateOrFederal(
                      representative.jurisdiction?.classification || ""
                    )})`}
                  </p>
                </div>
              </div>

              {/* Grade Section */}
              <div className="w-full sm:w-1/3 max-w-xs sm:max-w-sm mt-4 sm:mt-0">
                <p className="text-sm text-white mb-1">
                  Grade: <span className="font-bold">{grade}</span>
                </p>
                <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden relative">
                  <div
                    className={`h-full rounded-full ${gradeColor} transition-all duration-300`}
                    style={{ width: `${grade}%` }}
                  />
                  <span className="absolute inset-0 flex justify-center items-center text-xs font-semibold text-white">
                    {grade}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {representative?.phone && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-2" />
                  <a
                    href={`mailto:${representative?.phone}`}
                    className="text-blue-600 hover:underline break-all"
                  >
                    {representative?.phone}
                  </a>
                </div>
              )}
              {representative?.email && (
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-2" />
                  <a
                    href={`mailto:${representative.email}`}
                    className="text-blue-600 hover:underline break-all"
                  >
                    {representative.email}
                  </a>
                </div>
              )}
              {representative?.openstates_url && (
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-500 mr-2" />
                  <a
                    href={representative.openstates_url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official Website
                  </a>
                </div>
              )}
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <span className="text-gray-700 text-sm">
                  {representative?.address ||
                    `District ${representative?.current_role.district}, Nevada, USA`}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left: Bio + Badges */}
              <div className="lg:col-span-12 space-y-8">
                {/* <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="mr-2 text-blue-600" />
                Badges and Achievements
              </h2>
              <BadgesList badges={badges} />
            </div> */}

                {representative?.extras?.biography && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Biography
                    </h2>
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                      {representative.extras.biography}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Voting Record */}
              {representative?.extras?.votingRecord &&
                representative?.extras?.votingRecord.length !== 0 && (
                  <div className="lg:col-span-12">
                    <VotingRecord
                      categories={representative?.extras?.votingRecord}
                    />
                  </div>
                )}
            </div>

            {/* Extra Points */}
            {representative.extras.extraPoints.length > 0 && (
              <div className="bg-[#4B2E2E] text-white rounded-xl px-6 py-4 shadow-md">
                <h2 className="text-center text-lg text-white font-semibold uppercase border-b border-white pb-2 mb-4">
                  Extra Points Added/Deducted
                </h2>

                {representative.extras.extraPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-3"
                  >
                    <div className="font-semibold sm:w-1/2">{point.bills}</div>
                    <p className="sm:w-2/3">
                      {point.description}
                      <strong>{getTotalPoints(point.points)}</strong>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Highlights */}
            {!representative?.extras?.highlights.title ||
              !representative?.extras?.highlights.badgeNum > 0 ||
              !representative?.extras?.highlights?.session || (
                <div className="bg-[#373B54] text-white rounded-xl px-6 py-4 shadow-md">
                  <h2 className="text-center text-lg font-semibold text-white uppercase border-b border-white pb-2 mb-4">
                    Highlights & Key Takeaways
                  </h2>
                  <div className="flex flex-row flex-nowrap gap-4 items-start">
                    <div className="w-3/4">
                      {representative?.extras?.highlights.title && (
                        <p>
                          {`${representative?.extras?.highlights.title}`}

                          {` ${representative?.extras?.highlights?.session}`}
                        </p>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-xl font-bold">
                      {representative?.extras?.highlights?.badgeNum > 0 &&
                        representative?.extras?.highlights?.badgeNum}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>

        <div className="px-2 m-6">
          <div className="flex flex-col gap-3 w-full sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => handleDownload(representative)}
              className="flex items-center justify-center text-white py-2 px-4 rounded-md transition duration-200 w-full sm:w-auto"
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${primaryColor})`,
              }}
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </button>

            {/* Share Buttons */}
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
              <button
                onClick={() => handleShare("Twitter")}
                className="bg-[#202021] hover:bg-[#000000] text-white p-2 rounded-md transition duration-200"
                aria-label="Share on X (Twitter)"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                onClick={() => handleShare("Tiktok")}
                className="bg-[#000000] hover:bg-[#333333] text-white p-2 rounded-md transition duration-200"
                aria-label="Share on TikTok"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </button>
              <button
                onClick={() => handleShare("Whatsapp")}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white p-2 rounded-md transition duration-200"
                aria-label="Share on WhatsApp"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>
              <button
                onClick={() => handleShare("Instagram")}
                className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-2 rounded-full transition"
                aria-label="Share on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare("Facebook")}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RepresentativeDetails;
