import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import ReactDOM from "react-dom";
import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmModalVoting = forwardRef(
  ({ isOpen, onConfirm, onClose, isDeleting, featureName }, ref) => {
    // Example: expose functions to parent
    useImperativeHandle(ref, () => ({
      close: () => onClose(),
      confirm: () => onConfirm(),
    }));

    if (!isOpen) return null;

    return ReactDOM.createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-5 border-b">
            <div className="flex items-center">
              <AlertTriangle size={20} className="text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Delete Voting Card
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5">
            <p className="text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{featureName}</span>? This action
              cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-3 p-5 border-t bg-gray-50 rounded-b-lg">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                isDeleting
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>,
      document.getElementById("modal-root")
    );
  }
);

export default DeleteConfirmModalVoting;
