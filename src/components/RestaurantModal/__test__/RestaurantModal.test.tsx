import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Restaurant } from "@/services/restaurant.type";
import { DeleteConfirmModal } from "../DeleteConfirmModal";
import { RestaurantFormModal } from "../RestaurantFormModal";


describe("RestaurantFormModal", () => {
  const defaultProps = {
    open: true,
    mode: "create" as const,
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("submits the transformed payload when valid", async () => {
    const user = userEvent.setup();

    render(
      <RestaurantFormModal
        open={defaultProps.open}
        mode={defaultProps.mode}
        onCancel={defaultProps.onCancel}
        onSubmit={defaultProps.onSubmit}
      />,
    );

    await user.type(screen.getByPlaceholderText("Restaurant name"), "Fresh Bites");
    await user.click(screen.getByRole("radio", { name: "Inactive" }));
    await user.click(screen.getByRole("button", { name: "OK" }));

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        name: "Fresh Bites",
        openingTime: "08:00",
        closingTime: "22:00",
        status: "inactive",
      });
    });
  });

  test("shows validation feedback when required fields are missing", async () => {
    const user = userEvent.setup();

    render(
      <RestaurantFormModal
        open={defaultProps.open}
        mode={defaultProps.mode}
        onCancel={defaultProps.onCancel}
        onSubmit={defaultProps.onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "OK" }));

    expect(await screen.findByText("Name is required")).toBeVisible();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  test("pre-populates values in update mode and handles cancel", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const initial: Partial<Restaurant> = {
      id: "42",
      name: "Cafe Delight",
      openingTime: "10:00",
      closingTime: "20:00",
      status: "inactive",
    };

    render(
      <RestaurantFormModal
        open
        mode="update"
        initial={initial}
        onCancel={onCancel}
        onSubmit={defaultProps.onSubmit}
      />,
    );

    expect(screen.getByText("Update Restaurant")).toBeVisible();
    expect(screen.getByDisplayValue("Cafe Delight")).toBeVisible();
    expect(screen.getByDisplayValue("10:00")).toBeVisible();
    expect(screen.getByDisplayValue("20:00")).toBeVisible();
    expect(screen.getByRole("radio", { name: "Inactive" })).toBeChecked();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

describe("DeleteConfirmModal", () => {
  const restaurant: Restaurant = {
    id: "5",
    name: "Sample Place",
    openingTime: "07:30",
    closingTime: "23:30",
    status: "active",
  };

  test("renders prompt with restaurant name and reacts to actions", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    render(
      <DeleteConfirmModal
        open
        restaurant={restaurant}
        onCancel={onCancel}
        onConfirm={onConfirm}
        loading={false}
      />,
    );

    expect(screen.getByText("Delete Restaurant")).toBeVisible();
    expect(
      screen.getByText(
        "Are you sure you want to delete Sample Place? This action cannot be undone.",
      ),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
