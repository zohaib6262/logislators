import React, { useContext } from "react";
import SearchForm from "../reusableComponents/SearchForm";
import { useNavigate, useOutletContext } from "react-router-dom";
import { TokenContext } from "@/store/TokenContextProvider";
import { lightenColor } from "@/utils/colorUtils";

const HomePage = () => {
  const {
    homeData,
    coords,
    people,
    isLoading,
    setIsLoading,
    error,
    features,
    header,
  } = useOutletContext();

  const navigation = useNavigate();
  const { primaryColor } = useContext(TokenContext);
  const lightPrimary = lightenColor(primaryColor, 60); // 60% lighter

  const handleSearch = async (formData) => {
    try {
      const { street, city, state, zipcode } = formData;
      const queryParams = new URLSearchParams({
        street,
        city,
        state,
        zipCode: zipcode,
      });
      const queryString = queryParams.toString().replace(/%20/g, "+");
      navigation(`/representatives?${queryString}`, { state: formData });
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      {/* Hero Section */}
      {homeData?.enableHomeHeader && (
        <div style={{ backgroundColor: primaryColor }} className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {homeData.pageTitle || ""}
              </h1>
              <p className="text-xl opacity-90 mb-8">
                {homeData.pageDescription || ""}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-8">
        <SearchForm
          onSearch={handleSearch}
          isLoading={isLoading}
          homeData={homeData}
        />

        {error && (
          <div className="max-w-2xl mx-auto mt-6 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Information Cards */}
        <div className="max-w-6xl mx-auto mt-16">
          {header && (
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              {header}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features?.map((feature) => (
              <div
                key={feature._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: lightPrimary }}
                >
                  <img
                    src={feature?.icon}
                    alt="Feature Icon"
                    className="w-6 h-6"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature?.title || ""}
                </h3>
                <p className="text-gray-600">{feature?.description || ""}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
