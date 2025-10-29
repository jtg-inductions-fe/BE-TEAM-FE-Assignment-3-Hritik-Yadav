import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/Routes";
import { store } from "./store";
import { Provider } from "react-redux";
import { ThemeProvider } from "./context/ThemeContext";

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};
