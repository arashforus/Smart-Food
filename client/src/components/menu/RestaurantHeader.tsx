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

  const panelVariants = {
    closed: {
      x: isRtl ? '100%' : '-100%',
      opacity: 0,
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    },
    exit: {
      x: isRtl ? '100%' : '-100%',
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const contentVariants = {
    closed: {
      x: 0,
      textAlign: 'center' as const,
    },
    open: {
      x: isRtl ? '-100%' : '100%',
      textAlign: isRtl ? 'right' : 'left' as const,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    }
  };

  return (
    <div className="relative overflow-hidden bg-background/40 backdrop-blur-sm min-h-[250px] flex items-center justify-center py-8 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key="header-content"
          variants={contentVariants}
          animate={isOpen ? "open" : "closed"}
          className={`z-10 w-full max-w-lg transition-all duration-500 ${isOpen ? (isRtl ? 'pr-8' : 'pl-8') : ''}`}
        >
          {settings?.menuShowRestaurantLogo && settings.restaurantLogo && (
            <div className={`flex mb-4 ${isOpen ? (isRtl ? 'justify-end' : 'justify-start') : 'justify-center'}`}>
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
            <p className="text-base text-muted-foreground leading-relaxed">
              {restaurant.description}
            </p>
          )}

          {!isOpen && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full px-6 group"
                onClick={() => setIsOpen(true)}
                data-testid="button-toggle-info"
              >
                {t.aboutUs}
                <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${isRtl ? 'rotate-180' : ''} group-hover:translate-x-1`} />
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className={`absolute top-0 bottom-0 ${isRtl ? 'left-0 border-r' : 'right-0 border-l'} w-[80%] md:w-[60%] bg-card/95 backdrop-blur-xl shadow-2xl z-20 flex flex-col p-6`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{t.aboutUs}</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6 overflow-y-auto pr-2">
              {settings?.menuShowOperationHours && restaurant.hours && (
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.hours}</p>
                    <p className="text-sm mt-1 font-medium leading-snug" data-testid="text-restaurant-hours">{restaurant.hours}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.address}</p>
                  <p className="text-sm mt-1 font-medium leading-snug" data-testid="text-restaurant-address">{restaurant.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.phone}</p>
                  <p className="text-sm mt-1 font-medium leading-snug" data-testid="text-restaurant-phone">{restaurant.phone}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
