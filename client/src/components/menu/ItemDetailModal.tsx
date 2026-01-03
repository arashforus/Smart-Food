import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import type { MenuItem, Language, Settings } from '@/lib/types';
import { translations } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

interface ItemDetailModalProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
  language: Language;
  onAddToCart?: (item: MenuItem, quantity: number, notes: string) => void;
  settings?: Settings;
}

export default function ItemDetailModal({ item, open, onClose, language, onAddToCart, settings }: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const { data: allMaterials = [] } = useQuery<any[]>({
    queryKey: ['/api/materials'],
    enabled: !!item,
  });

  const { data: allFoodTypes = [] } = useQuery<any[]>({
    queryKey: ['/api/food-types'],
    enabled: !!item,
  });

  if (!item) return null;

  const getName = () => {
    return item.name[language as keyof typeof item.name] || item.name.en || Object.values(item.name)[0] || '';
  };

  const getLongDescription = () => {
    return item.longDescription[language as keyof typeof item.longDescription] || item.longDescription.en || Object.values(item.longDescription)[0] || '';
  };

  const getMaterials = () => {
    return (item.materials || []).map(id => {
      const material = allMaterials.find(m => m.id === id);
      return material ? (material.name[language as keyof typeof material.name] || material.name.en) : '';
    }).filter(Boolean);
  };

  const getTypes = () => {
    return (item.types || []).map(id => {
      const type = allFoodTypes.find(t => t.id === id);
      return type ? { name: type.name[language as keyof typeof type.name] || type.name.en, color: type.color } : null;
    }).filter(Boolean);
  };

  const t = translations[language] || translations.en;
  const isRtl = language === 'fa' || language === 'ar';

  const price = Number(item.price);
  const discountedPrice = item.discountedPrice ? Number(item.discountedPrice) : null;
  const hasDiscount = discountedPrice !== null && discountedPrice < price;

  const currencySymbol = settings?.currencySymbol || '$';
  const currencyPosition = settings?.currencyPosition || 'after';

  const formatPrice = (p: number) => {
    return currencyPosition === 'before' ? `${currencySymbol}${p.toFixed(2)}` : `${p.toFixed(2)}${currencySymbol}`;
  };

  const handleAddToCart = () => {
    onAddToCart?.(item, quantity, notes);
    setQuantity(1);
    setNotes('');
    onClose();
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(1, quantity + delta);
    if (item.maxSelect) {
      setQuantity(Math.min(newQty, Number(item.maxSelect)));
    } else {
      setQuantity(newQty);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-2xl px-6" data-testid="modal-item-detail" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={isRtl ? 'text-right' : ''} data-testid="text-modal-item-name">
            {getName()}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="w-full aspect-video rounded-xl bg-muted flex items-center justify-center overflow-hidden">
            {settings?.menuShowImages && item.image ? (
              <img
                src={item.image}
                alt={getName()}
                className="w-full h-full object-cover"
              />
            ) : (
              <UtensilsCrossed className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
          
          <p className={`text-sm text-muted-foreground leading-relaxed ${isRtl ? 'text-right' : ''}`}>{getLongDescription()}</p>
          
          {settings?.menuShowFoodTypes && getTypes().length > 0 && (
            <div className={`flex flex-wrap gap-2 ${isRtl ? 'justify-end' : ''}`}>
              {getTypes().map((type, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="text-xs"
                  style={{ backgroundColor: type?.color, color: 'white' }}
                >
                  {type?.name}
                </Badge>
              ))}
            </div>
          )}
          
          {settings?.menuShowIngredients && getMaterials().length > 0 && (
            <div className={isRtl ? 'text-right' : ''}>
              <p className="text-xs text-muted-foreground font-medium mb-1">{t.materials}:</p>
              <p className="text-sm text-muted-foreground">
                {getMaterials().join(', ')}
              </p>
            </div>
          )}
          
          {settings?.menuShowPrices && (
            <div className={`flex items-center gap-3 ${isRtl ? 'justify-end' : ''}`}>
              {hasDiscount ? (
                <>
                  <span className="text-xl font-semibold text-primary" data-testid="text-modal-item-price">
                    {formatPrice(discountedPrice!)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(price)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-semibold text-primary" data-testid="text-modal-item-price">
                  {formatPrice(price)}
                </span>
              )}
            </div>
          )}
          
          <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm font-medium">{t.quantity}:</span>
            <div className={`flex items-center gap-2 bg-muted rounded-lg p-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                data-testid="button-quantity-decrease"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold" data-testid="text-quantity-display">
                {quantity}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(1)}
                disabled={item.maxSelect ? quantity >= Number(item.maxSelect) : false}
                data-testid="button-quantity-increase"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className={isRtl ? 'text-right' : ''}>
            <label className="text-sm font-medium block mb-2" htmlFor="order-notes">
              {t.notes || 'Special requests'}
            </label>
            <Textarea
              id="order-notes"
              placeholder={t.notesPlaceholder || 'Add any special requests or notes...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`resize-none rounded-lg ${isRtl ? 'text-right' : ''}`}
              data-testid="textarea-order-notes"
            />
          </div>
          
          {settings?.menuShowBuyButton && (
            <Button
              onClick={handleAddToCart}
              className="w-full gap-2 rounded-lg"
              size="lg"
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {t.addToCart}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
