import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Plus, RefreshCw } from "lucide-react";
import VotingCard from "./VotingCard";
import DeleteConfirmationModalVoting from "./DeleteConfirmModalVoting";
import { TokenContext } from "@/store/TokenContextProvider";
import { newLightnerColor } from "@/utils/colorUtils";
import { useVotingSection } from "@/hooks/VotingSection/useVotingSection";

const VotingSection = () => {
  const {
    votingSection,
    loading,
    error,
    deleteVotingSection,
    refreshVotingSection,
  } = useVotingSection();
  const { primaryColor } = useContext(TokenContext);

  const lighterPrimary = newLightnerColor(primaryColor, 30);
  const [votingCardToDelete, setVotingCardToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const handleDeleteConfirm = async () => {
    if (votingCardToDelete) {
      try {
        const result = await deleteVotingSection(votingCardToDelete);
        if (result.success) {
          showNotification("success", "Voting card deleted successfully");
          await refreshVotingSection();
        } else {
          showNotification(
            "error",
            result.error || "Failed to delete voting card"
          );
        }
      } catch (err) {
        showNotification("error", "An unexpected error occurred");
      } finally {
        setVotingCardToDelete(null);
      }
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-white py-8 mt-18">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
              Manage Voting Section
            </h1>

            <p className="text-gray-600">
              Manage the voting section cards that appear on your website's
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => navigate("/admin/voting-section/new")}
              className="flex items-center px-4 py-2 text-white rounded-md transition-colors focus:outline-none focus:ring-2"
              style={{
                background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
              }}
            >
              <Plus size={18} className="mr-2" />
              Add New Voting Card
            </button>
          </div>
        </div>

        {notification && (
          <div
            className={`mb-6 p-4 rounded-md ${
              notification.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            } animate-fadeIn`}
          >
            {notification.message}
          </div>
        )}

        {/* Voting Section Grid */}
        {loading && votingSection.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
              style={{ borderColor: primaryColor }}
            ></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-md">{error}</div>
        ) : votingSection.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">No voting card found.</p>
            <button
              onClick={() => navigate("/admin/voting-section/new")}
              className="px-4 py-2 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
              }}
            >
              Add Your First Feature
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {votingSection.map((votingSectionData) => (
              <VotingCard
                key={votingSectionData._id}
                votingCard={votingSectionData}
                onEdit={() =>
                  navigate(`/admin/voting-section/${votingSectionData._id}`)
                }
                onDelete={(id) => setVotingCardToDelete(id)}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {votingCardToDelete && (
          <DeleteConfirmationModalVoting
            isOpen={!!votingCardToDelete}
            onClose={() => setVotingCardToDelete(null)}
            onConfirm={handleDeleteConfirm}
            isDeleting={loading}
            featureName={
              votingSection.find((f) => f._id === votingCardToDelete)?.title ||
              ""
            }
          />
        )}
      </div>
    </div>
  );
};

export default VotingSection;
