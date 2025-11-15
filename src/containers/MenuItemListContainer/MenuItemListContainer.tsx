import React, { useCallback, useEffect, useRef, useState } from "react";
import { message, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { FormikHelpers } from "formik";

import {
  MenuItemListComponent,
  MenuItemFormModalComponent,
  BackToButtonComponent,
} from "@/components";
import { uploadImage } from "@services/upload.service";
import { createMenuItem, listMenuItems, listPublicMenuItems } from "@services/menu.service";
import {
  selectIsMenuItemFormModalOpen,
  selectMenuItemNextPageToken,
  selectCartItems,
  selectCartRestaurantId,
} from "@store/selectors/selector";
import { closeMenuItemFormModal } from "@store/actions/modal.actions";
import { addItemToCart } from "@store/actions/cart.actions";
import { useAuthContext } from "@/context/AuthContext";
import { USER_ROLE } from "@services/service.const";
import { ROUTES_URL } from "@/routes/routes.const";
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
  const { authUser, role } = useAuthContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nextPageToken = useSelector(selectMenuItemNextPageToken);
  const isCreateModalOpen = useSelector(selectIsMenuItemFormModalOpen);
  const cartItems = useSelector(selectCartItems);
  const cartRestaurantId = useSelector(selectCartRestaurantId);
  const { restaurantId } = useParams<{ restaurantId?: string }>();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const isOwner = role === USER_ROLE.OWNER;
  const isCustomer = role === USER_ROLE.CUSTOMER;
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
  }, [authUser, isOwner]);

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
    [dispatch, getAuthToken, restaurantId, isOwner],
  );

  useEffect(() => {
    if (lastFetchRestaurantRef.current === restaurantId) {
      return;
    }
    lastFetchRestaurantRef.current = restaurantId;

    setItems([]);
    setHasMore(false);
    dispatch(clearMenuItemPagination());
    fetchMenuItems(false, null);

    return () => {
      dispatch(closeMenuItemFormModal());
      dispatch(clearMenuItemPagination());
    };
  }, [dispatch, fetchMenuItems, restaurantId]);

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
      helpers.setSubmitting(false);
      return;
    }

    let uploadedImageName: string;

    try {
      uploadedImageName = await uploadImage(token, file);
    } catch (error) {
      const errorMessage = resolveError({
        error,
        defaultAxiosError: "Image upload failed. Please try again.",
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
      const response = await createMenuItem(token, restaurantId!, payload);
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
        defaultAxiosError: "Failed to create menu item. Please try again.",
      });
      message.error(errorMessage);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const handleMenuItemView = useCallback(
    (id: string) => {
      navigate(
        `${ROUTES_URL.RESTAURANT}/${restaurantId}/${ROUTES_URL.MENU}/${ROUTES_URL.ITEM}/${id}`,
      );
    },
    [navigate, restaurantId],
  );

  const handleAddToCart = useCallback(
    (menuItem: MenuItem) => {
      if (!isCustomer) {
        navigate(ROUTES_URL.LOGIN);
      }
      if (!restaurantId) {
        return;
      }

      if (cartRestaurantId && cartRestaurantId !== restaurantId) {
        message.error("Cannot select items from different restaurants.");
        return;
      }

      if (menuItem.quantity <= 0) {
        message.info("Item currently out of stock");
        return;
      }

      const existingCartItem = cartItems.find((item) => item.itemId === menuItem.id);
      const currentQuantity = existingCartItem?.quantity ?? 0;

      if (currentQuantity >= menuItem.quantity) {
        message.warning(`Only ${menuItem.quantity} available for ${menuItem.name}`);
        return;
      }

      dispatch(
        addItemToCart({
          item: {
            itemId: menuItem.id,
            name: menuItem.name,
            price: menuItem.amount.price,
            quantity: 1,
            availableQuantity: menuItem.quantity,
          },
          currency: menuItem.amount.currency,
          restaurantId,
        }),
      );

      message.success("Item added to cart");
    },
    [cartItems, cartRestaurantId, dispatch, restaurantId, isCustomer, navigate],
  );

  return (
    <section className="menu-container">
      <header className="menu-container__heading">
        <Title level={2} className="menu-container__section-title">
          Menu Items
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
