import React, { useContext } from "react";
import { ThemeContext } from "./Theme";

export default function WebsitePage({ children }) {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme === "light" ? "#fff" : "#444",
      }}
    >
      {children}
    </div>
  );
}
