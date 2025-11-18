import React, { useCallback, useEffect, useState } from "react";
import { message, Spin, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { FormikHelpers } from "formik";

import { useAuthContext } from "@/context/AuthContext";
import {
  MenuItemDetailComponent,
  MenuItemFormModalComponent,
  DeleteConfirmModalComponent,
  BackToButtonComponent,
} from "@/components";
import { ROUTES_URL } from "@/routes/routes.const";
import { USER_ROLE } from "@services/service.const";
import { addItemToCart } from "@store/actions/cart.actions";
import { selectCartItems, selectCartRestaurantId } from "@store/selectors/selector";
import { deleteMenuItem, getMenuItem, updateMenuItem, getPublicMenuItem } from "@/services";
import { resolveError } from "@/utils/errorHandlers";
import { mapUpdateFormValuesToPayload } from "./menuItemDetailContainer.helper";
import { UPDATE_MODE } from "@components/MenuItemFormModalComponent/MenuItemFormModal.const";

import type { MenuItem, MenuItemFormValues, MenuItemPayload } from "@services/menu.type";

const { Text } = Typography;

export const MenuItemDetailContainer: React.FC = () => {
  const navigate = useNavigate();
  const { authUser, role } = useAuthContext();
  const isOwner = role === USER_ROLE.OWNER;
  const isCustomer = role === USER_ROLE.CUSTOMER;
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartRestaurantId = useSelector(selectCartRestaurantId);
  const { restaurantId = "", menuItemId = "" } = useParams<{
    restaurantId: string;
    menuItemId: string;
  }>();

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getAuthToken = useCallback(async (): Promise<string> => {
    if (!authUser) {
      if (isOwner) {
        message.error("Authentication required");
        navigate(ROUTES_URL.LOGIN);
      }
      return "";
    }

    try {
      return await authUser.getIdToken();
    } catch (error) {
      const errorMessage = resolveError({ error });
      message.error(errorMessage);
      return "";
    }
  }, [authUser, isOwner, navigate]);

  const fetchMenuItem = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();

      const response = isOwner
        ? await getMenuItem(token, restaurantId, menuItemId)
        : await getPublicMenuItem(restaurantId, menuItemId);
      const responseData = response?.data;

      if (!responseData) {
        setMenuItem(null);
        message.error("Menu item not found");
        return;
      }
      setMenuItem(responseData);
    } catch (error) {
      const errorMessage = resolveError({
        error,
        axiosErrorMessage: "Failed to fetch menu item",
      });
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isOwner, menuItemId, getAuthToken, restaurantId]);

  useEffect(() => {
    fetchMenuItem();
  }, [fetchMenuItem]);

  const handleUpdateOpen = useCallback(() => {
    setIsUpdateModalOpen(true);
  }, []);

  const handleUpdateSubmit = useCallback(
    async (values: MenuItemFormValues, helpers: FormikHelpers<MenuItemFormValues>) => {
      helpers.setSubmitting(true);
      const token = await getAuthToken();
      if (!menuItem) {
        message.error("Could not resolve item data. Try Again");
        return;
      }

      try {
        const payload: MenuItemPayload = mapUpdateFormValuesToPayload(values, {
          imageName: menuItem.imageName,
        });
        const response = await updateMenuItem(token, restaurantId, menuItemId, payload);
        const updatedItem = response.data;
        if (updatedItem) {
          setMenuItem(updatedItem);
        }
        message.success("Menu item updated");
        setIsUpdateModalOpen(false);
      } catch (error) {
        const errorMessage = resolveError({ error, axiosErrorMessage: "Update failed" });
        message.error(errorMessage);
      } finally {
        helpers.setSubmitting(false);
      }
    },
    [getAuthToken, menuItem, menuItemId, restaurantId],
  );

  const handleDeleteOpen = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    const token = await getAuthToken();
    if (!menuItem) {
      message.error("Could not resolve item data. Try Again");
      return;
    }

    try {
      setDeleteLoading(true);
      await deleteMenuItem(token, restaurantId, menuItemId, menuItem.imageName ?? "");
      message.success("Menu item deleted");
      setIsDeleteModalOpen(false);
      navigate(`${ROUTES_URL.RESTAURANT}/${restaurantId}/${ROUTES_URL.MENU}`, { replace: true });
    } catch (error) {
      const errorMessage = resolveError({ error, axiosErrorMessage: "Delete failed" });
      message.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  }, [getAuthToken, menuItem, menuItemId, navigate, restaurantId]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

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

  if (loading) {
    return (
      <div className="menu-item-detail__loader">
        <BackToButtonComponent label="Back to Menu" />
        <Spin />
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="menu-item-detail__loader">
        <BackToButtonComponent label="Back to Menu" />
        <Text>No menu item to display.</Text>
      </div>
    );
  }

  return (
    <>
      <MenuItemDetailComponent
        menuItem={menuItem}
        isOwnerView={isOwner}
        onUpdate={isOwner ? handleUpdateOpen : undefined}
        onDelete={isOwner ? handleDeleteOpen : undefined}
        onAddToCart={!isOwner ? handleAddToCart : undefined}
      />

      {isOwner && (
        <>
          <MenuItemFormModalComponent
            open={isUpdateModalOpen}
            mode={UPDATE_MODE}
            initial={menuItem}
            onCancel={() => setIsUpdateModalOpen(false)}
            onSubmit={handleUpdateSubmit}
            showUpload={false}
          />
          <DeleteConfirmModalComponent
            title="Item"
            open={isDeleteModalOpen}
            itemName={menuItem.name ?? "this item"}
            onCancel={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            loading={deleteLoading}
          />
        </>
      )}
    </>
  );
};
