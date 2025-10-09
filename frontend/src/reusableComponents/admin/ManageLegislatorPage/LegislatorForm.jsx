// import { useState, useEffect } from "react";
// import { X, Plus, Trash2 } from "lucide-react";

// const LegislatorForm = ({ legislator, onClose, onSave }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     party: "D",
//     chamber: "Assembly",
//     points: 0,
//     points_possible: 0,
//     score_percentage: 0,
//     score_with_bonus: 0,
//     key_highlights: "",
//     categoryScores: [],
//     bills: [],
//   });
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (legislator) {
//       setFormData(legislator);
//     }
//   }, [legislator]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       await onSave(formData);
//       onClose();
//     } catch (error) {
//       console.error("Error saving legislator:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCategoryScoreChange = (index, field, value) => {
//     const updatedScores = [...(formData.categoryScores || [])];
//     updatedScores[index] = { ...updatedScores[index], [field]: value };
//     setFormData({ ...formData, categoryScores: updatedScores });
//   };

//   const addCategoryScore = () => {
//     setFormData({
//       ...formData,
//       categoryScores: [
//         ...(formData.categoryScores || []),
//         { category: "", score: 0 },
//       ],
//     });
//   };

//   const removeCategoryScore = (index) => {
//     const updatedScores = (formData.categoryScores || []).filter(
//       (_, i) => i !== index
//     );
//     setFormData({ ...formData, categoryScores: updatedScores });
//   };

//   const handleBillChange = (index, field, value) => {
//     const updatedBills = [...(formData.bills || [])];
//     updatedBills[index] = { ...updatedBills[index], [field]: value };
//     setFormData({ ...formData, bills: updatedBills });
//   };

//   const addBill = () => {
//     setFormData({
//       ...formData,
//       bills: [
//         ...(formData.bills || []),
//         {
//           billNumber: "",
//           value: "",
//           recommendation: "",
//           category: "",
//           weighting: 0,
//         },
//       ],
//     });
//   };

//   const removeBill = (index) => {
//     const updatedBills = (formData.bills || []).filter((_, i) => i !== index);
//     setFormData({ ...formData, bills: updatedBills });
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex min-h-screen items-center justify-center p-4">
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//           onClick={onClose}
//         ></div>

//         <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//           <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {legislator ? "Edit Legislator" : "Add New Legislator"}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6">
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Name *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Party *
//                   </label>
//                   <select
//                     required
//                     value={formData.party}
//                     onChange={(e) =>
//                       setFormData({ ...formData, party: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   >
//                     <option value="D">Democrat (D)</option>
//                     <option value="R">Republican (R)</option>
//                     <option value="I">Independent (I)</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Chamber *
//                   </label>
//                   <select
//                     required
//                     value={formData.chamber}
//                     onChange={(e) =>
//                       setFormData({ ...formData, chamber: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   >
//                     <option value="Assembly">Assembly</option>
//                     <option value="Senate">Senate</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Points
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.points || 0}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         points: Number(e.target.value),
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Points Possible
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.points_possible || 0}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         points_possible: Number(e.target.value),
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Score Percentage
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={formData.score_percentage || 0}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         score_percentage: Number(e.target.value),
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Key Highlights
//                 </label>
//                 <textarea
//                   rows={4}
//                   value={formData.key_highlights || ""}
//                   onChange={(e) =>
//                     setFormData({ ...formData, key_highlights: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                 />
//               </div>

//               {/* Category Scores */}
//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Category Scores
//                   </label>
//                   <button
//                     type="button"
//                     onClick={addCategoryScore}
//                     className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Add Category
//                   </button>
//                 </div>
//                 <div className="space-y-2">
//                   {(formData.categoryScores || []).map(
//                     (categoryScore, index) => (
//                       <div key={index} className="flex gap-2">
//                         <input
//                           type="text"
//                           placeholder="Category"
//                           value={categoryScore.category}
//                           onChange={(e) =>
//                             handleCategoryScoreChange(
//                               index,
//                               "category",
//                               e.target.value
//                             )
//                           }
//                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                         />
//                         <input
//                           type="number"
//                           step="0.01"
//                           placeholder="Score"
//                           value={categoryScore.score}
//                           onChange={(e) =>
//                             handleCategoryScoreChange(
//                               index,
//                               "score",
//                               Number(e.target.value)
//                             )
//                           }
//                           className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeCategoryScore(index)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>

//               {/* Bills */}
//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Bills
//                   </label>
//                   <button
//                     type="button"
//                     onClick={addBill}
//                     className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Add Bill
//                   </button>
//                 </div>
//                 <div className="space-y-3">
//                   {(formData.bills || []).map((bill, index) => (
//                     <div
//                       key={index}
//                       className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-2"
//                     >
//                       <div className="flex gap-2">
//                         <input
//                           type="text"
//                           placeholder="Bill Number"
//                           value={bill.billNumber}
//                           onChange={(e) =>
//                             handleBillChange(
//                               index,
//                               "billNumber",
//                               e.target.value
//                             )
//                           }
//                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
//                         />
//                         <input
//                           type="text"
//                           placeholder="Value (Y/N/A)"
//                           value={bill.value}
//                           onChange={(e) =>
//                             handleBillChange(index, "value", e.target.value)
//                           }
//                           className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeBill(index)}
//                           className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                       <div className="grid grid-cols-3 gap-2">
//                         <input
//                           type="text"
//                           placeholder="Recommendation"
//                           value={bill.recommendation}
//                           onChange={(e) =>
//                             handleBillChange(
//                               index,
//                               "recommendation",
//                               e.target.value
//                             )
//                           }
//                           className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
//                         />
//                         <input
//                           type="text"
//                           placeholder="Category"
//                           value={bill.category}
//                           onChange={(e) =>
//                             handleBillChange(index, "category", e.target.value)
//                           }
//                           className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
//                         />
//                         <input
//                           type="number"
//                           placeholder="Weighting"
//                           value={bill.weighting}
//                           onChange={(e) =>
//                             handleBillChange(
//                               index,
//                               "weighting",
//                               Number(e.target.value)
//                             )
//                           }
//                           className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 disabled={saving}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {saving ? "Saving..." : legislator ? "Update" : "Create"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LegislatorForm;
import React, { useContext, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

import { TokenContext } from "@/store/TokenContextProvider";
import { lightenColor } from "@/utils/colorUtils";
import { legislatorAPI } from "@/services/api";
import {
  useGetLegislator,
  useUpdateLegislator,
} from "@/hooks/manageLegislators/manageLegislators";
const EditLegislator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { primaryColor } = useContext(TokenContext);
  const lighterPrimary = lightenColor(primaryColor, 60);

  // Get legislator data
  const {
    legislator,
    loading: fetchLoading,
    error: fetchError,
  } = useGetLegislator(id);

  // Update legislator function
  const {
    updateLegislator,
    loading: saving,
    error: saveError,
    setError,
  } = useUpdateLegislator();

  const [formData, setFormData] = useState({
    name: "",
    party: "D",
    chamber: "Assembly",
    points: 0,
    points_possible: 0,
    score_percentage: 0,
    score_with_bonus: 0,
    key_highlights: "",
    categoryScores: [],
    bills: [],
  });

  // Initialize form when data loads
  React.useEffect(() => {
    if (legislator) {
      setFormData({
        name: legislator.name || "",
        party: legislator.party || "D",
        chamber: legislator.chamber || "Assembly",
        points: legislator.points || 0,
        points_possible: legislator.points_possible || 0,
        score_percentage: legislator.score_percentage || 0,
        score_with_bonus: legislator.score_with_bonus || 0,
        key_highlights: legislator.key_highlights || "",
        categoryScores: legislator.categoryScores || [],
        bills: legislator.bills || [],
      });
    }
  }, [legislator]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const numValue = type === "number" ? Number(value) : value;

    if (name === "score_percentage") {
      if (numValue > 100) {
        setError("Score percentage cannot exceed 100");
      } else if (numValue < 0) {
        setError("Score percentage cannot be negative");
      } else {
        setError("");
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const handleCategoryScoreChange = (index, field, value) => {
    const updatedScores = [...formData.categoryScores];
    const numValue = field === "score" ? Number(value) : value;
    updatedScores[index] = {
      ...updatedScores[index],
      [field]: numValue,
    };
    setFormData((prev) => ({
      ...prev,
      categoryScores: updatedScores,
    }));
  };

  const handleAddCategoryScore = () => {
    setFormData((prev) => ({
      ...prev,
      categoryScores: [...prev.categoryScores, { category: "", score: 0 }],
    }));
  };

  const handleRemoveCategoryScore = (index) => {
    setFormData((prev) => ({
      ...prev,
      categoryScores: prev.categoryScores.filter((_, i) => i !== index),
    }));
  };

  const handleBillChange = (index, field, value) => {
    const updatedBills = [...formData.bills];
    const numValue = field === "weighting" ? Number(value) : value;
    updatedBills[index] = {
      ...updatedBills[index],
      [field]: numValue,
    };
    setFormData((prev) => ({
      ...prev,
      bills: updatedBills,
    }));
  };

  const handleAddBill = () => {
    setFormData((prev) => ({
      ...prev,
      bills: [
        ...prev.bills,
        {
          billNumber: "",
          value: "",
          recommendation: "",
          category: "",
          weighting: 0,
        },
      ],
    }));
  };

  const handleRemoveBill = (index) => {
    setFormData((prev) => ({
      ...prev,
      bills: prev.bills.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.chamber) {
      setError("Name and Chamber are required");
      return;
    }
    try {
      await updateLegislator(id, formData);
      navigate("/admin/manage-legislators");
    } catch (error) {
      console.error("Error updating legislator:", error);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{
            borderColor: primaryColor,
          }}
        ></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{fetchError}</p>
            <div className="mt-4">
              <Link
                to="/admin/manage-legislators"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to legislators
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Legislator
        </h1>
        <Link
          to="/admin/manage-legislators"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to List
        </Link>
      </div>

      {saveError && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{saveError}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Basic Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update the legislator's basic details.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Name Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 "
                />
              </div>

              {/* Party Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Party
                </label>
                <select
                  name="party"
                  value={formData.party}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 "
                >
                  <option value="D">Democrat (D)</option>
                  <option value="R">Republican (R)</option>
                  <option value="I">Independent (I)</option>
                </select>
              </div>

              {/* Chamber Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Chamber
                </label>
                <select
                  name="chamber"
                  value={formData.chamber}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none "
                >
                  <option value="Assembly">Assembly</option>
                  <option value="Senate">Senate</option>
                </select>
              </div>

              {/* Points Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Points
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none "
                />
              </div>

              {/* Points Possible Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Points Possible
                </label>
                <input
                  type="number"
                  name="points_possible"
                  value={formData.points_possible}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none "
                />
              </div>

              {/* Score Percentage Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Score Percentage (0-100)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="score_percentage"
                  min="0"
                  max="100"
                  value={formData.score_percentage}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none "
                />
              </div>

              {/* Score with Bonus Field */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Score with Bonus
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="score_with_bonus"
                  value={formData.score_with_bonus}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none "
                />
              </div>
            </div>
          </div>
        </div>

        {/* Key Highlights Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Key Highlights
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <textarea
              rows="5"
              name="key_highlights"
              value={formData.key_highlights}
              onChange={(e) =>
                setFormData({ ...formData, key_highlights: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none "
            />
          </div>
        </div>

        {/* Category Scores Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Category Scores
              </h3>
              {/* <button
                type="button"
                onClick={handleAddCategoryScore}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white"
                style={{
                  background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
                }}
              >
                <Plus size={16} className="mr-1" />
                Add Category
              </button> */}
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {formData.categoryScores.map((score, index) => (
              <div
                key={index}
                className="mb-4 pb-4 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0 flex gap-4 items-end"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={score.category}
                    onChange={(e) =>
                      handleCategoryScoreChange(
                        index,
                        "category",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none "
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={score.score}
                    onChange={(e) =>
                      handleCategoryScoreChange(index, "score", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none "
                  />
                </div>
                {/* <button
                  type="button"
                  onClick={() => handleRemoveCategoryScore(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button> */}
              </div>
            ))}
          </div>
        </div>

        {/* Bills Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Bills
              </h3>
              {/* <button
                type="button"
                onClick={handleAddBill}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white"
                style={{
                  background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
                }}
              >
                <Plus size={16} className="mr-1" />
                Add Bill
              </button> */}
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {formData.bills.map((bill, index) => (
              <div
                key={index}
                className="mb-6 pb-6 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    Bill #{index + 1}
                  </h4>
                  {/* <button
                    type="button"
                    onClick={() => handleRemoveBill(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button> */}
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bill Number
                    </label>
                    <input
                      type="text"
                      value={bill.billNumber}
                      onChange={(e) =>
                        handleBillChange(index, "billNumber", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none "
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Value (Y/N/A)
                    </label>
                    <input
                      type="text"
                      value={bill.value}
                      onChange={(e) =>
                        handleBillChange(index, "value", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none "
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Recommendation
                    </label>
                    <input
                      type="text"
                      value={bill.recommendation}
                      onChange={(e) =>
                        handleBillChange(
                          index,
                          "recommendation",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none "
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      type="text"
                      value={bill.category}
                      onChange={(e) =>
                        handleBillChange(index, "category", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none "
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/manage-legislators")}
            className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: `linear-gradient(to right, ${lighterPrimary}, ${primaryColor})`,
            }}
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLegislator;
