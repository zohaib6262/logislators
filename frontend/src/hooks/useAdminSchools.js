import { useState, useCallback, useEffect, useRef } from "react";
import api from "@/services/api";

const BASE = "adminSchoolFinderFeeds/schools";

export function useAdminSchoolsList({ page = 1, limit = 25, search = "" } = {}) {
  const [schools, setSchools] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [resolvedPage, setResolvedPage] = useState(page);
  const [resolvedLimit, setResolvedLimit] = useState(limit);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const requestSeqRef = useRef(0);

  const fetchList = useCallback(async () => {
    const seq = ++requestSeqRef.current;
    setIsFetching(true);
    setError(null);
    try {
      const params = { page, limit };
      const q = (search || "").trim();
      if (q) params.q = q;
      const { data } = await api.get(BASE, { params });
      if (seq !== requestSeqRef.current) return;
      const t = data.total ?? 0;
      const lim = data.limit ?? limit;
      const tp = data.totalPages ?? Math.max(1, Math.ceil(t / lim));
      setSchools(data.data || []);
      setTotal(t);
      setTotalPages(tp);
      setResolvedPage(data.page ?? page);
      setResolvedLimit(lim);
    } catch (err) {
      if (seq !== requestSeqRef.current) return;
      setError(err.response?.data?.message || "Failed to fetch schools");
    } finally {
      if (seq === requestSeqRef.current) setIsFetching(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const isInitialLoading = isFetching && schools.length === 0;

  return {
    schools,
    total,
    totalPages,
    page: resolvedPage,
    limit: resolvedLimit,
    isLoading: isInitialLoading,
    isFetching,
    error,
    refetch: fetchList,
  };
}

export function useAdminSchool(id) {
  const [school, setSchool] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestSeqRef = useRef(0);

  const fetchOne = useCallback(async () => {
    if (!id) {
      requestSeqRef.current += 1;
      setSchool(null);
      setIsLoading(false);
      setError(null);
      return;
    }
    const seq = ++requestSeqRef.current;
    setSchool(null);
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`${BASE}/${id}`);
      if (seq !== requestSeqRef.current) return;
      setSchool(data.data);
    } catch (err) {
      if (seq !== requestSeqRef.current) return;
      setError(err.response?.data?.message || "Failed to fetch school");
      setSchool(null);
    } finally {
      if (seq === requestSeqRef.current) setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOne();
  }, [fetchOne]);

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
