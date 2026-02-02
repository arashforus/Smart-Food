import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Star, Plus } from 'lucide-react';
import { translations } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import type { MenuItem, Language, Settings } from '@/lib/types';

function SteamEffect() {
  return (
    <div className="steam-container" style={{ '--steam-width': '8px', '--steam-height': '20px', '--steam-blur': '4px' } as any}>
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
      {[...Array(12)].map((_, i) => (
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
      {[...Array(60)].map((_, i) => {
        // Distribute snowflakes strictly along all four sides of the border
        const side = i % 4;
        let top = '0%', left = '0%';
        
        if (side === 0) { // Top border
          top = '0px';
          left = `${Math.random() * 100}%`;
        } else if (side === 1) { // Right border
          left = '100%';
          top = `${Math.random() * 100}%`;
        } else if (side === 2) { // Bottom border
          top = '100%';
          left = `${Math.random() * 100}%`;
        } else { // Left border
          left = '0px';
          top = `${Math.random() * 100}%`;
        }
        
        return (
          <div
            key={i}
            className="ice-snowflake"
            style={{
              '--left': left,
              '--top': top,
              '--size': `${16 + Math.random() * 12}px`,
              '--duration': `${6 + Math.random() * 4}s`,
              'animationDelay': `${Math.random() * 8}s`,
              'transform': 'translate(-50%, -50%)' // Center the snowflake exactly on the border line
            } as React.CSSProperties}
          >
            ❄
          </div>
        );
      })}
    </div>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
  language: Language;
  onClick?: () => void;
  onAddToCart?: (item: MenuItem) => void;
  isSuggested?: boolean;
  viewMode?: 'grid' | 'list';
  settings?: Settings;
}

export default function MenuItemCard({ item, language, onClick, onAddToCart, isSuggested, viewMode = 'list', settings }: MenuItemCardProps) {
  const getName = () => {
    return item.name[language as keyof typeof item.name] || item.name.en || Object.values(item.name)[0] || '';
  };

  const getDescription = () => {
    return item.shortDescription[language as keyof typeof item.shortDescription] || item.shortDescription.en || Object.values(item.shortDescription)[0] || '';
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

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(item);
  };

  if (viewMode === 'grid') {
    return (
      <Card
        className={`hover-elevate active-elevate-2 cursor-pointer border-none shadow-md bg-card/60 backdrop-blur-sm rounded-2xl ${isSuggested || item.suggested ? 'ring-2 ring-amber-500/30' : ''}`}
        onClick={onClick}
        data-testid={`card-menu-item-${item.id}`}
      >
        <CardContent className="p-0">
          <div className="aspect-square w-full rounded-t-2xl bg-muted flex items-center justify-center overflow-hidden relative">
            {settings?.menuShowImages && item.image ? (
              <img
                src={item.image}
                alt={getName()}
                className="w-full h-full object-cover rounded-t-2xl transition-transform duration-500 hover:scale-110"
                loading="lazy"
                data-testid={`img-item-${item.id}`}
              />
            ) : (
              <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
            )}
            {item.smokeEffect && <SteamEffect />}
            {item.fireEffect && <FireEffect />}
            {item.iceEffect && <IceEffect />}
            {(isSuggested || item.suggested) && (
              <div className="absolute top-2 right-2 bg-amber-500 rounded-full p-1">
                <Star className="h-3 w-3 text-white fill-white" />
              </div>
            )}
            {item.isNew && (
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground font-bold uppercase text-[10px] px-2 py-0.5">
                New
              </Badge>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm truncate" data-testid={`text-item-name-${item.id}`}>
              {getName()}
            </h3>
            {settings?.menuShowIngredients && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[2rem]">
                {getDescription()}
              </p>
            )}
            <div className="flex items-center justify-between mt-2">
              {settings?.menuShowPrices && (
                <div className="flex items-center gap-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-sm font-semibold text-primary" data-testid={`text-item-price-${item.id}`}>
                        {formatPrice(discountedPrice!)}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-primary" data-testid={`text-item-price-${item.id}`}>
                      {formatPrice(price)}
                    </span>
                  )}
                </div>
              )}
              {settings?.menuShowBuyButton && (
                <Button
                  size="icon"
                  variant="default"
                  className="h-8 w-8 rounded-full"
                  onClick={handleAddClick}
                  data-testid={`button-add-to-cart-card-${item.id}`}
                  title={t.addToCart}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`hover-elevate active-elevate-2 cursor-pointer border-none shadow-md bg-card/60 backdrop-blur-sm rounded-2xl ${isSuggested || item.suggested ? 'ring-2 ring-amber-500/30' : ''}`}
      onClick={onClick}
      data-testid={`card-menu-item-${item.id}`}
    >
      <CardContent className="p-0 flex h-32">
        {settings?.menuShowImages && (
          <div className="w-32 h-32 flex-shrink-0 bg-muted flex items-center justify-center overflow-hidden relative rounded-s-2xl">
            {item.image ? (
              <img
                src={item.image}
                alt={getName()}
                className="w-full h-full object-cover rounded-s-2xl"
                loading="lazy"
                data-testid={`img-item-${item.id}`}
              />
            ) : (
              <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
            )}
            {item.smokeEffect && <SteamEffect />}
            {item.fireEffect && <FireEffect />}
            {item.iceEffect && <IceEffect />}
            {(isSuggested || item.suggested) && (
              <div className="absolute top-1 inset-inline-end-1 bg-amber-500 rounded-full p-0.5">
                <Star className="h-3 w-3 text-white fill-white" />
              </div>
            )}
            {item.isNew && (
              <div className="absolute top-1 inset-inline-start-1 bg-primary text-primary-foreground font-bold uppercase text-[10px] px-2 py-0.5 rounded-full">
                New
              </div>
            )}
          </div>
        )}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-base truncate" data-testid={`text-item-name-${item.id}`}>
                {getName()}
              </h3>
              {settings?.menuShowPrices && (
                <div className="flex flex-col items-end">
                  {hasDiscount ? (
                    <>
                      <span className="text-base font-semibold text-primary" data-testid={`text-item-price-${item.id}`}>
                        {formatPrice(discountedPrice!)}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-base font-semibold text-primary" data-testid={`text-item-price-${item.id}`}>
                      {formatPrice(price)}
                    </span>
                  )}
                </div>
              )}
            </div>
            {settings?.menuShowIngredients && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {getDescription()}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex gap-1">
              {settings?.menuShowFoodTypes && item.types?.slice(0, 2).map((typeId) => (
                <Badge key={typeId} variant="secondary" className="text-[10px] py-0 px-1.5 h-4 font-normal">
                  {typeId}
                </Badge>
              ))}
            </div>
            {settings?.menuShowBuyButton && (
              <Button
                size="sm"
                variant="default"
                className="rounded-full h-8 px-4 flex items-center gap-1"
                onClick={handleAddClick}
                data-testid={`button-add-to-cart-card-${item.id}`}
                title={t.addToCart}
              >
                <Plus className="h-4 w-4" />
                {t.add || 'Add'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
