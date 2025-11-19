import React from "react";
import { Typography, Space, Button, Spin, Collapse, Dropdown } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { OrderDetails } from "../OrderDetailsComponent";

import type { OrdersListProps } from "./ordersList.types";

import "./orderList.style.scss";

const { Title, Text } = Typography;
const { Panel } = Collapse;

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  loading,
  hasMore,
  loadMore,
  status,
  setStatus,
  filters,
  getStatusMenuItems,
}) => {
  return (
    <section className="order-list">
      <div>
        <Title level={2} className="order-list__heading">
          Orders
        </Title>

        <div className="order-list__filters">
          <Space>
            {filters.map((filter) => (
              <Button
                className="order-list__filter-button"
                key={filter.key}
                type={status == filter.key ? "primary" : "default"}
                onClick={() => setStatus(filter.key)}
                size="middle"
              >
                {filter.label}
              </Button>
            ))}
          </Space>
        </div>
      </div>

      <InfiniteScroll
        dataLength={orders.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          loading && (
            <div className="order-list__loader">
              <Spin size="small" />
            </div>
          )
        }
        endMessage={!loading ? <Text className="order-list__end">No more orders</Text> : undefined}
      >
        <Collapse accordion>
          {orders.map((order) => (
            <Panel
              key={order.id}
              className="order-item__panel"
              header={
                <div className="order-item__header">
                  <Text strong>Order Id #{order.id}</Text>

                  {order.createdAt && (
                    <Text type="secondary">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  )}

                  <Text type="secondary">{order.orderStatus ?? "—"}</Text>
                  <Text>Total Price</Text>

                  {getStatusMenuItems ? (
                    <div onClick={(e) => e.stopPropagation()}>
                      <Dropdown menu={getStatusMenuItems(order.id)}>
                        <Button>Update Status</Button>
                      </Dropdown>
                    </div>
                  ) : undefined}
                </div>
              }
            >
              <OrderDetails order={order} />
            </Panel>
          ))}
        </Collapse>
      </InfiniteScroll>
    </section>
  );
};
