import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const VotingCard = ({ votingCard, onEdit, onDelete, preview = false }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${
        preview ? "p-6" : "p-5"
      }`}
    >
      {!preview && (
        <div className="flex justify-end space-x-2 mb-2">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            aria-label="Edit voting card"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => votingCard._id && onDelete(votingCard._id)}
            className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
            aria-label="Delete voting card"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}

      {/* Voting card content */}
      <div className={preview ? "" : "mt-2"}>
        <img
          src={votingCard?.icon || "/default-icon.png"}
          alt={votingCard?.title || "Voting icon"}
          className={`${
            preview ? "mb-4" : "mb-3"
          } flex items-center justify-center ${
            preview ? "w-16 h-16" : "w-12 h-12"
          } rounded-full bg-blue-100`}
        />
        <h3
          className={`${
            preview ? "text-xl mb-3" : "text-lg mb-2"
          } font-semibold text-gray-800`}
        >
          {votingCard.title}
        </h3>
        <p className="text-gray-600 text-sm">{votingCard.description}</p>
      </div>
    </div>
  );
};

export default VotingCard;
