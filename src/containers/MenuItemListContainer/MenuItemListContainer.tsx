import React, { useCallback, useEffect, useRef, useState } from "react";
import { message, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { FormikHelpers } from "formik";

import {
  MenuItemListComponent,
  MenuItemFormModalComponent,
  BackToButtonComponent,
} from "@/components";
import { uploadImage } from "@services/upload.service";
import { createMenuItem, listMenuItems } from "@services/menu.service";
import {
  selectIsMenuItemFormModalOpen,
  selectMenuItemNextPageToken,
} from "@store/selectors/selector";
import { closeMenuItemFormModal } from "@store/actions/menuItems.actions";
import { useAuthContext } from "@/context/AuthContext";
import { clearMenuItemPagination, setMenuItemNextToken } from "@store/actions/menuItems.actions";
import { resolveError } from "@/utils/errorHandlers";
import { MENU_ITEM_PAGE_SIZE } from "./menuItemListContainer.const";

import type { MenuItem, MenuItemFormValues, MenuItemPayload } from "@services/menu.type";

import "./menuItemListContainer.style.scss";

const { Title } = Typography;

const mapFormValuesToPayload = (
  values: MenuItemFormValues,
  overrides: Partial<MenuItemPayload> = {},
): MenuItemPayload => ({
  name: values.name,
  description: values.description,
  amount: {
    currency: values.amount.currency,
    price: values.amount.price,
  },
  rating: values.rating,
  category: values.category,
  quantity: values.quantity,
  ...overrides,
});

export const MenuItemListContainer: React.FC = () => {
  const { authUser } = useAuthContext();
  const dispatch = useDispatch();
  const nextPageToken = useSelector(selectMenuItemNextPageToken);
  const { restaurantId = "" } = useParams<{ restaurantId: string }>();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const isCreateModalOpen = useSelector(selectIsMenuItemFormModalOpen);
  const lastFetchRestaurantRef = useRef<string | null | undefined>(undefined);

  const getAuthToken = useCallback(async (): Promise<string> => {
    if (!authUser) {
      message.error("Authentication required");
      return "";
    }

    try {
      return await authUser.getIdToken();
    } catch (error) {
      const errorMessage = resolveError({ error });
      message.error(errorMessage);
      return "";
    }
  }, [authUser]);

  const fetchPage = useCallback(
    async (append: boolean, cursorId: string | null) => {
      setLoading(true);

      const token = await getAuthToken();
      try {
        const response = await listMenuItems(token, restaurantId, {
          perPage: MENU_ITEM_PAGE_SIZE,
          nextPageToken: cursorId ?? undefined,
        });
        const fetchedItems = response.data?.items ?? [];
        setItems((previousItems) => (append ? [...previousItems, ...fetchedItems] : fetchedItems));

        const nextToken = response.data?.nextPageToken ?? null;
        dispatch(setMenuItemNextToken(nextToken));
        setHasMore(!!nextToken && fetchedItems.length == MENU_ITEM_PAGE_SIZE);
      } catch (error) {
        const errorMessage = resolveError({
          error,
          AxiosErrorMessage: "Failed to load menu items",
        });
        message.error(errorMessage);
        dispatch(setMenuItemNextToken(null));
      } finally {
        setLoading(false);
      }
    },
    [dispatch, getAuthToken, restaurantId],
  );

  useEffect(() => {
    if (lastFetchRestaurantRef.current === restaurantId) {
      return;
    }
    lastFetchRestaurantRef.current = restaurantId;

    setItems([]);
    setHasMore(false);
    dispatch(clearMenuItemPagination());
    fetchPage(false, null);

    return () => {
      dispatch(closeMenuItemFormModal());
      dispatch(clearMenuItemPagination());
    };
  }, [dispatch, fetchPage, restaurantId]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) {
      return;
    }
    fetchPage(true, nextPageToken);
  }, [fetchPage, hasMore, loading, nextPageToken]);

  const handleCreate = async (
    values: MenuItemFormValues,
    helpers: FormikHelpers<MenuItemFormValues>,
    file?: File,
  ) => {
    const token = await getAuthToken();

    const ownerId = authUser?.uid;
    if (!ownerId) {
      message.error("Unable to resolve owner details. Please sign in again.");
      helpers.setSubmitting(false);
      return;
    }

    if (!file) {
      helpers.setSubmitting(false);
      return;
    }

    let uploadedImageName: string;

    try {
      uploadedImageName = await uploadImage(token, file);
    } catch (error) {
      const errorMessage = resolveError({
        error,
        AxiosErrorMessage: "Image upload failed. Please try again.",
      });
      message.error(errorMessage);
      helpers.setSubmitting(false);
      return;
    }

    const payload: MenuItemPayload = mapFormValuesToPayload(values, {
      imageName: uploadedImageName,
      ownerId,
      restaurantId,
    });

    //create menu-item
    try {
      const response = await createMenuItem(token, restaurantId, payload);
      const createdMenuItem = response.data;
      if (createdMenuItem) {
        setItems((previousItems) => [createdMenuItem, ...previousItems]);
      }
      message.success("Menu item created");
      dispatch(closeMenuItemFormModal());
      helpers.resetForm();
    } catch (error) {
      const errorMessage = resolveError({
        error,
        AxiosErrorMessage: "Failed to create menu item. Please try again.",
      });
      message.error(errorMessage);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <section className="menu-container">
      <header className="menu-container__heading">
        <Title level={2} className="menu-container__section-title">
          Your Menu Items
        </Title>
        <BackToButtonComponent label="Back To Restaurant" />
      </header>
      <MenuItemListComponent
        items={items}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        restaurantId={restaurantId}
      />

      <MenuItemFormModalComponent
        open={isCreateModalOpen}
        mode="create"
        onCancel={() => dispatch(closeMenuItemFormModal())}
        onSubmit={handleCreate}
      />
    </section>
  );
};
