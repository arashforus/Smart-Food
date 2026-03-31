import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Bell, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { apiRequest } from '@/lib/queryClient';
import { motion, AnimatePresence } from 'framer-motion';
import type { Settings, AppLanguage } from '@/lib/types';

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
  const { t, setLanguage } = useLanguage();
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const attemptPlay = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      await videoRef.current.play();
      setNeedsInteraction(false);
    } catch {
      setNeedsInteraction(true);
    }
  }, []);

  useEffect(() => {
    if (!needsInteraction) return;
    const tryPlay = async () => {
      if (!videoRef.current) return;
      try {
        await videoRef.current.play();
        setNeedsInteraction(false);
      } catch {}
    };
    document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
    document.addEventListener('click', tryPlay, { once: true });
    return () => {
      document.removeEventListener('touchstart', tryPlay);
      document.removeEventListener('click', tryPlay);
    };
  }, [needsInteraction]);

  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  const { data: languages = [] } = useQuery<AppLanguage[]>({
    queryKey: ['/api/languages'],
  });

  const activeLanguages = languages.filter((lang) => lang.isActive);

  const handleLanguageSelect = async (langCode: string) => {
    await setLanguage(langCode);
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

  const animatedTexts = settings?.qrAnimatedTexts || ['Welcome'];
  const backgroundImage = settings?.qrMediaUrl || '';
  const showLogo = settings?.qrShowLogo !== false;
  const showTitle = settings?.qrShowTitle !== false;
  const showDescription = settings?.qrShowDescription !== false;
  const showAnimatedText = settings?.qrShowAnimatedText !== false;
  const showCallWaiter = settings?.qrShowCallWaiter !== false;
  const showAddressPhone = settings?.qrShowAddressPhone !== false;
  const googlePlaceId = settings?.restaurantGooglePlaceId;

  const isVideo = settings?.qrMediaType === 'video' && !!settings?.qrMediaUrl;

  return (
    <div className="min-h-screen relative flex flex-col bg-black">
      {isVideo && !videoFailed ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
              }
              attemptPlay();
            }}
            onCanPlay={attemptPlay}
            onError={() => setVideoFailed(true)}
            {...{ 'webkit-playsinline': 'true', 'x-webkit-airplay': 'allow' } as any}
          >
            {/* No type= attribute — let Content-Type header determine format */}
            <source src={settings!.qrMediaUrl} />
          </video>
          {needsInteraction && (
            <div className="absolute inset-0 flex items-end justify-center pb-8 z-20 pointer-events-none">
              <div className="bg-black/50 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
                <span>▶</span>
                <span>Tap anywhere to play</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto px-6 py-12 text-center">
        {showLogo && (
          <>
            {settings?.restaurantLogo ? (
              settings?.qrLogoShowBackground ? (
                <div
                  className={`w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-md ${
                    settings.qrLogoBackgroundType === 'circle' ? 'rounded-full' :
                    settings.qrLogoBackgroundType === 'square-low' ? 'rounded-xl' :
                    settings.qrLogoBackgroundType === 'square-high' ? 'rounded-3xl' :
                    'rounded-none'
                  }`}
                  style={{ backgroundColor: settings.qrLogoBackgroundColor || '#ffffff' }}
                >
                  <img
                    src={settings.restaurantLogo}
                    alt="Restaurant Logo"
                    className="w-16 h-16 object-contain"
                    data-testid="img-restaurant-logo"
                  />
                </div>
              ) : (
                <img 
                  src={settings.restaurantLogo} 
                  alt="Restaurant Logo"
                  className="w-24 h-24 mx-auto mb-6 rounded-full object-cover border-2 border-white/30"
                  data-testid="img-restaurant-logo"
                />
              )
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

      {(showCallWaiter || showAddressPhone || googlePlaceId) && (
        <div className="relative z-10 w-full max-w-lg mx-auto px-6 pb-8 text-center">
          {(showCallWaiter || googlePlaceId) && (
            <div className="flex items-center justify-center gap-3 mb-6">
              {showCallWaiter && (
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleCallWaiter}
                  disabled={isCallingWaiter}
                  className="gap-2"
                  data-testid="button-call-waiter"
                >
                  <Bell className="h-5 w-5" />
                  {t('callWaiter')}
                </Button>
              )}
              {googlePlaceId && (
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                  data-testid="button-google-review"
                >
                  <a
                    href={`https://search.google.com/local/writereview?placeid=${googlePlaceId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    Google Review
                  </a>
                </Button>
              )}
            </div>
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
          <p className="text-[10px] text-white/40 flex items-center justify-center gap-1.5  tracking-widest font-medium">
            <span>{t('poweredBy')}</span>
            <a 
              href="https://qrdish.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-white/60 hover:text-white transition-all hover:underline"
            >
              QRdish
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
