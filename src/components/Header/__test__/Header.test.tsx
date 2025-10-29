import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { message } from "antd";

import { Header } from "../Header.component";

const mockedGetAuth = getAuth as jest.Mock;
const mockedOnAuthStateChanged = onAuthStateChanged as jest.Mock;
const mockSignOut = jest.fn(() => Promise.resolve());

type MockUser = {
  uid: string;
  email: string;
};

const mockAuthObject: { currentUser: MockUser | null; signOut: jest.Mock } = {
  currentUser: null,
  signOut: mockSignOut,
};

const mockUser = {
  uid: "test-user-123",
  email: "test@example.com",
};

const setLoggedInState = () => {
  mockAuthObject.currentUser = mockUser;
  mockedGetAuth.mockReturnValue(mockAuthObject);

  mockedOnAuthStateChanged.mockImplementation((auth, callback) => {
    callback(mockUser);
    return jest.fn();
  });
};

const setLoggedOutState = () => {
  mockAuthObject.currentUser = null;
  mockedGetAuth.mockReturnValue(mockAuthObject);

  mockedOnAuthStateChanged.mockImplementation((auth, callback) => {
    callback(null);
    return jest.fn();
  });
};

describe("Header testing", () => {
  beforeEach(() => {
    mockedGetAuth.mockClear();
    mockedOnAuthStateChanged.mockClear();
    mockSignOut.mockClear();
    (message.success as jest.Mock).mockClear();

    setLoggedOutState();
  });

  test("renders the Home page header for the default route and test logo", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText("Zomato Lite")).toBeVisible();
    expect(screen.getByText("Signup")).toBeVisible();
    expect(screen.getByText("Login")).toBeVisible();
  });

  test.each([
    { route: "/login", routeName: "Login" },
    { route: "/signup", routeName: "Signup" },
    { route: "/confirm", routeName: "Confirmation" },
  ])("hides Login and Signup buttons on $routeName route", ({ route }) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Signup")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  test('renders "Logout" button when user is logged in', () => {
    setLoggedInState();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText("Logout")).toBeVisible();
    expect(screen.queryByText("Signup")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  test("renders Logout button working on click", async () => {
    const user = userEvent.setup();
    setLoggedInState();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header />
      </MemoryRouter>,
    );

    const logoutButton = screen.getByText("Logout");
    await user.click(logoutButton);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith("Logout Successfully");
    });
  });
});
