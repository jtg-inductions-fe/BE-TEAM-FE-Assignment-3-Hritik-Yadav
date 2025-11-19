import React, { useCallback, useEffect, useState } from "react";
import { message, Modal } from "antd";
import { useAuthContext } from "@/context/AuthContext";
import { getRestaurantOrders, getUserOrders, updateOrder } from "@/services/order.service";
import { resolveError } from "@/utils/errorHandlers";
import { Order, OrderStatus } from "@/services/order.type";
import { useParams } from "react-router-dom";
import { OrdersList } from "@/components";
import { FILTERS, ORDER_STATUS, ORDERS_PAGE_SIZE } from "./orderListContainer.const";
import { USER_ROLE } from "@/services/service.const";


export const OrdersListContainer: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const { restaurantId = "" } = useParams<{ restaurantId: string }>();
  const { authUser, role } = useAuthContext();
  const isOwner = role === USER_ROLE.OWNER;
  const isCustomer = role === USER_ROLE.CUSTOMER;

  const [status, setStatus] = useState<OrderStatus>("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string | null>(null);

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

  // Fetch orders from backend
  const fetchOrders = useCallback(
    async (append: boolean, cursorId: string | null) => {
      setLoading(true);
      try {
        const token = await getAuthToken();
        if (!token) return;

        const response = isCustomer
          ? await getUserOrders(token, {
              status: status,
              perPage: ORDERS_PAGE_SIZE,
              nextPageToken: cursorId,
            })
          : await getRestaurantOrders(token, restaurantId, {
              status: status,
              perPage: ORDERS_PAGE_SIZE,
              nextPageToken: cursorId,
            });

        const orders = response.data?.items ?? [];
        const nextToken = response.data?.nextPageToken ?? null;

        setOrders((prev) => (append ? [...prev, ...orders] : orders));
        setNextPageToken(nextToken ?? null);
        setHasMore(!!nextToken && orders.length !== ORDERS_PAGE_SIZE);
      } catch (error) {
        const errorMessage = resolveError({ error, axiosErrorMessage: "Failed to load orders" });
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [getAuthToken, status, isCustomer, restaurantId],
  );

  useEffect(() => {
    fetchOrders(false, null);
  }, [fetchOrders, status]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchOrders(true, nextPageToken);
  }, [fetchOrders, hasMore, loading, nextPageToken]);

  // Called by component dropdown
  const handleStatusRequest = (orderId: string, newStatus: string) => {
    setSelectedOrderId(orderId);
    setNewStatus(newStatus);
    setIsModalOpen(true);
  };

  // Confirm modal action
  const handleConfirmStatusUpdate = async () => {
    if (!selectedOrderId || !newStatus) return;

    setLoading(true);

    try {
      const token = await getAuthToken();
      await updateOrder(token, restaurantId, newStatus, selectedOrderId);
      message.success("Order status updated!");

      fetchOrders(false, null);
    } catch (error) {
      const errorMessage = resolveError({ error, axiosErrorMessage: "Failed to update status" });
      message.error(errorMessage);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setSelectedOrderId(null);
      setNewStatus(null);
    }
  };

  const getStatusMenuItems = (orderId: string) => ({
    items: [
      {
        key: ORDER_STATUS.accepted,
        label: "Accept",
        onClick: () => handleStatusRequest(orderId, ORDER_STATUS.accepted),
      },
      {
        key: ORDER_STATUS.rejected,
        label: "Reject",
        onClick: () => handleStatusRequest(orderId, ORDER_STATUS.rejected),
      },
      {
        key: ORDER_STATUS.delivered,
        label: "Delivered",
        onClick: () => handleStatusRequest(orderId, ORDER_STATUS.delivered),
      },
    ],
  });

  return (
    <>
      <OrdersList
        orders={orders}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        status={status}
        setStatus={setStatus} // this is used for filter change
        filters={FILTERS}
        getStatusMenuItems={isOwner ? getStatusMenuItems : undefined} // this is used for patch status change
      />

      <Modal
        open={isModalOpen}
        title="Confirm Status Change"
        onOk={handleConfirmStatusUpdate}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
      >
        Are you sure you want to change the status to <strong>{newStatus?.toUpperCase()}</strong>?
      </Modal>
    </>
  );
};

export default OrdersListContainer;
