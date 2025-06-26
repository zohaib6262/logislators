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

  return `${finalScore.total}/${finalScore.outOf}`;
};
