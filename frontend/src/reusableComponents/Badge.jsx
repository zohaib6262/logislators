import React from "react";
import { Award } from "lucide-react";

const Badge = ({ title, description, icon, color = "blue" }) => {
  const colorClasses = {
    red: "bg-red-100 text-red-800 border-red-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-green-100 text-green-800 border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <div
      className={`flex items-center p-2 rounded-lg border ${colorClasses[color]}`}
    >
      <div className="flex-shrink-0 mr-3">
        {icon || (
          <Award size={20} className={`text-${color.replace("bg-", "")}-500`} />
        )}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        {description && <p className="text-sm opacity-75">{description}</p>}
      </div>
    </div>
  );
};

export default Badge;
export const BadgesList = ({ badges }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
      {badges.map((badge, index) => (
        <Badge key={index} {...badge} />
      ))}
    </div>
  );
};
