import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";

import { HeaderContainer } from "@/containers";

import "./rootLayout.style.scss";

const { Content } = Layout;

export const RootLayout: React.FC = () => {
  return (
    <Layout className="page">
      <HeaderContainer />
      <Content className="page__content">
        <Outlet />
      </Content>
    </Layout>
  );
};
