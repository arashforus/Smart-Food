import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, ShoppingCart, Trash2, Send, X, Search } from 'lucide-react';
import { mockMenuItems, mockCategories, mockTables, mockOrders } from '@/lib/mockData';
import type { MenuItem, Order, OrderItem } from '@/lib/types';

interface CartOrderItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [cart, setCart] = useState<CartOrderItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const availableItems = mockMenuItems.filter((item) => item.available);
  
  const filteredItems = availableItems.filter((item) => {
    const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || 
      (item.name.en?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      return [...prev, { menuItem: item, quantity: 1, notes: '' }];
    });
    toast({ title: 'Added', description: `${item.name.en} added to order` });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) =>
          ci.menuItem.id === itemId
            ? { ...ci, quantity: Math.max(0, ci.quantity + delta) }
            : ci
        )
        .filter((ci) => ci.quantity > 0)
    );
  };

  const updateItemNotes = (itemId: string, notes: string) => {
    setCart((prev) =>
      prev.map((ci) =>
        ci.menuItem.id === itemId ? { ...ci, notes } : ci
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
  };

  const cartTotal = cart.reduce(
    (sum, ci) => sum + (ci.menuItem.discountedPrice || ci.menuItem.price) * ci.quantity,
    0
  );

  const cartItemCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  const submitOrder = () => {
    if (cart.length === 0) {
      toast({ title: 'Empty Order', description: 'Please add items to the order', variant: 'destructive' });
      return;
    }

    const orderNumber = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
    const orderItems: OrderItem[] = cart.map((ci, idx) => ({
      id: `${orders.length + 1}-${idx + 1}`,
      menuItemId: ci.menuItem.id,
      menuItemName: ci.menuItem.name,
      quantity: ci.quantity,
      price: ci.menuItem.discountedPrice || ci.menuItem.price,
      notes: ci.notes || undefined,
      status: 'pending' as const,
    }));

    const newOrder: Order = {
      id: String(orders.length + 1),
      orderNumber,
      tableNumber: selectedTable || undefined,
      branchId: '1',
      items: orderItems,
      status: 'pending',
      totalAmount: cartTotal,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: orderNotes || undefined,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setSelectedTable('');
    setOrderNotes('');
    setShowCart(false);
    toast({ title: 'Order Created', description: `${orderNumber} has been sent to kitchen` });
  };

  const getCategoryName = (categoryId: string) => {
    const cat = mockCategories.find((c) => c.id === categoryId);
    return cat?.name.en || 'Unknown';
  };

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">New Order</h1>
          <p className="text-muted-foreground">Touch-friendly ordering system</p>
        </div>
        <Button
          size="lg"
          onClick={() => setShowCart(true)}
          className="gap-2"
          data-testid="button-view-cart"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="font-semibold">{cartItemCount} items</span>
          <span>${cartTotal.toFixed(2)}</span>
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          onClick={() => setSelectedCategory(null)}
          className="shrink-0"
          data-testid="button-category-all"
        >
          All
        </Button>
        {mockCategories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat.id)}
            className="shrink-0"
            data-testid={`button-category-${cat.id}`}
          >
            {cat.name.en}
          </Button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-items"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover-elevate active-elevate-2 transition-all"
            onClick={() => addToCart(item)}
            data-testid={`card-menu-item-${item.id}`}
          >
            <CardContent className="p-3">
              {item.image && (
                <div className="aspect-square rounded-md overflow-hidden mb-2">
                  <img
                    src={item.image}
                    alt={item.name.en}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.name.en}</h3>
              <div className="flex items-center gap-2">
                {item.discountedPrice ? (
                  <>
                    <span className="font-semibold text-sm">${item.discountedPrice.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground line-through">${item.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="font-semibold text-sm">${item.price.toFixed(2)}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Current Order</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger data-testid="select-table">
                <SelectValue placeholder="Select Table (Optional)" />
              </SelectTrigger>
              <SelectContent>
                {mockTables.filter((t) => t.isActive).map((table) => (
                  <SelectItem key={table.id} value={table.number}>
                    Table {table.number} ({table.seats} seats)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No items in order</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((ci) => (
                  <Card key={ci.menuItem.id}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{ci.menuItem.name.en}</h4>
                          <p className="text-sm text-muted-foreground">
                            ${(ci.menuItem.discountedPrice || ci.menuItem.price).toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(ci.menuItem.id, -1)}
                            data-testid={`button-decrease-${ci.menuItem.id}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{ci.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(ci.menuItem.id, 1)}
                            data-testid={`button-increase-${ci.menuItem.id}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromCart(ci.menuItem.id)}
                            data-testid={`button-remove-${ci.menuItem.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Input
                        placeholder="Notes (e.g., no onions)"
                        value={ci.notes}
                        onChange={(e) => updateItemNotes(ci.menuItem.id, e.target.value)}
                        className="mt-2 text-sm"
                        data-testid={`input-notes-${ci.menuItem.id}`}
                      />
                      <p className="text-right font-semibold mt-2">
                        ${((ci.menuItem.discountedPrice || ci.menuItem.price) * ci.quantity).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Textarea
              placeholder="Order notes (optional)"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="resize-none"
              data-testid="textarea-order-notes"
            />

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCart(false)}
                className="flex-1"
              >
                Continue
              </Button>
              <Button
                onClick={submitOrder}
                className="flex-1 gap-2"
                disabled={cart.length === 0}
                data-testid="button-submit-order"
              >
                <Send className="h-4 w-4" />
                Send to Kitchen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
