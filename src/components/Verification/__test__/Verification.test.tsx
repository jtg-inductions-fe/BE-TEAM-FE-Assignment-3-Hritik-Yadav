import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Verification from "../Verification";

describe("test Verification component", () => {
  test("renders basic info and hint", () => {
    render(
      <Verification
        status="info"
        title="Verify your email"
        subTitle="Please check your inbox for a verification link."
      />,
    );

    expect(screen.getByText("Verify your email")).toBeVisible();
    expect(screen.getByText("Please check your inbox for a verification link.")).toBeVisible();

    const message =
      "If you didn't receive an email, check your spam folder or try signing up again.";
    expect(screen.getByText(message)).toBeVisible();

    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Resend verification email" })).toBeNull();
  });

  test(" test shows and triggers Retry button when onRetry provided", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    render(
      <Verification
        status="error"
        title="Verification failed"
        subTitle="Something went wrong."
        onRetry={onRetry}
      />,
    );

    const retryBtn = screen.getByRole("button", { name: "Retry" });
    expect(retryBtn).toBeVisible();

    await user.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test("shows and triggers Resend button when onResend provided", async () => {
    const user = userEvent.setup();
    const onResend = jest.fn();
    render(
      <Verification
        status="warning"
        title="Email not verified"
        subTitle="You need to verify your email."
        onResend={onResend}
      />,
    );

    const resendBtn = screen.getByRole("button", { name: "Resend verification email" });
    expect(resendBtn).toBeVisible();

    await user.click(resendBtn);
    expect(onResend).toHaveBeenCalledTimes(1);
  });

  test("shows both buttons and both are clickable when both handlers provided", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();
    const onResend = jest.fn();
    render(
      <Verification
        status="warning"
        title="Action required"
        subTitle="Please verify or try again."
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
