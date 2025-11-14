import React from "react";
import { Button, Typography, Result, Space } from "antd";

import type { VerificationProps } from "./Verification.type";

import "./verification.style.scss";

const { Paragraph } = Typography;

export const VerificationComponent: React.FC<VerificationProps> = ({
  title,
  subtitle,
  onRetry,
  onResend,
}) => {
  return (
    <div className="verification">
      <div className="verification__card">
        <Result
          className="verification__result"
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
            <Paragraph className="verification__hint">
              If you didn&apos;t receive an email, check your spam folder or try signing up again.
            </Paragraph>
          </div>
        </Result>
      </div>
    </div>
  );
};
