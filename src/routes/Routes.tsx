import React from "react";
import { Route, Routes } from "react-router-dom";

import { ROUTES_URL } from "./routes.const";
import {
  NotFoundPage,
  SignupPage,
  VerificationPage,
  LoginPage,
  RestaurantPage,
  RestaurantItemsPage,
  MenuItemPage,
} from "@/pages";
import { ProtectedRouteComponent, PublicRouteComponent, RootLayoutComponent } from "@/components";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES_URL.HOME} element={<RootLayoutComponent />}>
        <Route element={<PublicRouteComponent />}>
          <Route index element={<RestaurantPage />} />
          <Route path={ROUTES_URL.SIGNUP} element={<SignupPage />} />
          <Route path={ROUTES_URL.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES_URL.VERIFICATION} element={<VerificationPage />} />
          <Route
            path={`${ROUTES_URL.RESTAURANT}/:restaurantId/${ROUTES_URL.MENU}`}
            element={<RestaurantItemsPage />}
          />
          <Route
            path={`${ROUTES_URL.RESTAURANT}/:restaurantId/${ROUTES_URL.MENU}/${ROUTES_URL.ITEM}/:menuItemId`}
            element={<MenuItemPage />}
          />
        </Route>
        <Route element={<ProtectedRouteComponent />}>
          <Route path={ROUTES_URL.VERIFICATION} element={<VerificationPage />} />
        </Route>
      </Route>
      <Route path={ROUTES_URL.ROUTE_NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};
