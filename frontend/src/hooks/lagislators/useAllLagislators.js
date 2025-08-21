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
      let data2 = [];

      if (data) {
        for (let i = 0; i < data.length; i++) {
          const classification = data[i].jurisdiction.classification;

          if (
            classification !== "country" &&
            classification !== "federal" &&
            (data[i].current_role.title === "Assembly Member" ||
              data[i].current_role.title === "Senator")
          ) {
            console.log("Data", classification);

            data2.push(data[i]);
          }
        }
      }

      setRepresentatives(data2);
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
