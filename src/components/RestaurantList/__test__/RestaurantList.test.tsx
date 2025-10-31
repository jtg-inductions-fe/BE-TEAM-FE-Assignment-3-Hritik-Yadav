import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Restaurant } from "@/services/restaurant.type";
import { RestaurantList } from "../RestaurantList";

const mockRestaurantCard = jest.fn(({ restaurant, onUpdate, onDelete }: any) => (
  <div data-testid={`restaurant-card-${restaurant.id}`}>
    <span>{restaurant.name}</span>
    <button onClick={onUpdate}>update card</button>
    <button onClick={onDelete}>delete card</button>
  </div>
));

jest.mock("@/components", () => {
  const actual = jest.requireActual("@/components");
  return {
    ...actual,
    RestaurantCard: (props: any) => mockRestaurantCard(props),
  };
});

jest.mock("react-infinite-scroll-component", () => ({
  __esModule: true,
  default: ({ children, next, loader, endMessage, hasMore }: any) => (
    <div>
      <button data-testid="load-more-trigger" onClick={next}>
        load more
      </button>
      <div data-testid="infinite-content">{children}</div>
      {loader}
      {!hasMore && endMessage}
    </div>
  ),
}));

describe("RestaurantList", () => {
  const baseProps = {
    loading: false,
    loadingMore: false,
    hasMore: false,
    loadMore: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  };

  const restaurants: Restaurant[] = [
    { id: "1", name: "First", openingTime: "09:00", closingTime: "21:00", status: "active" },
    { id: "2", name: "Second", openingTime: "10:00", closingTime: "22:00", status: "inactive" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders a spinner while loading", () => {
    const { container } = render(
      <RestaurantList
        items={[]}
        loading={true}
        loadingMore={false}
        hasMore={false}
        loadMore={baseProps.loadMore}
        onUpdate={baseProps.onUpdate}
        onDelete={baseProps.onDelete}
      />,
    );

    expect(container.querySelector(".ant-spin")).toBeVisible();
  });

  test("renders empty state when no restaurant is available", () => {
    render(
      <RestaurantList
        items={[]}
        loading={false}
        loadingMore={false}
        hasMore={false}
        loadMore={baseProps.loadMore}
        onUpdate={baseProps.onUpdate}
        onDelete={baseProps.onDelete}
      />,
    );

    expect(screen.getByText("No restaurant found")).toBeVisible();
  });

  test("renders provided restaurants", () => {
    render(
      <RestaurantList
        items={restaurants}
        loading={false}
        loadingMore={false}
        hasMore={true}
        loadMore={baseProps.loadMore}
        onUpdate={baseProps.onUpdate}
        onDelete={baseProps.onDelete}
      />,
    );

    expect(mockRestaurantCard).toHaveBeenCalledTimes(restaurants.length);
    restaurants.forEach(({ id }) => {
      expect(screen.getByTestId(`restaurant-card-${id}`)).toBeVisible();
    });
  });

  test("invokes loadMore when the infinite scroll trigger fires", async () => {
    const user = userEvent.setup();
    const loadMore = jest.fn();

    render(
      <RestaurantList
        items={restaurants}
        loading={false}
        loadingMore={false}
        hasMore={true}
        loadMore={loadMore}
        onUpdate={baseProps.onUpdate}
        onDelete={baseProps.onDelete}
      />,
    );

    await user.click(screen.getByTestId("load-more-trigger"));

    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  test("renders loader and end message states", () => {
    const { container, rerender } = render(
      <RestaurantList
        items={restaurants}
        loading={false}
        loadingMore={true}
        hasMore={true}
        loadMore={baseProps.loadMore}
        onUpdate={baseProps.onUpdate}
        onDelete={baseProps.onDelete}
      />,
    );

    expect(container.querySelector(".restaurant-list__loader")).toBeVisible();

    rerender(
      <RestaurantList
        items={restaurants}
        loading={false}
        loadingMore={false}
        hasMore={false}
        loadMore={baseProps.loadMore}
        onUpdate={baseProps.onUpdate}
        onDelete={baseProps.onDelete}
      />,
    );

    expect(screen.getByText("No more results to show")).toBeVisible();
  });

  test("proxies update and delete handlers through RestaurantCard", async () => {
    const user = userEvent.setup();
    const onUpdate = jest.fn();
    const onDelete = jest.fn();

    render(
      <RestaurantList
        items={restaurants}
        loading={false}
        loadingMore={false}
        hasMore={true}
        loadMore={baseProps.loadMore}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />,
    );

    const firstCard = screen.getByTestId("restaurant-card-1");
    await user.click(within(firstCard).getByText("update card"));
    await user.click(within(firstCard).getByText("delete card"));

    expect(onUpdate).toHaveBeenCalledWith(restaurants[0]);
    expect(onDelete).toHaveBeenCalledWith(restaurants[0]);
  });
});
