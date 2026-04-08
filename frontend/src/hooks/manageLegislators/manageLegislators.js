// ============================================
// src/hooks/useGetLegislator.js
// ============================================

import { useState, useEffect } from "react";
import { legislatorAPI } from "@/services/api";

export const useGetLegislator = (id) => {
  const [legislator, setLegislator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLegislator = async () => {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          const data = await legislatorAPI.getById(id);
          setLegislator(data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch legislator");
        console.error("Error fetching legislator:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLegislator();
  }, [id]);

  return { legislator, loading, error };
};

// ============================================
// src/hooks/useUpdateLegislator.js
// ============================================

export const useUpdateLegislator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateLegislator = async (id, legislatorData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await legislatorAPI.update(id, legislatorData);

      return response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update legislator";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateLegislator, loading, error, setError };
};

// ============================================
// src/hooks/useGetAllLegislators.js
// ============================================

export const useGetAllLegislators = () => {
  const [legislators, setLegislators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLegislators = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await legislatorAPI.getAll();
        setLegislators(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch legislators");
        console.error("Error fetching legislators:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLegislators();
  }, []);

  return { legislators, loading, error };
};

// ============================================
// src/hooks/useCreateLegislator.js
// ============================================

export const useCreateLegislator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createLegislator = async (legislatorData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await legislatorAPI.create(legislatorData);
      return response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create legislator";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createLegislator, loading, error, setError };
};

// ============================================
// src/hooks/useDeleteLegislator.js
// ============================================

export const useDeleteLegislator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteLegislator = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await legislatorAPI.delete(id);
      return response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete legislator";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteLegislator, loading, error, setError };
};
