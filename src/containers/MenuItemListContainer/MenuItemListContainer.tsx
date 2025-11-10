import React, { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";


import { MenuItemList, MenuItemFormModal } from "@/components";
import { getSignedUrl } from "@services/upload.service";
import { createMenuItem, listMenuItems } from "@services/menu.service";
import {
  selectIsMenuItemFormModalOpen,
  selectMenuItemNextPageToken,
} from "@store/selectors/selector";
import {
  clearMenuItemPagination,
  closeMenuItemFormModal,
  setMenuItemNextToken,
} from "@/store/actions/actions";
import { ListMenuItemsResponseData, MenuItem, MenuItemFormValues, MenuItemPayload } from "@/services/menu.type";
import "./menuItemListContainer.style.scss";
import { resolveAxiosErrorMessage } from "@/utils/helper";
import { useAuthContext } from "@/context/AuthContext";

const PAGE_SIZE = 12;

export const MenuItemListContainer: React.FC = () => {
  const { authUser } = useAuthContext();
  const dispatch = useDispatch();
  const nextPageToken = useSelector(selectMenuItemNextPageToken);
  const isCreateModalOpen = useSelector(selectIsMenuItemFormModalOpen);
  const { restaurantId } = useParams<{ restaurantId?: string }>();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const getAuthToken = useCallback(async (): Promise<string | null> => {
    if (!authUser) {
      message.error("Authentication required");
      return null;
    }

    try {
      return await authUser.getIdToken();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to resolve authentication token";
      message.error(errorMessage);
      return null;
    }
  }, [authUser]);

  const fetchPage = useCallback(
    async (append: boolean, cursorId: string | null) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const token = await getAuthToken();
      if (!token) {
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      if (!restaurantId) {
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      try {
        const response = await listMenuItems(token, restaurantId, {
          perPage: PAGE_SIZE,
          nextPageToken: cursorId ?? undefined,
        });
        const responseData = response.data as ListMenuItemsResponseData | undefined;
        const fetchedItems = responseData?.items ?? [];

        setItems((previousItems) => (append ? [...previousItems, ...fetchedItems] : fetchedItems));

        const nextToken = responseData?.nextPageToken ?? null;
        dispatch(setMenuItemNextToken(nextToken));
        setHasMore(Boolean(nextToken));
      } catch (error) {
        const errorMessage = resolveAxiosErrorMessage(error, "Failed to load menu items");
        message.error(errorMessage);
        dispatch(setMenuItemNextToken(null));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [dispatch, getAuthToken, restaurantId],
  );

  useEffect(() => {
    if (!restaurantId) {
      return;
    }

    setItems([]);
    setHasMore(true);
    dispatch(clearMenuItemPagination());
    fetchPage(false, null);

    return () => {
      dispatch(closeMenuItemFormModal());
      dispatch(clearMenuItemPagination());
    };
  }, [dispatch, fetchPage, restaurantId]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) {
      return;
    }

    if (!nextPageToken) {
      return;
    }

    fetchPage(true, nextPageToken);
  }, [fetchPage, hasMore, loading, loadingMore, nextPageToken]);
  const handleCreate = async (values: MenuItemFormValues, file?: File) => {
    const token = await getAuthToken();
    if (!token) {
      return;
    }

    const ownerId = authUser?.uid;
    if (!ownerId) {
      message.error("Missing owner id");
      return;
    }

    if (!restaurantId) {
      message.error("Restaurant context missing");
      return;
    }

    if (!file) {
      message.error("Image upload failed. Please try again.");
      return;
    }

    const contentType = file.type || "application/octet-stream";

    let uploadedImageName: string | null = null;

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
      const errorMessage = resolveAxiosErrorMessage(
        error,
        "Image upload failed. Please try again.",
      );
      message.error(errorMessage);
      return;
    }

    if (!uploadedImageName) {
      message.error("Image upload failed. Please try again.");
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

    try {
      await createMenuItem(token, restaurantId, payload);
      message.success("Menu item created");
      dispatch(clearMenuItemPagination());
      await fetchPage(false, null);
      dispatch(closeMenuItemFormModal());
    } catch (error) {
      const errorMessage = resolveAxiosErrorMessage(
        error,
        "Failed to create menu item. Please try again.",
      );
      message.error(errorMessage);
    }
  };

  return (
    <section className="menu-container">
      <MenuItemList
        items={items}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        loadMore={loadMore}
        restaurantId={restaurantId}
      />

      <MenuItemFormModal
        open={isCreateModalOpen}
        mode="create"
        onCancel={() => dispatch(closeMenuItemFormModal())}
        onSubmit={handleCreate}
      />
    </section>
  );
};
