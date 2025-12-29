import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Utensils, Pizza, Coffee, Beef, IceCream, Sandwich, Soup, Apple, Carrot, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

const icons = [Utensils, Pizza, Coffee, Beef, IceCream, Sandwich, Soup, Apple, Carrot, Cookie];

const MarqueeRow = ({ reverse = false, speed = 20 }: { reverse?: boolean; speed?: number }) => {
  const rowIcons = [...Array(20)].map(() => icons[Math.floor(Math.random() * icons.length)]);
  
  return (
    <div className="flex overflow-hidden whitespace-nowrap py-2 opacity-5">
      <motion.div
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex gap-12"
      >
        {rowIcons.map((Icon, i) => (
          <Icon key={i} size={48} className="text-foreground shrink-0" />
        ))}
        {rowIcons.map((Icon, i) => (
          <Icon key={`clone-${i}`} size={48} className="text-foreground shrink-0" />
        ))}
      </motion.div>
    </div>
  );
};

export default function NotFound() {
  const marqueeRows = [...Array(10)].map((_, i) => ({
    reverse: i % 2 === 0,
    speed: 15 + Math.random() * 25
  }));

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Marquee Background */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none overflow-hidden rotate-[-5deg] scale-110">
        {marqueeRows.map((row, i) => (
          <MarqueeRow key={i} reverse={row.reverse} speed={row.speed} />
        ))}
      </div>

      <Card className="w-full max-w-md mx-4 shadow-2xl border-border/50 backdrop-blur-md bg-card/80 relative z-10">
        <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          
          <h1 className="text-4xl font-black tracking-tight mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-4 text-foreground/80">Page Not Found</h2>
          
          <p className="text-muted-foreground mb-8 max-w-[280px]">
            Oops! It seems you've wandered into an empty kitchen. This page doesn't exist.
          </p>

          <Button asChild className="w-full hover-elevate active-elevate-2">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
