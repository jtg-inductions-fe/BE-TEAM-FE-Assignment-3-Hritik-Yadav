import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { Header } from "@/components";

describe("Header", () => {
  test("shows signup and login buttons when user is not authenticated and page is allowed", () => {
    const logout = jest.fn();

    render(
      <MemoryRouter>
        <Header logout={logout} isAuthenticate={false} isAllowedPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Zomato Lite")).toBeVisible();
    expect(screen.getByText("Signup")).toBeVisible();
    expect(screen.getByText("Login")).toBeVisible();
  });

  test("hides auth actions when page is not allowed", () => {
    const logout = jest.fn();

    render(
      <MemoryRouter>
        <Header logout={logout} isAuthenticate={false} isAllowedPage={false} />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Signup")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  test("shows logout button when user is authenticated", () => {
    const logout = jest.fn();

    render(
      <MemoryRouter>
        <Header logout={logout} isAuthenticate isAllowedPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Logout")).toBeVisible();
    expect(screen.queryByText("Signup")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  test("calls logout handler when logout button is clicked", async () => {
    const user = userEvent.setup();
    const logout = jest.fn();

    render(
      <MemoryRouter>
        <Header logout={logout} isAuthenticate isAllowedPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByText("Logout"));

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
