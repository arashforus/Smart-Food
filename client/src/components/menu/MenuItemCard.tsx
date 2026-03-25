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

function SteamEffect({ viewMode = 'list' }: { viewMode?: 'grid' | 'list' }) {
      const isGrid = viewMode === 'grid';
      return (
        <div className="steam-container" style={{
          '--steam-width':  isGrid ? '15px'   : '8px',
          '--steam-height': isGrid ? '28px'   : '20px',
          '--steam-blur':   isGrid ? '6px'    : '4px',
          '--steam-travel': isGrid ? '-60px' : '-40px',
        } as any}>
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
      {/* Breathing glow — corners only */}
      <div className="ice-frost-corners" />

      {/* Snow drift — top edge, soft rounded mounds */}
      <svg className="ice-icicles-top" viewBox="0 0 300 32" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="icicle-grad-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(248,252,255,0.97)" />
            <stop offset="100%" stopColor="rgba(220,240,255,0.0)"  />
          </linearGradient>
        </defs>
        <path
          d="M0,0 L0,13 Q12,25 26,17 Q40,9 54,21 Q68,31 83,18 Q98,5 112,15 Q126,24 140,14 Q154,4 168,17 Q182,28 196,17 Q210,6 224,13 Q238,20 252,24 Q266,28 280,16 Q294,4 300,11 L300,0 Z"
          fill="url(#icicle-grad-top)"
        />
      </svg>

      {/* Snow drift — bottom edge, soft rounded mounds */}
      <svg className="ice-icicles-bottom" viewBox="0 0 300 32" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="icicle-grad-bottom" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="rgba(248,252,255,0.97)" />
            <stop offset="100%" stopColor="rgba(220,240,255,0.0)"  />
          </linearGradient>
        </defs>
        <path
          d="M0,32 L0,19 Q12,7 26,15 Q40,23 54,11 Q68,1 83,14 Q98,27 112,17 Q126,8 140,18 Q154,28 168,15 Q182,4 196,15 Q210,26 224,19 Q238,12 252,8 Q266,4 280,16 Q294,28 300,21 L300,32 Z"
          fill="url(#icicle-grad-bottom)"
        />
      </svg>

      {/* Snow drift — left edge, soft rounded mounds */}
      <svg className="ice-icicles-left" viewBox="0 0 32 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="icicle-grad-left" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(248,252,255,0.97)" />
            <stop offset="100%" stopColor="rgba(220,240,255,0.0)"  />
          </linearGradient>
        </defs>
        <path
          d="M0,0 L13,0 Q25,12 17,26 Q9,40 21,54 Q31,68 18,83 Q5,98 15,112 Q24,126 14,140 Q4,154 17,168 Q28,182 17,196 Q6,210 13,224 Q20,238 24,252 Q28,266 16,280 Q4,294 11,300 L0,300 Z"
          fill="url(#icicle-grad-left)"
        />
      </svg>

      {/* Snow drift — right edge, soft rounded mounds */}
      <svg className="ice-icicles-right" viewBox="0 0 32 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="icicle-grad-right" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%"   stopColor="rgba(248,252,255,0.97)" />
            <stop offset="100%" stopColor="rgba(220,240,255,0.0)"  />
          </linearGradient>
        </defs>
        <path
          d="M32,0 L19,0 Q7,12 15,26 Q23,40 11,54 Q1,68 14,83 Q27,98 17,112 Q8,126 18,140 Q28,154 15,168 Q4,182 15,196 Q26,210 19,224 Q12,238 8,252 Q4,266 16,280 Q28,294 21,300 L32,300 Z"
          fill="url(#icicle-grad-right)"
        />
      </svg>

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
            {item.smokeEffect && <SteamEffect viewMode="grid" />}
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
            {item.smokeEffect && <SteamEffect viewMode="list" />}
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
