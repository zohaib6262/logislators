import { useContext, useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Check } from "lucide-react";
import useResetPassword from "@/hooks/resetPassword/useResetPassword";
import { TokenContext } from "@/store/TokenContextProvider";
import { newLightnerColor } from "@/utils/colorUtils";

export default function ResetPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const { resetPassword, loading, error, success } = useResetPassword();
  const { primaryColor } = useContext(TokenContext);
  const lighterPrimary = newLightnerColor(primaryColor, 30);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (newPassword !== confirmPassword) {
      setLocalError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword === currentPassword) {
      setLocalError("New password must be different from current password");
      return;
    }

    await resetPassword({ currentPassword, newPassword });
  };

  const inputClasses = "w-full px-4 py-3 border rounded-lg pr-12";

  const toggleButtonClasses =
    "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div
            className="px-8 py-6"
            style={{
              background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
            }}
          >
            <h1 className="text-2xl font-bold text-white">Change Password</h1>
            <p className="text-white/90 mt-1">Update your account password</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error / Success */}
            {(localError || error) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {localError || error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <Check size={18} /> Password updated successfully
              </div>
            )}

            {/* Current Password */}
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                className={inputClasses}
                style={{ outlineColor: primaryColor }}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className={toggleButtonClasses}
              >
                {showCurrentPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className={inputClasses}
                style={{ outlineColor: primaryColor }}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={toggleButtonClasses}
              >
                {showNewPassword ? <EyeOff /> : <Eye />}
              </button>
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className={inputClasses}
                style={{ outlineColor: primaryColor }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={toggleButtonClasses}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
                outlineColor: primaryColor,
              }}
            >
              <Lock size={20} />
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </form>

          {/* Password Tips */}
          <div className="bg-blue-50 border-t border-blue-200 p-5">
            <h3 className="font-semibold text-blue-900 mb-2">Password Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Use a strong, unique password</li>
              <li>Mix uppercase, lowercase letters, numbers & symbols</li>
              <li>Avoid using personal information</li>
              <li>Change your password regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
