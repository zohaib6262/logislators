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

const ResourcesPage = () => {
  const { resources, loading, error } = useGetResources();
  const { resourceData, isLoading } = useFetchResourcePage();
  const { categories: totalCategories } = useGetCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { primaryColor } = useContext(TokenContext);

  const filterCategoryName = totalCategories.map((category) => category.name);
  const categories = ["All", ...filterCategoryName];

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
              {resourceData?.title || ""}
            </h1>
            <p className="text-xl text-blue-100 text-center mt-4 max-w-3xl mx-auto">
              {resourceData?.description || ""}
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search resources..."
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
              Loading resources...
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
                            {resource.category}
                          </span>
                          <h3 className="text-xl font-bold text-gray-800 mt-2">
                            {resource.title}
                          </h3>
                        </div>
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mt-3">
                        {resource.description}
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
                    No resources found matching your search. Try adjusting your
                    filters.
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
                Suggest a Resource
              </h2>
              <p className="text-gray-700 mb-4">
                Do you know of a valuable resource that should be included in
                our directory? Let us know and we'll consider adding it to the
                list.
              </p>
              <a
                href={`mailto:${resourceData?.email}?subject=Resource%20Suggestion`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                style={{ backgroundColor: primaryColor }}
              >
                Submit a Resource
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
