// hooks/useUserManagement.js
import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils";

// Fetch all admins
export function useFetchAdmins() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdmins = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/api/users/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdmins(response.data.admins || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch admins");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return { admins, isLoading, error, refetch: fetchAdmins };
}

// Invite admin
export function useInviteAdmin() {
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [inviteMessage, setInviteMessage] = useState("");

  const inviteAdmin = async (email) => {
    setIsInviting(true);
    setInviteError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${BASE_URL}/api/users/invite-admin`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setInviteMessage("Admin invitation sent successfully!");
      return response.data;
    } catch (err) {
      setInviteError(
        err.response?.data?.message || "Failed to send invitation"
      );
      throw err;
    } finally {
      setIsInviting(false);
      setTimeout(() => setInviteMessage(""), 3000);
    }
  };

  return { inviteAdmin, isInviting, inviteError, inviteMessage };
}

// Delete admin
export function useDeleteAdmin() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");

  const deleteAdmin = async (adminId) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(
        `${BASE_URL}/api/users/admin/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDeleteMessage("Admin deleted successfully!");
      return response.data;
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete admin");
      throw err;
    } finally {
      setIsDeleting(false);
      setTimeout(() => setDeleteMessage(""), 3000);
    }
  };

  return { deleteAdmin, isDeleting, deleteError, deleteMessage };
}

// Reset password
export function useResetPassword() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [resetMessage, setResetMessage] = useState("");

  const resetPassword = async (currentPassword, newPassword) => {
    setIsResetting(true);
    setResetError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${BASE_URL}/api/users/reset-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResetMessage("Password updated successfully!");
      return response.data;
    } catch (err) {
      setResetError(err.response?.data?.message || "Failed to reset password");
      throw err;
    } finally {
      setIsResetting(false);
      setTimeout(() => setResetMessage(""), 3000);
    }
  };

  return { resetPassword, isResetting, resetError, resetMessage };
}

// Login
export function useLogin() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const login = async (email, password) => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const response = await axios.post(`${BASE_URL}/api/users/login`, {
        email,
        password,
      });

      const { token, ...userData } = response.data;

      // Save token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      return response.data;
    } catch (err) {
      setLoginError(err.response?.data?.message || "Failed to login");
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  };

  return { login, isLoggingIn, loginError };
}
