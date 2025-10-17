// import { useMemo, useState } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   flexRender,
//   createColumnHelper,
// } from "@tanstack/react-table";
// import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

// const columnHelper = createColumnHelper();

// export default function LegislatorTable({
//   legislators,
//   selectedCategory,
//   selectedParty,
//   selectedChamber,
// }) {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);

//   const getPartyColor = (party) => {
//     if (party === "D") return "text-blue-600 font-semibold";
//     if (party === "R") return "text-red-600 font-semibold";
//     return "text-gray-600";
//   };

//   const getScoreColor = (score) => {
//     if (!score) return "text-gray-400";
//     if (score >= 90) return "text-green-600 font-bold";
//     if (score >= 70) return "text-yellow-600 font-semibold";
//     if (score >= 50) return "text-orange-600 font-semibold";
//     return "text-red-600 font-bold";
//   };

//   const getCategoryScore = (legislator, category) => {
//     const match = legislator.categoryScores?.find(
//       (c) => c.category.toLowerCase() === category.toLowerCase()
//     );
//     return match ? match.score : "-";
//   };

//   // Get all bill numbers and filter by category if selected
//   const allBillNumbers = useMemo(() => {
//     const allBills = Array.from(
//       new Set(
//         legislators.flatMap(
//           (leg) => leg.bills?.map((bill) => bill.billNumber) || []
//         )
//       )
//     );

//     // If no category selected, show all bills
//     if (!selectedCategory) return allBills;

//     // Filter bills by selected category
//     const firstLeg = legislators[0];
//     if (!firstLeg?.bills) return allBills;

//     return allBills.filter((billNum) => {
//       const bill = firstLeg.bills.find((b) => b.billNumber === billNum);
//       return bill?.category?.toLowerCase() === selectedCategory.toLowerCase();
//     });
//   }, [legislators, selectedCategory]);

//   const columns = useMemo(() => {
//     const baseColumns = [
//       columnHelper.accessor("name", {
//         header: "Name",
//         cell: (info) => (
//           <div className="font-medium text-gray-900">{info.getValue()}</div>
//         ),
//         size: 150,
//       }),
//       columnHelper.accessor("party", {
//         header: "Party",
//         cell: (info) => (
//           <div className={getPartyColor(info.getValue())}>
//             {info.getValue()}
//           </div>
//         ),
//         size: 80,
//       }),
//       columnHelper.accessor("chamber", {
//         header: "Chamber",
//         cell: (info) => <div className="text-gray-600">{info.getValue()}</div>,
//         size: 100,
//       }),
//     ];

//     const billColumns = allBillNumbers.map((billNum) =>
//       columnHelper.display({
//         id: `bill-${billNum}`,
//         header: billNum,
//         cell: (info) => {
//           const bill = info.row.original.bills?.find(
//             (b) => b.billNumber === billNum
//           );
//           return (
//             <div className="text-center text-gray-600">
//               {bill ? bill.value || "-" : "-"}
//             </div>
//           );
//         },
//         size: 80,
//         meta: {
//           billNumber: billNum,
//         },
//       })
//     );

//     const scoreColumns = [
//       columnHelper.accessor("points", {
//         header: "Points",
//         cell: (info) => (
//           <div className="text-gray-700 font-medium">
//             {info.getValue() || "-"}
//           </div>
//         ),
//         size: 80,
//       }),
//       columnHelper.accessor("points_possible", {
//         header: "Possible",
//         cell: (info) => (
//           <div className="text-gray-600">{info.getValue() || "-"}</div>
//         ),
//         size: 80,
//       }),
//       columnHelper.accessor("score_percentage", {
//         header: "Score",
//         cell: (info) => {
//           const score = info.getValue();
//           return (
//             <div className={getScoreColor(score)}>
//               {score ? `${score.toFixed(2)}%` : "-"}
//             </div>
//           );
//         },
//         size: 100,
//       }),
//       columnHelper.accessor("score_with_bonus", {
//         header: "Score with Bonus",
//         cell: (info) => (
//           <div className="text-gray-600">{info.getValue() || "-"}</div>
//         ),
//         size: 120,
//       }),
//       columnHelper.accessor("key_highlights", {
//         header: "Key Highlights & Takeaways",
//         cell: (info) => (
//           <div className="text-sm text-gray-600">{info.getValue() || "-"}</div>
//         ),
//         size: 300,
//       }),
//     ];

//     const categoryColumns = [
//       "fiscal",
//       "education",
//       "labor",
//       "elections",
//       "Good Governance",
//       "business",
//       "healthcare",
//       "housing",
//     ].map((cat) =>
//       columnHelper.display({
//         id: `category-${cat}`,
//         header: cat.charAt(0).toUpperCase() + cat.slice(1),
//         cell: (info) => (
//           <div className="text-center text-gray-600">
//             {getCategoryScore(info.row.original, cat)}
//           </div>
//         ),
//         size: 100,
//       })
//     );

//     return [
//       ...baseColumns,
//       ...billColumns,
//       ...scoreColumns,
//       ...categoryColumns,
//     ];
//   }, [allBillNumbers, legislators]);

//   const table = useReactTable({
//     data: legislators,
//     columns,
//     state: {
//       sorting,
//       columnFilters,
//     },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//   });

//   const getBillMetadata = (billNumber) => {
//     const sample = legislators[0]?.bills?.find(
//       (b) => b.billNumber === billNumber
//     );
//     return {
//       recommendation: sample?.recommendation || "",
//       category: sample?.category || "",
//       weighting: sample?.weighting || "",
//     };
//   };
//   let headerHtml;
//   let footerHtml;
//   if (selectedCategory && selectedChamber && selectedParty) {
//     footerHtml = ` • Filtered by ${selectedCategory} category bills and ${selectedChamber} members and ${
//       selectedParty === "D"
//         ? "Democrat party members"
//         : selectedParty === "R"
//         ? "Republican party members"
//         : "Independent party members"
//     }`;
//     headerHtml = (
//       <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//         <p className="text-sm text-blue-700 font-medium">
//           📌 Showing only
//           <span className="font-bold">{` ${
//             selectedCategory ? `${selectedCategory} category bills` : ""
//           }  ${
//             selectedChamber ? `and ${selectedChamber} chamber members` : ""
//           } ${selectedParty === "D" ? `and Democrat party members` : ""} ${
//             selectedParty === "R" ? `and Republican party members` : ""
//           }
//           ${selectedParty === "I" ? `and Independent party ` : ""}`}</span>{" "}
//         </p>
//       </div>
//     );
//   } else if (selectedCategory && selectedChamber) {
//     footerHtml = ` • Filtered by ${selectedCategory} category bills and ${selectedChamber} members"
//     }`;
//     headerHtml = (
//       <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//         <p className="text-sm text-blue-700 font-medium">
//           📌 Showing only
//           <span className="font-bold">{` ${
//             selectedCategory ? `${selectedCategory} category bills` : ""
//           }  ${
//             selectedChamber ? `and ${selectedChamber} chamber members` : ""
//           }`}</span>
//         </p>
//       </div>
//     );
//   } else if (selectedCategory && selectedParty) {
//     footerHtml = ` • Filtered by ${selectedCategory} category bills ${
//       selectedParty === "D"
//         ? "Democrat party members"
//         : selectedParty === "R"
//         ? "Republican party members"
//         : "Independent party members"
//     }`;
//     headerHtml = (
//       <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//         <p className="text-sm text-blue-700 font-medium">
//           📌 Showing only
//           <span className="font-bold">{` ${
//             selectedCategory ? `${selectedCategory} category bills` : ""
//           }  ${selectedParty === "D" ? `and Democrat party members` : ""} ${
//             selectedParty === "R" ? `and Republican party members` : ""
//           }
//           ${
//             selectedParty === "I" ? `and Independent party members` : ""
//           }`}</span>{" "}
//         </p>
//       </div>
//     );
//   } else if (selectedChamber && selectedParty) {
//     footerHtml = ` • Filtered by ${selectedChamber} members and ${
//       selectedParty === "D"
//         ? "Democrat party members"
//         : selectedParty === "R"
//         ? "Republican party members"
//         : "Independent party members"
//     }`;
//     headerHtml = (
//       <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//         <p className="text-sm text-blue-700 font-medium">
//           📌 Showing only
//           <span className="font-bold">{`${
//             selectedChamber ? ` ${selectedChamber} chamber members` : ""
//           } ${selectedParty === "D" ? `and Democrat party members` : ""} ${
//             selectedParty === "R" ? `and Republican party members` : ""
//           }
//           ${
//             selectedParty === "I" ? `and Independent party members` : ""
//           }`}</span>{" "}
//         </p>
//       </div>
//     );
//   } else if (selectedCategory && !selectedChamber && !selectedParty) {
//     footerHtml = ` • Filtered by ${selectedCategory} category bills`;
//     headerHtml = (
//       <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//         <p className="text-sm text-blue-700 font-medium">
//           📌 Showing only
//           <span className="font-bold">{` ${
//             selectedCategory ? `${selectedCategory} category bills` : ""
//           } `}</span>
//         </p>
//       </div>
//     );
//   } else if (!selectedCategory && selectedChamber && !selectedParty) {
//     footerHtml = ` • Filtered by ${selectedChamber} members`;
//     headerHtml = (
//       <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//         <p className="text-sm text-blue-700 font-medium">
//           📌 Showing only
//           <span className="font-bold">{` ${
//             selectedChamber ? ` ${selectedChamber} chamber members` : ""
//           }`}</span>
//         </p>
//       </div>
//     );
//   } else if (!selectedCategory && !selectedChamber && selectedParty) {
//     footerHtml = ` • Filtered by ${
//       selectedParty === "D"
//         ? "Democrat party members"
//         : selectedParty === "R"
//         ? "Republican party members"
//         : "Independent party members"
//     }`;
//     headerHtml = (
//       <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//         <p className="text-sm text-blue-700 font-medium">
//           📌 Showing only
//           <span className="font-bold">{` ${
//             selectedParty === "D" ? `Democrat party members` : ""
//           } ${selectedParty === "R" ? `Republican party members` : ""}
//           ${
//             selectedParty === "I" ? `Independent party members` : ""
//           }`}</span>{" "}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {headerHtml && headerHtml}

//       <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             {/* Row 1: Column Headers */}
//             <tr>
//               <th className="px-4 py-3 sticky left-0 z-[40] bg-gray-50 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 align-top">
//                 Name
//               </th>
//               <th
//                 rowSpan={4}
//                 className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 align-top"
//               >
//                 Party
//               </th>
//               <th
//                 rowSpan={4}
//                 className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 align-top"
//               >
//                 Chamber
//               </th>
//               {allBillNumbers.map((billNum) => (
//                 <th
//                   key={billNum}
//                   className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200"
//                 >
//                   {billNum}
//                 </th>
//               ))}
//               <th
//                 rowSpan={4}
//                 className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200 align-top"
//               >
//                 Points
//               </th>
//               <th
//                 rowSpan={4}
//                 className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider align-top"
//               >
//                 Possible
//               </th>
//               <th
//                 rowSpan={4}
//                 className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider align-top"
//               >
//                 Score
//               </th>
//               <th
//                 rowSpan={4}
//                 className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider align-top"
//               >
//                 Score with Bonus
//               </th>
//               <th
//                 rowSpan={4}
//                 className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200 align-top min-w-[300px]"
//               >
//                 Key Highlights & Takeaways
//               </th>
//               <th
//                 colSpan={8}
//                 className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200"
//               >
//                 Scores by Category
//               </th>
//             </tr>

//             {/* Row 2: Recommendation */}
//             <tr className="bg-gray-100">
//               <th className="px-4 py-2 sticky left-0 z-[30] bg-gray-100 text-start text-xs text-gray-600 border-r border-gray-200">
//                 Recommendation
//               </th>
//               {allBillNumbers.map((billNum) => {
//                 const meta = getBillMetadata(billNum);
//                 return (
//                   <th
//                     key={`rec-${billNum}`}
//                     className="px-4 py-2 text-center text-xs text-gray-600 border-r border-gray-200"
//                   >
//                     {meta.recommendation}
//                   </th>
//                 );
//               })}
//               {[
//                 "Fiscal",
//                 "Education",
//                 "Labor",
//                 "Elections",
//                 "Good Governance",
//                 "Business",
//                 "Healthcare",
//                 "Housing",
//               ].map((cat) => (
//                 <th
//                   key={cat}
//                   rowSpan={3}
//                   className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200 align-top"
//                 >
//                   {cat}
//                 </th>
//               ))}
//             </tr>

//             {/* Row 3: Category */}
//             <tr className="bg-gray-50">
//               <th className="px-4 py-2 sticky left-0 z-[20] bg-gray-50 text-left text-xs text-gray-600 border-r border-gray-200">
//                 Category
//               </th>
//               {allBillNumbers.map((billNum) => {
//                 const meta = getBillMetadata(billNum);
//                 return (
//                   <th
//                     key={`cat-${billNum}`}
//                     className="px-4 py-2 text-center text-xs text-gray-600 border-r border-gray-200"
//                   >
//                     {meta.category}
//                   </th>
//                 );
//               })}
//             </tr>

//             {/* Row 4: Weighting */}
//             <tr className="bg-gray-100">
//               <th className="px-4 py-2 sticky left-0 z-[10] bg-gray-100 text-start text-xs text-gray-600 border-r border-gray-200">
//                 Weighting
//               </th>
//               {allBillNumbers.map((billNum) => {
//                 const meta = getBillMetadata(billNum);
//                 return (
//                   <th
//                     key={`weight-${billNum}`}
//                     className="px-4 py-2 text-center text-xs text-gray-600 border-r border-gray-200"
//                   >
//                     {meta.weighting}
//                   </th>
//                 );
//               })}
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-gray-200">
//             {table.getRowModel().rows.map((row) => (
//               <tr key={row.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-4 py-3 sticky left-0 z-[5] bg-white text-sm font-medium text-gray-900 border-r border-gray-200">
//                   {row.original.name}
//                 </td>
//                 <td
//                   className={`px-4 py-3 text-sm ${getPartyColor(
//                     row.original.party
//                   )} border-r border-gray-200`}
//                 >
//                   {row.original.party}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
//                   {row.original.chamber}
//                 </td>
//                 {allBillNumbers.map((billNum) => {
//                   const bill = row.original.bills?.find(
//                     (b) => b.billNumber === billNum
//                   );
//                   return (
//                     <td
//                       key={`${row.id}-${billNum}`}
//                       className="px-4 py-3 text-sm text-center text-gray-600 border-r border-gray-200"
//                     >
//                       {bill ? bill.value || "-" : "-"}
//                     </td>
//                   );
//                 })}
//                 <td className="px-4 py-3 text-sm text-gray-700 font-medium border-l border-gray-200">
//                   {row.original.points || "-"}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-600">
//                   {row.original.points_possible || "-"}
//                 </td>
//                 <td
//                   className={`px-4 py-3 text-sm ${getScoreColor(
//                     row.original.score_percentage
//                   )}`}
//                 >
//                   {row.original.score_percentage
//                     ? `${row.original.score_percentage.toFixed(2)}%`
//                     : "-"}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-600">
//                   {row.original.score_with_bonus || "-"}
//                 </td>
//                 <td className="px-4 py-3 text-sm text-gray-600 border-l border-gray-200">
//                   {row.original.key_highlights || "-"}
//                 </td>
//                 {[
//                   "fiscal",
//                   "education",
//                   "labor",
//                   "elections",
//                   "Good Governance",
//                   "business",
//                   "healthcare",
//                   "housing",
//                 ].map((cat) => (
//                   <td
//                     key={`${row.id}-${cat}`}
//                     className="px-4 py-3 text-sm text-center text-gray-600 border-l border-gray-200"
//                   >
//                     {getCategoryScore(row.original, cat)}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="mt-4 text-sm text-gray-600">
//         {`Showing ${table.getRowModel().rows.length} of ${legislators.length}
//          legislators`}
//         {footerHtml && footerHtml}
//       </div>
//     </div>
//   );
// }
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, Monitor } from "lucide-react";

const columnHelper = createColumnHelper();

export default function LegislatorTable({
  legislators,
  selectedCategory,
  selectedParty,
  selectedChamber,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const getPartyColor = (party) => {
    if (party === "D") return "text-blue-600 font-semibold";
    if (party === "R") return "text-red-600 font-semibold";
    return "text-gray-600";
  };

  const getScoreColor = (score) => {
    if (!score) return "text-gray-400";
    if (score >= 90) return "text-green-600 font-bold";
    if (score >= 70) return "text-yellow-600 font-semibold";
    if (score >= 50) return "text-orange-600 font-semibold";
    return "text-red-600 font-bold";
  };

  const getCategoryScore = (legislator, category) => {
    const match = legislator.categoryScores?.find(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    );
    return match ? match.score : "-";
  };

  // Get all bill numbers and filter by category if selected
  const allBillNumbers = useMemo(() => {
    const allBills = Array.from(
      new Set(
        legislators.flatMap(
          (leg) => leg.bills?.map((bill) => bill.billNumber) || []
        )
      )
    );

    // If no category selected, show all bills
    if (!selectedCategory) return allBills;

    // Filter bills by selected category
    const firstLeg = legislators[0];
    if (!firstLeg?.bills) return allBills;

    return allBills.filter((billNum) => {
      const bill = firstLeg.bills.find((b) => b.billNumber === billNum);
      return bill?.category?.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [legislators, selectedCategory]);

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <div className="font-medium text-gray-900">{info.getValue()}</div>
        ),
        size: 150,
      }),
      columnHelper.accessor("party", {
        header: "Party",
        cell: (info) => (
          <div className={getPartyColor(info.getValue())}>
            {info.getValue()}
          </div>
        ),
        size: 80,
      }),
      columnHelper.accessor("chamber", {
        header: "Chamber",
        cell: (info) => <div className="text-gray-600">{info.getValue()}</div>,
        size: 100,
      }),
    ];

    const billColumns = allBillNumbers.map((billNum) =>
      columnHelper.display({
        id: `bill-${billNum}`,
        header: billNum,
        cell: (info) => {
          const bill = info.row.original.bills?.find(
            (b) => b.billNumber === billNum
          );
          return (
            <div className="text-center text-gray-600">
              {bill ? bill.value || "-" : "-"}
            </div>
          );
        },
        size: 80,
        meta: {
          billNumber: billNum,
        },
      })
    );

    const scoreColumns = [
      columnHelper.accessor("points", {
        header: "Points",
        cell: (info) => (
          <div className="text-gray-700 font-medium">
            {info.getValue() || "-"}
          </div>
        ),
        size: 80,
      }),
      columnHelper.accessor("points_possible", {
        header: "Possible",
        cell: (info) => (
          <div className="text-gray-600">{info.getValue() || "-"}</div>
        ),
        size: 80,
      }),
      columnHelper.accessor("score_percentage", {
        header: "Score",
        cell: (info) => {
          const score = info.getValue();
          return (
            <div className={getScoreColor(score)}>
              {score ? `${score.toFixed(2)}%` : "-"}
            </div>
          );
        },
        size: 100,
      }),
      columnHelper.accessor("score_with_bonus", {
        header: "Score with Bonus",
        cell: (info) => (
          <div className="text-gray-600">{info.getValue() || "-"}</div>
        ),
        size: 120,
      }),
      columnHelper.accessor("key_highlights", {
        header: "Key Highlights & Takeaways",
        cell: (info) => (
          <div className="text-sm text-gray-600">{info.getValue() || "-"}</div>
        ),
        size: 300,
      }),
    ];

    const categoryColumns = [
      "fiscal",
      "education",
      "labor",
      "elections",
      "Good Governance",
      "business",
      "healthcare",
      "housing",
    ].map((cat) =>
      columnHelper.display({
        id: `category-${cat}`,
        header: cat.charAt(0).toUpperCase() + cat.slice(1),
        cell: (info) => (
          <div className="text-center text-gray-600">
            {getCategoryScore(info.row.original, cat)}
          </div>
        ),
        size: 100,
      })
    );

    return [
      ...baseColumns,
      ...billColumns,
      ...scoreColumns,
      ...categoryColumns,
    ];
  }, [allBillNumbers, legislators]);

  const table = useReactTable({
    data: legislators,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const getBillMetadata = (billNumber) => {
    const sample = legislators[0]?.bills?.find(
      (b) => b.billNumber === billNumber
    );
    return {
      recommendation: sample?.recommendation || "",
      category: sample?.category || "",
      weighting: sample?.weighting || "",
      description: sample?.description || "No description available",
    };
  };
  let headerHtml;
  let footerHtml;
  if (selectedCategory && selectedChamber && selectedParty) {
    footerHtml = ` • Filtered by ${selectedCategory} category bills and ${selectedChamber} members and ${
      selectedParty === "D"
        ? "Democrat party members"
        : selectedParty === "R"
        ? "Republican party members"
        : "Independent party members"
    }`;
    headerHtml = (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">
          📌 Showing only
          <span className="font-bold">{` ${
            selectedCategory ? `${selectedCategory} category bills` : ""
          }  ${
            selectedChamber ? `and ${selectedChamber} chamber members` : ""
          } ${selectedParty === "D" ? `and Democrat party members` : ""} ${
            selectedParty === "R" ? `and Republican party members` : ""
          }
          ${selectedParty === "I" ? `and Independent party ` : ""}`}</span>{" "}
        </p>
      </div>
    );
  } else if (selectedCategory && selectedChamber) {
    footerHtml = ` • Filtered by ${selectedCategory} category bills and ${selectedChamber} members"
    }`;
    headerHtml = (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">
          📌 Showing only
          <span className="font-bold">{` ${
            selectedCategory ? `${selectedCategory} category bills` : ""
          }  ${
            selectedChamber ? `and ${selectedChamber} chamber members` : ""
          }`}</span>
        </p>
      </div>
    );
  } else if (selectedCategory && selectedParty) {
    footerHtml = ` • Filtered by ${selectedCategory} category bills ${
      selectedParty === "D"
        ? "Democrat party members"
        : selectedParty === "R"
        ? "Republican party members"
        : "Independent party members"
    }`;
    headerHtml = (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">
          📌 Showing only
          <span className="font-bold">{` ${
            selectedCategory ? `${selectedCategory} category bills` : ""
          }  ${selectedParty === "D" ? `and Democrat party members` : ""} ${
            selectedParty === "R" ? `and Republican party members` : ""
          }
          ${
            selectedParty === "I" ? `and Independent party members` : ""
          }`}</span>{" "}
        </p>
      </div>
    );
  } else if (selectedChamber && selectedParty) {
    footerHtml = ` • Filtered by ${selectedChamber} members and ${
      selectedParty === "D"
        ? "Democrat party members"
        : selectedParty === "R"
        ? "Republican party members"
        : "Independent party members"
    }`;
    headerHtml = (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">
          📌 Showing only
          <span className="font-bold">{`${
            selectedChamber ? ` ${selectedChamber} chamber members` : ""
          } ${selectedParty === "D" ? `and Democrat party members` : ""} ${
            selectedParty === "R" ? `and Republican party members` : ""
          }
          ${
            selectedParty === "I" ? `and Independent party members` : ""
          }`}</span>{" "}
        </p>
      </div>
    );
  } else if (selectedCategory && !selectedChamber && !selectedParty) {
    footerHtml = ` • Filtered by ${selectedCategory} category bills`;
    headerHtml = (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">
          📌 Showing only
          <span className="font-bold">{` ${
            selectedCategory ? `${selectedCategory} category bills` : ""
          } `}</span>
        </p>
      </div>
    );
  } else if (!selectedCategory && selectedChamber && !selectedParty) {
    footerHtml = ` • Filtered by ${selectedChamber} members`;
    headerHtml = (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">
          📌 Showing only
          <span className="font-bold">{` ${
            selectedChamber ? ` ${selectedChamber} chamber members` : ""
          }`}</span>
        </p>
      </div>
    );
  } else if (!selectedCategory && !selectedChamber && selectedParty) {
    footerHtml = ` • Filtered by ${
      selectedParty === "D"
        ? "Democrat party members"
        : selectedParty === "R"
        ? "Republican party members"
        : "Independent party members"
    }`;
    headerHtml = (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 font-medium">
          📌 Showing only
          <span className="font-bold">{` ${
            selectedParty === "D" ? `Democrat party members` : ""
          } ${selectedParty === "R" ? `Republican party members` : ""}
          ${
            selectedParty === "I" ? `Independent party members` : ""
          }`}</span>{" "}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop viewing recommendation */}
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
        <Monitor className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800 font-medium">
          💡 This table is best viewed on desktop for optimal experience
        </p>
      </div>

      {headerHtml && headerHtml}

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {/* Row 1: Column Headers */}
            <tr>
              <th className="px-4 py-3 sticky left-0 z-[40] bg-gray-50 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 align-top">
                Name
              </th>
              <th
                rowSpan={4}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 align-top"
              >
                Party
              </th>
              <th
                rowSpan={4}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 align-top"
              >
                Chamber
              </th>
              {allBillNumbers.map((billNum) => {
                return (
                  <th
                    key={billNum}
                    className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200"
                  >
                    {billNum}
                  </th>
                );
              })}

              <th
                rowSpan={4}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200 align-top"
              >
                Points
              </th>
              <th
                rowSpan={4}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider align-top"
              >
                Possible
              </th>
              <th
                rowSpan={4}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider align-top"
              >
                Score
              </th>
              <th
                rowSpan={4}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider align-top"
              >
                Score with Bonus
              </th>
              <th
                rowSpan={4}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200 align-top min-w-[300px]"
              >
                Key Highlights & Takeaways
              </th>
              <th
                colSpan={8}
                className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200"
              >
                Scores by Category
              </th>
            </tr>

            {/* Row 2: Recommendation */}
            <tr className="bg-gray-100">
              <th className="px-4 py-2 sticky left-0 z-[30] bg-gray-100 text-start text-xs text-gray-600 border-r border-gray-200">
                Recommendation
              </th>
              {allBillNumbers.map((billNum) => {
                const meta = getBillMetadata(billNum);
                return (
                  <th
                    key={`rec-${billNum}`}
                    className="px-4 py-2 text-center text-xs text-gray-600 border-r border-gray-200"
                  >
                    {meta.recommendation}
                  </th>
                );
              })}
              {[
                "Fiscal",
                "Education",
                "Labor",
                "Elections",
                "Good Governance",
                "Business",
                "Healthcare",
                "Housing",
              ].map((cat) => (
                <th
                  key={cat}
                  rowSpan={3}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200 align-top"
                >
                  {cat}
                </th>
              ))}
            </tr>

            {/* Row 3: Category */}
            <tr className="bg-gray-50">
              <th className="px-4 py-2 sticky left-0 z-[20] bg-gray-50 text-left text-xs text-gray-600 border-r border-gray-200">
                Category
              </th>
              {allBillNumbers.map((billNum) => {
                const meta = getBillMetadata(billNum);
                return (
                  <th
                    key={`cat-${billNum}`}
                    className="px-4 py-2 text-center text-xs text-gray-600 border-r border-gray-200"
                  >
                    {meta.category}
                  </th>
                );
              })}
            </tr>

            {/* Row 4: Weighting */}
            <tr className="bg-gray-100">
              <th className="px-4 py-2 sticky left-0 z-[10] bg-gray-100 text-start text-xs text-gray-600 border-r border-gray-200">
                Weighting
              </th>
              {allBillNumbers.map((billNum) => {
                const meta = getBillMetadata(billNum);
                return (
                  <th
                    key={`weight-${billNum}`}
                    className="px-4 py-2 text-center text-xs text-gray-600 border-r border-gray-200"
                  >
                    {meta.weighting}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 sticky left-0 z-[5] bg-white text-sm font-medium text-gray-900 border-r border-gray-200">
                  {row.original.name}
                </td>
                <td
                  className={`px-4 py-3 text-sm ${getPartyColor(
                    row.original.party
                  )} border-r border-gray-200`}
                >
                  {row.original.party}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">
                  {row.original.chamber}
                </td>
                {allBillNumbers.map((billNum) => {
                  const bill = row.original.bills?.find(
                    (b) => b.billNumber === billNum
                  );
                  return (
                    <td
                      key={`${row.id}-${billNum}`}
                      className="px-4 py-3 text-sm text-center text-gray-600 border-r border-gray-200"
                    >
                      {bill ? bill.value || "-" : "-"}
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-sm text-gray-700 font-medium border-l border-gray-200">
                  {row.original.points || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {row.original.points_possible || "-"}
                </td>
                <td
                  className={`px-4 py-3 text-sm ${getScoreColor(
                    row.original.score_percentage
                  )}`}
                >
                  {row.original.score_percentage
                    ? `${row.original.score_percentage.toFixed(2)}%`
                    : "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {row.original.score_with_bonus || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border-l border-gray-200">
                  {row.original.key_highlights || "-"}
                </td>
                {[
                  "fiscal",
                  "education",
                  "labor",
                  "elections",
                  "Good Governance",
                  "business",
                  "healthcare",
                  "housing",
                ].map((cat) => (
                  <td
                    key={`${row.id}-${cat}`}
                    className="px-4 py-3 text-sm text-center text-gray-600 border-l border-gray-200"
                  >
                    {getCategoryScore(row.original, cat)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        {`Showing ${table.getRowModel().rows.length} of ${legislators.length}
         legislators`}
        {footerHtml && footerHtml}
      </div>
    </div>
  );
}
