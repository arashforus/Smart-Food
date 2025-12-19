import { useEffect, useState } from 'react';
import { useOrders } from '@/lib/orderContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, AlertCircle, Flame, Maximize2, Minimize2 } from 'lucide-react';
import type { Order, OrderStatus } from '@/lib/types';

const getStatusConfig = (status: OrderStatus, bgColor: string) => {
  const statusLabels: Record<OrderStatus, string> = {
    pending: 'Pending',
    preparing: 'Preparing',
    ready: 'Ready',
    served: 'Served',
    cancelled: 'Cancelled',
  };

  const statusIcons: Record<OrderStatus, React.ReactNode> = {
    pending: <Clock className="w-8 h-8" />,
    preparing: <Flame className="w-8 h-8" />,
    ready: <CheckCircle2 className="w-8 h-8" />,
    served: <CheckCircle2 className="w-8 h-8" />,
    cancelled: <AlertCircle className="w-8 h-8" />,
  };

  return {
    label: statusLabels[status],
    icon: statusIcons[status],
    bgColor,
  };
};

export default function OrderStatusScreen() {
  const { orders, ossSettings } = useOrders();
  const [displayOrders, setDisplayOrders] = useState<Order[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : 'rgb(255, 255, 255)';
  };

  const getBackgroundColorForStatus = (status: OrderStatus) => {
    let hexColor = '#ffffff';
    if (status === 'pending') hexColor = ossSettings.pendingColor;
    else if (status === 'preparing') hexColor = ossSettings.preparingColor;
    else if (status === 'ready') hexColor = ossSettings.readyColor;
    else if (status === 'served') hexColor = '#dbeafe';
    else if (status === 'cancelled') hexColor = '#fee2e2';

    const rgbColor = hexToRgb(hexColor);
    const isDark = parseInt(hexColor.slice(1), 16) < 0xffffff / 2;
    const textColor = isDark ? 'text-white' : 'text-gray-900';

    return { bgColor: rgbColor, textColor };
  };

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

  const screenBackgroundStyle = ossSettings.backgroundType === 'image' && ossSettings.backgroundImage
    ? { backgroundImage: `url(${ossSettings.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: ossSettings.backgroundColor };

  return (
    <div className="w-full h-screen p-8 overflow-auto flex flex-col" style={screenBackgroundStyle}>
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
              const { bgColor, textColor } = getBackgroundColorForStatus(order.status);
              const config = getStatusConfig(order.status, bgColor);
              return (
                <Card
                  key={order.id}
                  className={`border-4 ${textColor} overflow-hidden transform hover:scale-105 transition-transform duration-300 min-h-64`}
                  style={{ backgroundColor: bgColor }}
                  data-testid={`card-order-status-${order.orderNumber}`}
                >
                  <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center space-y-6">
                    {/* Status Icon */}
                    {ossSettings.showIcon && (
                      <div className="flex justify-center">
                        {config.icon}
                      </div>
                    )}

                    {/* Order Number */}
                    <div>
                      <p className="text-lg opacity-75 mb-2">{ossSettings.numberLabel}</p>
                      <h2 className="text-6xl font-bold">{order.orderNumber.replace(/^ORD-/, '')}</h2>
                    </div>

                    {/* Table Number */}
                    {ossSettings.showTableInfo && order.tableNumber && (
                      <div>
                        <p className="text-lg opacity-75 mb-2">{ossSettings.tableLabel}</p>
                        <p className="text-4xl font-bold">{order.tableNumber}</p>
                      </div>
                    )}

                    {/* Status Badge */}
                    <Badge className={`text-2xl py-3 px-6 ${textColor}`} style={{ backgroundColor: bgColor }}>
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
