import React from "react";

import { app } from "@/firebase/firebase";
import Title from "antd/lib/typography/Title";
import { Button, Card } from "antd";
import { useTheme } from "@/context/ThemeContext";

export const Test: React.FC = () => {
  console.log("firebase connected", app.name);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Title level={1}>Konnichiwa - Firebase Connected!!</Title>
      <div style={{ padding: 24 }}>
        <Card title="Theme Demo">
          <p>Current theme: {theme}</p>
          <Button type="primary" onClick={toggleTheme}>
            Toggle Theme
          </Button>
        </Card>
      </div>
    </>
  );
};
