import React from "react";
import OfficialCard from "./OfficialCard";

const RepresentativeList = ({ offices, officials, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!offices || !officials || offices.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Your Representatives</h2>

      <div className="grid grid-cols-1 gap-6">
        {offices.map((office, officeIndex) => (
          <div key={officeIndex}>
            <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200">
              {office.name}
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {office.officialIndices.map((officialIndex) => (
                <OfficialCard
                  key={officialIndex}
                  official={officials[officialIndex]}
                  office={office}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepresentativeList;
