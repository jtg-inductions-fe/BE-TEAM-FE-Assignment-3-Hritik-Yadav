import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { AuthProvider } from "@/context/AuthContext";
import { AppRoutes } from "./routes/Routes";
import { store } from "./store";

export const App: React.FC = () => (
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </Provider>
);
