import React, { useState } from "react";
import {
  Phone,
  Globe,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const OfficialCard = ({ official, office }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  // Assign default values if properties are missing
  const officialWithDefaults = {
    ...official,
    party: official.party || "Unknown Party",
    phones: official.phones || [],
    urls: official.urls || [],
    enhanced: official.enhanced || {},
  };

  const { name, party, phones, urls, photoUrl, enhanced } =
    officialWithDefaults;
  const officeName = office?.name || official.office?.name || "Nevada Official";

  const getPartyColor = (party) => {
    const partyLower = party.toLowerCase();
    if (partyLower.includes("democratic")) return "bg-blue-100 text-blue-800";
    if (partyLower.includes("republican")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
      onClick={() =>
        navigate(
          `/representative/${official.name.replace(/\s+/g, "-").toLowerCase()}`
        )
      }
    >
      <div className="p-6">
        <div className="flex items-start">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="w-24 h-24 object-cover rounded-lg mr-4 shadow-sm"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
              <Users size={32} className="text-gray-400" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-800">{name}</h3>
              <span
                className={`mt-1 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getPartyColor(
                  party
                )}`}
              >
                {party}
              </span>
            </div>

            <p className="text-gray-600 font-medium mb-2 flex items-center">
              <MapPin size={16} className="mr-1" />
              {officeName}
            </p>

            {phones.length > 0 && (
              <div className="flex items-center text-gray-600 mb-1">
                <Phone size={16} className="mr-2" />
                <a
                  href={`tel:${phones[0]}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {phones[0]}
                </a>
              </div>
            )}

            {urls && urls.length > 0 && (
              <div className="flex items-center text-gray-600">
                <Globe size={16} className="mr-2" />
                <a
                  href={urls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors truncate"
                >
                  Official Website
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <span className="font-medium">Additional Information</span>
            {expanded ? (
              <ChevronUp size={18} className="text-gray-600" />
            ) : (
              <ChevronDown size={18} className="text-gray-600" />
            )}
          </button>

          {expanded && (
            <div className="mt-4 space-y-4 animate-fadeIn">
              {enhanced.customDescription ? (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">About</h4>
                  <p className="text-gray-600">{enhanced.customDescription}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No additional information available.
                </p>
              )}

              {enhanced.resources && enhanced.resources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Resources
                  </h4>
                  <ul className="space-y-2">
                    {enhanced.resources.map((resource, index) => (
                      <li key={index}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {enhanced.rating !== undefined && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Community Rating
                  </h4>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= enhanced.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-gray-600">
                      {enhanced.rating} out of 5
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficialCard;
