import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { translations } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedWelcomeProps {
  texts: string[];
  isVisible: boolean;
}

function AnimatedWelcome({ texts, isVisible }: AnimatedWelcomeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedTexts = texts && texts.length > 0 ? texts : ['Welcome'];

  useEffect(() => {
    if (!isVisible || animatedTexts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isVisible, animatedTexts.length]);

  if (!isVisible) return null;

  return (
    <div className="h-20 flex items-center justify-center mb-8">
      <AnimatePresence mode="wait">
        <motion.h2
          key={currentIndex}
          initial={{ 
            opacity: 0, 
            filter: 'blur(12px)',
            scale: 0.95,
          }}
          animate={{ 
            opacity: 1, 
            filter: 'blur(0px)',
            scale: 1,
          }}
          exit={{ 
            opacity: 0, 
            filter: 'blur(12px)',
            scale: 1.05,
          }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="text-4xl md:text-5xl font-semibold text-white tracking-tight absolute"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
          }}
          data-testid={`text-welcome-${currentIndex}`}
        >
          {animatedTexts[currentIndex]}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}

export default function QRLandingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/settings'],
  });

  const { data: languages = [], isLoading: languagesLoading } = useQuery({
    queryKey: ['/api/languages'],
  });

  const activeLanguages = languages.filter((lang: any) => lang.isActive);

  const handleLanguageSelect = (langCode: string) => {
    localStorage.setItem('menuLanguage', langCode);
    setLocation('/menu');
  };

  const handleCallWaiter = async () => {
    setIsCallingWaiter(true);
    try {
      await apiRequest('POST', '/api/waiter-request', {});
      toast({
        title: 'Waiter Called',
        description: 'A waiter has been notified and will be with you shortly.',
      });
    } catch (error) {
      toast({
        title: 'Request Sent',
        description: 'Your request has been received.',
      });
    } finally {
      setIsCallingWaiter(false);
    }
  };

  if (settingsLoading || languagesLoading) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center bg-black">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const animatedTexts = settings?.qrAnimatedTexts || ['Welcome'];
  const backgroundImage = settings?.qrMediaUrl || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80';
  const showLogo = settings?.qrShowLogo !== false;
  const showTitle = settings?.qrShowTitle !== false;
  const showDescription = settings?.qrShowDescription !== false;
  const showAnimatedText = settings?.qrShowAnimatedText !== false;
  const showCallWaiter = settings?.qrShowCallWaiter !== false;
  const showAddressPhone = settings?.qrShowAddressPhone !== false;

  return (
    <div className="min-h-screen relative flex flex-col">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {settings?.qrMediaType === 'video' && settings?.qrMediaUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={settings.qrMediaUrl} type="video/mp4" />
        </video>
      )}

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto px-6 py-12 text-center">
        {showLogo && (
          <>
            {settings?.restaurantLogo ? (
              <img 
                src={settings.restaurantLogo} 
                alt="Restaurant Logo"
                className="w-24 h-24 mx-auto mb-6 rounded-full object-cover border-2 border-white/30"
                data-testid="img-restaurant-logo"
              />
            ) : (
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <span className="text-3xl font-bold text-white">
                  {(settings?.restaurantName || 'R').charAt(0)}
                </span>
              </div>
            )}
          </>
        )}

        {showTitle && (
          <h1 
            className="text-4xl font-bold text-white mb-2" 
            data-testid="text-qr-page-title"
          >
            {settings?.qrPageTitle || 'Welcome'}
          </h1>
        )}

        {showDescription && (
          <p 
            className="text-white/70 mb-6" 
            data-testid="text-qr-page-description"
          >
            {settings?.qrPageDescription || 'Please select your language to continue view the menu'}
          </p>
        )}

        {showAnimatedText && (
          <AnimatedWelcome texts={animatedTexts} isVisible={showAnimatedText} />
        )}

        <div className="space-y-4 w-full">
          <div className="grid grid-cols-2 gap-3">
            {activeLanguages.map((lang: any) => (
              <Button
                key={lang.id}
                variant="outline"
                size="lg"
                onClick={() => handleLanguageSelect(lang.code)}
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white gap-2"
                data-testid={`button-lang-${lang.code}`}
              >
                {lang.flagImage && (
                  <img 
                    src={lang.flagImage} 
                    alt={lang.name}
                    className="w-6 h-4 object-cover rounded-sm"
                  />
                )}
                <span>{lang.nativeName}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {(showCallWaiter || showAddressPhone) && (
        <div className="relative z-10 w-full max-w-lg mx-auto px-6 pb-8 text-center">
          {showCallWaiter && (
            <Button
              variant="default"
              size="lg"
              onClick={handleCallWaiter}
              disabled={isCallingWaiter}
              className="gap-2 mb-6"
              data-testid="button-call-waiter"
            >
              <Bell className="h-5 w-5" />
              {translations.en.callWaiter}
            </Button>
          )}

          {showAddressPhone && (
            <div className="text-white/50 text-sm">
              {settings?.restaurantAddress && <p>{settings.restaurantAddress}</p>}
              {settings?.restaurantPhone && <p>{settings.restaurantPhone}</p>}
            </div>
          )}
        </div>
      )}

      <footer className="py-4 mt-auto relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] text-white/40 flex items-center justify-center gap-1.5 uppercase tracking-widest font-medium">
            <span>Powered by</span>
            <a 
              href="https://smartfood.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-white/60 hover:text-white transition-all hover:underline"
            >
              Smart Food
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
