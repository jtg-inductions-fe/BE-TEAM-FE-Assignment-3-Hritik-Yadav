import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";

import { app } from "@/firebase/firebase";
import { HeaderComponent } from "@/components";
import { useAuthContext } from "@/context/AuthContext";
import { ROUTES_URL } from "@/routes/routes.const";
import { USER_ROLE } from "@/services/service.const";
import { openMenuItemFormModal, openRestaurantFormModal } from "@store/actions/modal.actions";
import { resolveError } from "@/utils/errorHandlers";

export const HeaderContainer: React.FC = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isSignupPage = location.pathname === ROUTES_URL.SIGNUP;
  const isLoginPage = location.pathname === ROUTES_URL.LOGIN;
  const isVerificationPage = location.pathname === ROUTES_URL.VERIFICATION;
  const isAllowedPage = !isSignupPage && !isLoginPage && !isVerificationPage;
  const { authUser, isAuthLoading, userName, role } = useAuthContext();
  const isAuthenticate = !!authUser && !isAuthLoading;
  const isMenuRoute = location.pathname.endsWith(ROUTES_URL.MENU);
  const isRestaurantRoute = location.pathname === ROUTES_URL.HOME && role === USER_ROLE.OWNER

  const logout = async () => {
    try {
      await auth.signOut();
      message.success("Logout Successfully");
      navigate(ROUTES_URL.LOGIN);
    } catch (error) {
      const errorMessage = resolveError({ error, defaultFirebaseError: "Logout Failed" });
      message.error(errorMessage);
    }
  };

  const handlePrimaryAction = () => {
    if (!isAuthenticate || !isAllowedPage) {
      return;
    }

    if (isMenuRoute) {
      dispatch(openMenuItemFormModal());
      return;
    }
    if (isRestaurantRoute) {
      dispatch(openRestaurantFormModal());
      return;
    }
  };

  const primaryActionLabel = isMenuRoute
    ? "Create Item"
    : isRestaurantRoute
      ? "Create Restaurant"
      : "";

  return (
    <HeaderComponent
      logout={logout}
      isAllowedPage={isAllowedPage}
      isAuthenticate={isAuthenticate}
      primaryActionLabel={isAuthenticate && isAllowedPage ? primaryActionLabel : undefined}
      onPrimaryAction={isAuthenticate && isAllowedPage ? handlePrimaryAction : undefined}
      userName={userName}
    />
  );
};
