import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Star, Plus, Leaf } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Badge } from '@/components/ui/badge';
import type { MenuItem, Language, Settings, FoodType } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

function getDynamicIcon(name?: string | null) {
  if (!name) return Leaf;
  const Icon = (LucideIcons as any)[name];
  return Icon || Leaf;
}

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
      {[...Array(25)].map((_, i) => {
        // Distribute snowflakes strictly along all four sides of the border
        const type = i % 4; // 0: top, 1: left, 2: bottom, 3: right
        let top = '0%', left = '0%';
        let clipPath = '';
        
        if (type === 0) { // top
          top = '-20%';
          left = `${Math.random() * 100}%`;
          clipPath = 'inset(0% -100% -100% -100%)';
        } else if (type === 1) { // left
          left = '-10%';
          top = `${Math.random() * 100}%`;
          clipPath = 'inset(-100% -100% -100% 0%)';
        } else if (type === 2) { // bottom
          top = '85%';
          left = `${Math.random() * 100}%`;
          clipPath = 'inset(-100% -100% 0% -100%)';
        } else { // right
          left = '95%';
          top = `${Math.random() * 100}%`;
          clipPath = 'inset(-100% 0% -100% -100%)';
        }
        
        return (
          <div
            key={i}
            className="ice-snowflake"
            style={{
              '--left': left,
              '--top': top,
              '--size': `${20 + Math.random() * 12}px`,
              '--duration': `${8 + Math.random() * 4}s`,
              'animationDelay': `${Math.random() * 8}s`,
              'transform': 'translate(-50%, -50%)',
              'clipPath': clipPath
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

  const { t, dir } = useLanguage();
  const isRtl = dir === 'rtl';

  const price = Number(item.price);
  const discountedPrice = item.discountedPrice ? Number(item.discountedPrice) : null;
  const hasDiscount = discountedPrice !== null && discountedPrice < price;

  const currencySymbol = settings?.currencySymbol || '$';
  const currencyPosition = settings?.currencyPosition || 'after';

  const formatPrice = (p: number) => {
    const decimalPlaces = settings?.currencyDecimal ?? 2;
    const formattedPrice = p.toFixed(decimalPlaces);
    return currencyPosition === 'before' ? `${currencySymbol}${formattedPrice}` : `${formattedPrice}${currencySymbol}`;
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
          </div>
            <div className="p-3">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-medium text-sm truncate" data-testid={`text-item-name-${item.id}`}>
                {getName()}
              </h3>
              {item.isNew && (
                <Badge className="bg-primary text-primary-foreground font-bold uppercase text-[10px] px-2 py-0.5 h-auto">
                  {t('new')}
                </Badge>
              )}
              {(isSuggested || item.suggested) && (
                <Badge className="bg-amber-500 text-white font-bold uppercase text-[10px] px-2 py-1 h-auto items-center justify-center min-w-[24px]">
                  <Star className="h-2.5 w-2.5 fill-white" />
                </Badge>
              )}
            </div>
            {settings?.menuShowFoodTypes && item.types && item.types.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {item.types.map((typeId) => {
                  const { data: foodTypes = [] } = useQuery<FoodType[]>({
                    queryKey: ['/api/food-types'],
                  });
                  const type = foodTypes.find(t => t.id === typeId);
                  if (!type) return null;
                  const IconComponent = getDynamicIcon(type.icon);
                  return (
                    <Badge 
                      key={typeId} 
                      variant="outline" 
                      className="text-[9px] py-0 px-1.5 h-4 font-medium gap-1"
                      style={{
                        borderColor: type.color,
                        color: type.color,
                        backgroundColor: 'transparent'
                      }}
                    >
                      <IconComponent className="w-2.5 h-2.5" />
                      {type.name[language as keyof typeof type.name] || type.name.en}
                    </Badge>
                  );
                })}
              </div>
            )}
            {settings?.menuShowIngredients && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[2rem] text-start">
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
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <CardContent className="p-0 flex h-32">
        {settings?.menuShowImages && (
          <div className={`w-32 h-32 flex-shrink-0 bg-muted flex items-center justify-center overflow-hidden relative rounded-s-2xl`}>
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
          </div>
        )}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start gap-2">
              <div className="flex flex-col truncate min-w-0">
                <div className="flex items-center gap-2 truncate">
                  <h3 className="font-bold text-base truncate" data-testid={`text-item-name-${item.id}`}>
                    {getName()}
                  </h3>
                  {item.isNew && (
                    <Badge className="bg-primary text-primary-foreground font-bold uppercase text-[10px] px-2 py-0.5 h-auto flex-shrink-0">
                      {t('new')}
                    </Badge>
                  )}
                  {(isSuggested || item.suggested) && (
                    <Badge className="bg-amber-500 text-white font-bold uppercase text-[10px] px-2 py-1 h-auto flex-shrink-0 flex items-center justify-center min-w-[24px]">
                      <Star className="h-2.5 w-2.5 fill-white" />
                    </Badge>
                  )}
                </div>
                {settings?.menuShowFoodTypes && item.types && item.types.length > 0 && (
                  <div className={`flex flex-wrap gap-1 mt-0.5`}>
                    {item.types.map((typeId) => {
                      const { data: foodTypes = [] } = useQuery<FoodType[]>({
                        queryKey: ['/api/food-types'],
                      });
                      const type = foodTypes.find(t => t.id === typeId);
                      if (!type) return null;
                      const IconComponent = getDynamicIcon(type.icon);
                      return (
                        <Badge 
                          key={typeId} 
                          variant="outline" 
                          className={`text-[10px] py-0 px-1.5 h-4 font-medium gap-1 `}
                          style={{
                            borderColor: type.color,
                            color: type.color,
                            backgroundColor: 'transparent'
                          }}
                        >
                          <IconComponent className="w-3 h-3" />
                          {type.name[language as keyof typeof type.name] || type.name.en}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
              {settings?.menuShowPrices && (
                <div className={`flex flex-col item-end`}>
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
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1 text-start">
                {getDescription()}
              </p>
            )}
          </div>
          <div className={`flex items-center justify-between mt-1 `}>
            <div className="flex gap-1" />
            {settings?.menuShowBuyButton && (
              <Button
                size="sm"
                variant="default"
                className={`rounded-full h-8 px-4 flex items-center gap-1 `}
                onClick={handleAddClick}
                data-testid={`button-add-to-cart-card-${item.id}`}
                title={t('addToCart')}
              >
                <Plus className="h-4 w-4" />
                {t('add')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
