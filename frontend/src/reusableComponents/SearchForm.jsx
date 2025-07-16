import React, { useState } from "react";
import { Loader2, Search } from "lucide-react";
import Label from "../UI/Label";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { NavLink, useParams } from "react-router-dom";
import useFetchHomePage from "../hooks/homePage/useFetchHomePage";
const SearchForm = ({ onSearch, isLoading, homeData }) => {
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "Nevada",
    email: "",
    firstName: "",
    lastName: "",
    zipcode: "",
  });
  const [localError, setLocalError] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Update the handleSubmit function in SearchForm.js
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (homeData.enableStreetAddress && !formData.street.trim()) ||
      (homeData.enableCity && !formData.city.trim()) ||
      (homeData.enableZipCode && !formData.zipcode) ||
      !formData.email.trim() ||
      !formData.firstName.trim()
    ) {
      setLocalError("Please fill out all required address fields");
      return;
    }

    onSearch(formData);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Image */}
        {homeData.image && (
          <div className="md:w-1/2 relative">
            <img
              src={homeData?.image}
              alt="Nevada State Capitol"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center p-8">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">
                  {homeData?.imageTitle || ""}
                </h2>
                <p className="text-lg opacity-90">
                  {homeData?.imageDescription || ""}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Right side - Form */}
        <div className="md:w-1/2 p-8 bg-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Find Your Representatives
            </h2>

            <p className="text-gray-600 mb-6">
              Enter your Nevada address to discover who represents you and
              access resources about your elected officials.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
                {homeData?.enableZipCode && (
                  <div className="space-y-2">
                    <Label htmlFor="zipcode">ZIP Code</Label>
                    <Input
                      id="zipcode"
                      name="zipcode"
                      type="number"
                      placeholder="ZIP Code"
                      value={formData.zipcode}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              {homeData?.enableStreetAddress && (
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    placeholder="123 Main Street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {homeData?.enableCity && (
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Las Vegas"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    readOnly
                    className="bg-gray-100 w-full"
                  />
                </div>
              </div>
              {localError && (
                <p className="text-red-600 text-sm mt-2">{localError}</p>
              )}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-50 py-3 text-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Find My Representatives"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
