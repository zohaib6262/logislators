import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils";

const usePrimaryColor = () => {
  const [primaryColor, setPrimaryColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch primary color on mount
  useEffect(() => {
    const fetchColor = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/primary`);
        setPrimaryColor(data.primaryBgColor);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchColor();
  }, []);

  // Function to update color with authentication
  const updatePrimaryColor = async (newColor) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send token in header
        },
      };

      const { data } = await axios.put(
        `${BASE_URL}/primary`,
        { primaryBgColor: newColor },
        config
      );

      setPrimaryColor(data.primaryBgColor);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { primaryColor, loading, error, updatePrimaryColor };
};

export default usePrimaryColor;
