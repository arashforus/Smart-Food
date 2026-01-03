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
    <div className="bg-background/40 backdrop-blur-sm py-8 px-4 overflow-hidden">
      <div className={`max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 transition-all duration-500`}>
        <motion.div
          key="header-content"
          layout
          className={`flex flex-col items-center transition-all duration-500 ${isOpen ? (isRtl ? 'md:items-end' : 'md:items-start') : 'items-center'}`}
        >
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
            <h1 className={`text-3xl font-bold mb-2 tracking-tight ${isOpen ? (isRtl ? 'text-right' : 'text-left md:text-left') : 'text-center'}`} data-testid="text-restaurant-name">
              {restaurant.name}
            </h1>
          )}
          {settings?.menuShowRestaurantDescription && (
            <p className={`text-base text-muted-foreground leading-relaxed max-w-lg ${isOpen ? (isRtl ? 'text-right' : 'text-left') : 'text-center'}`}>
              {restaurant.description}
            </p>
          )}

          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-6 group"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-toggle-info"
            >
              {t.aboutUs}
              <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${isOpen ? (isRtl ? '-rotate-180' : 'rotate-180') : 'rotate-0'}`} />
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0, height: 0,x: isRtl ? -100 : 100 }}
              animate={{ opacity: 1, width: '50%', height: 'auto', x: 0 }}
              exit={{ opacity: 0, width: 0, height: 0, x: isRtl ? -100 : 100 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <Card className="border-none shadow-none bg-card/40 backdrop-blur-md min-w-[300px] md:min-w-[400px]">
                <CardContent className="p-6">
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isRtl ? 'md:divide-x-reverse md:divide-x' : 'md:divide-x'} divide-border`}>
                    {/* Left Column: Hours */}
                    <div className="space-y-4">
                      {settings?.menuShowOperationHours && restaurant.hours && (
                        <div className={`flex flex-col gap-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                          <div className={`flex items-center gap-2 mb-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <Clock className="h-5 w-5 text-primary" />
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.hours}</p>
                          </div>
                          <div className="grid grid-cols-1 gap-1">
                            {(() => {
                              try {
                                const hours = JSON.parse(restaurant.hours);
                                return Object.entries(hours).map(([day, config]: [string, any]) => (
                                  <div key={day} className={`flex items-center justify-between py-0.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-xs font-medium">{day}</span>
                                    <span className={`text-xs ${config.closed ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                                      {config.closed ? 'Closed' : `${config.start} - ${config.end}`}
                                    </span>
                                  </div>
                                ));
                              } catch (e) {
                                return <p className="text-xs">{restaurant.hours}</p>;
                              }
                            })()}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Address and Phone */}
                    <div className={`space-y-6 ${isRtl ? 'md:pr-8' : 'md:pl-8'}`}>
                      <div className="space-y-4">
                        <div className={`flex items-start gap-4 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}>
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.address}</p>
                            <p className="text-sm mt-1 font-medium" data-testid="text-restaurant-address">{restaurant.address}</p>
                            {settings?.restaurantGoogleMapsUrl && (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 mt-2 text-primary hover-elevate"
                                onClick={() => window.open(settings.restaurantGoogleMapsUrl, '_blank')}
                                data-testid="button-show-on-map"
                              >
                                Show on Map
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className={`flex items-start gap-4 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}>
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Phone className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.phone}</p>
                            <p className="text-sm mt-1 font-medium" data-testid="text-restaurant-phone">{restaurant.phone}</p>
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 mt-2 text-primary hover-elevate"
                              onClick={() => window.open(`tel:${restaurant.phone}`, '_self')}
                              data-testid="button-call-now"
                            >
                              Call Now
                            </Button>
                          </div>
                        </div>
                      </div>
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
