import { useLocation } from "react-router-dom";

const RepresentativeReport = () => {
  const location = useLocation();
  const { official } = location.state || {}; // Safely access state

  if (!official) {
    return <div>No representative data found!</div>; // Handle case where no official is passed
  }

  const {
    name,
    party,
    district,
    county,
    grade,
    percentage,
    votingRecord,
    extraPoints,
    highlights,
    photoUrl,
  } = official;

  // Utility to color grade circle
  function getGradeColor(grade) {
    if (grade.startsWith("A")) return "bg-green-500";
    if (grade.startsWith("B")) return "bg-yellow-500";
    if (grade.startsWith("C")) return "bg-orange-500";
    return "bg-red-500";
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={photoUrl || "https://via.placeholder.com/150"} // Fallback to placeholder image
          alt={name}
          className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
          <p className="text-gray-600">
            {party} - {district}
          </p>
          <p className="text-gray-500 text-sm">County: {county}</p>
        </div>
        <div className="ml-auto flex flex-col items-center">
          <div
            className={`text-4xl font-bold text-white w-20 h-20 rounded-full flex items-center justify-center ${getGradeColor(
              grade
            )}`}
          >
            {grade}
          </div>
          <p className="text-sm text-gray-600 mt-1">({percentage}%)</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Voting Record
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b text-gray-600">Area</th>
              <th className="p-2 border-b text-gray-600">Bills</th>
              <th className="p-2 border-b text-gray-600">Score</th>
            </tr>
          </thead>
          <tbody>
            {votingRecord?.map((record, i) => (
              <tr key={i}>
                <td className="p-2 border-b">{record.area}</td>
                <td className="p-2 border-b">{record.bills.join(", ")}</td>
                <td className="p-2 border-b font-semibold">{record.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {extraPoints?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Extra Points
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            {extraPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {highlights?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Highlights
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            {highlights.map((highlight, i) => (
              <li key={i}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RepresentativeReport;
