import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils";
const API_BASE_URL = `${BASE_URL}/features`;
function useFetchHomePage() {
  const [homeData, setHomeData] = useState({
    enableHomeHeader: true,
    pageTitle: "",
    pageDescription: "",
    image: "",
    imageTitle: "",
    imageDescription: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHomePage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/home`);
      setHomeData(response.data);
    } catch (err) {
      setError({
        statusCode: err.response?.status || 500,
        message: err.response?.data?.message || "Failed to fetch home page",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomePage();
  }, [fetchHomePage]);

  return {
    homeData,
    setHomeData,
    setIsLoading,
    isLoading,
    error,
    refetch: fetchHomePage,
  };
}

export default useFetchHomePage;
