import { useState } from "react";
import axios from "axios";
import BASE_URL from "@/lib/utils";

export default function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetPassword = async ({ newPassword }) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send token in header
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/auth/reset-password`,
        {
          newPassword,
        },
        config
      );

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to update password");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error, success };
}
