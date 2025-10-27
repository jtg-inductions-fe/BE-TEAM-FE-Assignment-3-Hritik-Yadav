import React from "react";
import { Button, Typography, Result, Space } from "antd";

import type { Props } from "./Verification.type";

import "./confirmation.style.scss";

const { Paragraph } = Typography;

const Confirmation: React.FC<Props> = ({ status, title, subTitle, onRetry, onResend }) => {
  const message = "If you didn't receive an email, check your spam folder or try signing up again.";
  
  return (
    <div className="confirmation-wrapper">
      <div className="confirmation-card">
        <Result
          status={status}
          title={title}
          subTitle={subTitle}
          extra={
            onRetry || onResend ? (
              <Space>
                {onRetry ? (
                  <Button type="primary" onClick={onRetry}>
                    Retry
                  </Button>
                ) : null}
                {onResend ? <Button onClick={onResend}>Resend verification email</Button> : null}
              </Space>
            ) : null
          }
        >
          <div>
            <Paragraph className="confirmation-hint">{message}</Paragraph>
          </div>
        </Result>
      </div>
    </div>
  );
};

export default Confirmation;
