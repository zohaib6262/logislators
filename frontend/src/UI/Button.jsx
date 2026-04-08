// import React from "react";

// const Button = ({ children, className, ...props }) => {
//   return (
//     <button
//       className={`!bg-blue-600  hover:bg-blue-700 text-white font-semibold rounded-lg px-2 py-2 transition-colors disabled:opacity-50 ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// export default Button;
import React, { useContext } from "react";
import { TokenContext } from "@/store/TokenContextProvider";

const Button = ({ children, className = "", ...props }) => {
  const { primaryColor } = useContext(TokenContext);

  return (
    <button
      className={`text-white font-semibold rounded-lg px-4 py-2 transition-colors disabled:opacity-50 ${className}`}
      style={{
        backgroundColor: primaryColor,
        ...(props.disabled && { opacity: 0.5 }),
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
