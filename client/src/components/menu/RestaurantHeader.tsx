import { MapPin, Phone, Clock, ChevronRight, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const isRtl = language === 'fa' || language === 'ar';

  if (!settings?.menuShowRestaurantName && !settings?.menuShowRestaurantDescription && !settings?.menuShowRestaurantLogo) {
    return null;
  }

  return (
    <div className="bg-background/40 backdrop-blur-sm py-8 px-4">
      <div className={`max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 ${isRtl ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
        <motion.div
          key="header-content"
          layout
          className="flex-1 w-full"
        >
          {settings?.menuShowRestaurantLogo && settings.restaurantLogo && (
            <div className={`flex mb-4 ${isRtl ? 'justify-end' : 'justify-start'}`}>
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
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              {restaurant.description}
            </p>
          )}

          <div className="flex mt-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-6 group"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-toggle-info"
            >
              {t.aboutUs}
              <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, height: 0 }}
              animate={{ opacity: 1, scale: 1, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.95, height: 0 }}
              className="flex-1 w-full"
            >
              <Card className="border-none shadow-xl bg-card/80 backdrop-blur-md overflow-hidden">
                <CardContent className="p-6 space-y-5">
                  <h2 className="text-xl font-bold mb-4">{t.aboutUs}</h2>
                  
                  {settings?.menuShowOperationHours && restaurant.hours && (
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.hours}</p>
                        <p className="text-sm mt-1" data-testid="text-restaurant-hours">{restaurant.hours}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.address}</p>
                      <p className="text-sm mt-1" data-testid="text-restaurant-address">{restaurant.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.phone}</p>
                      <p className="text-sm mt-1" data-testid="text-restaurant-phone">{restaurant.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
