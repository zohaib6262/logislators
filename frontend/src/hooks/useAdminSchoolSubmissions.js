import { useState, useCallback, useEffect, useRef } from "react";
import api from "@/services/api";

const BASE = "adminSchoolSubmissions";

export function useAdminSchoolSubmissionsList({ status = "", page = 1, limit = 25, search = "" } = {}) {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [resolvedPage, setResolvedPage] = useState(page);
  const [resolvedLimit, setResolvedLimit] = useState(limit);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      if (status) params.status = status;
      const q = (search || "").trim();
      if (q) params.q = q;
      const { data } = await api.get(BASE, { params });
      const t = data.total ?? 0;
      const lim = data.limit ?? limit;
      setList(data.data || []);
      setTotal(t);
      setTotalPages(data.totalPages ?? Math.max(1, Math.ceil(t / lim)));
      setResolvedPage(data.page ?? page);
      setResolvedLimit(lim);
      setCounts(data.counts || { pending: 0, approved: 0, rejected: 0 });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch submissions");
    } finally {
      setIsLoading(false);
    }
  }, [status, page, limit, search]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    list,
    total,
    totalPages,
    page: resolvedPage,
    limit: resolvedLimit,
    counts,
    isLoading,
    error,
    refetch: fetchList,
  };
}

export function useAdminSchoolSubmission(id) {
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestSeqRef = useRef(0);

  const fetchOne = useCallback(async () => {
    if (!id) {
      requestSeqRef.current += 1;
      setSubmission(null);
      setIsLoading(false);
      setError(null);
      return;
    }
    const seq = ++requestSeqRef.current;
    setSubmission(null);
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`${BASE}/${id}`);
      if (seq !== requestSeqRef.current) return;
      setSubmission(data.data);
    } catch (err) {
      if (seq !== requestSeqRef.current) return;
      setError(err.response?.data?.message || "Failed to fetch submission");
      setSubmission(null);
    } finally {
      if (seq === requestSeqRef.current) setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOne();
  }, [fetchOne]);

  return { submission, isLoading, error, refetch: fetchOne };
}

export function usePatchAdminSchoolSubmission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const patch = useCallback(async (id, updates) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.patch(`${BASE}/${id}`, updates);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update submission");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { patch, isLoading, error };
}

export function useApproveAdminSchoolSubmission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const approve = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`${BASE}/${id}/approve`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve submission");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { approve, isLoading, error };
}
