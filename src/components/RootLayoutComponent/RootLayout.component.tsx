import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";

import { HeaderContainer } from "@/containers";

import "./rootLayout.component.style.scss";

const { Content } = Layout;

export const RootLayoutComponent: React.FC = () => {
  return (
    <Layout className="page">
      <HeaderContainer />
      <Content className="page__content">
        <Outlet />
      </Content>
    </Layout>
  );
};
