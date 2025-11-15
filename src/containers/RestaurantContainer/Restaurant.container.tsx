import React, { useCallback, useEffect, useRef, useState } from "react";
import { Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { FormikHelpers } from "formik";

import { useAuthContext } from "@/context/AuthContext";
import {
  createRestaurant,
  deleteRestaurant,
  listPublicRestaurants,
  listRestaurants,
  updateRestaurant,
} from "@services/restaurant.service";
import {
  selectIsRestaurantFormModalOpen,
  selectRestaurantNextPageToken,
} from "@store/selectors/selector";
import { closeRestaurantFormModal } from "@/store/actions/modal.actions";
import {
  AppLoaderComponent,
  DeleteConfirmModalComponent,
  RestaurantFormModalComponent,
  RestaurantListComponent,
} from "@/components";
import {
  clearRestaurantPagination,
  setRestaurantNextToken,
} from "@/store/actions/restaurant.actions";
import { RESTAURANT_MODAL_TIME_FORMAT } from "@components/RestaurantFormModalComponent/RestaurantFormModal.const";
import { PAGE_SIZE } from "./restaurantContainer.const";
import { resolveError } from "@/utils/errorHandlers";

import type {
  Restaurant,
  RestaurantFormValues,
  RestaurantPayload,
} from "@services/restaurant.type";

import "./restaurantContainer.style.scss";
import { USER_ROLE } from "@/services/service.const";
import { ROUTES_URL } from "@/routes/routes.const";

const { Title } = Typography;

const mapFormValuesToPayload = (values: RestaurantFormValues): RestaurantPayload => ({
  name: values.name,
  openingTime: values.openingTime.format(RESTAURANT_MODAL_TIME_FORMAT),
  closingTime: values.closingTime.format(RESTAURANT_MODAL_TIME_FORMAT),
  status: values.status,
});

export const RestaurantContainer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const nextPageToken = useSelector(selectRestaurantNextPageToken);
  const { authUser, isAuthLoading, role } = useAuthContext();

  const [items, setItems] = useState<Restaurant[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Restaurant | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Restaurant | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const isCreateModalOpen = useSelector(selectIsRestaurantFormModalOpen);
  // Guard against StrictMode double-running effects in development.
  const lastFetchAuthKeyRef = useRef<string | null | undefined>(undefined);

  // to provide consistent token to all functions
  const getAuthToken = useCallback(async (): Promise<string | null> => {
    if (!authUser) {
      if (role === USER_ROLE.OWNER) message.error("Authentication required");
      return null;
    }

    try {
      const token = await authUser.getIdToken();
      if (!token) {
        setLoading(false);
        return null;
      }

      return token;
    } catch (error) {
      const errorMessage = resolveError({ error });
      message.error(errorMessage);
      return null;
    }
  }, [authUser, role]);

  // restaurant list function to fetch list
  const fetchRestaurants = useCallback(
    async (append: boolean, cursorId?: string | null) => {
      setLoading(true);

      const token = await getAuthToken();
      try {
        const response =
          role == USER_ROLE.OWNER
            ? await listRestaurants(token, {
                perPage: PAGE_SIZE,
                nextPageToken: cursorId ?? null,
              })
            : await listPublicRestaurants({
                perPage: PAGE_SIZE,
                nextPageToken: cursorId ?? null,
              });

        const fetchedItems = response.data?.items ?? [];
        setItems((previousItems) => (append ? [...previousItems, ...fetchedItems] : fetchedItems));

        const nextToken = response.data?.nextPageToken ?? null;
        dispatch(setRestaurantNextToken(nextToken));
        setHasMore(!!nextToken);
      } catch (error) {
        const errorMessage = resolveError({
          error,
          defaultAxiosError: "Failed to load restaurants",
        });
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, getAuthToken, role],
  );

  const resetRestaurants = useCallback(() => {
    setItems([]);
    dispatch(clearRestaurantPagination());
    setHasMore(false);
  }, [dispatch]);

  useEffect(() => {
    const authKey = authUser?.uid ?? null;
    if (lastFetchAuthKeyRef.current === authKey) {
      return;
    }
    lastFetchAuthKeyRef.current = authKey;
    resetRestaurants();
    fetchRestaurants(false, null);
  }, [authUser, dispatch, fetchRestaurants, resetRestaurants]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) {
      return;
    }
    fetchRestaurants(true, nextPageToken);
  }, [fetchRestaurants, hasMore, loading, nextPageToken]);

  const handleFormModalCancel = useCallback(() => {
    if (editOpen) {
      setEditOpen(false);
      setEditTarget(null);
    } else {
      dispatch(closeRestaurantFormModal());
    }
  }, [dispatch, editOpen]);

  // handles creation of restaurant
  const handleCreate = async (
    values: RestaurantFormValues,
    helpers: FormikHelpers<RestaurantFormValues>,
  ) => {
    const token = await getAuthToken();
    if (!token) {
      helpers.setSubmitting(false);
      return;
    }

    const ownerId = authUser?.uid;
    if (!ownerId) {
      message.error("Unable to resolve owner details. Please sign in again.");
      helpers.setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...mapFormValuesToPayload(values),
        ownerId,
      };
      await createRestaurant(token, {
        ...payload,
      });
      message.success("Restaurant created");
      dispatch(closeRestaurantFormModal());
      helpers.resetForm();
    } catch (error) {
      const errorMessage = resolveError({ error, defaultAxiosError: "Restaurant Creation failed" });
      message.error(errorMessage);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  // handles updation of restaurant
  const handleUpdate = async (
    values: RestaurantFormValues,
    helpers: FormikHelpers<RestaurantFormValues>,
  ) => {
    if (!editTarget) {
      helpers.setSubmitting(false);
      return;
    }

    const token = await getAuthToken();
    if (!token) {
      helpers.setSubmitting(false);
      return;
    }

    try {
      const payload = mapFormValuesToPayload(values);
      const response = await updateRestaurant(token, editTarget.id, payload);
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
      const errorMessage = resolveError({ error, defaultAxiosError: "Restaurant Updation failed" });
      message.error(errorMessage);
    } finally {
      helpers.setSubmitting(false);
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
      const errorMessage = resolveError({ error, defaultAxiosError: "Restaurant Deletion failed" });
      message.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestaurantView = useCallback(
    (id: string) => {
      navigate(`${ROUTES_URL.RESTAURANT}/${id}/${ROUTES_URL.MENU}`);
    },
    [navigate],
  );

  if (isAuthLoading) {
    return <AppLoaderComponent />;
  }

  return (
    <section className="restaurant-container">
      <header className="restaurant-container__heading">
        <Title level={2} className="restaurant-container__heading-title">
          Your Restaurants
        </Title>
      </header>
      <RestaurantListComponent
        items={items}
        loading={loading}
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
        onView={handleRestaurantView}
      />

      <RestaurantFormModalComponent
        open={isCreateModalOpen || editOpen}
        mode={editOpen ? "update" : "create"}
        initial={editOpen ? (editTarget ?? undefined) : undefined}
        onCancel={handleFormModalCancel}
        onSubmit={editOpen ? handleUpdate : handleCreate}
      />

      <DeleteConfirmModalComponent
        open={deleteOpen}
        restaurant={deleteTarget ?? undefined}
        onCancel={() => setDeleteOpen(false)}
        onDelete={handleDelete}
        loading={deleteLoading}
      />
    </section>
  );
};
