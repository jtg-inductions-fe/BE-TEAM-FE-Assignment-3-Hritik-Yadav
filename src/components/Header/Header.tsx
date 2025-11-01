import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Layout, Typography } from "antd";

import { ROUTES_URL } from "@/routes/routes.const";
import type { HeaderProps } from "./header.type";

import "./header.style.scss";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export const Header: React.FC<HeaderProps> = ({
  logout,
  isAuthenticate,
  isAllowedPage,
  onCreateRestaurant,
}) => {
  const navigate = useNavigate();

  return (
    <AntHeader className="header">
      <Title level={3} className="header__title">
        <Link to={ROUTES_URL.HOME}>Zomato Lite</Link>
      </Title>
      {isAuthenticate ? (
        <div className="header__button">
          {onCreateRestaurant && (
            <Button type="primary" onClick={onCreateRestaurant}>
              Create Restaurant
            </Button>
          )}
          <Button type="default" onClick={logout}>
            Logout
          </Button>
        </div>
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
