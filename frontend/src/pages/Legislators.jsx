import { useState, useEffect, useContext } from "react";
import { Search, Filter, Download, RefreshCw, Loader2 } from "lucide-react";
import { legislatorAPI } from "../services/api";
import LegislatorTable from "../reusableComponents/LegislatorTable";
import toast from "react-hot-toast";
import { TokenContext } from "@/store/TokenContextProvider";
import { useFetchLegislatorPage } from "@/hooks/manageLegislatorsHeaderPage/manageLegislatorsHeaderPage";

export default function LegislatorsPage() {
  const [legislators, setLegislators] = useState([]);
  const [filteredLegislators, setFilteredLegislators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    party: "",
    chamber: "",
    recommendation: "",
    minScore: "",
    maxScore: "",
  });
  const { primaryColor } = useContext(TokenContext);
  const { legislatorData, isLoading } = useFetchLegislatorPage();

  useEffect(() => {
    fetchLegislators();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else if (hasActiveFilters()) {
      handleFilter();
    } else {
      setFilteredLegislators(legislators);
    }
  }, [searchTerm, filters, legislators]);

  const hasActiveFilters = () => {
    return (
      filters.party ||
      filters.chamber ||
      filters.recommendation ||
      filters.minScore ||
      filters.maxScore
    );
  };

  const fetchLegislators = async () => {
    try {
      setLoading(true);
      const response = await legislatorAPI.getAll();
      setLegislators(response.data);
      setFilteredLegislators(response.data);
      toast.success(
        `Loaded ${response.count || response.data?.length || 0} legislators`
      );
    } catch (error) {
      console.error("Error fetching legislators:", error);
      toast.error("Failed to load legislators");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredLegislators(legislators);
      return;
    }

    try {
      const response = await legislatorAPI.search(searchTerm);
      setFilteredLegislators(response.data);
    } catch (error) {
      console.error("Error searching:", error);
      const filtered = legislators.filter(
        (leg) =>
          leg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leg.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLegislators(filtered);
    }
  };

  const handleFilter = async () => {
    if (!hasActiveFilters()) {
      setFilteredLegislators(legislators);
      return;
    }

    try {
      const filterParams = {};
      if (filters.party) filterParams.party = filters.party;
      if (filters.chamber) filterParams.chamber = filters.chamber;
      if (filters.recommendation)
        filterParams.recommendation = filters.recommendation;
      if (filters.minScore) filterParams.minScore = Number(filters.minScore);
      if (filters.maxScore) filterParams.maxScore = Number(filters.maxScore);

      const response = await legislatorAPI.filter(filterParams);
      setFilteredLegislators(response.data);
    } catch (error) {
      console.error("Error filtering:", error);
      toast.error("Failed to apply filters");
    }
  };

  const clearFilters = () => {
    setFilters({
      party: "",
      chamber: "",
      recommendation: "",
      minScore: "",
      maxScore: "",
    });
    setSearchTerm("");
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Party",
      "Chamber",
      "District",
      "Recommendation",
      "Score",
      "Points",
    ];
    const csvData = filteredLegislators.map((leg) => [
      leg.name,
      leg.party,
      leg.chamber,
      leg.district,
      leg.recommendation,
      leg.score,
      leg.points,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nevada-legislators-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    toast.success("CSV exported successfully");
  };

  const LoadingSpinner = () => (
    <div
      className="flex justify-center py-10 animate-pulse"
      style={{ color: primaryColor }}
    >
      <Loader2 className="mr-2 animate-spin" />
      Loading about us page...
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50">
      {/* {isLoading && <LoadingSpinner />} */}

      {legislatorData?.enableLegislatorsHeader && (
        <div
          className="pt-24 pb-16"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, ${primaryColor})`,
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {legislatorData?.title || ""}
              </h1>
              <p className="text-xl opacity-90 mb-8">
                {legislatorData?.description || ""}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 mt-16">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                style={{ outlineColor: primaryColor }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  borderColor: showFilters && primaryColor,
                  color: showFilters && primaryColor,
                }}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  !showFilters && "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
              <button
                onClick={fetchLegislators}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors`}
                style={{ background: primaryColor }}
              >
                <Download className="w-5 h-5" />
                Export CSV
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party
                  </label>
                  <select
                    value={filters.party}
                    onChange={(e) =>
                      setFilters({ ...filters, party: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    style={{ outlineColor: primaryColor }}
                  >
                    <option value="">All Parties</option>
                    <option value="D">Democrat</option>
                    <option value="R">Republican</option>
                    <option value="I">Independent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chamber
                  </label>
                  <select
                    value={filters.chamber}
                    onChange={(e) =>
                      setFilters({ ...filters, chamber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    style={{ outlineColor: primaryColor }}
                  >
                    <option value="">All Chambers</option>
                    <option value="Assembly">Assembly</option>
                    <option value="Senate">Senate</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredLegislators.length} of {legislators.length}{" "}
              legislators
            </div>
            {(searchTerm || hasActiveFilters()) && (
              <div className="text-sm" style={{ color: primaryColor }}>
                {searchTerm && `Searching for "${searchTerm}"`}
                {searchTerm && hasActiveFilters() && " • "}
                {hasActiveFilters() && "Filters applied"}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 "
              style={{ borderColor: primaryColor }}
            ></div>
            <p className="mt-4 text-gray-600">Loading legislators...</p>
          </div>
        ) : filteredLegislators.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600">No legislators found</p>
            <button
              onClick={clearFilters}
              className="mt-4"
              style={{ color: primaryColor }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <LegislatorTable legislators={filteredLegislators} />
          </div>
        )}
      </div>
    </div>
  );
}
