import BASE_URL from "@/lib/utils";
import { useEffect, useState } from "react";

const useGetResource = (id) => {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await fetch(`${BASE_URL}/resources/${id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        setResource(data);
      } catch (error) {
        setError(error.error || "Failed to fetch resource");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchResource();
  }, [id]);

  return { resource, loading, fetchDataError: error };
};

export default useGetResource;
