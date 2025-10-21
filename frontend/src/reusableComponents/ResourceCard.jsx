import { Edit, ExternalLink, Star, StarOff, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import useDeleteResource from "../hooks/useDeleteResource";
import ConfirmModal from "./ConfirmModal";

const ResourceCard = ({ resource, refetch }) => {
  const [showModal, setShowModal] = useState(false);
  const { deleteResource, deleting, error } = useDeleteResource(refetch);

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

              <h3 className="text-xl font-bold text-gray-800 mt-2">
                {resource.title}
              </h3>
            </div>

            <div className="flex space-x-2">
              {/* <button
                      onClick={() => toggleFeatured(resource._id, resource.isFeatured)}
                      className={`p-2 rounded-lg transition-colors ${
                        resource.isFeatured
                          ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={resource.isFeatured ? 'Remove from featured' : 'Set as featured'}
                    >
                      {resource.isFeatured ? <StarOff className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                    </button> */}
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
