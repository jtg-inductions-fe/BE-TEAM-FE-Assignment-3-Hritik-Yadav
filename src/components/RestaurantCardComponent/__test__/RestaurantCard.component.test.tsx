import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RestaurantCardComponent } from "../RestaurantCard.component";

import type { Restaurant } from "@/services/restaurant.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("RestaurantCard", () => {
  const restaurant: Restaurant = {
    id: "1",
    name: "Testaurant",
    openingTime: "09:00",
    closingTime: "21:00",
    status: "active",
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("displays restaurant details", () => {
    render(
      <RestaurantCardComponent restaurant={restaurant} onUpdate={jest.fn()} onDelete={jest.fn()} />,
    );

    expect(screen.getByText(restaurant.name)).toBeVisible();
    expect(screen.getByText(restaurant.status)).toBeVisible();
    expect(screen.getByText("Opens at 09:00")).toBeVisible();
    expect(screen.getByText("Closes at 21:00")).toBeVisible();
  });

  test("navigates to restaurant items when view items is clicked", async () => {
    const user = userEvent.setup();

    render(
      <RestaurantCardComponent restaurant={restaurant} onUpdate={jest.fn()} onDelete={jest.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "View Items" }));

    expect(mockNavigate).toHaveBeenCalledWith(`/restaurant/${restaurant.id}/mnu-items`);
  });

  test("invokes update and delete handlers", async () => {
    const user = userEvent.setup();
    const onUpdate = jest.fn();
    const onDelete = jest.fn();

    render(
      <RestaurantCardComponent restaurant={restaurant} onUpdate={onUpdate} onDelete={onDelete} />,
    );

    await user.click(screen.getByRole("button", { name: "Update" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onUpdate).toHaveBeenCalledWith(restaurant);
    expect(onDelete).toHaveBeenCalledWith(restaurant);
  });
});
