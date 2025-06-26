import React, { createContext, useEffect, useState } from "react";

export const TokenContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

const TokenContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const isLogin = localStorage.getItem("token");
    if (isLogin) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
    }
  }, [isAuthenticated]);
  return (
    <TokenContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenContextProvider;
