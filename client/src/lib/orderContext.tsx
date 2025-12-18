import { createContext, useContext, useState, useCallback } from 'react';
import { mockOrders } from './mockData';
import type { Order, OrderItem } from './types';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateItemStatus: (orderId: string, itemId: string, status: OrderItem['status']) => void;
  getActiveOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | null>(null);

let orderCounter = mockOrders.length;

function generateOrderId(): string {
  return `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function generateOrderNumber(): string {
  orderCounter++;
  return `ORD-${String(orderCounter).padStart(3, '0')}`;
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    return mockOrders.map((order) => ({
      ...order,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
    }));
  });

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order => {
    const now = new Date();
    const newOrder: Order = {
      ...orderData,
      id: generateOrderId(),
      orderNumber: generateOrderNumber(),
      createdAt: now,
      updatedAt: now,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date() }
          : order
      )
    );
  }, []);

  const updateItemStatus = useCallback((orderId: string, itemId: string, status: OrderItem['status']) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedItems = order.items.map((item) =>
          item.id === itemId ? { ...item, status } : item
        );

        const allReady = updatedItems.every((item) => item.status === 'ready');
        const anyPreparing = updatedItems.some((item) => item.status === 'preparing');

        let orderStatus = order.status;
        if (allReady && order.status !== 'served' && order.status !== 'cancelled') {
          orderStatus = 'ready';
        } else if (anyPreparing && order.status === 'pending') {
          orderStatus = 'preparing';
        }

        return {
          ...order,
          items: updatedItems,
          status: orderStatus,
          updatedAt: new Date(),
        };
      })
    );
  }, []);

  const getActiveOrders = useCallback(() => {
    return orders.filter((o) => o.status === 'pending' || o.status === 'preparing');
  }, [orders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        updateItemStatus,
        getActiveOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
