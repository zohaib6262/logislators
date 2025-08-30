import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useVotingSection,
  initialVotingSection,
} from "../../../hooks/VotingSection/useVotingSection";
import VotingForm from "./VotingForm";

const AddVoting = () => {
  const navigate = useNavigate();
  const { createVotingSection } = useVotingSection();
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (votingCard) => {
    try {
      const result = await createVotingSection(votingCard);
      console.log("Result from createVotingSection:", result);
      if (result.success) {
        setNotification({
          type: "success",
          message: "Voting card created successfully",
        });
        setTimeout(() => navigate("/admin/voting-section"), 1500);
      } else {
        setNotification({
          type: "error",
          message: result.error || "Failed to create voting card",
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
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
          votingCard={initialVotingSection}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/voting-section")}
        />
      </div>
    </div>
  );
};

export default AddVoting;
