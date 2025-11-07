import React from "react";
import { Route, Routes } from "react-router-dom";

import { ROUTES_URL } from "./routes.const";

import { TestPage } from "@/pages";
import { NotFoundPage } from "@/pages";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES_URL.TEST_ROUTE} element={<TestPage />} />
      <Route path={ROUTES_URL.ROUTE_NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};
