// import { TokenContext } from "@/store/TokenContextProvider";
// import { useContext } from "react";

// export default function LegislatorTable({ legislators }) {
//   const { primaryColor } = useContext(TokenContext);

//   const getPartyColor = (party) => {
//     if (party === "D") return "text-blue-600";
//     if (party === "R") return "text-red-600";
//     return "text-gray-600";
//   };

//   const getScoreColor = (score) => {
//     if (score >= 90) return "text-green-600";
//     if (score >= 70) return "text-yellow-600";
//     if (score >= 50) return "text-orange-600";
//     return "text-red-600";
//   };

//   const getRecommendationBadge = (rec) => {
//     if (!rec) return <span className="text-gray-400">-</span>;
//     const baseClasses = "px-2 py-1 rounded text-xs font-medium";
//     if (rec.includes("Support 1"))
//       return (
//         <span className={`${baseClasses} bg-green-100 text-green-700`}>
//           Support 1
//         </span>
//       );
//     if (rec.includes("Support 2"))
//       return (
//         <span className={`${baseClasses} bg-green-50 text-green-600`}>
//           Support 2
//         </span>
//       );
//     if (rec.includes("Oppose 1"))
//       return (
//         <span className={`${baseClasses} bg-red-100 text-red-700`}>
//           Oppose 1
//         </span>
//       );
//     if (rec.includes("Oppose 2"))
//       return (
//         <span className={`${baseClasses} bg-red-50 text-red-600`}>
//           Oppose 2
//         </span>
//       );
//     return <span className="text-gray-400">-</span>;
//   };

//   const allBillNumbers = Array.from(
//     new Set(
//       legislators.flatMap(
//         (leg) => leg.bills?.map((bill) => bill.billNumber) || []
//       )
//     )
//   );

//   const getCategoryScore = (legislator, category) => {
//     const match = legislator.categoryScores?.find(
//       (c) => c.category.toLowerCase() === category.toLowerCase()
//     );
//     return match ? match.score : "-";
//   };

//   return (
//     <div className="overflow-x-auto border border-gray-200 rounded-lg">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200">
//               Name
//             </th>
//             <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
//               Party
//             </th>
//             <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
//               Chamber
//             </th>

//             {allBillNumbers.map((billNum) => (
//               <th
//                 key={billNum}
//                 className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase"
//               >
//                 {billNum}
//               </th>
//             ))}
//             <th
//               className="px-4 py-3 text-left align-text-top border-l border-gray-200 text-xs font-medium text-gray-700 uppercase"
//               rowSpan={4}
//             >
//               Points
//             </th>
//             <th
//               className="px-4 py-3 text-left align-text-top border-l text-xs font-medium text-gray-700 uppercase"
//               rowSpan={4}
//             >
//               Possible
//             </th>
//             <th
//               className="px-4 py-3 text-left align-text-top border-l text-xs font-medium text-gray-700 uppercase"
//               rowSpan={4}
//             >
//               Score
//             </th>
//             <th
//               className="px-4 py-3 text-left align-text-top border-l text-xs font-medium text-gray-700 uppercase"
//               rowSpan={4}
//             >
//               Score with Bonus
//             </th>
//             <th
//               className="px-4 py-3 text-center align-text-top border-l text-xs font-medium text-gray-700 uppercase min-w-[400px]"
//               rowSpan={4}
//               colSpan={10}
//             >
//               Key Highlights & Takeaways
//             </th>

//             <th
//               className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase border-l border-gray-200"
//               rowSpan={2}
//               colSpan={8}
//             >
//               Scores by Category
//             </th>
//           </tr>

//           {/* Recommendation row */}
//           <tr className="bg-gray-100">
//             <th className="sticky left-0 z-10 bg-gray-100 px-4 py-2 text-left text-xs font-semibold text-gray-600 border-r border-gray-200">
//               Recommendation
//             </th>
//             <th colSpan={2}></th>
//             {allBillNumbers.map((billNum) => {
//               const sample = legislators[0]?.bills?.find(
//                 (b) => b.billNumber === billNum
//               );
//               return (
//                 <th
//                   key={`rec-${billNum}`}
//                   className="px-4 py-2 text-center text-xs text-gray-600"
//                 >
//                   {sample ? sample.recommendation : ""}
//                 </th>
//               );
//             })}
//           </tr>

//           {/* Category row */}
//           <tr className="bg-gray-50">
//             <th className="sticky left-0 z-10 bg-gray-50 px-4 py-2 text-left text-xs font-semibold text-gray-600 border-r border-gray-200">
//               Category
//             </th>
//             <th colSpan={2}></th>
//             {allBillNumbers.map((billNum) => {
//               const sample = legislators[0]?.bills?.find(
//                 (b) => b.billNumber === billNum
//               );
//               return (
//                 <th
//                   key={`cat-${billNum}`}
//                   className="px-4 py-2 text-center text-xs text-gray-600"
//                 >
//                   {sample ? sample.category : ""}
//                 </th>
//               );
//             })}
//             {[
//               "Fiscal",
//               "Education",
//               "Labor",
//               "Elections",
//               "Good Governance",
//               "Business",
//               "Healthcare",
//               "Housing",
//             ].map((cat) => (
//               <th
//                 key={cat}
//                 className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase border-l border-t border-gray-200"
//                 rowSpan={2}
//               >
//                 {cat}
//               </th>
//             ))}
//           </tr>

//           {/* Weighting row */}
//           <tr className="bg-gray-100">
//             <th className="sticky left-0 z-10 bg-gray-100 px-4 py-2 text-left text-xs font-semibold text-gray-600 border-r border-gray-200">
//               Weighting
//             </th>
//             <th colSpan={2}></th>
//             {allBillNumbers.map((billNum) => {
//               const sample = legislators[0]?.bills?.find(
//                 (b) => b.billNumber === billNum
//               );
//               return (
//                 <th
//                   key={`weight-${billNum}`}
//                   className="px-4 py-2 text-center text-xs text-gray-600"
//                 >
//                   {sample ? sample.weighting : ""}
//                 </th>
//               );
//             })}
//           </tr>
//         </thead>

//         <tbody className="bg-white divide-y divide-gray-200">
//           {legislators.map((leg) => (
//             <tr key={leg._id} className="hover:bg-gray-50 transition-colors">
//               <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
//                 {leg.name}
//               </td>
//               <td
//                 className={`px-4 py-3 text-sm font-semibold ${getPartyColor(
//                   leg.party
//                 )}`}
//               >
//                 {leg.party}
//               </td>
//               <td className="px-4 py-3 text-sm text-gray-600">{leg.chamber}</td>
//               {/* Bill values */}
//               {allBillNumbers.map((billNum) => {
//                 const bill = leg.bills?.find((b) => b.billNumber === billNum);
//                 return (
//                   <td
//                     key={`${leg._id}-${billNum}`}
//                     className="px-4 py-3 text-sm text-center text-gray-600"
//                   >
//                     {bill ? bill.value || "-" : "-"}
//                   </td>
//                 );
//               })}
//               <td className="px-4 py-3 text-sm text-gray-600">
//                 {leg.points || "-"}
//               </td>
//               <td className="px-4 py-3 text-sm text-gray-600">
//                 {leg.points_possible || "-"}
//               </td>
//               <td
//                 className={`px-4 py-3 text-sm font-semibold ${getScoreColor(
//                   leg.score_percentage
//                 )}`}
//               >
//                 {leg.score_percentage
//                   ? `${leg.score_percentage.toFixed(2)}%`
//                   : "-"}
//               </td>
//               <td className="px-4 py-3 text-sm text-gray-600">
//                 {leg.score_with_bonus || "-"}
//               </td>
//               <td className="px-4 py-3 text-sm text-gray-600" colSpan={10}>
//                 {leg.key_highlights || "-"}
//               </td>

//               {[
//                 "fiscal",
//                 "education",
//                 "labor",
//                 "elections",
//                 "Good Governance",
//                 "business",
//                 "healthcare",
//                 "housing",
//               ].map((cat) => (
//                 <td
//                   key={`${leg._id}-${cat}`}
//                   className="px-4 py-3 text-sm text-center text-gray-600"
//                 >
//                   {getCategoryScore(leg, cat)}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
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
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

const columnHelper = createColumnHelper();

export default function LegislatorTable({ legislators }) {
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

  const allBillNumbers = useMemo(
    () =>
      Array.from(
        new Set(
          legislators.flatMap(
            (leg) => leg.bills?.map((bill) => bill.billNumber) || []
          )
        )
      ),
    [legislators]
  );

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
    };
  };

  return (
    <div className="w-full">
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
              {allBillNumbers.map((billNum) => (
                <th
                  key={billNum}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200"
                >
                  {billNum}
                </th>
              ))}
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
        Showing {table.getRowModel().rows.length} of {legislators.length}{" "}
        legislators
      </div>
    </div>
  );
}
