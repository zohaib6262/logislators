import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils";

const useGetResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/resources`);
      setResources(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return { resources, loading, error, refetch: fetchResources };
};

export default useGetResources;
