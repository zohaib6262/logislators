import BASE_URL from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAddRepresentative = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const addRepresentative = async (representativeData) => {
    try {
      setLoading(true);
      setError(null);

      // // Calculate grade based on voting records
      // const totalScore = representativeData.votingRecords.reduce(
      //   (acc, record) => {
      //     const [scored, total] = record.score.split("/").map(Number);
      //     return {
      //       scored: acc.scored + (scored || 0),
      //       total: acc.total + (total || 0),
      //     };
      //   },
      //   { scored: 0, total: 0 }
      // );

      // const percentage = Math.round(
      //   (totalScore.scored / totalScore.total) * 100
      // );
      // const grade =
      //   percentage >= 90
      //     ? "A"
      //     : percentage >= 80
      //     ? "B"
      //     : percentage >= 70
      //     ? "C"
      //     : percentage >= 60
      //     ? "D"
      //     : "F";

      // // Prepare final payload
      // const payload = {
      //   ...representativeData,
      //   grade: `${grade}${
      //     percentage % 10 >= 7 ? "+" : percentage % 10 <= 2 ? "-" : ""
      //   } (${percentage}%)`,
      //   votingRecord: representativeData.votingRecords.map((record) => ({
      //     area: record.area,
      //     notableBills: record.bills,
      //     score: record.score,
      //   })),
      // };

      const response = await fetch(`${BASE_URL}/representatives`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(representativeData),
      });
      if (!response.ok) {
        throw new Error("Failed to add representative");
      }

      const data = await response.json();
      navigate("/admin/representatives");
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addRepresentative, loading, error, setError };
};
