import React from "react";
import Title from "antd/lib/typography/Title";

import app from "@/firebase/firebase";

const TestPage: React.FC = () => {
  console.log("firebase connected", app.name);
  return (
    <>
      <Title level={1}>Konnichiwa</Title>; Firebase Connected!!
    </>
  );
};

export default TestPage;
