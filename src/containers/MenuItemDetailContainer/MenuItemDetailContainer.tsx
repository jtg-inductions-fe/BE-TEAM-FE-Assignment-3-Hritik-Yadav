import React, { useCallback, useEffect, useState } from "react";
import { message, Spin, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthContext } from "@/context/AuthContext";
import {
  MenuItemDetailComponent,
  MenuItemFormModalComponent,
  DeleteItemConfirmModalComponent,
  BackToButtonComponent,
} from "@/components";
import { ROUTES_URL } from "@/routes/routes.const";
import { deleteMenuItem, getMenuItem, getPublicMenuItem, updateMenuItem } from "@services/menu.service";

import type { MenuItem, MenuItemFormValues, MenuItemPayload } from "@services/menu.type";
import { resolveAxiosErrorMessage } from "@/utils/helper";
import { USER_ROLE } from "@/services/service.const";

const { Text } = Typography;

export const MenuItemDetailContainer: React.FC = () => {
  const navigate = useNavigate();
  const { restaurantId, menuItemId } = useParams<{ restaurantId: string; menuItemId: string }>();
  const { authUser, isAuthLoading, role } = useAuthContext();
  const isOwnerView = role === USER_ROLE.OWNER;

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const resolveAuthToken = useCallback(async () => {
    if (!authUser) {
      return null;
    }

    try {
      const token = await authUser.getIdToken();
      return token ?? null;
    } catch (error) {
      const errorMessage = resolveAxiosErrorMessage(error, "Unable to fetch auth token");
      message.error(errorMessage);
      return null;
    }
  }, [authUser]);

  const fetchMenuItem = useCallback(async () => {
    if (isAuthLoading) {
      return;
    }

    if (!restaurantId || !menuItemId) {
      return;
    }

    try {
      setLoading(true);
      let data: MenuItem | null | undefined;

      if (isOwnerView) {
        const token = await resolveAuthToken();
        if (!token) {
          message.warn("Auth Token Missing");
          return;
        }
        const response = await getMenuItem(token, restaurantId, menuItemId);
        data = response?.data;
      } else {
        const response = await getPublicMenuItem(restaurantId, menuItemId);
        data = response?.data;
      }

      if (!data) {
        setMenuItem(null);
        message.warning("Menu item not found");
        return;
      }
      setMenuItem(data);
    } catch (error) {
      const errorMessage = resolveAxiosErrorMessage(error, "Failed to fetch menu item");
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthLoading, isOwnerView, menuItemId, resolveAuthToken, restaurantId]);

  useEffect(() => {
    void fetchMenuItem();
  }, [fetchMenuItem]);

  const handleUpdateOpen = useCallback(() => {
    setIsUpdateModalOpen(true);
  }, []);

  const handleUpdateSubmit = useCallback(
    async (values: MenuItemFormValues) => {
      if (!restaurantId || !menuItemId) {
        return;
      }

      const token = await resolveAuthToken();
      if (!token) {
        message.warn("Auth Token Missing");
        return;
      }

      try {
        const payload: MenuItemPayload = {
          name: values.name,
          description: values.description,
          amount: {
            currency: values.amount.currency,
            price: values.amount.price,
          },
          category: values.category,
          rating: values.rating,
          quantity: values.quantity,
        };
        const response = await updateMenuItem(token, restaurantId, menuItemId, payload);
        const updatedItem = response.data;
        if (updatedItem) {
          setMenuItem(updatedItem);
        }
        message.success("Menu item updated");
      } catch (error) {
        const errorMessage = resolveAxiosErrorMessage(error, "Update failed");
        message.error(errorMessage);
      } finally {
        setIsUpdateModalOpen(false);
      }
    },
    [menuItemId, resolveAuthToken, restaurantId],
  );

  const handleDeleteOpen = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!restaurantId || !menuItemId) {
      return;
    }

    if (!menuItem) {
      return;
    }

    const token = await resolveAuthToken();
    if (!token) {
      message.warn("Auth Token Missing");
      return;
    }

    try {
      setDeleteLoading(true);
      await deleteMenuItem(token, restaurantId, menuItemId, menuItem.imageName);
      message.success("Menu item deleted");
      setIsDeleteModalOpen(false);
      const restaurantMenuPath = `${ROUTES_URL.RESTAURANT}/${restaurantId}/${ROUTES_URL.MENU}`;
      navigate(restaurantMenuPath, { replace: true });
    } catch (error) {
      const errorMessage = resolveAxiosErrorMessage(error, "Delete failed");
      message.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  }, [menuItem, menuItemId, navigate, resolveAuthToken, restaurantId]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const handleAddToCart = useCallback((item: MenuItem) => {
    if (item.quantity <= 0) {
      message.info("Item currently out of stock");
      return;
    }

    message.success("Item added to cart");
  }, []);

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
        isOwnerView={isOwnerView}
        onUpdate={isOwnerView ? handleUpdateOpen : undefined}
        onDelete={isOwnerView ? handleDeleteOpen : undefined}
        onAddToCart={!isOwnerView ? handleAddToCart : undefined}
      />

      {isOwnerView && (
        <>
          <MenuItemFormModalComponent
            open={isUpdateModalOpen}
            mode="update"
            initial={menuItem}
            onCancel={() => setIsUpdateModalOpen(false)}
            onSubmit={handleUpdateSubmit}
            showUpload={false}
          />

          <DeleteItemConfirmModalComponent
            open={isDeleteModalOpen}
            menuItem={menuItem}
            onCancel={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            loading={deleteLoading}
          />
        </>
      )}
    </>
  );
};
