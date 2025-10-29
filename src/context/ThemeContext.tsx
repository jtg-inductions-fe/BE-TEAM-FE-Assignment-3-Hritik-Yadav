import React, { createContext, useState, useContext, useLayoutEffect } from "react";
import { ConfigProvider } from "antd";
import { Theme, ThemeContextType, ThemeProviderProps } from "./context.type";
import { THEME } from "./context.const";

const lightTheme = {
  primaryColor: "#1890ff",
  infoColor: "#1890ff",
  successColor: "#52c41a",
  processingColor: "#1890ff",
  errorColor: "#f5222d",
  warningColor: "#faad14",
};

const darkTheme = {
  primaryColor: "#1DA57A",
  infoColor: "#1DA57A",
  successColor: "#52c41a",
  processingColor: "#1DA57A",
  errorColor: "#ff7875",
  warningColor: "#ffc069",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const isBrowser = typeof window !== "undefined";

  const [theme, setTheme] = useState<Theme>(() => {
    if (!isBrowser) return THEME.LIGHT;
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    return storedTheme || THEME.LIGHT;
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
  };

  useLayoutEffect(() => {
    if (!isBrowser) return;
    document.body.classList.remove(THEME.LIGHT, THEME.DARK);
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);

    ConfigProvider.config({
      theme: theme === THEME.LIGHT ? lightTheme : darkTheme,
    });
  }, [theme]);

  const value: ThemeContextType = { theme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
