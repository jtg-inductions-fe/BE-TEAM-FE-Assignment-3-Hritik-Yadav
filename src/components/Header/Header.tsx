import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Dropdown, Layout, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

import { ROUTES_URL } from "@/routes/routes.const";

import type { HeaderProps } from "./header.type";

import "./header.style.scss";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export const Header: React.FC<HeaderProps> = ({
  logout,
  isAuthenticate,
  isAllowedPage,
  userName,
}) => {
  const navigate = useNavigate();

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      logout();
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "logout",
      label: "Logout",
    },
  ];

  return (
    <AntHeader className="header">
      <Title level={3} className="header__title">
        <Link to={ROUTES_URL.HOME}>Zomato Lite</Link>
      </Title>
      {isAuthenticate ? (
        <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }}>
          <Button type="default" className="header__user-button">
            <span className="header__user-label">{userName ?? "Account"}</span>
            <DownOutlined />
          </Button>
        </Dropdown>
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
