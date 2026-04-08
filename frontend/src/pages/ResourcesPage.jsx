import React, { useState, useContext } from "react";
import {
  Search,
  FileText,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import useGetResources from "../hooks/useGetRecources";
import { useFetchResourcePage } from "@/hooks/manageResourcePage/useManageResourcePage";
import { TokenContext } from "@/store/TokenContextProvider";
import useGetCategories from "@/hooks/categories/useGetCategories";

/*
 * Data sources (public /resources page):
 * - Hero: resourceData from GET /api/resource (ManageResourcePage). Fallback when missing or isLegacyCivicContent().
 * - Featured card: first resource with isFeatured from GET /api/resources. Same fallbacks for legacy text.
 * - List cards: GET /api/resources; title/description/category use fallbacks or getCategoryDisplayName when legacy.
 * - Categories: GET /api/categories. Site branding: GET /api/settings (Header/Footer).
 */

/** Detect legacy civic/voting/Nevada wording so we can show school-focused fallbacks instead. */
function isLegacyCivicContent(str) {
  if (!str || typeof str !== "string") return true;
  const s = str.toLowerCase();
  return (
    s.includes("nevada") &&
    (s.includes("voting") ||
      s.includes("civic") ||
      s.includes("government") ||
      s.includes("elected") ||
      s.includes("representatives") ||
      s.includes("legislator"))
  );
}

/** Display label for resource category (school-focused when legacy category names exist). */
function getCategoryDisplayName(category) {
  if (!category) return "";
  const map = {
    Voting: "Admissions & Info",
    Government: "School & Government",
    Education: "Education",
  };
  return map[category] || category;
}

const ResourcesPage = () => {
  const { resources, loading, error } = useGetResources();
  const { resourceData, isLoading } = useFetchResourcePage();
  const { categories: totalCategories } = useGetCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { primaryColor } = useContext(TokenContext);
  // Utility function to lighten a hex color
  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const lightShade = lightenColor(primaryColor, 70); // soft pastel background
  const veryLightShade = lightenColor(primaryColor, 85); // faint background

  const filterCategoryName = totalCategories.map((category) => category.name);
  const categories = ["All", ...filterCategoryName];

  const featuredResource = resources.filter((item) => item.isFeatured);
  const featuredCategory = featuredResource[0]?.category;
  const categoryColor =
    featuredCategory === "Government"
      ? "bg-blue-100 text-blue-800"
      : featuredCategory === "Voting"
      ? "bg-green-100 text-green-800"
      : featuredCategory === "Education"
      ? "bg-purple-100 text-purple-800"
      : "bg-yellow-100 text-yellow-800";
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || resource.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {resourceData?.enableResourceHeader && (
        <div
          className="py-12"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, ${primaryColor})`,
          }}
        >
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              {resourceData?.title && !isLegacyCivicContent(resourceData.title)
                ? resourceData.title
                : "Resource Page"}
            </h1>
            <p className="text-xl text-blue-100 text-center mt-4 max-w-3xl mx-auto">
              {resourceData?.description &&
              !isLegacyCivicContent(resourceData.description)
                ? resourceData.description
                : "Explore helpful resources that support families in finding schools, understanding admissions, and preparing for enrollment."}
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="py-8">
            {featuredResource.length > 0 && (
              <div
                className="bg-gradient-to-r from-orange-50 to-red-50 border-2 rounded-xl p-8 shadow-lg"
                style={{
                  borderColor: primaryColor,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="text-white p-3 rounded-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider"
                        style={{ backgroundColor: primaryColor, color: "#fff" }}
                      >
                        Featured School Resource
                      </span>
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full ${categoryColor}`}
                      >
                        {getCategoryDisplayName(featuredResource[0].category)}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      {featuredResource[0].title &&
                      !isLegacyCivicContent(featuredResource[0].title)
                        ? featuredResource[0].title
                        : "School Search & Admissions Support"}
                    </h2>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      {featuredResource[0].description &&
                      !isLegacyCivicContent(featuredResource[0].description)
                        ? featuredResource[0].description
                        : "Browse useful school-related guidance designed to help families make informed decisions. Resources may include admissions help, enrollment checklists, tuition and financial aid guidance, required document information, parent support materials, and school comparison tips."}
                    </p>
                    <a
                      href={featuredResource[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                      style={{
                        backgroundColor: primaryColor,
                        color: "white",
                      }}
                    >
                      Visit Resource
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search school resources..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 pl-12 focus:outline-none focus:ring-2"
                    style={{
                      borderColor: primaryColor,
                      boxShadow: `0 0 0 2px ${primaryColor}33`,
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2"
                  style={{
                    borderColor: primaryColor,
                    boxShadow: `0 0 0 2px ${primaryColor}33`,
                  }}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div
              className="flex justify-center py-10 animate-pulse"
              style={{ color: primaryColor }}
            >
              <Loader2 className="mr-2 animate-spin" />
              Loading school resources...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center text-red-600 py-6">
              <AlertTriangle className="mr-2" />
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <div
                    key={resource._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              resource.category === "Government"
                                ? "bg-blue-100 text-blue-800"
                                : resource.category === "Voting"
                                ? "bg-green-100 text-green-800"
                                : resource.category === "Education"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {getCategoryDisplayName(resource.category)}
                          </span>
                          <h3 className="text-xl font-bold text-gray-800 mt-2">
                            {resource.title &&
                            !isLegacyCivicContent(resource.title)
                              ? resource.title
                              : "School resource"}
                          </h3>
                        </div>
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mt-3">
                        {resource.description &&
                        !isLegacyCivicContent(resource.description)
                          ? resource.description
                          : "Helpful information for families exploring schools, admissions, and enrollment."}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center font-medium transition-colors"
                          style={{ color: primaryColor }}
                        >
                          Visit Resource
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">
                    No school resources found matching your search. Try
                    adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Suggest a Resource */}
          {resourceData?.email && (
            <div
              className="mt-12 rounded-lg shadow-md p-6"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Suggest a School Resource
              </h2>
              <p className="text-gray-700 mb-4">
                Do you know of a valuable school-related resource that could
                help families find schools, understand admissions, or prepare
                for enrollment? Let us know and we'll consider adding it to the
                list.
              </p>
              <a
                href={`mailto:${resourceData?.email}?subject=School%20Resource%20Suggestion`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                style={{ backgroundColor: primaryColor }}
              >
                Submit a Suggestion
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
