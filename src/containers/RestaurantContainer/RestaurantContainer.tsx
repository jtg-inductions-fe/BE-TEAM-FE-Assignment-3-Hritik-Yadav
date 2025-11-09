import React, { useCallback, useEffect, useState } from "react";
import { Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { useAuthContext } from "@/context/AuthContext";
import { RestaurantList, RestaurantFormModal, DeleteConfirmModal, AppLoader } from "@/components";
import {
  createRestaurant,
  deleteRestaurant,
  listRestaurants,
  updateRestaurant,
} from "@services/restaurant.service";
import {
  selectIsRestaurantFormModalOpen,
  selectRestaurantNextPageToken,
} from "@store/selectors/selector";
import {
  clearRestaurantPagination,
  closeRestaurantFormModal,
  setRestaurantNextToken,
} from "@store/actions/actions";

import type { Restaurant, RestaurantPayload } from "@/services/restaurant.type";

import "./restaurantContainer.style.scss";
import { resolveAxiosErrorMessage } from "@/utils/helper";

const { Title } = Typography;
const PAGE_SIZE = 12;

export const RestaurantContainer: React.FC = () => {
  const dispatch = useDispatch();
  const nextPageToken = useSelector(selectRestaurantNextPageToken);
  const { authUser, isAuthLoading } = useAuthContext();

  const [items, setItems] = useState<Restaurant[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Restaurant | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Restaurant | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const isCreateModalOpen = useSelector(selectIsRestaurantFormModalOpen);

  // to provide consistent token to all functions
  const getAuthToken = useCallback(async (): Promise<string | null> => {
    if (!authUser) {
      message.error("Authentication required");
      return null;
    }

    try {
      return await authUser.getIdToken();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to resolve authentication token";
      message.error(errorMessage);
      return null;
    }
  }, [authUser]);

  // restaurant list function to fetch list
  const fetchPage = useCallback(
    async (append: boolean, cursorId?: string | null) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const token = await getAuthToken();
      if (!token) {
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      try {
        const response = await listRestaurants(token, {
          perPage: PAGE_SIZE,
          nextPageToken: cursorId ?? null,
        });
        const fetchedItems = response.data?.items ?? [];
        setItems((previousItems) => (append ? [...previousItems, ...fetchedItems] : fetchedItems));

        const nextToken = response.data?.nextPageToken ?? null;
        dispatch(setRestaurantNextToken(nextToken));
        setHasMore(!!nextToken);
      } catch (error) {
        const errorMessage = resolveAxiosErrorMessage(error, "Failed to load restaurants");
        message.error(errorMessage);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [dispatch, getAuthToken],
  );

  useEffect(() => {
    if (!authUser) {
      setItems([]);
      dispatch(clearRestaurantPagination());
      setHasMore(true);
      return;
    }

    setItems([]);
    dispatch(clearRestaurantPagination());
    setHasMore(true);

    fetchPage(false, null);
  }, [authUser, dispatch, fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) {
      return;
    }
    fetchPage(true, nextPageToken);
  }, [fetchPage, hasMore, loading, loadingMore, nextPageToken]);

  // handles creation of restaurant
  const handleCreate = async (values: RestaurantPayload) => {
    const token = await getAuthToken();
    if (!token) {
      message.error("Auth Token Not found");
      return;
    }

    const ownerId = authUser?.uid;
    if (!ownerId) {
      message.error("Missing owner id");
      return;
    }

    try {
      const response = await createRestaurant(token, {
        ...values,
        ownerId,
      });
      const createdRestaurant = response.data;
      if (createdRestaurant) {
        setItems((previousItems) => [createdRestaurant, ...previousItems]);
      }
      message.success("Restaurant created");
      dispatch(closeRestaurantFormModal());
    } catch (error) {
      const errorMessage = resolveAxiosErrorMessage(error, "Create failed");
      message.error(errorMessage);
    }
  };

  // handles updation of restaurant
  const handleUpdate = async (values: RestaurantPayload) => {
    if (!editTarget) {
      return;
    }

    const token = await getAuthToken();
    if (!token) {
      message.error("Auth Token Not found");
      return;
    }

    try {
      const response = await updateRestaurant(token, editTarget.id, values);
      const updatedRestaurant = response.data;
      if (updatedRestaurant) {
        setItems((previousItems) =>
          previousItems.map((restaurantItem) =>
            restaurantItem.id === updatedRestaurant.id ? updatedRestaurant : restaurantItem,
          ),
        );
      }
      message.success("Restaurant updated");
      setEditOpen(false);
      setEditTarget(null);
    } catch (error) {
      const errorMessage = resolveAxiosErrorMessage(error, "Update failed");
      message.error(errorMessage);
    }
  };

  // handles deletion of restaurant
  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    const token = await getAuthToken();
    if (!token) {
      return;
    }

    try {
      setDeleteLoading(true);
      await deleteRestaurant(token, deleteTarget.id);
      setItems((previousItems) =>
        previousItems.filter((restaurantItem) => restaurantItem.id !== deleteTarget.id),
      );
      message.success("Restaurant deleted");
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      const errorMessage = resolveAxiosErrorMessage(error, "Delete failed");
      message.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isAuthLoading) {
    return <AppLoader />;
  }

  return (
    <section className="restaurant-container">
      <header className="restaurant-container__heading">
        <Title level={2} className="restaurant-container__heading-title">
          Your Restaurants
        </Title>
      </header>
      <RestaurantList
        items={items}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        loadMore={loadMore}
        onUpdate={(restaurantItem) => {
          setEditTarget(restaurantItem);
          setEditOpen(true);
        }}
        onDelete={(restaurantItem) => {
          setDeleteTarget(restaurantItem);
          setDeleteOpen(true);
        }}
      />

      <RestaurantFormModal
        open={isCreateModalOpen}
        mode="create"
        onCancel={() => dispatch(closeRestaurantFormModal())}
        onSubmit={handleCreate}
      />

      <RestaurantFormModal
        open={editOpen}
        mode="update"
        initial={editTarget ?? undefined}
        onCancel={() => {
          setEditOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleUpdate}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        restaurant={deleteTarget ?? undefined}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </section>
  );
};
