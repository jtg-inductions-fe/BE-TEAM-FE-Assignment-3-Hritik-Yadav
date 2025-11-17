import React, { useCallback, useEffect, useState } from "react";
import { message, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { FormikHelpers } from "formik";

import {
  MenuItemListComponent,
  MenuItemFormModalComponent,
  BackToButtonComponent,
} from "@/components";
import { createMenuItem, listMenuItems, uploadImage } from "@/services";
import {
  selectIsMenuItemFormModalOpen,
  selectMenuItemNextPageToken,
} from "@store/selectors/selector";
import { closeMenuItemFormModal } from "@store/actions/menuItems.actions";
import { useAuthContext } from "@/context/AuthContext";
import { clearMenuItemPagination, setMenuItemNextToken } from "@store/actions/menuItems.actions";
import { resolveError } from "@/utils/errorHandlers";
import { MENU_ITEM_PAGE_SIZE } from "./menuItemListContainer.const";
import { mapItemFormValuesToPayload } from "./menuItemListContainer.helper";
import { ROUTES_URL } from "@/routes/routes.const";
import { CREATE_MODE } from "@/components/MenuItemFormModalComponent/MenuItemFormModal.const";

import type { MenuItem, MenuItemFormValues, MenuItemPayload } from "@services/menu.type";

import "./menuItemListContainer.style.scss";

const { Title } = Typography;

export const MenuItemListContainer: React.FC = () => {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nextPageToken = useSelector(selectMenuItemNextPageToken);
  const { restaurantId = "" } = useParams<{ restaurantId: string }>();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const isCreateModalOpen = useSelector(selectIsMenuItemFormModalOpen);

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

  const fetchMenuItems = useCallback(
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

    const ownerId = authUser?.uid;
    if (!ownerId) {
      message.error("Unable to resolve owner details. Please sign in again.");
      helpers.setSubmitting(false);
      return;
    }
    if (!file) {
      helpers.setSubmitting(false);
      message.error("Image got corrupt. Please Try Again.");
      return;
    }
    let uploadedImageName: string = "";

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

    const payload: MenuItemPayload = mapItemFormValuesToPayload(values, {
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
  const handleView = (id: string) => {
    const detailsPage = `${ROUTES_URL.RESTAURANT}/${restaurantId}/${ROUTES_URL.MENU}/${ROUTES_URL.ITEM}/${id}`;
    navigate(detailsPage);
  };

  return (
    <section className="menu-container">
      <div className="menu-container__heading">
        <Title level={2} className="menu-container__section-title">
          Your Menu Items
        </Title>
        <BackToButtonComponent label="Back To Restaurant" />
      </div>
      <MenuItemListComponent
        items={items}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        onView={handleView}
      />

      <MenuItemFormModalComponent
        open={isCreateModalOpen}
        mode={CREATE_MODE}
        onCancel={() => dispatch(closeMenuItemFormModal())}
        onSubmit={handleCreate}
      />
    </section>
  );
};
