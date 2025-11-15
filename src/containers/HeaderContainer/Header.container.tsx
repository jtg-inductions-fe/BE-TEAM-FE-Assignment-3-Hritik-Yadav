import React, { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";

import { app } from "@/firebase/firebase";
import { HeaderComponent } from "@/components";
import { useAuthContext } from "@/context/AuthContext";
import { ROUTES_URL } from "@/routes/routes.const";
import { selectCartItems } from "@/store/selectors/selector";
import { USER_ROLE } from "@/services/service.const";
import { openMenuItemFormModal, openRestaurantFormModal } from "@store/actions/modal.actions";
import { resolveError } from "@/utils/errorHandlers";
import { clearCart } from "@/store/actions/cart.actions";

export const HeaderContainer: React.FC = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const { authUser, isAuthLoading, userName, role } = useAuthContext();
  const isOwner = role === USER_ROLE.OWNER;
  const isCustomer = role === USER_ROLE.CUSTOMER;
  const isSignupPage = location.pathname === ROUTES_URL.SIGNUP;
  const isLoginPage = location.pathname === ROUTES_URL.LOGIN;
  const isVerificationPage = location.pathname === ROUTES_URL.VERIFICATION;
  const isAllowedPage = !isSignupPage && !isLoginPage && !isVerificationPage;
  const isAuthenticate = !!authUser && !isAuthLoading;
  const isMenuRoute = location.pathname.endsWith(ROUTES_URL.MENU) && isOwner;
  const isRestaurantRoute = location.pathname === ROUTES_URL.HOME && isOwner;
  const isCartRoute = isAllowedPage && location.pathname !== ROUTES_URL.CART && isCustomer;

  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const logout = async () => {
    try {
      await auth.signOut();
      dispatch(clearCart());
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

  const handleCartNavigate = useCallback(() => {
    navigate(ROUTES_URL.CART);
  }, [navigate]);

  return (
    <HeaderComponent
      logout={logout}
      isAllowedPage={isAllowedPage}
      isAuthenticate={isAuthenticate}
      primaryActionLabel={isAuthenticate && isAllowedPage ? primaryActionLabel : undefined}
      onPrimaryAction={isAuthenticate && isAllowedPage ? handlePrimaryAction : undefined}
      userName={userName}
      onCartNavigate={isCartRoute ? handleCartNavigate : undefined}
      cartItemCount={isCartRoute ? cartItemCount : undefined}
    />
  );
};
