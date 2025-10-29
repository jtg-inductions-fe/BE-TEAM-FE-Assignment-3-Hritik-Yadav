import { ReactNode } from "react";
import { THEME } from "./context.const";

export interface ThemeProviderProps {
  children: ReactNode;
}

export type Theme = typeof THEME.LIGHT | typeof THEME.DARK;

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
