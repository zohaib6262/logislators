import { X, Loader2 } from "lucide-react";
import { forwardRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const DeleteConfirmationModal = forwardRef(
  (
    { isOpen, onClose, onConfirm, isDeleting, representativeName, featureName },
    ref
  ) => {
    const modalRef = useRef(null);
    const portalRoot = document.getElementById("modal-root") || document.body;

    // Create the modal root element if it doesn't exist
    useEffect(() => {
      let modalRoot = document.getElementById("modal-root");
      if (!modalRoot) {
        modalRoot = document.createElement("div");
        modalRoot.id = "modal-root";
        document.body.appendChild(modalRoot);
      }
      return () => {
        if (modalRoot && modalRoot.childNodes.length === 0) {
          document.body.removeChild(modalRoot);
        }
      };
    }, []);

    // Combine forwarded ref with internal ref
    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(modalRef.current);
        } else {
          ref.current = modalRef.current;
        }
      }
    }, [ref]);

    // Handle Escape key press
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Escape" && isOpen && !isDeleting) {
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isDeleting, onClose]);

    if (!isOpen) return null;

    return createPortal(
      <div
        ref={modalRef}
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3
                id="modal-title"
                className="text-lg font-medium text-gray-900"
              >
                Confirm Deletion
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
                disabled={isDeleting}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete
                <span className="font-semibold">
                  {representativeName || featureName}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 inline" size={16} />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>,
      portalRoot
    );
  }
);

DeleteConfirmationModal.displayName = "DeleteConfirmationModal";

export default DeleteConfirmationModal;
