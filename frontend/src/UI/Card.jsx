import React from "react";

const Card = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className} w-50`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className }) => {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
};

export { Card, CardContent };
