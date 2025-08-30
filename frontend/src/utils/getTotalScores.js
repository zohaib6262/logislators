// export const getTotalScores = (categories) => {
//   const finalScore = categories.reduce(
//     (acc, item) => {
//       const [numerator, denominator] = item.score.split("/").map(Number);
//       acc.total += numerator;
//       acc.outOf += denominator;
//       return acc;
//     },
//     { total: 0, outOf: 0 }
//   );
//   const total = finalScore.total.toFixed(2);
//   const outOf = finalScore.outOf.toFixed(2);

//   return `${total}/${outOf}`;
// };

// export const getTotalPoints = (points) => {
//   if (!points) return "0/0"; // fallback

//   // split string by "/"
//   const [numerator, denominator] = points.split("/").map(Number);

//   // round to 2 decimals
//   const total = numerator.toFixed(2);
//   const outOf = denominator.toFixed(2);

//   return `${total}/${outOf}`;
// };
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

  // agar denominator 0 ya 1 ho to sirf total dikhayein
  if (Number(finalScore.outOf) < 0.1 || !Number(finalScore.outOf)) {
    return total;
  }

  return `${total}/${outOf}`;
};

export const getTotalPoints = (points) => {
  if (!points) return "0";

  const [numerator, denominator] = points.split("/").map(Number);
  if (numerator && denominator) {
    const total = numerator.toFixed(2);
    const outOf = denominator.toFixed(2);
    return `${total}/${outOf}`;
  }

  // agar denominator 0 ya 1 ho to sirf total dikhayein
  if (denominator < 0.1 || !denominator) {
    const total = numerator.toFixed(2);

    return `${total}`;
  }
};
