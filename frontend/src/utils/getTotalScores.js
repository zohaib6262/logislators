export const getTotalScores = (categories) => {
  const finalScore = categories.reduce(
    (acc, item) => {
      const [numerator, denominator] = item.score.split("/").map(Number);
      acc.total += numerator;
      acc.outOf += denominator;
      return acc;
    },
    { total: 0, outOf: 0 }
  );
  const total = finalScore.total.toFixed(2);
  const outOf = finalScore.outOf.toFixed(2);

  return `${total}/${outOf}`;
};
