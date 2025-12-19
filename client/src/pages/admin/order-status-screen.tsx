import { useEffect, useState } from 'react';
import { useOrders } from '@/lib/orderContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, AlertCircle, Flame, Maximize2, Minimize2 } from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const handleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8 overflow-auto flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold text-white mb-2">Order Status</h1>
            <p className="text-xl text-slate-300">
              {displayOrders.length} active order{displayOrders.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={handleFullscreen}
            size="icon"
            className="h-12 w-12"
            data-testid="button-fullscreen-toggle"
          >
            {isFullscreen ? (
              <Minimize2 className="h-6 w-6" />
            ) : (
              <Maximize2 className="h-6 w-6" />
            )}
          </Button>
        </div>

        {displayOrders.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Clock className="w-24 h-24 mx-auto text-slate-400 mb-4 opacity-50" />
              <p className="text-3xl text-slate-300">No active orders</p>
              <p className="text-xl text-slate-400 mt-2">Waiting for new orders...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 auto-rows-max flex-1 overflow-auto">
            {displayOrders.map((order) => {
              const config = statusConfig[order.status];
              return (
                <Card
                  key={order.id}
                  className={`${config.bgColor} border-4 ${config.textColor} overflow-hidden transform hover:scale-105 transition-transform duration-300 min-h-64`}
                  data-testid={`card-order-status-${order.orderNumber}`}
                >
                  <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center space-y-6">
                    {/* Status Icon */}
                    <div className="flex justify-center">
                      {config.icon}
                    </div>

                    {/* Order Number */}
                    <div>
                      <p className="text-lg opacity-75 mb-2">Order #</p>
                      <h2 className="text-6xl font-bold">{order.orderNumber}</h2>
                    </div>

                    {/* Table Number */}
                    {order.tableNumber && (
                      <div>
                        <p className="text-lg opacity-75 mb-2">Table</p>
                        <p className="text-4xl font-bold">{order.tableNumber}</p>
                      </div>
                    )}

                    {/* Status Badge */}
                    <Badge className={`text-2xl py-3 px-6 ${config.bgColor} ${config.textColor}`}>
                      {config.label}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
