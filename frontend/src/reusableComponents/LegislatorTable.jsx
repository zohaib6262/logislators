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
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Main Tippy styles
import "tippy.js/themes/light.css"; // Light theme

const columnHelper = createColumnHelper();

export default function LegislatorTable({
  legislators,
  selectedCategory,
  selectedParty,
  selectedChamber,
  selectedRecommendation,
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

  // Get all bill numbers and their summaries
  const allBillNumbers = useMemo(() => {
    const billMap = new Map();

    legislators.forEach((leg) => {
      leg.bills?.forEach((bill) => {
        if (!billMap.has(bill.billNumber)) {
          billMap.set(bill.billNumber, {
            billNumber: bill.billNumber,
            billSummary: bill.billSummary || "",
            category: bill.category || "",
          });
        }
      });
    });

    const allBills = Array.from(billMap.values());

    // If no category selected, show all bills
    if (!selectedCategory) return allBills;

    // Filter bills by selected category
    return allBills.filter(
      (bill) => bill.category.toLowerCase() === selectedCategory.toLowerCase()
    );
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

    const billColumns = allBillNumbers.map((bill) =>
      columnHelper.display({
        id: `bill-${bill.billNumber}`,
        header: bill.billNumber,
        cell: (info) => {
          const foundBill = info.row.original.bills?.find(
            (b) => b.billNumber === bill.billNumber
          );
          return (
            <div className="text-center text-gray-600">
              {foundBill ? foundBill.value || "-" : "-"}
            </div>
          );
        },
        size: 80,
        meta: {
          billNumber: bill.billNumber,
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
      billSummary: sample?.billSummary || "",
    };
  };

  const summary = useMemo(() => {
    const parts = [];
    if (selectedCategory) parts.push(`${selectedCategory} category bills`);
    if (selectedChamber) parts.push(`${selectedChamber} members`);
    if (selectedParty) {
      const partyName =
        selectedParty === "D"
          ? "Democrat"
          : selectedParty === "R"
          ? "Republican"
          : "Independent";
      parts.push(`${partyName} party members`);
    }
    if (selectedRecommendation)
      parts.push(`${selectedRecommendation} recommendation`);
    return parts.join(" and ");
  }, [
    selectedCategory,
    selectedChamber,
    selectedParty,
    selectedRecommendation,
  ]);

  const headerHtml = summary && (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-sm text-blue-700 font-medium">
        📌 Showing only <span className="font-bold">{summary}</span>
      </p>
    </div>
  );
  const footerHtml = summary && ` • Filtered by ${summary}`;

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
            {/* Row 1: Column Headers with Tippy Tooltips */}
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
              {allBillNumbers.map((bill) => (
                <th
                  key={bill.billNumber}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200"
                >
                  <Tippy
                    content={
                      <div style={{ maxWidth: "400px", padding: "8px" }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            marginBottom: "8px",
                            fontSize: "14px",
                          }}
                        >
                          {bill.billNumber}
                        </div>
                        <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
                          {bill.billSummary ||
                            "No summary available for this bill"}
                        </div>
                      </div>
                    }
                    theme="light"
                    placement="top"
                    arrow={true}
                    maxWidth={450}
                    delay={[200, 0]}
                    animation="fade"
                    appendTo={() => document.body}
                  >
                    <span className="cursor-help border-b border-dotted border-gray-400 hover:border-blue-500 transition-colors inline-block">
                      {bill.billNumber}
                    </span>
                  </Tippy>
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
              {allBillNumbers.map((bill) => {
                const meta = getBillMetadata(bill.billNumber);
                return (
                  <th
                    key={`rec-${bill.billNumber}`}
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
              {allBillNumbers.map((bill) => {
                const meta = getBillMetadata(bill.billNumber);
                return (
                  <th
                    key={`cat-${bill.billNumber}`}
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
              {allBillNumbers.map((bill) => {
                const meta = getBillMetadata(bill.billNumber);
                return (
                  <th
                    key={`weight-${bill.billNumber}`}
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
                {allBillNumbers.map((bill) => {
                  const foundBill = row.original.bills?.find(
                    (b) => b.billNumber === bill.billNumber
                  );
                  return (
                    <td
                      key={`${row.id}-${bill.billNumber}`}
                      className="px-4 py-3 text-sm text-center text-gray-600 border-r border-gray-200"
                    >
                      {foundBill ? foundBill.value || "-" : "-"}
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
