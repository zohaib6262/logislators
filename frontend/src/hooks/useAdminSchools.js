import { useState, useCallback } from "react";
import api from "@/services/api";

const BASE = "adminSchoolFinderFeeds/schools";

export function useAdminSchoolsList(page = 1, limit = 20) {
  const [schools, setSchools] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get(BASE, { params: { page, limit } });
      setSchools(data.data || []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch schools");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  return { schools, total, isLoading, error, refetch: fetchList };
}

export function useAdminSchool(id) {
  const [school, setSchool] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOne = useCallback(async () => {
    if (!id) {
      setSchool(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`${BASE}/${id}`);
      setSchool(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch school");
      setSchool(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return { school, isLoading, error, refetch: fetchOne };
}

export function usePatchAdminSchool() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const patch = useCallback(async (id, updates) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.patch(`${BASE}/${id}`, updates);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update school");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { patch, isLoading, error };
}

export function useDeleteAdminSchool() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const remove = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`${BASE}/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete school");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteSchool: remove, isLoading, error };
}
