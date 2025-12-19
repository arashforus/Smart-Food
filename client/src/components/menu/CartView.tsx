import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, ShoppingCart } from 'lucide-react';
import { translations } from '@/lib/types';
import type { Language, CartItem } from '@/lib/types';

interface CartViewProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  language: Language;
  onRemoveItem?: (cartItemId: string) => void;
  onUpdateQuantity?: (cartItemId: string, quantity: number) => void;
  onPlaceOrder?: () => void;
}

export default function CartView({
  open,
  onClose,
  cartItems,
  language,
  onRemoveItem,
  onUpdateQuantity,
  onPlaceOrder,
}: CartViewProps) {
  const t = translations[language] || translations.en;
  const isRtl = language === 'fa';

  const cartTotal = cartItems.reduce(
    (sum, ci) => sum + (ci.item.discountedPrice || ci.item.price) * ci.quantity,
    0
  );

  const getName = (cartItem: CartItem) => {
    const item = cartItem.item;
    return item.name[language] || item.name.en || Object.values(item.name)[0] || '';
  };

  if (cartItems.length === 0) {
    return (
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md rounded-2xl px-6" dir={isRtl ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={isRtl ? 'text-right' : ''}>
              {t.cart}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              {t.emptyCart || 'Your cart is empty'}
            </p>
            <Button variant="outline" onClick={onClose}>
              {t.continueMenu || 'Continue Shopping'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-2xl px-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={isRtl ? 'text-right' : ''}>
            {t.cart}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {cartItems.map((cartItem) => (
            <Card key={cartItem.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className={`flex gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  {cartItem.item.image && (
                    <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={cartItem.item.image}
                        alt={getName(cartItem)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${isRtl ? 'text-right' : ''}`}>
                      {getName(cartItem)}
                    </h4>
                    <p className={`text-xs text-muted-foreground mt-1 ${isRtl ? 'text-right' : ''}`}>
                      ${(cartItem.item.discountedPrice || cartItem.item.price).toFixed(2)} x {cartItem.quantity}
                    </p>
                    {cartItem.notes && (
                      <p className={`text-xs text-muted-foreground italic mt-2 ${isRtl ? 'text-right' : ''}`}>
                        {t.notes}: {cartItem.notes}
                      </p>
                    )}
                  </div>
                  <div className={`flex flex-col items-end gap-2 ${isRtl ? 'items-start' : ''}`}>
                    <span className="font-semibold text-sm">
                      ${((cartItem.item.discountedPrice || cartItem.item.price) * cartItem.quantity).toFixed(2)}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => onRemoveItem?.(cartItem.id)}
                      data-testid={`button-remove-cart-item-${cartItem.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className={`flex items-center justify-between pt-4 border-t ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className="font-medium">{t.total || 'Total'}:</span>
            <span className="text-lg font-semibold">${cartTotal.toFixed(2)}</span>
          </div>

          <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t.continueMenu || 'Continue Shopping'}
            </Button>
            <Button onClick={onPlaceOrder} className="flex-1">
              {t.placeOrder || 'Place Order'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
