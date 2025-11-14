import React, { useCallback, useEffect, useRef, useState } from "react";
import { message, Typography } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FormikHelpers } from "formik";

import {
  MenuItemListComponent,
  MenuItemFormModalComponent,
  BackToButtonComponent,
} from "@/components";
import { getSignedUrl } from "@services/upload.service";
import { createMenuItem, listMenuItems, listPublicMenuItems } from "@services/menu.service";
import {
  selectIsMenuItemFormModalOpen,
  selectMenuItemNextPageToken,
} from "@store/selectors/selector";
import { closeMenuItemFormModal } from "@store/actions/modal.actions";
import { useAuthContext } from "@/context/AuthContext";
import { USER_ROLE } from "@/services/service.const";
import { ROUTES_URL } from "@/routes/routes.const";
import { clearMenuItemPagination, setMenuItemNextToken } from "@store/actions/menuItems.actions";
import { resolveError } from "@/utils/errorHandlers";
import { MENU_ITEM_PAGE_SIZE } from "./menuItemListContainer.const";

import type { MenuItem, MenuItemFormValues, MenuItemPayload } from "@services/menu.type";

import "./menuItemListContainer.style.scss";

const { Title } = Typography;

export const MenuItemListContainer: React.FC = () => {
  const { authUser, role } = useAuthContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nextPageToken = useSelector(selectMenuItemNextPageToken);
  const { restaurantId } = useParams<{ restaurantId: string }>();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const isOwner = role === USER_ROLE.OWNER;
  const isCreateModalOpen = useSelector(selectIsMenuItemFormModalOpen);
  const lastFetchRestaurantRef = useRef<string | null | undefined>(undefined);

  const getAuthToken = useCallback(async (): Promise<string | null> => {
    if (!authUser) {
      if (isOwner) message.error("Authentication required");
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
  }, [authUser]);

  const fetchMenuItems = useCallback(
    async (append: boolean, cursorId: string | null) => {
      setLoading(true);
      const token = await getAuthToken();

      try {
        const response = isOwner
          ? await listMenuItems(token, restaurantId!, {
              perPage: MENU_ITEM_PAGE_SIZE,
              nextPageToken: cursorId ?? undefined,
            })
          : await listPublicMenuItems(restaurantId!, {
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
          defaultAxiosError: "Failed to load menu items",
        });
        message.error(errorMessage);
        dispatch(setMenuItemNextToken(null));
      } finally {
        setLoading(false);
      }
    },
    [dispatch, getAuthToken],
  );

  useEffect(() => {
    const restaurant = restaurantId;
    if (lastFetchRestaurantRef.current === restaurant) {
      return;
    }
    lastFetchRestaurantRef.current = restaurant;

    setItems([]);
    setHasMore(false);
    dispatch(clearMenuItemPagination());
    fetchMenuItems(false, null);

    return () => {
      dispatch(closeMenuItemFormModal());
      dispatch(clearMenuItemPagination());
    };
  }, [dispatch, fetchMenuItems]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) {
      return;
    }
    fetchMenuItems(true, nextPageToken);
  }, [fetchMenuItems, hasMore, loading, nextPageToken]);

  const handleCreate = async (
    values: MenuItemFormValues,
    helpers: FormikHelpers<MenuItemFormValues>,
    file?: File,
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

    if (!file) {
      message.error("Image upload failed. Please try again.");
      return;
    }

    const contentType = file.type;
    let uploadedImageName = file.name;

    //image upload
    try {
      const signedUrlResponse = await getSignedUrl(token, file.name, contentType);
      const { uploadUrl, imageName } = signedUrlResponse?.data ?? signedUrlResponse ?? {};

      if (!uploadUrl || !imageName) {
        message.error("Unable to resolve upload destination.");
        return;
      }

      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": contentType,
        },
      });

      uploadedImageName = imageName;
    } catch (error) {
      const errorMessage = resolveError({
        error,
        defaultAxiosError: "Image upload failed. Please try again.",
      });
      message.error(errorMessage);
      helpers.setSubmitting(false);
      return;
    }

    const payload: MenuItemPayload = {
      name: values.name,
      description: values.description,
      amount: {
        currency: values.amount.currency,
        price: values.amount.price,
      },
      imageName: uploadedImageName,
      category: values.category,
      rating: values.rating,
      quantity: values.quantity,
      ownerId,
      restaurantId,
    };

    //create menu-item
    try {
      await createMenuItem(token, restaurantId!, payload);
      message.success("Menu item created");
      dispatch(closeMenuItemFormModal());
      helpers.resetForm();
    } catch (error) {
      const errorMessage = resolveError({
        error,
        defaultAxiosError: "Failed to create menu item. Please try again.",
      });
      message.error(errorMessage);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const handleMenuItemView = useCallback(
    (id: string) => {
      navigate(`${ROUTES_URL.RESTAURANT}/${restaurantId}/${ROUTES_URL.MENU}/${ROUTES_URL.ITEM}/${id}`);
    },
    [navigate],
  );

  const handleAddToCart = useCallback(
    (menuItem: MenuItem) => {
      console.log("Add: ", menuItem);
    },
    [role],
  );

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
        onView={handleMenuItemView}
        onAddToCart={isOwner ? undefined : handleAddToCart}
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
