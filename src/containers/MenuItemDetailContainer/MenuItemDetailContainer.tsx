import React, { useCallback, useEffect, useState } from "react";
import { message, Spin, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthContext } from "@/context/AuthContext";
import {
  MenuItemDetail,
  MenuItemFormModal,
  DeleteItemConfirmModal,
  BackToButton,
} from "@/components";
import { ROUTES_URL } from "@/routes/routes.const";
import { deleteMenuItem, getMenuItem, updateMenuItem } from "@services/menu.service";

import type { MenuItem, MenuItemFormValues, MenuItemPayload } from "@services/menu.type";
import { resolveAxiosErrorMessage } from "@/utils/helper";

const { Text } = Typography;

export const MenuItemDetailContainer: React.FC = () => {
  const navigate = useNavigate();
  const { restaurantId, menuItemId } = useParams<{ restaurantId: string; menuItemId: string }>();
  const { authUser, isAuthLoading } = useAuthContext();

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMenuItem = useCallback(async () => {
    if (isAuthLoading) {
      return;
    }

    if (!restaurantId || !menuItemId) {
      return;
    }

    const token = await authUser?.getIdToken();
    if (!token) {
      message.warn("Auth Token Missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getMenuItem(token, restaurantId, menuItemId);
      const data = response.data;
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
  }, [authUser, isAuthLoading, menuItemId, restaurantId]);

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

      const token = await authUser?.getIdToken();
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
    [authUser, menuItemId, restaurantId],
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

    const token = await authUser?.getIdToken();
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
  }, [authUser, menuItem, menuItemId, navigate, restaurantId]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  if (loading) {
    return (
      <div className="menu-item-detail__loader">
        <BackToButton label="Back to Menu" />
        <Spin />
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="menu-item-detail__loader">
        <BackToButton label="Back to Menu" />
        <Text>No menu item to display.</Text>
      </div>
    );
  }

  return (
    <>
      <MenuItemDetail
        menuItem={menuItem}
        onUpdate={handleUpdateOpen}
        onDelete={handleDeleteOpen}
      />

      <MenuItemFormModal
        open={isUpdateModalOpen}
        mode="update"
        initial={menuItem}
        onCancel={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateSubmit}
        showUpload={false}
      />

      <DeleteItemConfirmModal
        open={isDeleteModalOpen}
        menuItem={menuItem}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </>
  );
};
