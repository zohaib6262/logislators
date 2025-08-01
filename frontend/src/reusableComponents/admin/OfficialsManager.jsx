import React, { useState, useRef, useContext } from "react";
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
  Plus,
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
import { TokenContext } from "@/store/TokenContextProvider";

// Small reusable components
const LoadingSpinner = ({ primaryColor }) => (
  <div
    className="flex justify-center py-10 animate-pulse"
    style={{ color: primaryColor }}
  >
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
  const { primaryColor } = useContext(TokenContext);
  const lightenColor = (color, percent) => {
    if (!color) return "#93c5fd";
    color = color.replace("#", "");

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    const lighten = (value) =>
      Math.min(255, value + Math.round(255 * (percent / 100)));

    return `#${[
      lighten(r).toString(16).padStart(2, "0"),
      lighten(g).toString(16).padStart(2, "0"),
      lighten(b).toString(16).padStart(2, "0"),
    ].join("")}`;
  };
  const lighterPrimary = lightenColor(primaryColor, 30);

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
      <div
        className="py-14 shadow-lg"
        style={{
          background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
        }}
      >
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-extrabold text-white text-center tracking-wide">
            Admin Representatives Dashboard
          </h1>
          <p className="text-lg text-gray-300 text-center mt-3 max-w-2xl mx-auto">
            Manage all legislative representatives
          </p>
        </div>
      </div>

      <div className="px-4 py-5">
        {/* Loading State */}
        <div className="py-2 w-60 flex justify-between items-center mb-6">
          <Link
            to="/admin/representatives/new"
            className="flex items-center px-4 py-3 text-white text-sm font-medium rounded-md transition-all"
            style={{
              background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Representative
          </Link>
        </div>

        {isLoading && <LoadingSpinner primaryColor={primaryColor} />}

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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 pl-12"
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
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 bg-white"
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
