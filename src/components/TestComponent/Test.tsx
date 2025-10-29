import React from "react";

import { app } from "@/firebase/firebase";
import Title from "antd/lib/typography/Title";
import { Button, Card } from "antd";

export const Test: React.FC = () => {
  console.log("firebase connected", app.name);

  return (
    <>
      <Title level={1}>Konnichiwa - Firebase Connected!!</Title>
      <div style={{ padding: 24 }}>
        <Card title="Ant Design Demo">
          <Button type="primary">Primary Action</Button>
        </Card>
      </div>
    </>
  );
};
