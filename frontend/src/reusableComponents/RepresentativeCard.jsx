import React, { useState } from "react";
import { Building2, MapPin, FileText, Star } from "lucide-react";
import Button from "../UI/Button";
import Badge from "../UI/Badge";
import RatingBar from "../UI/RatingBar";

const RepresentativeCard = ({ representative, isLarge = false, onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getPartyVariant = (party) => {
    switch (party) {
      case "Republican":
        return "red";
      case "Democratic":
        return "blue";
      case "Independent":
        return "gray";
      case "Libertarian":
        return "yellow";
      case "Green":
        return "green";
      default:
        return "purple";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg 
          ${isHovered ? "transform scale-[1.02]" : "transform scale-100"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsModalOpen(true)}
    >
      <div className="relative">
        {representative.image ? (
          <div className="overflow-hidden">
            <img
              src={representative.image}
              alt={representative.name}
              className={`w-full object-cover transition-transform duration-500 
                  ${isHovered ? "transform scale-110" : "transform scale-100"} 
                  ${isLarge ? "h-64" : "h-48"}`}
            />
          </div>
        ) : (
          <div
            className={`w-full bg-gray-900 dark:bg-gray-700 flex items-center justify-center 
                ${isLarge ? "h-64" : "h-48"}`}
          >
            <Building2 className="h-12 w-12 text-gray-900" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={getPartyVariant(representative.party)}>
            {`${representative?.party} Party` || "Independent"}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {representative.name}
          </h3>

          <div className="space-y-2 text-sm">
            <p className="text-gray-800 flex items-center">
              <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">
                {representative.current_role.title}
              </span>
            </p>
            <p className="text-gray-800 flex items-center">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">
                District: {representative.current_role.district}
                {representative.current_role.state &&
                  `, ${representative.current_role.state}`}
              </span>
            </p>
            <div className="flex items-center text-gray-800">
              <Star className="h-4 w-4 mr-2 flex-shrink-0" />
              <RatingBar rating={representative?.extras?.grade || 0}>
                <span className="text-sm font-medium text-gray-700 ml-2">
                  {representative?.extras?.grade === 0 ||
                  representative?.extras?.grade === undefined
                    ? (0 / 20).toFixed(1)
                    : (representative?.extras?.grade / 20)?.toFixed(1) || "0.0"}
                  /5
                </span>
              </RatingBar>
            </div>
          </div>

          <div className="pt-4 mt-auto">
            <Button
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
                onClick();
              }}
            >
              <FileText size={16} />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepresentativeCard;
