import React, { useContext, useState } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import { TokenContext } from "@/store/TokenContextProvider";
import { lightenColor } from "@/utils/colorUtils";
import Label from "@/UI/Label";
import Input from "@/UI/Input";
import Button from "@/UI/Button";

/**
 * SchoolFinder: Full-page with hero and lead/address form only.
 * Submit navigates to /schools?zipCode=... (filters are on results page).
 */
const SchoolFinder = () => {
  const navigate = useNavigate();
  const { homeData, error, features, header } = useOutletContext();
  const { primaryColor } = useContext(TokenContext);
  const lightPrimary = lightenColor(primaryColor, 60);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    zipcode: "",
    street: "",
    city: "",
    state: "Nevada",
  });
  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName?.trim() || !formData.email?.trim()) {
      setLocalError("Please fill out all required address fields");
      return;
    }
    if (!formData.zipcode?.trim()) {
      setLocalError("ZIP Code is required for school search.");
      return;
    }
    setLocalError(null);
    const zipCode = formData.zipcode.trim();
    const leadState = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      street: formData.street.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
    };
    navigate(`/schools?zipCode=${encodeURIComponent(zipCode)}`, { state: leadState });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      {/* Hero Section - same as Home page */}
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

      {/* Main Content - duplicated form card + exact copy + school fields */}
      <div className="container mx-auto px-4 py-12 -mt-8">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Image (exact copy text) */}
            {homeData?.image && (
              <div className="md:w-1/2 relative">
                <img
                  src={homeData.image}
                  alt="Nevada State Capitol"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center justify-center p-4 text-center">
                  <div className="text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">
                      Nevada State Capitol
                    </h2>
                    <p className="text-sm md:text-lg opacity-90 font-semibold mb-2">
                      Your Voice is Powerful
                    </p>
                    <p className="text-sm md:text-lg opacity-90">
                      Every law that affects your family, your business, and your
                      community is shaped by the Nevada Legislature. Whether you
                      care about education, taxes, healthcare, or government
                      transparency, your input matters. But the first step is
                      knowing who to contact.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Right side - Form (exact labels/placeholders + school fields) */}
            <div className="md:w-1/2 p-8 bg-white">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Find Your School
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
                    <div className="space-y-2">
                      <Label htmlFor="zipcode">
                        ZIP Code<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="zipcode"
                        name="zipcode"
                        placeholder="ZIP Code"
                        value={formData.zipcode}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      name="street"
                      placeholder="Enter your street address"
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="Enter your city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>
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
                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <Button type="submit" className="w-full sm:w-auto py-3 text-md">
                      Find My School
                    </Button>
                    <Link
                      to="/add-school"
                      className="inline-flex items-center justify-center w-full sm:w-auto py-3 px-4 text-md font-semibold rounded-lg border-2 transition-colors"
                      style={{
                        borderColor: primaryColor,
                        color: primaryColor,
                      }}
                    >
                      Add Your School
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mt-6 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Information Cards - same as Home page */}
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

export default SchoolFinder;
