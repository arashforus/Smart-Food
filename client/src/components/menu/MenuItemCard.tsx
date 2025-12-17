import { Card, CardContent } from '@/components/ui/card';
import { UtensilsCrossed, Star } from 'lucide-react';
import type { MenuItem, Language } from '@/lib/types';

interface MenuItemCardProps {
  item: MenuItem;
  language: Language;
  onClick?: () => void;
  isSuggested?: boolean;
}

export default function MenuItemCard({ item, language, onClick, isSuggested }: MenuItemCardProps) {
  const getName = () => {
    return item.name[language] || item.name.en || Object.values(item.name)[0] || '';
  };

  const getDescription = () => {
    return item.shortDescription[language] || item.shortDescription.en || Object.values(item.shortDescription)[0] || '';
  };

  const isRtl = language === 'fa';

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
            <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
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
          <div className="flex items-center gap-2 mt-1">
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
        </div>
      </CardContent>
    </Card>
  );
}
