import { useState, useCallback } from "react";
import api from "@/services/api";

const BASE = "adminSchoolSubmissions";

export function useAdminSchoolSubmissionsList(statusFilter) {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const { data } = await api.get(BASE, { params });
      setList(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch submissions");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  return { list, isLoading, error, refetch: fetchList };
}

export function useAdminSchoolSubmission(id) {
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOne = useCallback(async () => {
    if (!id) {
      setSubmission(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`${BASE}/${id}`);
      setSubmission(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch submission");
      setSubmission(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

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
