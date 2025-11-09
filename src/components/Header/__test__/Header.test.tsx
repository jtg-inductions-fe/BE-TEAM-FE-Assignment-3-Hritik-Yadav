import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { Header } from "@/components";

describe("Header", () => {
  test("shows signup and login buttons when user is not authenticated and page is allowed", () => {
    const logout = jest.fn();
    const onPrimaryAction = jest.fn();

    render(
      <MemoryRouter>
        <Header
          logout={logout}
          isAuthenticate={false}
          isAllowedPage
          primaryActionLabel="Create Restaurant"
          onPrimaryAction={onPrimaryAction}
          userName={null}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Zomato Lite")).toBeVisible();
    expect(screen.getByText("Signup")).toBeVisible();
    expect(screen.getByText("Login")).toBeVisible();
    expect(screen.queryByText("Create Restaurant")).not.toBeInTheDocument();
  });

  test("hides auth actions when page is not allowed", () => {
    const logout = jest.fn();
    const onPrimaryAction = jest.fn();

    render(
      <MemoryRouter>
        <Header
          logout={logout}
          isAuthenticate={false}
          isAllowedPage={false}
          primaryActionLabel="Create Restaurant"
          onPrimaryAction={onPrimaryAction}
          userName={null}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Signup")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.queryByText("Create Restaurant")).not.toBeInTheDocument();
  });

  test("shows logout button when user is authenticated", () => {
    const logout = jest.fn();
    const onPrimaryAction = jest.fn();

    render(
      <MemoryRouter>
        <Header
          logout={logout}
          isAuthenticate
          isAllowedPage
          primaryActionLabel="Create Restaurant"
          onPrimaryAction={onPrimaryAction}
          userName="Test User"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test User")).toBeVisible();
    expect(screen.getByText("Create Restaurant")).toBeVisible();
    expect(screen.queryByText("Signup")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  test("calls logout handler when logout button is clicked", async () => {
    const user = userEvent.setup();
    const logout = jest.fn();
    const onPrimaryAction = jest.fn();

    render(
      <MemoryRouter>
        <Header
          logout={logout}
          isAuthenticate
          isAllowedPage
          primaryActionLabel="Create Restaurant"
          onPrimaryAction={onPrimaryAction}
          userName="Test User"
        />
      </MemoryRouter>,
    );

    const userMenuButton = screen.getByRole("button", { name: /Test User/i });
    await user.hover(userMenuButton);
    const logoutAction = await screen.findByRole("menuitem", { name: "Logout" });
    await user.click(logoutAction);

    expect(logout).toHaveBeenCalledTimes(1);
  });

  test("invokes create restaurant handler when button is clicked", async () => {
    const user = userEvent.setup();
    const logout = jest.fn();
    const onPrimaryAction = jest.fn();

    render(
      <MemoryRouter>
        <Header
          logout={logout}
          isAuthenticate
          isAllowedPage
          primaryActionLabel="Create Restaurant"
          onPrimaryAction={onPrimaryAction}
          userName={null}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByText("Create Restaurant"));

    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    expect(logout).not.toHaveBeenCalled();
  });
});
