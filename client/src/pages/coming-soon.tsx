import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { SiInstagram, SiWhatsapp, SiTelegram } from "react-icons/si";
import { MapPin, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Setting } from "@shared/schema";
import Lottie from "lottie-react";

// You would typically fetch this from an external URL or have a local JSON
// For demonstration, I'll use a placeholder URL for a food-related Lottie animation
const LOTTIE_FOOD_URL = "https://assets9.lottiefiles.com/packages/lf20_tll0j4bb.json";

const comingSoonTexts = [
  { text: "Coming Soon", lang: "English", dir: "ltr" },
  { text: "به زودی", lang: "Persian", dir: "rtl" },
  { text: "Yakında", lang: "Turkish", dir: "ltr" },
  { text: "قريباً", lang: "Arabic", dir: "rtl" },
  { text: "Скоро", lang: "Russian", dir: "ltr" },
];

export default function ComingSoonPage() {
  const [index, setIndex] = useState(0);
  const [lottieData, setLottieData] = useState<any>(null);
  const { data: settings } = useQuery<Setting>({ 
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % comingSoonTexts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch(LOTTIE_FOOD_URL)
      .then(res => res.json())
      .then(data => setLottieData(data))
      .catch(err => console.error("Lottie load error:", err));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 15s ease infinite;
        }
      `}} />

      <Card className="w-[95vw] h-[95vh] flex flex-col p-8 space-y-8 text-center bg-card/80 backdrop-blur-md border-primary/20 shadow-2xl relative z-10 overflow-y-auto">
        <CardContent className="p-0 space-y-8 flex flex-col items-center flex-1 justify-center">
          {/* Logo and Name */}
          <div className="space-y-4">
            {settings?.restaurantLogo && (
              <motion.img 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                src={settings.restaurantLogo} 
                alt="Logo" 
                className="h-24 mx-auto object-contain"
              />
            )}
            <h2 className="text-3xl font-bold text-foreground">
              {settings?.restaurantName || "Our Restaurant"}
            </h2>
          </div>

          {/* Animated Text Transition */}
          <div className="h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-5xl md:text-8xl font-bold text-primary"
                dir={comingSoonTexts[index].dir}
              >
                {comingSoonTexts[index].text}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Lottie Animation */}
          <div className="w-full max-w-md aspect-square flex items-center justify-center">
            {lottieData ? (
              <Lottie 
                animationData={lottieData} 
                loop={true} 
                style={{ height: '300px' }}
              />
            ) : (
              <div className="animate-pulse text-muted-foreground">Loading Animation...</div>
            )}
          </div>

          <p className="text-2xl text-muted-foreground max-w-2xl">
            We are preparing something delicious for you!
          </p>

          <div className="grid md:grid-cols-2 gap-12 pt-8 w-full max-w-4xl">
            <div className="space-y-6 text-left flex flex-col justify-center">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="text-primary" /> Address
                </h3>
                <p className="text-lg text-muted-foreground">
                  {settings?.restaurantAddress || "Coming to a place near you"}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Phone className="text-primary" /> Contact
                </h3>
                <p className="text-lg text-muted-foreground">
                  {settings?.restaurantPhone || "Stay tuned for updates"}
                </p>
              </div>
            </div>

            <div className="space-y-8 flex flex-col justify-center">
              <div className="flex justify-center gap-6">
                {settings?.restaurantInstagram && (
                  <a href={settings.restaurantInstagram} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="icon" className="w-14 h-14 hover-elevate">
                      <SiInstagram size={28} />
                    </Button>
                  </a>
                )}
                {settings?.restaurantWhatsapp && (
                  <a href={`https://wa.me/${settings.restaurantWhatsapp}`} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="icon" className="w-14 h-14 hover-elevate">
                      <SiWhatsapp size={28} />
                    </Button>
                  </a>
                )}
                {settings?.restaurantTelegram && (
                  <a href={settings.restaurantTelegram} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="icon" className="w-14 h-14 hover-elevate">
                      <SiTelegram size={28} />
                    </Button>
                  </a>
                )}
              </div>

              <Button className="w-full h-16 text-xl flex items-center justify-center gap-2" asChild>
                <a href="/menu">
                  View Menu Preview <ExternalLink size={24} />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
