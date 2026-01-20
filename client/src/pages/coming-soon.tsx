import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { SiInstagram, SiWhatsapp, SiTelegram } from "react-icons/si";
import { MapPin, Phone, ExternalLink, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Setting } from "@shared/schema";

const comingSoonTexts = [
  { text: "Coming Soon", lang: "English", dir: "ltr" },
  { text: "به زودی", lang: "Persian", dir: "rtl" },
  { text: "Yakında", lang: "Turkish", dir: "ltr" },
  { text: "قريباً", lang: "Arabic", dir: "rtl" },
  { text: "Скоро", lang: "Russian", dir: "ltr" },
];

export default function ComingSoonPage() {
  const [index, setIndex] = useState(0);
  const { data: settings } = useQuery<Setting>({ 
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % comingSoonTexts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Food Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              rotate: 0 
            }}
            animate={{ 
              y: ["-10%", "110%"],
              rotate: 360
            }}
            transition={{ 
              duration: Math.random() * 20 + 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <UtensilsCrossed size={Math.random() * 40 + 20} />
          </motion.div>
        ))}
      </div>

      <Card className="max-w-2xl w-full p-8 space-y-8 text-center bg-card/50 backdrop-blur-sm border-primary/20 shadow-xl relative z-10">
        {/* Animated Text Transition */}
        <div className="h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-5xl md:text-7xl font-bold text-primary"
              dir={comingSoonTexts[index].dir}
            >
              {comingSoonTexts[index].text}
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center"
          >
            <div className="p-6 bg-primary/10 rounded-full">
              <UtensilsCrossed size={64} className="text-primary" />
            </div>
          </motion.div>
          <p className="text-xl text-muted-foreground">
            We are preparing something delicious for you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-8">
          <div className="space-y-4 text-left">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="text-primary" /> Address
            </h3>
            <p className="text-sm text-muted-foreground">
              {settings?.restaurantAddress || "Coming to a place near you"}
            </p>
            
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="text-primary" /> Contact
            </h3>
            <p className="text-sm text-muted-foreground">
              {settings?.restaurantPhone || "Stay tuned for updates"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center gap-4">
              {settings?.restaurantInstagram && (
                <a href={settings.restaurantInstagram} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="icon" className="hover-elevate">
                    <SiInstagram size={20} />
                  </Button>
                </a>
              )}
              {settings?.restaurantWhatsapp && (
                <a href={`https://wa.me/${settings.restaurantWhatsapp}`} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="icon" className="hover-elevate">
                    <SiWhatsapp size={20} />
                  </Button>
                </a>
              )}
              {settings?.restaurantTelegram && (
                <a href={settings.restaurantTelegram} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="icon" className="hover-elevate">
                    <SiTelegram size={20} />
                  </Button>
                </a>
              )}
            </div>

            <Button className="w-full flex items-center justify-center gap-2" asChild>
              <a href="/menu">
                View Menu Preview <ExternalLink size={16} />
              </a>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
