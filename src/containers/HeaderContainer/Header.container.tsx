import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";

import { app } from "@/firebase/firebase";
import { HeaderComponent } from "@/components";
import { useAuthContext } from "@/context/AuthContext";
import { ROUTES_URL } from "@/routes/routes.const";
import { openRestaurantFormModal } from "@store/actions/modal.actions";
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
  const { authUser, isAuthLoading, userName } = useAuthContext();
  const isAuthenticate = !!authUser && !isAuthLoading;

  const logout = async () => {
    try {
      await auth.signOut();
      message.success("Logout Successfully");
      navigate(ROUTES_URL.LOGIN);
    } catch (error) {
      const errorMessage = resolveError({ error, FirebaseErrorMessage: "Logout Failed" });
      message.error(errorMessage);
    }
  };

  return (
    <HeaderComponent
      logout={logout}
      isAllowedPage={isAllowedPage}
      isAuthenticate={isAuthenticate}
      onCreateRestaurant={() => dispatch(openRestaurantFormModal())}
      userName={userName}
    />
  );
};
