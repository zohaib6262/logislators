import BASE_URL from "@/lib/utils";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const TokenContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  primaryColor: "",
  setPrimaryColor: () => {},
});

const TokenContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("");

  useEffect(() => {
    const isLogin = localStorage.getItem("token");
    if (isLogin) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
    }
  }, [isAuthenticated]);
  // Fetch primary color on mount
  useEffect(() => {
    const fetchPrimaryColor = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/primary`);
        if (data?.primaryBgColor) {
          setPrimaryColor(data.primaryBgColor);
        }
      } catch (error) {
        console.error("Failed to fetch primary color:", error.message);
      }
    };

    fetchPrimaryColor();
  }, []);
  return (
    <TokenContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        primaryColor,
        setPrimaryColor,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export default TokenContextProvider;
