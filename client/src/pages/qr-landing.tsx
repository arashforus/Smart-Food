import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockLanguages, mockRestaurant, mockSettings } from '@/lib/mockData';
import { translations, type Language } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';
import { motion, AnimatePresence } from 'framer-motion';

const welcomeMessages = [
  { text: 'Welcome', lang: 'English' },
  { text: 'خوش آمدید', lang: 'Persian' },
  { text: 'Hoş geldiniz', lang: 'Turkish' },
  { text: 'أهلاً وسهلاً', lang: 'Arabic' },
];

function AnimatedWelcome() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % welcomeMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-16 flex items-center justify-center overflow-hidden mb-8">
      <AnimatePresence mode="wait">
        <motion.h2
          key={currentIndex}
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.8 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-4xl md:text-5xl font-semibold text-white tracking-tight"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
          }}
          data-testid={`text-welcome-${welcomeMessages[currentIndex].lang.toLowerCase()}`}
        >
          {welcomeMessages[currentIndex].text}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}

export default function QRLandingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);

  const activeLanguages = mockLanguages.filter(lang => lang.isActive);

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

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: mockSettings.backgroundImage 
            ? `url(${mockSettings.backgroundImage})`
            : 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {mockSettings.backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={mockSettings.backgroundVideo} type="video/mp4" />
        </video>
      )}

      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-12 text-center">
        {mockRestaurant.logo ? (
          <img 
            src={mockRestaurant.logo} 
            alt={mockRestaurant.name}
            className="w-24 h-24 mx-auto mb-6 rounded-full object-cover border-2 border-white/30"
          />
        ) : (
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
            <span className="text-3xl font-bold text-white">
              {mockRestaurant.name.charAt(0)}
            </span>
          </div>
        )}

        <h1 className="text-4xl font-bold text-white mb-2" data-testid="text-restaurant-name">
          {mockRestaurant.name}
        </h1>
        <p className="text-white/70 mb-6" data-testid="text-restaurant-description">
          {mockRestaurant.description}
        </p>

        <AnimatedWelcome />

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {activeLanguages.map((lang) => (
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

        <div className="mt-12">
          <Button
            variant="default"
            size="lg"
            onClick={handleCallWaiter}
            disabled={isCallingWaiter}
            className="gap-2"
            data-testid="button-call-waiter"
          >
            <Bell className="h-5 w-5" />
            {translations.en.callWaiter}
          </Button>
        </div>

        <div className="mt-8 text-white/50 text-sm">
          <p>{mockRestaurant.address}</p>
          <p>{mockRestaurant.phone}</p>
        </div>
      </div>
    </div>
  );
}
