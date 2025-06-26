import React, { useState } from "react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Label from "../UI/Label";
import { Card, CardContent } from "../UI/Card";
import { searchRepresentatives } from "../services/civicApi";
import { toast } from "sonner";
import RepresentativeList from "../reusableComponents/RepresentativeList";
// import { Official } from "../reusableComponents/OfficialCard";

const AddressForm = () => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({
    offices: [],
    officials: [],
  });
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "Nevada",
    zipCode: "",
    email: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.street || !formData.city || !formData.zipCode) {
      toast.error("Please fill out all required address fields");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResults(null);

    const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}`;

    try {
      // Log form data (could be sent to CRM)

      const results = await searchRepresentatives(fullAddress);

      if (results?.offices?.length === 0 && results?.officials?.length === 0) {
        toast.error("No representatives found for this address.");
        setSearchResults(null);
      } else {
        setSearchResults(results);
        toast.success("Representatives found!");
      }
    } catch (error) {
      toast.error("Failed to find representatives. Please try again.");
      setError("Failed to find representatives. Please try again.");
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-center mb-4">
              Enter Your Information
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Fill out the form below to find your state legislators and
              register with our system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">
              Street Address<span className="text-red-500">*</span>
            </Label>
            <Input
              id="street"
              name="street"
              placeholder="123 Main St"
              required
              value={formData.street}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                City<span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                placeholder="Las Vegas"
                required
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">
                ZIP Code<span className="text-red-500">*</span>
              </Label>
              <Input
                id="zipCode"
                name="zipCode"
                placeholder="89101"
                required
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-6 text-lg"
              disabled={loading}
            >
              {loading ? "Searching..." : "Find My Representatives"}
            </Button>
          </div>
        </form>

        {error && (
          <p className="mt-8 text-center text-red-600 font-semibold">{error}</p>
        )}

        {searchResults && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">
              Your Representatives:
            </h3>
            {searchResults && (
              <div className="max-w-4xl mx-auto mt-12">
                <RepresentativeList
                  offices={searchResults.offices}
                  officials={searchResults.officials}
                  isLoading={loading}
                />
              </div>
            )}
          </div>
        )}

        {searchResults && searchResults.officials.length === 0 && (
          <p className="mt-8 text-center text-gray-600">
            No representatives found for this address.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressForm;
