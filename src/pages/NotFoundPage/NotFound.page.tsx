import React from "react";
import { Link } from "react-router-dom";
import { Result } from "antd";

import { ROUTES_URL } from "@/routes/routes.const";

export const NotFoundPage: React.FC = () => {
  return (
    <Result
      status={404}
      title={"Page Not Found"}
      subTitle={"Sorry, the page you visited does not exist."}
      extra={
        <Link type="primary" to={ROUTES_URL.HOME}>
          Go Home
        </Link>
      }
    />
  );
};
