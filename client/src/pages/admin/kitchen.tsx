import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle, ChefHat, AlertCircle } from 'lucide-react';
import { mockOrders } from '@/lib/mockData';
import type { Order, OrderItem } from '@/lib/types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  preparing: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  ready: 'bg-green-500/20 text-green-700 dark:text-green-400',
  served: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
  cancelled: 'bg-red-500/20 text-red-700 dark:text-red-400',
};

const itemStatusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  preparing: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
  ready: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
};

export default function KitchenPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'preparing'
  );

  const getTimeSince = (date: Date) => {
    const diff = Math.floor((currentTime.getTime() - new Date(date).getTime()) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const updateItemStatus = (orderId: string, itemId: string, newStatus: 'pending' | 'preparing' | 'ready') => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        
        const updatedItems = order.items.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
        );
        
        const allReady = updatedItems.every((item) => item.status === 'ready');
        const anyPreparing = updatedItems.some((item) => item.status === 'preparing');
        
        let orderStatus = order.status;
        if (allReady) {
          orderStatus = 'ready';
        } else if (anyPreparing) {
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
  };

  const markOrderReady = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: 'ready',
              items: order.items.map((item) => ({ ...item, status: 'ready' as const })),
              updatedAt: new Date(),
            }
          : order
      )
    );
    toast({ title: 'Order Ready', description: 'Order marked as ready for serving' });
  };

  const markOrderServed = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: 'served', updatedAt: new Date() }
          : order
      )
    );
    toast({ title: 'Order Served', description: 'Order has been served' });
  };

  const startPreparing = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: 'preparing', updatedAt: new Date() }
          : order
      )
    );
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <ChefHat className="h-6 w-6" />
            Kitchen Display
          </h1>
          <p className="text-muted-foreground">Active orders for preparation</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {activeOrders.length} Active Orders
          </Badge>
          <div className="text-2xl font-mono">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">All Caught Up!</h2>
            <p>No active orders at the moment</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeOrders.map((order) => (
            <Card
              key={order.id}
              className={`overflow-hidden ${
                order.status === 'pending' ? 'border-yellow-500/50' : 'border-blue-500/50'
              }`}
              data-testid={`card-order-${order.id}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                  <Badge className={statusColors[order.status]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  {order.tableNumber && (
                    <span className="font-medium">Table {order.tableNumber}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getTimeSince(order.createdAt)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2 rounded-md border ${itemStatusColors[item.status]} cursor-pointer transition-all`}
                      onClick={() => {
                        const nextStatus = item.status === 'pending' ? 'preparing' : item.status === 'preparing' ? 'ready' : 'pending';
                        updateItemStatus(order.id, item.id, nextStatus);
                      }}
                      data-testid={`item-${item.id}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{item.quantity}x</span>
                          <span className="font-medium">{item.menuItemName.en}</span>
                        </div>
                        {item.status === 'ready' && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      {item.notes && (
                        <p className="text-sm flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {item.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="p-2 bg-muted rounded-md text-sm">
                    <strong>Note:</strong> {order.notes}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {order.status === 'pending' && (
                    <Button
                      onClick={() => startPreparing(order.id)}
                      className="flex-1"
                      variant="outline"
                      data-testid={`button-start-${order.id}`}
                    >
                      Start Preparing
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button
                      onClick={() => markOrderReady(order.id)}
                      className="flex-1"
                      data-testid={`button-ready-${order.id}`}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Ready
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <Button
                      onClick={() => markOrderServed(order.id)}
                      className="flex-1"
                      variant="secondary"
                      data-testid={`button-served-${order.id}`}
                    >
                      Mark Served
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="pt-4 border-t">
        <h2 className="text-lg font-semibold mb-4">Recently Completed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {orders
            .filter((o) => o.status === 'ready' || o.status === 'served')
            .slice(0, 4)
            .map((order) => (
              <Card key={order.id} className="opacity-70">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-medium">{order.orderNumber}</span>
                    <Badge className={statusColors[order.status]} size="sm">
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} items - ${order.totalAmount.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
