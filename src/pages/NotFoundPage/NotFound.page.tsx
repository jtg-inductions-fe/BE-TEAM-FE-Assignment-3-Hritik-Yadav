import React from "react";
import { Link } from "react-router-dom";
import { Result } from "antd";

import { ROUTES_URL } from "@/routes/routes.const";

import { NOT_FOUND_STATUS, NOT_FOUND_SUBTITLE } from "./notFound.const";

export const NotFoundPage: React.FC = () => {
  return (
    <Result
      status={NOT_FOUND_STATUS}
      title={NOT_FOUND_STATUS}
      subTitle={NOT_FOUND_SUBTITLE}
      extra={
        <Link type="primary" to={ROUTES_URL.HOME}>
          Go Home
        </Link>
      }
    />
  );
};
