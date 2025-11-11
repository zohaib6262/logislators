import { TokenContext } from "@/store/TokenContextProvider";
import React, { useState, useContext } from "react";
import {
  Search,
  UserPlus,
  Trash2,
  Mail,
  Calendar,
  Shield,
  Users,
  UserCheck,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  useFetchAdmins,
  useInviteAdmin,
  useDeleteAdmin,
} from "@/hooks/useUserManagement";

export default function UserManagement() {
  const { primaryColor } = useContext(TokenContext);

  // Custom hooks
  const { admins, isLoading, error, refetch } = useFetchAdmins();
  const { inviteAdmin, isInviting, inviteError, inviteMessage } =
    useInviteAdmin();
  const { deleteAdmin, isDeleting, deleteError, deleteMessage } =
    useDeleteAdmin();

  const lightenColor = (color, percent) => {
    if (!color) return "#93c5fd";
    color = color.replace("#", "");

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    const lighten = (value) =>
      Math.min(255, value + Math.round(255 * (percent / 100)));

    return `#${[
      lighten(r).toString(16).padStart(2, "0"),
      lighten(g).toString(16).padStart(2, "0"),
      lighten(b).toString(16).padStart(2, "0"),
    ].join("")}`;
  };

  const lighterPrimary = lightenColor(primaryColor, 30);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [notification, setNotification] = useState(null);

  // Filter users
  const filteredUsers = admins.filter((user) => {
    const matchesSearch = user.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter
      ? user.isPending
        ? statusFilter === "pending"
        : statusFilter === "active"
      : true;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter((u) => !u.isPending).length;
  const pendingInvites = admins.filter((u) => u.isPending).length;

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Invite user
  const handleInviteUser = async () => {
    if (!inviteEmail) {
      showNotification("Please enter an email address", "error");
      return;
    }

    try {
      await inviteAdmin(inviteEmail);
      setInviteEmail("");
      setIsInviteModalOpen(false);
      showNotification("Invitation sent successfully!");
      refetch(); // Refresh the list
    } catch (err) {
      showNotification(inviteError || "Failed to send invitation", "error");
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await deleteAdmin(id);
        showNotification("Admin deleted successfully!");
        refetch(); // Refresh the list
      } catch (err) {
        showNotification(deleteError || "Failed to delete admin", "error");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading admins...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {(notification || inviteMessage || deleteMessage) && (
        <div className="fixed top-4 right-4 z-50 animate-slideDown">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              notification?.type === "success" || inviteMessage || deleteMessage
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="text-lg">
              {notification?.type === "success" ||
              inviteMessage ||
              deleteMessage
                ? "✓"
                : "✕"}
            </div>
            <span className="font-medium">
              {notification?.message || inviteMessage || deleteMessage}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className="py-12 shadow-md"
        style={{
          background: `linear-gradient(135deg, ${lighterPrimary}, ${primaryColor})`,
        }}
      >
        <div className="container mx-auto px-6 -mt-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-white">User Management</h1>
          </div>
          <p className="text-white/90 text-center text-lg">
            Manage admin users and their permissions to maintain secure and
            organized access control
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Total Admins
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {totalAdmins}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Active Admins
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {activeAdmins}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <UserCheck className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Pending Invites
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {pendingInvites}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="text-yellow-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">All Admins</h2>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                disabled={isInviting}
                className="text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg flex items-center gap-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor }}
              >
                {isInviting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Invite New Admin
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ outlineColor: primaryColor }}
                />
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white cursor-pointer"
                  style={{ outlineColor: primaryColor }}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Shield size={16} />
                      Role
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Joined Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {user.isSuperAdmin ? "SUPER ADMIN" : "ADMIN"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          !user.isPending
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {user.isPending ? "PENDING" : "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.invitedAt || user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      {!user.isSuperAdmin && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={isDeleting}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No admins found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div
              className="px-6 py-5 rounded-t-2xl"
              style={{
                background: `linear-gradient(135deg, ${lighterPrimary}, ${primaryColor})`,
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <UserPlus className="text-white" size={28} />
                  <h3 className="text-2xl font-bold text-white">
                    Invite New Admin
                  </h3>
                </div>
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  disabled={isInviting}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors disabled:opacity-50"
                >
                  <span className="text-2xl font-bold">×</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {inviteError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span className="text-sm">{inviteError}</span>
                </div>
              )}

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="admin@example.com"
                  disabled={isInviting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  style={{ outlineColor: primaryColor }}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                >
                  <option value="admin">Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Only admin role is available at this time
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  disabled={isInviting}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteUser}
                  disabled={isInviting}
                  className="flex-1 px-6 py-3 text-white rounded-lg font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isInviting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Invite"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
