import React from "react";
import { Route, Routes } from "react-router-dom";

import { ROUTES_URL } from "./routes.const";
import {
  NotFoundPage,
  SignupPage,
  VerificationPage,
  LoginPage,
  HomePage,
  AdminPage,
} from "@/pages";
import { ProtectedRoute, PublicRoute, RootLayout } from "@/components";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES_URL.HOME} element={<RootLayout />}>
        <Route element={<PublicRoute />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTES_URL.SIGNUP} element={<SignupPage />} />
          <Route path={ROUTES_URL.LOGIN} element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES_URL.CONFIRMATION} element={<VerificationPage />} />
          <Route path={ROUTES_URL.ADMIN} element={<AdminPage />} />
        </Route>
      </Route>
      <Route path={ROUTES_URL.ROUTE_NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};
