import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils";

export const useFetchRepresentatives = () => {
  const [representatives, setRepresentatives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRepresentatives = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/representatives`);
      setRepresentatives(response.data);
    } catch (err) {
      setError(
        err || "Failed to load representatives. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepresentatives();
  }, [fetchRepresentatives]);

  return {
    representatives,
    isLoading,
    error,
    refetch: fetchRepresentatives,
    setRepresentatives,
  };
};

export const useSearchRepresentatives = () => {
  const [representatives, setRepresentatives] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRepresentatives = async (address) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:5000/api/representatives/search?address=${address}`
      );
      setRepresentatives(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to find representatives. Please check the address and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    representatives,
    isLoading,
    error,
    searchRepresentatives,
    setRepresentatives,
  };
};
