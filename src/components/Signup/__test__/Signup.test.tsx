import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { Signup } from "@/components";
import { USER_ROLE } from "@services/service.const";

describe("test Signup component", () => {
  test("test rendering of the signup component", () => {
    render(
      <MemoryRouter>
        <Signup onSubmit={() => {}} />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText("Your username")).toBeVisible();
    expect(screen.getByPlaceholderText("you@example.com")).toBeVisible();
    expect(screen.getByPlaceholderText("Password")).toBeVisible();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeVisible();
    const customerRadio = screen.getByRole("radio", { name: "Customer" });
    expect(customerRadio).toBeVisible();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeVisible();
    expect(screen.getByText("Already have an account?")).toBeVisible();
    expect(screen.getByText("Log in")).toBeVisible();
  });

  test("test shows validation errors on submit with empty fields", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Signup onSubmit={() => {}} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("Name is required")).toBeVisible();
    expect(screen.getByText("Email is required")).toBeVisible();
    expect(screen.getByText("Password is required")).toBeVisible();
    expect(screen.getByText("Confirm password is required")).toBeVisible();
  });

  test("test shows validation error wrong email, password<8 confirm password not match and disabled button", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Signup onSubmit={() => {}} />
      </MemoryRouter>,
    );
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");

    await userEvent.type(emailInput, "test");
    await userEvent.type(passwordInput, "pass");
    expect(await screen.findByText("Invalid email address format")).toBeVisible();
    await userEvent.type(confirmPasswordInput, "diff");
    expect(await screen.findByText("Password must be at least 8 characters")).toBeVisible();
    await user.click(emailInput);
    expect(await screen.findByText("Passwords must match")).toBeVisible();

    expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled();
  });

  test("test login button and form submission and toast", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();
    render(
      <MemoryRouter>
        <Signup onSubmit={mockOnSubmit} />
      </MemoryRouter>,
    );

    const usernameInput = screen.getByPlaceholderText("Your username");
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");

    await userEvent.type(usernameInput, "test example");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "Password@123");
    await userEvent.type(confirmPasswordInput, "Password@123");
    const ownerRadio = screen.getByRole("radio", { name: "Owner" });
    await user.click(ownerRadio);
    const loginButton = screen.getByRole("button", { name: "Sign up" });

    await waitFor(() => {
      expect(loginButton).toBeEnabled();
    });

    await user.click(loginButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: "test example",
        email: "test@example.com",
        password: "Password@123",
        confirmPassword: "Password@123",
        role: USER_ROLE.Owner,
      });
    });
  });
});
