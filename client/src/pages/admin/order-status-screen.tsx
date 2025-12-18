import { useEffect, useState } from 'react';
import { useOrders } from '@/lib/orderContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, AlertCircle, Flame } from 'lucide-react';
import type { Order, OrderStatus } from '@/lib/types';

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; bgColor: string; textColor: string }> = {
  pending: {
    label: 'Pending',
    icon: <Clock className="w-8 h-8" />,
    bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    textColor: 'text-yellow-900 dark:text-yellow-100',
  },
  preparing: {
    label: 'Preparing',
    icon: <Flame className="w-8 h-8" />,
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-orange-900 dark:text-orange-100',
  },
  ready: {
    label: 'Ready',
    icon: <CheckCircle2 className="w-8 h-8" />,
    bgColor: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-900 dark:text-green-100',
  },
  served: {
    label: 'Served',
    icon: <CheckCircle2 className="w-8 h-8" />,
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-900 dark:text-blue-100',
  },
  cancelled: {
    label: 'Cancelled',
    icon: <AlertCircle className="w-8 h-8" />,
    bgColor: 'bg-red-100 dark:bg-red-900',
    textColor: 'text-red-900 dark:text-red-100',
  },
};

export default function OrderStatusScreen() {
  const { orders } = useOrders();
  const [displayOrders, setDisplayOrders] = useState<Order[]>([]);

  useEffect(() => {
    const sortedOrders = [...orders]
      .filter((o) => o.status !== 'served' && o.status !== 'cancelled')
      .sort((a, b) => {
        const statusOrder = { pending: 0, preparing: 1, ready: 2 };
        const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
        const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.createdAt.getTime() - b.createdAt.getTime();
      });

    setDisplayOrders(sortedOrders);
  }, [orders]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Order Status</h1>
          <p className="text-xl text-slate-300">
            {displayOrders.length} active order{displayOrders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {displayOrders.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Clock className="w-24 h-24 mx-auto text-slate-400 mb-4 opacity-50" />
              <p className="text-3xl text-slate-300">No active orders</p>
              <p className="text-xl text-slate-400 mt-2">Waiting for new orders...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
            {displayOrders.map((order) => {
              const config = statusConfig[order.status];
              return (
                <Card
                  key={order.id}
                  className={`${config.bgColor} border-2 ${config.textColor} overflow-hidden transform hover:scale-105 transition-transform duration-300`}
                  data-testid={`card-order-status-${order.orderNumber}`}
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Order Number and Status */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {config.icon}
                          <h2 className="text-4xl font-bold">{order.orderNumber}</h2>
                        </div>
                      </div>
                      <Badge className={`text-lg py-2 px-4 ${config.bgColor} ${config.textColor}`}>
                        {config.label}
                      </Badge>
                    </div>

                    {/* Table Number */}
                    {order.tableNumber && (
                      <div className="text-2xl font-semibold">
                        Table {order.tableNumber}
                      </div>
                    )}

                    {/* Items Count */}
                    <div className="border-t-2 border-current opacity-30 pt-4">
                      <p className="text-xl font-semibold mb-3">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm md:text-base flex justify-between items-start gap-2">
                            <span className="flex-1">
                              • {item.menuItemName.en}
                              {item.quantity > 1 && <span className="font-semibold"> ×{item.quantity}</span>}
                            </span>
                            {item.status === 'ready' && (
                              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Time */}
                    <div className="border-t-2 border-current opacity-30 pt-4 text-sm md:text-base">
                      <p className="opacity-75">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div className="fixed bottom-4 right-4 text-slate-400 text-sm">
        <p>Updates in real-time</p>
      </div>
    </div>
  );
}
