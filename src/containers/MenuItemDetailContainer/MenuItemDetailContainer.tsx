import React, { useCallback, useEffect, useState } from "react";
import { message, Spin, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { FormikHelpers } from "formik";

import { useAuthContext } from "@/context/AuthContext";
import {
  MenuItemDetailComponent,
  MenuItemFormModalComponent,
  DeleteConfirmModalComponent,
  BackToButtonComponent,
} from "@/components";
import { ROUTES_URL } from "@/routes/routes.const";
import { deleteMenuItem, getMenuItem, updateMenuItem } from "@services/menu.service";
import { resolveError } from "@/utils/errorHandlers";

import type { MenuItem, MenuItemFormValues, MenuItemPayload } from "@services/menu.type";

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

  const getAuthToken = useCallback(async (): Promise<string | null> => {
    if (!authUser) {
      message.error("Authentication required");
      return null;
    }

    try {
      return await authUser.getIdToken();
    } catch (error) {
      const errorMessage = resolveError({ error });
      message.error(errorMessage);
      return null;
    }
  }, [authUser]);

  const fetchMenuItem = useCallback(async () => {
    if (isAuthLoading) {
      return;
    }

    const token = await getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getMenuItem(token, restaurantId!, menuItemId!);
      const data = response.data;
      if (!data) {
        setMenuItem(null);
        message.error("Menu item not found");
        return;
      }
      setMenuItem(data);
    } catch (error) {
      const errorMessage = resolveError({ error, defaultAxiosError: "Failed to fetch menu item" });
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
    async (values: MenuItemFormValues, helpers: FormikHelpers<MenuItemFormValues>) => {
      helpers.setSubmitting(true);
      const token = await getAuthToken();
      if (!token) {
        helpers.setSubmitting(false);
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
          // imageName: "", // fix
          category: values.category,
          rating: values.rating,
          quantity: values.quantity,
        };
        const response = await updateMenuItem(token, restaurantId!, menuItemId!, payload);
        const updatedItem = response.data;
        if (updatedItem) {
          setMenuItem(updatedItem);
        }
        message.success("Menu item updated");
      } catch (error) {
        const errorMessage = resolveError({ error, defaultAxiosError: "Update failed" });
        message.error(errorMessage);
      } finally {
        helpers.setSubmitting(false);
        setIsUpdateModalOpen(false);
      }
    },
    [authUser, menuItemId, restaurantId],
  );

  const handleDeleteOpen = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    const token = await getAuthToken();
    if (!token) {
      return;
    }

    try {
      setDeleteLoading(true);
      await deleteMenuItem(token, restaurantId!, menuItemId!, menuItem!.imageName); //need menu image to delete - fix
      message.success("Menu item deleted");
      setIsDeleteModalOpen(false);
      navigate(`${ROUTES_URL.RESTAURANT}/${restaurantId}/${ROUTES_URL.MENU}`, { replace: true });
    } catch (error) {
      const errorMessage = resolveError({ error, defaultAxiosError: "Delete failed" });
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
        onUpdate={handleUpdateOpen}
        onDelete={handleDeleteOpen}
      />

      <MenuItemFormModalComponent
        open={isUpdateModalOpen}
        mode="update"
        initial={menuItem}
        onCancel={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateSubmit}
        showUpload={false}
      />

      <DeleteConfirmModalComponent
        open={isDeleteModalOpen}
        menuItem={menuItem}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </>
  );
};
