import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Plus, RefreshCw } from "lucide-react";
import VotingCard from "./VotingCard";
import DeleteConfirmationModalVoting from "./DeleteConfirmModalVoting";
import { useVotingSection } from "../../../hooks/VotingSection/useVotingSection";
import { TokenContext } from "@/store/TokenContextProvider";
import { newLightnerColor } from "@/utils/colorUtils";

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
        const result = await deleteVotingCard(votingCardToDelete);
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
    <div className="cmin-h-screen bg-white py-8 mt-18">
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
      </div>
    </div>
  );
};

export default VotingSection;
