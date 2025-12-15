import { MapPin, Phone, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { Restaurant, Language } from '@/lib/types';
import { translations } from '@/lib/types';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  language: Language;
}

export default function RestaurantHeader({ restaurant, language }: RestaurantHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[language];

  return (
    <div className="bg-background">
      <div className="text-center py-6 px-4">
        <h1 className="text-2xl font-semibold mb-2" data-testid="text-restaurant-name">
          {restaurant.name}
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {restaurant.description}
        </p>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex justify-center pb-4">
            <Button variant="ghost" size="sm" data-testid="button-toggle-info">
              {t.aboutUs}
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mx-4 mb-4">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t.hours}</p>
                  <p className="text-sm" data-testid="text-restaurant-hours">{restaurant.hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t.address}</p>
                  <p className="text-sm" data-testid="text-restaurant-address">{restaurant.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t.phone}</p>
                  <p className="text-sm" data-testid="text-restaurant-phone">{restaurant.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
