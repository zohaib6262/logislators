import React from "react";

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`!bg-blue-600  hover:bg-blue-700 text-white font-semibold rounded-lg px-2 py-2 transition-colors disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
