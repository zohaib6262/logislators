// import React, { useState, useEffect, useContext } from "react";
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Search,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { legislatorAPI } from "@/services/api";
// import { TokenContext } from "@/store/TokenContextProvider";
// import { newLightnerColor } from "@/utils/colorUtils";

// const ITEMS_PER_PAGE = 6;

// const ManageLegislators = ({ onEditLegislator }) => {
//   const { primaryColor } = useContext(TokenContext);
//   const lighterPrimary = newLightnerColor(primaryColor, 30);

//   const [legislators, setLegislators] = useState([]);
//   const [filteredLegislators, setFilteredLegislators] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     fetchLegislators();
//   }, []);

//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = legislators.filter(
//         (leg) =>
//           leg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           leg.district.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredLegislators(filtered);
//       setCurrentPage(1);
//     } else {
//       setFilteredLegislators(legislators);
//     }
//   }, [searchTerm, legislators]);

//   const fetchLegislators = async () => {
//     try {
//       const data = await legislatorAPI.getAll();
//       console.log("Fetched legislators:", data.data);
//       setLegislators(data.data || []);
//       setFilteredLegislators(data.data || []);
//     } catch (error) {
//       console.error("Error fetching legislators:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (!confirm(`Are you sure you want to delete ${name}?`)) {
//       return;
//     }

//     try {
//       await legislatorAPI.delete(id);
//       setLegislators(legislators.filter((leg) => leg.id !== id));
//       alert("Legislator deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting legislator:", error);
//       alert("Error deleting legislator. Please try again.");
//     }
//   };

//   const getScoreColor = (score) => {
//     if (!score) return "text-gray-400";
//     if (score >= 90) return "text-green-600 font-bold";
//     if (score >= 70) return "text-yellow-600 font-semibold";
//     if (score >= 50) return "text-orange-600 font-semibold";
//     return "text-red-600 font-bold";
//   };

//   const totalPages = Math.ceil(filteredLegislators.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const currentLegislators = filteredLegislators.slice(startIndex, endIndex);

//   const goToPage = (page) => {
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header Section */}
//       <div
//         className="py-14 shadow-lg"
//         style={{
//           background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
//         }}
//       >
//         <div className="container mx-auto px-6">
//           <h1 className="text-4xl font-extrabold text-white text-center tracking-wide">
//             Admin Legislators Dashboard
//           </h1>
//           <p className="text-lg text-gray-200 text-center mt-3 max-w-2xl mx-auto">
//             Manage all Nevada Legislators in the system. Add, edit, or delete
//             legislator records as needed.
//           </p>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Manage Legislators
//             </h2>
//             <button
//               onClick={() => onEditLegislator(null)}
//               className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
//               style={{
//                 background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
//               }}
//             >
//               <Plus className="w-5 h-5" />
//               Add New Legislator
//             </button>
//           </div>

//           {/* Search */}
//           <div className="mb-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search by name"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//               />
//             </div>
//           </div>

//           <div className="text-sm text-gray-600 mb-4">
//             Showing {startIndex + 1}-
//             {Math.min(endIndex, filteredLegislators.length)} of{" "}
//             {filteredLegislators.length} legislators
//           </div>

//           {/* Table */}
//           {loading ? (
//             <div
//               className="flex justify-center py-10 animate-pulse"
//               style={{ color: primaryColor }}
//             >
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
//               <p className="mt-4 text-gray-600 ml-2">Loading legislators...</p>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                         Party
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                         Chamber
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                         Score
//                       </th>
//                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {currentLegislators.map((legislator) => (
//                       <tr key={legislator.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {legislator.name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           <span
//                             className={
//                               legislator.party === "D"
//                                 ? "text-blue-600 font-semibold"
//                                 : "text-red-600 font-semibold"
//                             }
//                           >
//                             {legislator.party}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {legislator.chamber}
//                         </td>
//                         <td
//                           className={`px-6 py-4 whitespace-nowrap text-sm text-gray-600 ${getScoreColor(
//                             legislator.score_percentage
//                           )}`}
//                         >
//                           {legislator.score_percentage
//                             ? `${legislator.score_percentage.toFixed(2)}%`
//                             : "-"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <button
//                             onClick={() => onEditLegislator(legislator)}
//                             className="mr-4 inline-flex items-center gap-1 text-blue-600 hover:text-blue-900"
//                           >
//                             <Edit className="w-4 h-4" />
//                             Edit
//                           </button>
//                           <button
//                             onClick={() =>
//                               handleDelete(legislator.id, legislator.name)
//                             }
//                             className="inline-flex items-center gap-1 text-red-600 hover:text-red-900"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
//                   <div className="text-sm text-gray-600">
//                     Page {currentPage} of {totalPages}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => goToPage(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
//                     >
//                       <ChevronLeft className="w-5 h-5" />
//                     </button>

//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                       (page) => (
//                         <button
//                           key={page}
//                           onClick={() => goToPage(page)}
//                           className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                             currentPage === page
//                               ? "text-white"
//                               : "border border-gray-300 hover:bg-gray-50 text-gray-700"
//                           }`}
//                           style={
//                             currentPage === page
//                               ? {
//                                   background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
//                                 }
//                               : {}
//                           }
//                         >
//                           {page}
//                         </button>
//                       )
//                     )}

//                     <button
//                       onClick={() => goToPage(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                       className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
//                     >
//                       <ChevronRight className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageLegislators;
import { useState, useEffect, useContext } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { legislatorAPI } from "@/services/api";
import DeleteModalLegislator from "./DeleteModalLegislator";
import LegislatorForm from "./LegislatorForm";
import { TokenContext } from "@/store/TokenContextProvider";
import { newLightnerColor } from "@/utils/colorUtils";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

const ManageLegislators = () => {
  const [legislators, setLegislators] = useState([]);
  const [filteredLegislators, setFilteredLegislators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [legislatorToDelete, setLegislatorToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedLegislator, setSelectedLegislator] = useState(null);
  const { primaryColor } = useContext(TokenContext);
  const lighterPrimary = newLightnerColor(primaryColor, 30);
  useEffect(() => {
    fetchLegislators();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = legislators.filter(
        (leg) =>
          leg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leg.district?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLegislators(filtered);
      setCurrentPage(1);
    } else {
      setFilteredLegislators(legislators);
    }
  }, [searchTerm, legislators]);
  const getScoreColor = (score) => {
    if (!score) return "text-gray-400";
    if (score >= 90) return "text-green-600 font-bold";
    if (score >= 70) return "text-yellow-600 font-semibold";
    if (score >= 50) return "text-orange-600 font-semibold";
    return "text-red-600 font-bold";
  };
  const fetchLegislators = async () => {
    try {
      const response = await legislatorAPI.getAll();
      const data = Array.isArray(response) ? response : response.data || [];
      setLegislators(data);
      setFilteredLegislators(data);
    } catch (error) {
      console.error("Error fetching legislators:", error);
      setLegislators([]);
      setFilteredLegislators([]);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id, name) => {
    setLegislatorToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setLegislatorToDelete(null);
  };

  const handleDelete = async () => {
    if (!legislatorToDelete) return;

    setIsDeleting(true);
    try {
      const response = await legislatorAPI.delete(legislatorToDelete.id);
      setLegislators(
        legislators.filter((leg) => leg._id !== legislatorToDelete.id)
      );
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting legislator:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openAddForm = () => {
    setSelectedLegislator(null);
    setShowForm(true);
  };

  const openEditForm = (legislator) => {
    setSelectedLegislator(legislator);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedLegislator(null);
  };

  const handleSave = async (legislator) => {
    try {
      if (selectedLegislator && selectedLegislator._id) {
        await legislatorAPI.update(selectedLegislator._id, legislator);
      } else {
        await legislatorAPI.create(legislator);
      }
      await fetchLegislators();
      closeForm();
    } catch (error) {
      console.error("Error saving legislator:", error);
      throw error;
    }
  };

  const totalPages = Math.ceil(filteredLegislators.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLegislators = filteredLegislators.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div
        className="py-14 shadow-lg"
        style={{
          background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
        }}
      >
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-extrabold text-white text-center tracking-wide">
            Admin Legislators Dashboard
          </h1>
          <p className="text-lg text-gray-300 text-center mt-3 max-w-2xl mx-auto">
            Manage all Nevada Legislators in the system
            {/* Add, edit, or delete
            legislator records as needed. */}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Manage Legislators
            </h2>
            <button
              onClick={openAddForm}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Legislator
            </button>
          </div> */}

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                style={{ outlineColor: primaryColor }}
              />
            </div>
          </div>

          {/* Showing Info */}
          <div className="text-sm text-gray-600 mb-4">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredLegislators.length)} of{" "}
            {filteredLegislators.length} legislators
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-12">
              <div
                className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
                style={{ borderColor: primaryColor }}
              ></div>
              <p className="mt-4 text-gray-600">Loading legislators...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Party
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Chamber
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentLegislators.map((legislator) => (
                      <tr key={legislator._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {legislator.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span
                            className={
                              legislator.party === "D"
                                ? "text-blue-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {legislator.party}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {legislator.chamber}
                        </td>

                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-600 ${getScoreColor(
                            legislator.score_percentage
                          )}`}
                        >
                          {legislator.score_percentage
                            ? `${legislator.score_percentage.toFixed(2)}%`
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex flex-row gap-5 justify-end">
                          <Link
                            to={`/admin/manage-legislators/${legislator._id}`}
                            className="text-blue-600 hover:text-blue-900  inline-flex items-center gap-1"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </Link>
                          {/* <button
                            onClick={() => openEditForm(legislator)}
                            className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" /> 
                          </button> */}
                          <button
                            onClick={() =>
                              openDeleteModal(legislator._id, legislator.name)
                            }
                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModalLegislator
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        legislatorName={legislatorToDelete?.name || ""}
        isDeleting={isDeleting}
      />

      {/* Add/Edit Form */}
      {/* {showForm && (
        <LegislatorForm
          legislator={selectedLegislator}
          onClose={closeForm}
          onSave={handleSave}
        />
      )} */}
    </div>
  );
};

export default ManageLegislators;
