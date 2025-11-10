import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { VerificationComponent } from "../Verification.component";

describe("test Verification component", () => {
  test("renders basic info and hint", () => {
    render(
      <VerificationComponent
        title="Verify your email"
        subtitle="Please check your inbox for a verification link."
      />,
    );

    expect(screen.getByText("Verify your email")).toBeVisible();
    expect(screen.getByText("Please check your inbox for a verification link.")).toBeVisible();

    expect(
      screen.getByText(
        "If you didn't receive an email, check your spam folder or try signing up again.",
      ),
    ).toBeVisible();

    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Resend verification email" })).toBeNull();
  });

  test("test shows and triggers Retry button when onRetry provided", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    render(
      <VerificationComponent
        title="Verification failed"
        subtitle="Something went wrong."
        onRetry={onRetry}
      />,
    );

    const retryBtn = screen.getByRole("button", { name: "Retry" });
    expect(retryBtn).toBeVisible();

    await user.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test("test shows and triggers Resend button when onResend provided", async () => {
    const user = userEvent.setup();
    const onResend = jest.fn();
    render(
      <VerificationComponent
        title="Email not verified"
        subtitle="You need to verify your email."
        onResend={onResend}
      />,
    );

    const resendBtn = screen.getByRole("button", { name: "Resend verification email" });
    expect(resendBtn).toBeVisible();

    await user.click(resendBtn);
    expect(onResend).toHaveBeenCalledTimes(1);
  });

  test("test shows both buttons and both are clickable when both handlers provided", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    const onResend = jest.fn();
    render(
      <VerificationComponent
        title="Action required"
        subtitle="Please verify or try again."
        onRetry={onRetry}
        onResend={onResend}
      />,
    );

    const retryBtn = screen.getByRole("button", { name: "Retry" });
    const resendBtn = screen.getByRole("button", { name: "Resend verification email" });

    expect(retryBtn).toBeVisible();
    expect(resendBtn).toBeVisible();

    await user.click(retryBtn);
    await user.click(resendBtn);

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onResend).toHaveBeenCalledTimes(1);
  });
});
