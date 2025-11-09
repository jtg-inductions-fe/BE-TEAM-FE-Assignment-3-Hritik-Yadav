import React, { useCallback, useEffect, useMemo, useState } from "react";
import { message, Spin, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthContext } from "@/context/AuthContext";
import {
  MenuItemDetail,
  MenuItemFormModal,
  DeleteItemConfirmModal,
  BackToMenuButton,
} from "@/components";
import { ROUTES_URL } from "@/routes/routes.const";
import { createBackNavigationHandler } from "@/utils/navigation";
import { deleteMenuItem, getMenuItem, updateMenuItem } from "@services/menu.service";
import type { MenuItem, MenuItemPayload } from "@services/menu.type";

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
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch menu item";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authUser, isAuthLoading, menuItemId, restaurantId]);

  useEffect(() => {
    void fetchMenuItem();
  }, [fetchMenuItem]);

  const handleBack = useMemo(() => createBackNavigationHandler(navigate), [navigate]);

  const handleUpdateOpen = useCallback(() => {
    setIsUpdateModalOpen(true);
  }, []);

  const handleUpdateSubmit = useCallback(
    async (values: MenuItemPayload) => {
      if (!restaurantId || !menuItemId) {
        return;
      }

      const token = await authUser?.getIdToken();
      if (!token) {
        message.warn("Auth Token Missing");
        return;
      }

      try {
        const response = await updateMenuItem(token, restaurantId, menuItemId, values);
        const updatedItem = response.data;
        if (updatedItem) {
          setMenuItem(updatedItem);
        }
        message.success("Menu item updated");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Update failed";
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
      const errorMessage = error instanceof Error ? error.message : "Delete failed";
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
        <BackToMenuButton onClick={handleBack} />
        <Spin />
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="menu-item-detail__loader">
        <BackToMenuButton onClick={handleBack} />
        <Text>No menu item to display.</Text>
      </div>
    );
  }

  return (
    <>
      <MenuItemDetail
        menuItem={menuItem}
        onBack={handleBack}
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
