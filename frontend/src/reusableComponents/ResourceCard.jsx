import { Edit, ExternalLink, Star, StarOff, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import useDeleteResource from "../hooks/useDeleteResource";
import ConfirmModal from "./ConfirmModal";
import { TokenContext } from "@/store/TokenContextProvider";

const ResourceCard = ({ resource, refetch }) => {
  const [showModal, setShowModal] = useState(false);
  const { deleteResource, deleting, error } = useDeleteResource(refetch);
  const { primaryColor } = useContext(TokenContext);
  // Utility function to lighten a hex color
  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const lightShade = lightenColor(primaryColor, 70); // soft pastel background
  const veryLightShade = lightenColor(primaryColor, 85); // faint background
  const handleDelete = async () => {
    if (!resource._id) {
      return;
    }

    try {
      await deleteResource(resource._id);
      setShowModal(false);
    } catch (err) {
      setError("Failed to delete resource.");
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <span
                className={`px-2 py-1 text-xs rounded-full font-medium ${
                  resource.category === "Government"
                    ? "bg-blue-100 text-blue-800"
                    : resource.category === "Voting"
                    ? "bg-green-100 text-green-800"
                    : resource.category === "Education"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {resource.category}
              </span>
              {resource.isFeatured && (
                <span
                  className="ml-2 inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                  style={{
                    background: lightenColor(primaryColor, 20),
                    color: "#fff",
                  }}
                >
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Featured
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-800 mt-2">
                {resource.title}
              </h3>
            </div>

            <div className="flex space-x-2">
              <Link
                to={`/admin/resources/${resource._id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setShowModal(true)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="text-gray-600 mt-3">{resource.description}</p>

          {resource.customFields?.length > 0 && (
            <div className="mt-4 space-y-2">
              {resource.customFields.map((field, index) => (
                <div key={index} className="flex text-sm">
                  <span className="font-medium text-gray-700">
                    {field.key}:
                  </span>
                  <span className="ml-2 text-gray-600">{field.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Visit Resource
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600 font-medium">{error}</div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </>
  );
};

export default ResourceCard;
