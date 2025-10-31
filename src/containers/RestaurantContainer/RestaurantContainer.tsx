import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Typography, Button, message } from "antd";
import { getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";

import { RestaurantList, RestaurantFormModal, DeleteConfirmModal, Loading } from "@/components";
import { getUserDetails } from "@/services/user.service";
import {
  createRestaurant,
  deleteRestaurant,
  listRestaurants,
  updateRestaurant,
} from "@/services/restaurant.service";
import { selectRestaurantNextPageToken, selectUser } from "@/store/selectors/selector";
import {
  clearRestaurantPagination,
  setRestaurantNextToken,
  setUser,
} from "@/store/actions/actions";
import type { Restaurant, RestaurantPayload } from "@/services/restaurant.type";
import "./restaurantContainer.style.scss";

const { Title } = Typography;
const PAGE_SIZE = 12;

export const RestaurantContainer: React.FC = () => {
  const dispatch = useDispatch();
  const storedUser = useSelector(selectUser);
  const nextPageToken = useSelector(selectRestaurantNextPageToken);
  const firebaseAuth = useMemo(() => getAuth(), []);

  const [items, setItems] = useState<Restaurant[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Restaurant | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Restaurant | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isUserReady, setIsUserReady] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  // works during mounting and refresh and user change
  useEffect(() => {
    const loadUser = async () => {
      if (storedUser) {
        setIsUserReady(true);
        setUserLoading(false);
        return;
      }
      setUserLoading(true);

      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        setIsUserReady(false);
        setUserLoading(false);
        return;
      }

      try {
        const token = await currentUser.getIdToken();
        const userResponse = await getUserDetails(token);

        if (userResponse.data) {
          dispatch(setUser(userResponse.data));
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unable to resolve user information";
        message.error(errorMessage);
        setIsUserReady(false);
      } finally {
        setUserLoading(false);
      }
    };

    void loadUser();
  }, [dispatch, firebaseAuth, storedUser]);

  // to provide consistent token to all functions
  const getAuthToken = useCallback(async (): Promise<string | null> => {
    const currentUser = firebaseAuth.currentUser;
    if (!currentUser) {
      message.error("Authentication required");
      return null;
    }

    try {
      return await currentUser.getIdToken();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to resolve authentication token";
      message.error(errorMessage);
      return null;
    }
  }, [firebaseAuth]);

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
        const responseData = response.data;
        const fetchedItems = responseData?.items ?? [];

        setItems((previousItems) => (append ? [...previousItems, ...fetchedItems] : fetchedItems));

        const nextToken = responseData?.nextPageToken ?? null;
        dispatch(setRestaurantNextToken(nextToken));
        setHasMore(Boolean(nextToken));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load restaurants";
        message.error(errorMessage);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [dispatch, getAuthToken],
  );

  useEffect(() => {
    if (!isUserReady) {
      return;
    }

    setItems([]);
    dispatch(clearRestaurantPagination());
    setHasMore(true);
    fetchPage(false, null);
  }, [dispatch, fetchPage, isUserReady]);

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
      return;
    }

    const ownerId = storedUser?.uid ?? firebaseAuth.currentUser?.uid;
    if (!ownerId) {
      message.error("Missing owner id");
      return;
    }

    try {
      const response = await createRestaurant(token, {
        ...values,
        ownerId,
      });
      const createdRestaurant = response.data?.restaurant;
      if (createdRestaurant) {
        setItems((previousItems) => [createdRestaurant, ...previousItems]);
      }
      message.success("Restaurant created");
      setCreateOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Create failed";
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
      return;
    }

    try {
      const response = await updateRestaurant(token, editTarget.id, values);
      const updatedRestaurant = response.data?.restaurant;
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
      const errorMessage = error instanceof Error ? error.message : "Update failed";
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
      const deletedId = deleteTarget.id;
      setItems((previousItems) =>
        previousItems.filter((restaurantItem) => restaurantItem.id !== deletedId),
      );
      message.success("Restaurant deleted");
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Delete failed";
      message.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const greetingName = storedUser?.username ?? firebaseAuth.currentUser?.displayName ?? "Owner";

  if (userLoading) {
    return <Loading />;
  }

  return (
    <section className="restaurant-container">
      <header className="restaurant-container__heading">
        <Title level={2} className="restaurant-container__heading-title">
          Hi, {greetingName}
        </Title>
        <Button type="primary" onClick={() => setCreateOpen(true)}>
          Create Restaurant
        </Button>
      </header>
      <div className="restaurant-container__section">
        <Title level={3} className="restaurant-container__section-title">
          Your Restaurants
        </Title>
      </div>

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
        open={createOpen}
        mode="create"
        onCancel={() => setCreateOpen(false)}
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
