import React from "react";
import { Button, Typography, Result, Space } from "antd";

import type { VerificationProps } from "./Verification.type";

import "./verification.style.scss";

const { Paragraph } = Typography;

export const Verification: React.FC<VerificationProps> = ({
  title,
  subtitle,
  onRetry,
  onResend,
}) => {
  const message = "If you didn't receive an email, check your spam folder or try signing up again.";

  return (
    <div className="confirmation-wrapper">
      <div className="confirmation-card">
        <Result
          title={title}
          subTitle={subtitle}
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
