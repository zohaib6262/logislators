import { useState, useEffect } from "react";
import BASE_URL from "@/lib/utils";
const useAllLegislators = () => {
  const [representatives, setRepresentatives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllLegislators = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/representatives`);
      if (!response.ok) throw new Error("Failed to fetch legislators");

      const data = await response.json();
      setRepresentatives(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLegislators();
  }, []);

  return {
    representatives,
    isLoading,
    error,
    refresh: fetchAllLegislators,
    setRepresentatives,
  };
};

export default useAllLegislators;
