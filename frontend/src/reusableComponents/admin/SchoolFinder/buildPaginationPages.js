/** Page numbers and ellipsis markers for admin list pagination controls. */
export function buildPaginationPages(current, totalPages) {
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const set = new Set([1, totalPages, current, current - 1, current + 1, current - 2, current + 2]);
  const sorted = [...set].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push("ellipsis");
    out.push(p);
    prev = p;
  }
  return out;
}
