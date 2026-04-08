import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "sonner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TokenContextProvider from "./store/TokenContextProvider.jsx";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <TokenContextProvider>
        <Toaster />
        <App />
      </TokenContextProvider>
    </HelmetProvider>
  </React.StrictMode>
);
