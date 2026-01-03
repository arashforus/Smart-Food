import { MapPin, Phone, Clock, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { Restaurant, Language, Settings } from '@/lib/types';
import { translations } from '@/lib/types';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  language: Language;
  settings?: Settings;
}

export default function RestaurantHeader({ restaurant, language, settings }: RestaurantHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[language] || translations.en;

  if (!settings?.menuShowRestaurantName && !settings?.menuShowRestaurantDescription && !settings?.menuShowRestaurantLogo) {
    return null;
  }

  return (
    <div className="bg-background/40 backdrop-blur-sm">
      <div className="text-center py-8 px-4">
        {settings?.menuShowRestaurantLogo && settings.restaurantLogo && (
          <div className="flex justify-center mb-4">
            <img 
              src={settings.restaurantLogo} 
              alt={restaurant.name} 
              className="h-20 w-20 object-contain rounded-full border-2 border-primary/20 p-1"
              data-testid="img-restaurant-logo"
            />
          </div>
        )}
        {settings?.menuShowRestaurantName && (
          <h1 className="text-3xl font-bold mb-2 tracking-tight" data-testid="text-restaurant-name">
            {restaurant.name}
          </h1>
        )}
        {settings?.menuShowRestaurantDescription && (
          <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {restaurant.description}
          </p>
        )}
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex justify-center pb-6">
            <Button variant="outline" size="sm" className="rounded-full px-6" data-testid="button-toggle-info">
              {t.aboutUs}
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mx-4 mb-6 border-none shadow-xl bg-card/80 backdrop-blur-md">
            <CardContent className="p-6 space-y-5">
              {settings?.menuShowOperationHours && restaurant.hours && (
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.hours}</p>
                    <p className="text-sm mt-0.5" data-testid="text-restaurant-hours">{restaurant.hours}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.address}</p>
                  <p className="text-sm mt-0.5" data-testid="text-restaurant-address">{restaurant.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.phone}</p>
                  <p className="text-sm mt-0.5" data-testid="text-restaurant-phone">{restaurant.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
