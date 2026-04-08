import BASE_URL from "@/lib/utils";
import { useState, useCallback, useEffect } from "react";

const useUserContactSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assemblyDistrict, setAssemblyDistrict] = useState("");
  const [stateDistrict, setStateDistrict] = useState("");

  const submitUserContact = useCallback(
    async (formData) => {
      const obj = {
        ...formData,
        assemblyDistrict: assemblyDistrict && assemblyDistrict,
        stateDistrict: stateDistrict && stateDistrict,
      };
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${BASE_URL}/userContact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to save user data");
        }

        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [assemblyDistrict, stateDistrict]
  );

  return {
    submitUserContact,
    isLoading,
    error,
    setAssemblyDistrict,
    setStateDistrict,
    assemblyDistrict,
    stateDistrict,
  };
};

export default useUserContactSubmit;
