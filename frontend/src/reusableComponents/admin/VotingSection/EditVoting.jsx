import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VotingForm from "./VotingForm"; // <-- make sure you have this
import { useVotingSection } from "@/hooks/VotingSection/useVotingSection";
import { TokenContext } from "@/store/TokenContextProvider";
import { lightenColor } from "@/utils/colorUtils";

const EditVoting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { votingSection, updateVotingSection } = useVotingSection();
  const [votingCard, setVotingCard] = useState(null);
  const [notification, setNotification] = useState(null);
  const { primaryColor } = useContext(TokenContext);
  const lightPrimary = lightenColor(primaryColor, 60); // 60% lighter

  useEffect(() => {
    const currentCard = votingSection.find((f) => f._id === id);
    if (currentCard) {
      setVotingCard(currentCard);
    }
  }, [id, votingSection]);

  const handleSubmit = async (updatedCard) => {
    try {
      const result = await updateVotingSection(id, updatedCard);
      if (result.success) {
        setNotification({
          type: "success",
          message: "Voting card updated successfully",
        });
        setTimeout(() => navigate("/admin/voting-section"), 1500);
      } else {
        setNotification({
          type: "error",
          message: result.error || "Failed to update voting card",
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: "An unexpected error occurred",
      });
      console.error(err);
    }
  };

  if (!votingCard) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: primaryColor }}
        ></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
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

        <VotingForm
          votingCard={votingCard}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/voting-section")}
        />
      </div>
    </div>
  );
};

export default EditVoting;
