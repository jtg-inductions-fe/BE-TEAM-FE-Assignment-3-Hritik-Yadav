import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES_URL } from "./routes.const";
import NotFoundPage from "@pages/NotFoundPage/NotFound.page";
import { TestPage } from "@pages/TestPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES_URL.TEST_ROUTE} element={<TestPage />} />
      <Route path={ROUTES_URL.ROUTE_NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
