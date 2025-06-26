import React from "react";

const Badge = ({ children, variant = "gray", className = "" }) => {
  const variantStyles = {
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300",
    yellow:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    green:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    purple:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${variantStyles[variant]} ${className} `}
    >
      {children}
    </span>
  );
};

export default Badge;
