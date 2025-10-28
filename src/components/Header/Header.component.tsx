import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Button, Layout, message, Typography } from "antd";

import { ROUTES_URL } from "@/routes/routes.const";

import "./header.style.scss";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignupPage = location.pathname === ROUTES_URL.SIGNUP;
  const isLoginPage = location.pathname === ROUTES_URL.LOGIN;
  const isVerificationPage = location.pathname === ROUTES_URL.CONFIRMATION;
  const isAllowedPage = !isSignupPage && !isLoginPage && !isVerificationPage;
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticate(!!user);
    });

    return unsubscribe;
  }, [auth]);

  const logout = async () => {
    try {
      await auth.signOut();
      message.success("Logout Successfully");
      navigate(ROUTES_URL.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
      message.error("Logout failed");
    }
  };

  return (
    <AntHeader className="header">
      <Title level={3} className="header__title">
        <Link to={ROUTES_URL.HOME}>Zomato Lite</Link>
      </Title>
      {isAuthenticate ? (
        <Button type="primary" onClick={logout}>
          Logout
        </Button>
      ) : (
        isAllowedPage && (
          <div className="header__button">
            <Button type="default" onClick={() => navigate(ROUTES_URL.SIGNUP)}>
              Signup
            </Button>
            <Button type="default" onClick={() => navigate(ROUTES_URL.LOGIN)}>
              Login
            </Button>
          </div>
        )
      )}
    </AntHeader>
  );
};

export default Header;
