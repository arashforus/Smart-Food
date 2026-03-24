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
      {/* Frosted glass gradients from all edges, heavier at corners */}
      <div className="ice-frost-frame" />

      {/* Icicle spikes — top edge dripping down */}
      <svg className="ice-icicles-top" viewBox="0 0 300 32" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="icicle-grad-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(220,245,255,0.95)" />
            <stop offset="100%" stopColor="rgba(190,230,255,0.0)"  />
          </linearGradient>
        </defs>
        <path
          d="M0,0 L0,10 L9,26 L18,8 L27,22 L36,5 L45,20 L54,10 L63,28 L72,7 L81,19 L90,4 L99,24 L108,11 L117,22 L126,3 L135,18 L144,9 L153,27 L162,6 L171,20 L180,8 L189,25 L198,10 L207,21 L216,5 L225,17 L234,9 L243,26 L252,12 L261,22 L270,4 L279,18 L288,8 L297,23 L300,14 L300,0 Z"
          fill="url(#icicle-grad-top)"
        />
      </svg>

      {/* Icicle spikes — bottom edge dripping up */}
      <svg className="ice-icicles-bottom" viewBox="0 0 300 32" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="icicle-grad-bottom" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="rgba(220,245,255,0.95)" />
            <stop offset="100%" stopColor="rgba(190,230,255,0.0)"  />
          </linearGradient>
        </defs>
        <path
          d="M0,32 L0,22 L9,6 L18,24 L27,10 L36,27 L45,12 L54,22 L63,4 L72,25 L81,13 L90,28 L99,8 L108,21 L117,10 L126,29 L135,14 L144,23 L153,5 L162,26 L171,12 L180,24 L189,7 L198,22 L207,11 L216,27 L225,15 L234,23 L243,6 L252,20 L261,10 L270,28 L279,14 L288,24 L297,9 L300,18 L300,32 Z"
          fill="url(#icicle-grad-bottom)"
        />
      </svg>

      {/* Icicle spikes — left edge dripping right */}
      <svg className="ice-icicles-left" viewBox="0 0 32 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="icicle-grad-left" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(220,245,255,0.95)" />
            <stop offset="100%" stopColor="rgba(190,230,255,0.0)"  />
          </linearGradient>
        </defs>
        <path
          d="M0,0 L10,0 L26,9 L8,18 L22,27 L5,36 L20,45 L10,54 L28,63 L7,72 L19,81 L4,90 L24,99 L11,108 L22,117 L3,126 L18,135 L9,144 L27,153 L6,162 L20,171 L8,180 L25,189 L10,198 L21,207 L5,216 L17,225 L9,234 L26,243 L12,252 L22,261 L4,270 L18,279 L8,288 L23,297 L14,300 L0,300 Z"
          fill="url(#icicle-grad-left)"
        />
      </svg>

      {/* Icicle spikes — right edge dripping left */}
      <svg className="ice-icicles-right" viewBox="0 0 32 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="icicle-grad-right" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%"   stopColor="rgba(220,245,255,0.95)" />
            <stop offset="100%" stopColor="rgba(190,230,255,0.0)"  />
          </linearGradient>
        </defs>
        <path
          d="M32,0 L22,0 L6,9 L24,18 L10,27 L27,36 L12,45 L22,54 L4,63 L25,72 L13,81 L28,90 L8,99 L21,108 L10,117 L29,126 L14,135 L23,144 L5,153 L26,162 L12,171 L24,180 L7,189 L22,198 L11,207 L27,216 L15,225 L23,234 L6,243 L20,252 L10,261 L28,270 L14,279 L24,288 L9,297 L18,300 L32,300 Z"
          fill="url(#icicle-grad-right)"
        />
      </svg>

      {/* Animated shimmer sweep across the surface */}
      <div className="ice-frost-shimmer" />
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
