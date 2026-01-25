import { MapPin, Phone, Clock, ChevronRight, ChevronDown, ChevronUp, X, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
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
  const [isRestaurantOpen, setIsRestaurantOpen] = useState<boolean | null>(null);
  const t = translations[language] || translations.en;
  const isRtl = language === 'fa' || language === 'ar';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const checkOpenStatus = () => {
      try {
        if (!restaurant.hours) {
          setIsRestaurantOpen(null);
          return;
        }

        const hours = typeof restaurant.hours === 'string' && restaurant.hours.trim() !== '' ? JSON.parse(restaurant.hours) : restaurant.hours;
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDay = days[now.getDay()];
        const dayConfig = hours[currentDay];

        if (!dayConfig || dayConfig.closed) {
          setIsRestaurantOpen(false);
          return;
        }

        const [startHours, startMinutes] = dayConfig.start.split(':').map(Number);
        const [endHours, endMinutes] = dayConfig.end.split(':').map(Number);
        
        const startTime = new Date(now);
        startTime.setHours(startHours, startMinutes, 0);
        
        const endTime = new Date(now);
        endTime.setHours(endHours, endMinutes, 0);

        // Handle case where closing time is after midnight (e.g., 02:00)
        if (endTime < startTime) {
          endTime.setDate(endTime.getDate() + 1);
        }

        setIsRestaurantOpen(now >= startTime && now <= endTime);
      } catch (e) {
        console.error('Error parsing restaurant hours:', e);
        setIsRestaurantOpen(null);
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [restaurant.hours]);

  if (!settings?.menuShowRestaurantName && !settings?.menuShowRestaurantDescription && !settings?.menuShowRestaurantLogo) {
    return null;
  }

  return (
    <div className="bg-background/40 backdrop-blur-sm py-8 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 transition-all duration-500">
        <motion.div
          key="header-content"
          layout
          className="flex flex-col items-center transition-all duration-500 text-center"
        >
          {settings?.menuShowRestaurantLogo && settings.restaurantLogo && (
            <div className="flex justify-center mb-4">
              <img 
                src={settings.restaurantLogo} 
                alt={restaurant.name} 
                className="h-24 w-auto max-w-[200px] object-contain"
                data-testid="img-restaurant-logo"
              />
            </div>
          )}
          {settings?.menuShowRestaurantName && (
            <div className="flex flex-col items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-center" data-testid="text-restaurant-name">
                {restaurant.name}
              </h1>
              {isRestaurantOpen !== null && (
                <Badge 
                  variant={isRestaurantOpen ? "default" : "destructive"}
                  className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                    isRestaurantOpen 
                      ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20" 
                      : "bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20"
                  }`}
                >
                  <Circle className={`h-2 w-2 fill-current ${isRestaurantOpen ? "animate-pulse" : ""}`} />
                  {isRestaurantOpen ? (language === 'fa' ? 'باز است' : 'OPEN') : (language === 'fa' ? 'بسته است' : 'CLOSED')}
                </Badge>
              )}
            </div>
          )}
          {settings?.menuShowRestaurantDescription && (
            <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
              {restaurant.description}
            </p>
          )}

          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-6 group flex items-center gap-2"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-toggle-info"
            >
              {t.aboutUs}
              {isMobile ? (
                isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? (isRtl ? '-rotate-180' : 'rotate-180') : 'rotate-0'} ${isRtl ? 'scale-x-[-1]' : ''}`} />
              )}
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={isMobile ? { opacity: 0, height: 0 } : { opacity: 0, height: 0, width: 0 }}
              animate={isMobile ? { opacity: 1, height: 'auto', width: '90%' } : { opacity: 1, height: 'auto', width: '50%' }}
              exit={isMobile ? { opacity: 0, height: 0 } : { opacity: 0, height: 0, width: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden w-full flex justify-center"
            >
              <Card className="border-none shadow-none bg-card/40 backdrop-blur-md w-full md:min-w-[400px]">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-0">
                    {/* Left Column: Hours */}
                    <div className="flex-1 space-y-3">
                      {settings?.menuShowOperationHours && restaurant.hours && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 mb-0.5">
                            <Clock className={`h-4 w-4 text-primary ${isRtl ? 'scale-x-[-1]' : ''}`} />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t.hours}</p>
                          </div>
                          <div className="grid grid-cols-1 gap-0.5">
                            {(() => {
                              try {
                                const hours = typeof restaurant.hours === 'string' && restaurant.hours.trim() !== '' ? JSON.parse(restaurant.hours) : restaurant.hours;
                                return Object.entries(hours).map(([day, config]: [string, any]) => (
                                  <div key={day} className="flex items-center justify-between py-0">
                                    <span className="text-[11px] font-medium">{day}</span>
                                    <span className={`text-[11px] ${config.closed ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                                      {config.closed ? (language === 'fa' ? 'بسته' : 'Closed') : `${config.start} - ${config.end}`}
                                    </span>
                                  </div>
                                ));
                              } catch (e) {
                                return <p className="text-[11px]">{restaurant.hours}</p>;
                              }
                            })()}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Middle Divider - Responsive (Horizontal on mobile, Vertical on desktop) */}
                    <div className="md:px-8 flex items-center justify-center">
                      <div className="w-full h-[1px] md:h-full md:w-[1px] bg-border/50" />
                    </div>

                    {/* Right Column: Address and Phone */}
                    <div className="flex-1 space-y-4">
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <MapPin className={`h-4 w-4 text-primary ${isRtl ? 'scale-x-[-1]' : ''}`} />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t.address}</p>
                          </div>
                          <div className="flex-1 flex flex-col items-center md:items-start">
                            <p className="text-[12px] font-medium leading-tight text-inherit" data-testid="text-restaurant-address">{restaurant.address}</p>
                            {settings?.restaurantGoogleMapsUrl && (
                              <div className="mt-2 w-full flex justify-center md:justify-start">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-4 text-[11px] text-primary hover-elevate gap-2 rounded-full border-primary/20 bg-primary/5 font-medium w-full max-w-[160px]"
                                  onClick={() => window.open(settings.restaurantGoogleMapsUrl, '_blank')}
                                  data-testid="button-show-on-map"
                                >
                                  <MapPin className={`h-3.5 w-3.5 ${isRtl ? 'scale-x-[-1]' : ''}`} />
                                  {language === 'fa' ? 'نمایش روی نقشه' : 'Show on Map'}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="border-t border-border/30 my-2" />

                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Phone className={`h-4 w-4 text-primary ${isRtl ? 'scale-x-[-1]' : ''}`} />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t.phone}</p>
                          </div>
                          <div className="flex-1 flex flex-col items-center md:items-start">
                            <p className="text-[12px] font-medium leading-tight text-inherit" data-testid="text-restaurant-phone">{restaurant.phone}</p>
                            <div className="mt-2 w-full flex justify-center md:justify-start">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-4 text-[11px] text-primary hover-elevate gap-2 rounded-full border-primary/20 bg-primary/5 font-medium w-full max-w-[160px]"
                                onClick={() => window.open(`tel:${restaurant.phone}`, '_self')}
                                data-testid="button-call-now"
                              >
                                <Phone className={`h-3.5 w-3.5 ${isRtl ? 'scale-x-[-1]' : ''}`} />
                                {language === 'fa' ? 'تماس بگیرید' : 'Call Now'}
                              </Button>
                            </div>
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
