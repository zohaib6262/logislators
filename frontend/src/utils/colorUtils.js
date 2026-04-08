// utils/colorUtils.js
export const lightenColor = (hex, percent) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

export const newLightnerColor = (color, percent) => {
  if (!color) return "#93c5fd";
  color = color.replace("#", "");

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const lighten = (value) =>
    Math.min(255, value + Math.round(255 * (percent / 100)));

  return `#${[
    lighten(r).toString(16).padStart(2, "0"),
    lighten(g).toString(16).padStart(2, "0"),
    lighten(b).toString(16).padStart(2, "0"),
  ].join("")}`;
};
