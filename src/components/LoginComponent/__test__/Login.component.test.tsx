import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { LoginComponent } from "../Login.component";

describe("test Login component", () => {
  test("test rendering of the login component", () => {
    render(
      <MemoryRouter>
        <LoginComponent onSubmit={() => {}} />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText("you@example.com")).toBeVisible();
    expect(screen.getByPlaceholderText("Password")).toBeVisible();
    expect(screen.getByRole("button", { name: "Log in" })).toBeVisible();
    expect(screen.getByText("Don't have an account?")).toBeVisible();
    expect(screen.getByText("Sign up")).toBeVisible();
  });

  test("test shows validation errors on submit with empty fields", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginComponent onSubmit={() => {}} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByText("Email is required")).toBeVisible();
    expect(screen.getByText("Password is required")).toBeVisible();
  });

  test("test show validation error on empty email and empty password", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginComponent onSubmit={() => {}} />
      </MemoryRouter>,
    );
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("Password");
    await user.click(emailInput);
    await user.click(passwordInput);
    expect(await screen.findByText("Email is required")).toBeVisible();
    await user.click(emailInput);
    expect(await screen.findByText("Password is required")).toBeVisible();
  });

  test("test show validation error on wrong email and disabled button", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginComponent onSubmit={() => {}} />
      </MemoryRouter>,
    );
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("Password");

    await userEvent.type(emailInput, "test");
    await user.click(passwordInput);

    expect(await screen.findByText("Invalid email")).toBeVisible();
    expect(screen.getByRole("button", { name: "Log in" })).toBeDisabled();
  });

  test("test login button and form submission", async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();
    render(
      <MemoryRouter>
        <LoginComponent onSubmit={mockOnSubmit} />
      </MemoryRouter>,
    );
    const emailInput = screen.getByPlaceholderText("you@example.com");
    const passwordInput = screen.getByPlaceholderText("Password");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    const loginButton = screen.getByRole("button", { name: "Log in" });

    await waitFor(() => {
      expect(loginButton).toBeEnabled();
    });

    await user.click(loginButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });
});
