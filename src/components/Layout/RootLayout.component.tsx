import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Header } from "@/components";
import { setUser, clearUser } from "@/store/actions/actions";
import { getUserDetails } from "@/services";
import { selectUser } from "@/store/selectors/selector";

import "./rootLayout.style.scss";

const { Content } = Layout;

export const RootLayout: React.FC = () => {
  const dispatch = useDispatch();
  const userState = useSelector(selectUser);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        dispatch(clearUser());
        return;
      }
      try {
        if (!userState) {
          const token = await user.getIdToken(true);
          if (token) {
            const resp = await getUserDetails(token);
            if (resp?.data) {
              dispatch(setUser(resp.data));
            }
          }
        }
      } catch (e) {
        console.error("User fetch failed", e);
      }
    });
    return () => unsubscribe();
  }, [dispatch, userState]);
  return (
    <Layout className="page">
      <Header />
      <Content className="page__content">
        <Outlet />
      </Content>
    </Layout>
  );
};
