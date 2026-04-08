import { getTotalScores } from "@/utils/getTotalScores";
import React from "react";

export const VotingRecord = ({ categories }) => {
  if (categories.length === 0) {
    return null;
  }
  const totalScore = getTotalScores(categories);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-red-500 text-white">
        <h3 className="text-lg font-bold text-center">Voting Record</h3>
      </div>

      <div>
        <table className="table-auto w-full divide-y divide-gray-200 -mr-5">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Area
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/4">
                Notable Bills
              </th>
              <th className="pr-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-3 py-4 text-sm font-medium text-gray-900 whitespace-normal break-words">
                  {category.area}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-normal break-words">
                  {category.notableBills}
                </td>
                <td className="pr-8 py-4 text-sm text-gray-900 whitespace-normal break-all max-w-[120px] sm:max-w-none">
                  {category.score}
                </td>
              </tr>
            ))}

            {totalScore && (
              <tr className="bg-gray-100">
                <td
                  colSpan={2}
                  className="px-3 py-4 text-sm font-bold text-gray-900"
                >
                  Total
                </td>
                <td className="pr-8 py-4 text-sm font-bold text-gray-900 whitespace-normal break-all max-w-[120px] sm:max-w-none">
                  {totalScore}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default VotingRecord;
