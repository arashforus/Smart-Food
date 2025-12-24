import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Star, ShoppingCart } from 'lucide-react';
import { translations } from '@/lib/types';
import type { MenuItem, Language } from '@/lib/types';

interface MenuItemCardProps {
  item: MenuItem;
  language: Language;
  onClick?: () => void;
  onAddToCart?: (item: MenuItem) => void;
  isSuggested?: boolean;
  viewMode?: 'grid' | 'list';
}

export default function MenuItemCard({ item, language, onClick, onAddToCart, isSuggested, viewMode = 'list' }: MenuItemCardProps) {
  const getName = () => {
    return item.name[language] || item.name.en || Object.values(item.name)[0] || '';
  };

  const getDescription = () => {
    return item.shortDescription[language] || item.shortDescription.en || Object.values(item.shortDescription)[0] || '';
  };

  const t = translations[language] || translations.en;
  const isRtl = language === 'fa';

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(item);
  };

  if (viewMode === 'grid') {
    return (
      <Card
        className={`hover-elevate active-elevate-2 cursor-pointer ${isSuggested ? 'ring-2 ring-amber-500/30' : ''}`}
        onClick={onClick}
        data-testid={`card-menu-item-${item.id}`}
      >
        <CardContent className="p-0">
          <div className="aspect-square w-full rounded-t-md bg-muted flex items-center justify-center overflow-hidden relative">
            {item.image ? (
              <img
                src={item.image}
                alt={getName()}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-image w-5 h-5 text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
            )}
            {isSuggested && (
              <div className="absolute top-2 right-2 bg-amber-500 rounded-full p-1">
                <Star className="h-3 w-3 text-white fill-white" />
              </div>
            )}
          </div>
          <div className={`p-3 ${isRtl ? 'text-right' : ''}`}>
            <h3 className="font-medium text-sm truncate" data-testid={`text-item-name-${item.id}`}>
              {getName()}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[2rem]">
              {getDescription()}
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                {item.discountedPrice ? (
                  <>
                    <span className="text-sm font-semibold text-primary" data-testid={`text-item-price-${item.id}`}>
                      ${item.discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      ${item.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-primary" data-testid={`text-item-price-${item.id}`}>
                    ${item.price.toFixed(2)}
                  </span>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleAddClick}
                data-testid={`button-add-to-cart-card-${item.id}`}
                title={t.addToCart}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`hover-elevate active-elevate-2 cursor-pointer ${isSuggested ? 'ring-2 ring-amber-500/30' : ''}`}
      onClick={onClick}
      data-testid={`card-menu-item-${item.id}`}
    >
      <CardContent className={`p-3 flex gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className="w-20 h-20 flex-shrink-0 rounded-md bg-muted flex items-center justify-center overflow-hidden relative">
          {item.image ? (
            <img
              src={item.image}
              alt={getName()}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-image w-5 h-5 text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
          )}
          {isSuggested && (
            <div className="absolute top-1 right-1 bg-amber-500 rounded-full p-0.5">
              <Star className="h-3 w-3 text-white fill-white" />
            </div>
          )}
        </div>
        <div className={`flex-1 min-w-0 flex flex-col justify-between ${isRtl ? 'text-right' : ''}`}>
          <div>
            <h3 className="font-medium text-base truncate" data-testid={`text-item-name-${item.id}`}>
              {getName()}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
              {getDescription()}
            </p>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              {item.discountedPrice ? (
                <>
                  <span className="text-base font-semibold text-primary" data-testid={`text-item-price-${item.id}`}>
                    ${item.discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${item.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-base font-semibold text-primary" data-testid={`text-item-price-${item.id}`}>
                  ${item.price.toFixed(2)}
                </span>
              )}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleAddClick}
              data-testid={`button-add-to-cart-card-${item.id}`}
              title={t.addToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
