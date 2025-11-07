import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";

import { app } from "@/firebase/firebase";
import { Header } from "@/components";
import { useAuthContext } from "@/context/AuthContext";
import { ROUTES_URL } from "@/routes/routes.const";
import { openRestaurantFormModal } from "@store/actions/actions";

export const HeaderContainer: React.FC = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isSignupPage = location.pathname === ROUTES_URL.SIGNUP;
  const isLoginPage = location.pathname === ROUTES_URL.LOGIN;
  const isVerificationPage = location.pathname === ROUTES_URL.CONFIRMATION;
  const isAllowedPage = !isSignupPage && !isLoginPage && !isVerificationPage;
  const { authUser, isAuthLoading } = useAuthContext();
  const isAuthenticate = !!authUser && !isAuthLoading;

  const logout = async () => {
    try {
      await auth.signOut();
      message.success("Logout Successfully");
      navigate(ROUTES_URL.LOGIN);
    } catch {
      message.error("Logout failed");
    }
  };

  return (
    <Header
      logout={logout}
      isAllowedPage={isAllowedPage}
      isAuthenticate={isAuthenticate}
      onCreateRestaurant={() => dispatch(openRestaurantFormModal())}
    />
  );
};
