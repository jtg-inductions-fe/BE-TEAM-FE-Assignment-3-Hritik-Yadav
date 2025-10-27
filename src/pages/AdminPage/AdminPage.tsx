import React, { useEffect } from "react";
import { message } from "antd";

const AdminPage: React.FC = () => {
  // testing message
  useEffect(() => {
    message.success("Hello world!");
  }, []);

  return <div>AdminPage</div>;
};

export default AdminPage;
