// import React, { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import {
//   Search,
//   PlusCircle,
//   Edit,
//   Trash2,
//   ChevronDown,
//   ChevronUp,
//   Loader2,
//   AlertTriangle,
//   Star,
// } from "lucide-react";
// import { useFetchRepresentatives } from "../../hooks/useRepresentatives";
// import { useDeleteRepresentative } from "../../hooks/useDeleteRepresentative";
// import DeleteConfirmationModal from "../DeleteConfirmationModal";
// import useLegislators from "../../hooks/lagislators/useLegislators";
// import useAllLegislators from "../../hooks/lagislators/useAllLagislators";

// const OfficialsManager = () => {
//   const { representatives, isLoading, error, refresh, setRepresentatives } =
//     useAllLegislators();
//   const { deleteRepresentative, isDeleting } = useDeleteRepresentative();
//   const modalRef = useRef(null);

//   // State for delete confirmation
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [representativeToDelete, setRepresentativeToDelete] = useState(null);

//   // Filter and sort state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortField, setSortField] = useState("name");
//   const [sortDirection, setSortDirection] = useState("asc");
//   const [currentFilter, setCurrentFilter] = useState("all");

//   // Filter function
//   const filteredRepresentatives = representatives.filter((rep) => {
//     const matchesSearch =
//       rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       rep.position?.toLowerCase().includes(searchTerm.toLowerCase());

//     if (currentFilter === "all") return matchesSearch;
//     if (currentFilter === "democratic")
//       return matchesSearch && rep.party === "Democratic Party";
//     if (currentFilter === "republican")
//       return matchesSearch && rep.party === "Republican Party";
//     return matchesSearch;
//   });

//   // Sort function
//   const sortedRepresentatives = [...filteredRepresentatives].sort((a, b) => {
//     const fieldA = a[sortField] || "";
//     const fieldB = b[sortField] || "";

//     if (typeof fieldA === "string" && typeof fieldB === "string") {
//       return sortDirection === "asc"
//         ? fieldA.localeCompare(fieldB)
//         : fieldB.localeCompare(fieldA);
//     }
//     return 0;
//   });

//   // Sort handler
//   const handleSort = (field) => {
//     if (field === sortField) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };

//   // Delete handlers
//   const handleDeleteClick = (rep) => {
//     setRepresentativeToDelete(rep);
//     setShowDeleteModal(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (representativeToDelete) {
//       const success = await deleteRepresentative(representativeToDelete._id);
//       if (success) {
//         // Optimistic UI update + refetch for consistency
//         setRepresentatives((prev) =>
//           prev.filter((rep) => rep._id !== representativeToDelete._id)
//         );
//         await refetch(); // Ensure data is in sync with server
//       }
//       setShowDeleteModal(false);
//       setRepresentativeToDelete(null);
//     }
//   };

//   const handleCancelDelete = () => {
//     setShowDeleteModal(false);
//     setRepresentativeToDelete(null);
//   };
//   const getPartyColor = (party) => {
//     const partyLower = party.toLowerCase();
//     if (partyLower.includes("democratic")) return "bg-blue-100 text-blue-800";
//     if (partyLower.includes("republican")) return "bg-red-100 text-red-800";
//     return "bg-gray-100 text-gray-800";
//   };
//   return (
//     <div className="container mx-auto px-4 py-8 mt-10">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
//           Representatives
//         </h1>
//         <Link
//           to="/admin/representatives/new"
//           className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           <PlusCircle size={18} className="mr-2" />
//           Add Representative
//         </Link>
//       </div>

//       {/* Loading State */}
//       {isLoading && (
//         <div className="flex justify-center py-10 text-blue-600 animate-pulse">
//           <Loader2 className="mr-2 animate-spin" />
//           Loading representatives...
//         </div>
//       )}

//       {/* Error State */}
//       {!isLoading && error && (
//         <div className="flex items-center justify-center text-red-600 py-6">
//           <AlertTriangle className="mr-2" />
//           {error}
//         </div>
//       )}

//       {/* Main Table */}
//       {!isLoading && !error && (
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           {/* Filters */}
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//               <div className="relative flex-1">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search size={18} className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search representatives..."
//                   className="block w-full pl-10 pr-3 py-2 border rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <select
//                   value={currentFilter}
//                   onChange={(e) => setCurrentFilter(e.target.value)}
//                   className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                 >
//                   <option value="all">All Parties</option>
//                   <option value="democratic">Democratic</option>
//                   <option value="republican">Republican</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {["name", "position", "party"].map((field) => (
//                     <th
//                       key={field}
//                       onClick={() => handleSort(field)}
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     >
//                       <div className="flex items-center">
//                         {field.charAt(0).toUpperCase() + field.slice(1)}
//                         {sortField === field &&
//                           (sortDirection === "asc" ? (
//                             <ChevronUp size={16} className="ml-1" />
//                           ) : (
//                             <ChevronDown size={16} className="ml-1" />
//                           ))}
//                       </div>
//                     </th>
//                   ))}
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Rating
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {sortedRepresentatives.map((rep) => (
//                   <tr key={rep._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
//                           {rep.image ? (
//                             <img
//                               src={rep.image}
//                               alt={rep.name}
//                               className="h-10 w-10 object-cover rounded-full"
//                             />
//                           ) : (
//                             rep.name.charAt(0)
//                           )}
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {rep.name}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             District-{rep.current_role.district || "N/A"}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {rep?.current_role?.title}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {rep?.current_role?.county}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPartyColor(
//                           rep.party
//                         )}`}
//                       >
//                         {rep.party || "Independent"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {rep?.rating && (
//                         <div className="mt-2 flex flex-wrap items-center gap-1 text-sm text-gray-900">
//                           {[...Array(5)].map((_, i) => (
//                             <Star
//                               key={i}
//                               size={18}
//                               className={
//                                 i < Math.floor(rep.rating)
//                                   ? "text-yellow-400 fill-yellow-400"
//                                   : "text-gray-300"
//                               }
//                             />
//                           ))}
//                           <span className="ml-2 text-sm text-gray-600">
//                             {`${rep.rating.toFixed(1)}/5` || "N/A"}
//                           </span>
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="flex justify-end space-x-3">
//                         <Link
//                           to={`/admin/representatives/${rep._id}`}
//                           className="text-blue-600 hover:text-blue-900"
//                           title="Edit"
//                         >
//                           <Edit size={18} />
//                         </Link>
//                         <button
//                           onClick={() => handleDeleteClick(rep)}
//                           className="text-red-600 hover:text-red-900"
//                           title="Delete"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//                 {sortedRepresentatives.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="px-6 py-4 text-center text-gray-500"
//                     >
//                       No representatives found matching your criteria.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         ref={modalRef}
//         isOpen={showDeleteModal}
//         onClose={handleCancelDelete}
//         onConfirm={handleConfirmDelete}
//         isDeleting={isDeleting}
//         representativeName={representativeToDelete?.name || ""}
//       />
//     </div>
//   );
// };

// export default OfficialsManager;
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertTriangle,
  Star,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { useDeleteRepresentative } from "../../hooks/useDeleteRepresentative";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import useAllLegislators from "../../hooks/lagislators/useAllLagislators";
import RatingBar from "../../UI/RatingBar";

// Small reusable components
const LoadingSpinner = () => (
  <div className="flex justify-center py-10 text-blue-600 animate-pulse">
    <Loader2 className="mr-2 animate-spin" />
    Loading representatives...
  </div>
);

const ErrorMessage = ({ error }) => (
  <div className="flex items-center justify-center text-red-600 py-6">
    <AlertTriangle className="mr-2" />
    {error}
  </div>
);
const EmptyState = () => (
  <tr>
    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
      No representatives found matching your criteria.
    </td>
  </tr>
);

const PartyBadge = ({ party }) => {
  const partyLower = party?.toLowerCase() || "";
  let className =
    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full ";

  if (partyLower.includes("democratic")) {
    className += "bg-blue-100 text-blue-800";
  } else if (partyLower.includes("republican")) {
    className += "bg-red-100 text-red-800";
  } else if (partyLower.includes("independent")) {
    className += "bg-gray-100 text-gray-800 border border-gray-300";
  } else if (partyLower.includes("libertarian")) {
    className += "bg-yellow-100 text-yellow-800";
  } else if (partyLower.includes("green")) {
    className += "bg-green-100 text-green-800";
  } else {
    className += "bg-purple-100 text-purple-800"; // Default for other parties
  }

  // Display text - capitalize first letter
  const displayText = party
    ? party.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
    : "Independent";

  return <span className={className}>{displayText}</span>;
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-6 py-3 ">
      <div className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "border border-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const OfficialsManager = () => {
  const { representatives, isLoading, error, refresh, setRepresentatives } =
    useAllLegislators();
  const { deleteRepresentative, isDeleting } = useDeleteRepresentative();
  const modalRef = useRef(null);

  // State for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [representativeToDelete, setRepresentativeToDelete] = useState(null);

  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentFilter, setCurrentFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const representativesPerPage = 5;

  // Filter function
  const filteredRepresentatives = representatives.filter((rep) => {
    const matchesSearch =
      rep.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.current_role?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      rep.current_role?.district?.toString().includes(searchTerm) ||
      rep.extras?.county?.toLowerCase().includes(searchTerm.toLowerCase());

    if (currentFilter === "all") return matchesSearch;
    if (currentFilter === "democratic")
      return matchesSearch && rep.party === "Democratic";
    if (currentFilter === "republican")
      return matchesSearch && rep.party === "Republican";
    if (currentFilter === "independent") {
      return matchesSearch && rep.party === "Independent";
    }

    if (currentFilter === "libertarian")
      return matchesSearch && rep.party === "Libertarian";
    if (currentFilter === "green")
      return matchesSearch && rep.party === "Green";
  });
  // Sort function
  const sortedRepresentatives = [...filteredRepresentatives].sort((a, b) => {
    const fieldA = a[sortField] || "";
    const fieldB = b[sortField] || "";

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastRepresentative = currentPage * representativesPerPage;
  const indexOfFirstRepresentative =
    indexOfLastRepresentative - representativesPerPage;
  const currentRepresentatives = sortedRepresentatives.slice(
    indexOfFirstRepresentative,
    indexOfLastRepresentative
  );
  const totalPages = Math.ceil(
    sortedRepresentatives.length / representativesPerPage
  );

  // Sort handler
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Delete handlers
  const handleDeleteClick = (rep) => {
    setRepresentativeToDelete(rep);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (representativeToDelete) {
      const success = await deleteRepresentative(representativeToDelete._id);
      if (success) {
        setRepresentatives((prev) =>
          prev.filter((rep) => rep._id !== representativeToDelete._id)
        );
        await refresh();
      }
      setShowDeleteModal(false);
      setRepresentativeToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRepresentativeToDelete(null);
  };

  return (
    <div className="min-h-screen bg-white pt-0">
      <div className="bg-gradient-to-r from-[#5f93e1] to-[#0844da] py-14 shadow-lg">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-extrabold text-white text-center tracking-wide">
            Representatives
          </h1>
          <p className="text-lg text-gray-300 text-center mt-3 max-w-2xl mx-auto">
            Manage all legislative representatives
          </p>
        </div>
      </div>

      <div className="px-4 py-8">
        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {!isLoading && error && <ErrorMessage error={error} />}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search representatives..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-12"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <select
                value={currentFilter}
                onChange={(e) => {
                  setCurrentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Parties</option>
                <option value="democratic">Democratic</option>
                <option value="republican">Republican</option>
                <option value="independent">Independent</option>
                <option value="libertarian">Libertarian</option>
                <option value="green">Green</option>
              </select>
            </div>
          </div>
        </div>

        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {["name", "position", "party"].map((field) => (
                <TableHead
                  key={field}
                  onClick={() => handleSort(field)}
                  className="cursor-pointer hover:bg-gray-100 text-gray-500 uppercase text-xs tracking-wider"
                >
                  <div className="flex items-center">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortField === field &&
                      (sortDirection === "asc" ? (
                        <ChevronUp size={16} className="ml-1" />
                      ) : (
                        <ChevronDown size={16} className="ml-1" />
                      ))}
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-gray-500 uppercase text-xs tracking-wider">
                Rating
              </TableHead>
              <TableHead className="text-right text-gray-500 uppercase text-xs tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRepresentatives.length > 0 ? (
              currentRepresentatives.map((rep) => (
                <TableRow key={rep._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {rep.image ? (
                          <img
                            src={rep.image}
                            alt={rep.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {rep.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {rep.name}
                        </div>
                        <div className="text-gray-500">
                          District-{rep.current_role.district || "N/A"}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-gray-900">
                      {rep?.current_role?.title}
                    </div>
                    <div className="text-gray-500">{rep?.extras?.county}</div>
                  </TableCell>

                  <TableCell>
                    <PartyBadge party={rep.party} />
                  </TableCell>

                  <TableCell>
                    <RatingBar rating={rep?.extras?.grade} />
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-3">
                      <Link
                        to={`/admin/representatives/${rep._id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(rep)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <EmptyState />
            )}
          </TableBody>

          {sortedRepresentatives.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
        {/* Main Table */}
        {!isLoading && !error && <h2>{error}</h2>}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        ref={modalRef}
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        representativeName={representativeToDelete?.name || ""}
      />
    </div>
  );
};

export default OfficialsManager;
