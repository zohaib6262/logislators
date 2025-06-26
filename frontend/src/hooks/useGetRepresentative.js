import BASE_URL from "@/lib/utils";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const useGetRepresentative = () => {
  const { id } = useParams();
  const [representative, setRepresentative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepresentative = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/representatives/${id}`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch representative");
        }

        const data = await response.json();
        setRepresentative(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setRepresentative(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRepresentative();
    }
  }, [id]);

  return { representative, loading, error };
};
