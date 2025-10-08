// ============================================
// API SERVICE (src/services/api.js)
// ============================================

import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";
// import.meta.env.VITE_API_URL ||
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (for token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (for errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============================================
// LEGISLATOR API CALLS
// ============================================

export const legislatorAPI = {
  // GET all legislators
  getAll: async () => {
    const response = await api.get("/legislators");
    return response.data;
  },

  // GET single legislator
  getById: async (id) => {
    const response = await api.get(`/legislators/${id}`);
    return response.data;
  },

  // CREATE legislator
  create: async (legislator) => {
    const response = await api.post("/legislators", legislator);
    return response.data;
  },

  // UPDATE legislator
  update: async (id, legislator) => {
    const response = await api.put(`/legislators/${id}`, legislator);
    return response.data;
  },

  // PATCH legislator
  patch: async (id, updates) => {
    const response = await api.patch(`/legislators/${id}`, updates);
    return response.data;
  },

  // DELETE legislator
  delete: async (id) => {
    const response = await api.delete(`/legislators/${id}`);
    return response.data;
  },

  // FILTER legislators
  filter: async (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });
    const response = await api.get(`/legislators/filter?${params}`);
    return response.data;
  },

  // GET by party
  getByParty: async (party) => {
    const response = await api.get(`/legislators/party/${party}`);
    return response.data;
  },

  // GET by chamber
  getByChamber: async (chamber) => {
    const response = await api.get(`/legislators/chamber/${chamber}`);
    return response.data;
  },

  // GET top scorers
  getTopScorers: async (limit = 10) => {
    const response = await api.get(`/legislators/top/${limit}`);
    return response.data;
  },

  // SEARCH by name
  search: async (name) => {
    const response = await api.get(`/legislators/search/${name}`);
    return response.data;
  },

  // GET stats
  getStats: async () => {
    const response = await api.get("/legislators/stats");
    return response.data;
  },

  // BULK create
  bulkCreate: async (legislators) => {
    const response = await api.post("/legislators/bulk", legislators);
    return response.data;
  },

  // BULK update
  bulkUpdate: async (updates) => {
    const response = await api.put("/legislators/bulk", updates);
    return response.data;
  },
};

export default api;
