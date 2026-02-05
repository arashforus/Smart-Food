import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Plus, Minus, ShoppingCart, Star } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import type { MenuItem, Language, Settings } from '@/lib/types';
import { translations } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

function SteamEffect() {
  return (
    <div className="steam-container" style={{ '--steam-width': '16px', '--steam-height': '40px', '--steam-blur': '8px' } as any}>
      <div className="steam-wisp" />
      <div className="steam-wisp" />
      <div className="steam-wisp" />
      <div className="steam-wisp" />
      <div className="steam-wisp" />
      <div className="steam-wisp" />
      <div className="steam-wisp" />
      <div className="steam-wisp" />
    </div>
  );
}

function FireEffect() {
  return (
    <div className="fire-container">
      <div className="fire-glow" />
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="fire-particle"
          style={{
            '--left': `${Math.random() * 100}%`,
            '--delay': `${Math.random() * 2}s`,
            '--duration': `${1 + Math.random()}s`
          } as any}
        />
      ))}
    </div>
  );
}

function IceEffect() {
  return (
    <div className="ice-container">
      <div className="ice-overlay" />
      <div className="ice-frost-corner" />
      <div className="ice-frost-corner" />
      <div className="ice-frost-corner" />
      <div className="ice-frost-corner" />
    </div>
  );
}

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
      if (!material) return null;
      return {
        id: material.id,
        name: material.name[language as keyof typeof material.name] || material.name.en || '',
        icon: material.icon,
        color: material.color
      };
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
      <DialogContent className={`w-[calc(100%-2rem)] max-w-md md:max-w-3xl rounded-2xl px-6 ${isRtl ? '[&>button]:right-auto [&>button]:left-4' : ''} max-h-[90vh] flex flex-col`} data-testid="modal-item-detail" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader className="shrink-0">
          <DialogTitle className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`} data-testid="text-modal-item-name">
            <span>{getName()}</span>
            {item.isNew && (
              <Badge className="bg-primary text-primary-foreground font-bold uppercase text-[10px] px-1.5 py-0.5 h-5 shadow-sm shrink-0">
                New
              </Badge>
            )}
            {item.suggested && (
              <Badge className="bg-amber-500 text-white font-bold uppercase text-[10px] px-1.5 py-0.5 h-5 flex items-center justify-center min-w-[20px] shadow-sm shrink-0">
                <Star className="h-2.5 w-2.5 fill-white" />
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="w-full md:w-1/2 aspect-square rounded-2xl bg-muted flex items-center justify-center overflow-hidden shrink-0 relative">
            {settings?.menuShowImages && item.image ? (
              <img
                src={item.image}
                alt={getName()}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <UtensilsCrossed className="w-12 h-12 text-muted-foreground" />
            )}
            {item.smokeEffect && <SteamEffect />}
            {item.fireEffect && <FireEffect />}
            {item.iceEffect && <IceEffect />}
          </div>
          
          <div className="flex-1 space-y-4">
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
                <div className={`flex flex-wrap gap-3 ${isRtl ? 'justify-end' : ''}`}>
                  {getMaterials().map((material: any) => (
                    <div key={material.id} className="flex flex-col items-center gap-1">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border bg-background"
                        title={material.name}
                      >
                        {material.icon ? (
                          <img src={material.icon} alt={material.name} className="w-full h-full object-cover" />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: material.color || '#999' }}
                          >
                            {material.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground text-center max-w-[50px] truncate">
                        {material.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {settings?.menuShowPrices && (
              <div className={`flex items-center gap-3 ${isRtl ? 'justify-end' : ''}`}>
                {hasDiscount ? (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(price)}
                    </span>
                    <span className="text-xl font-semibold text-primary" data-testid="text-modal-item-price">
                      {formatPrice(discountedPrice!)}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-semibold text-primary" data-testid="text-modal-item-price">
                    {formatPrice(price)}
                  </span>
                )}
              </div>
            )}
            
            {settings?.menuShowBuyButton && (
              <>
                <div className={`flex items-center gap-2 ${isRtl ? 'flex-row' : ''}`}>
                  <span className="text-sm font-medium">{t.quantity}:</span>
                  <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
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
                
                <Button
                  onClick={handleAddToCart}
                  className="w-full gap-2 rounded-lg"
                  size="lg"
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {t.addToCart}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
