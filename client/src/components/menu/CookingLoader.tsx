import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const FOOD_ITEMS = ['🍔', '🍕', '🍤', '🍟', '🍣', '🍰', '🌮', '🍩'];

export default function CookingLoader() {
  const [foodIndex, setFoodIndex] = useState(0);
  const [isEating, setIsEating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsEating(true);
      setTimeout(() => {
        setIsEating(false);
        setFoodIndex((prev) => (prev + 1) % FOOD_ITEMS.length);
      }, 400); // Duration of the eat animation
    }, 1200); // Total cycle time
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]">
      <div className="relative w-80 h-80 flex items-center justify-center">
        
        {/* Pac-Man Body */}
        <div className="relative w-32 h-32">
          {/* Upper Jaw */}
          <motion.div
            animate={{ rotate: isEating ? 0 : -35 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-yellow-400 rounded-t-full origin-bottom"
            style={{ height: '50%' }}
          />
          {/* Lower Jaw */}
          <motion.div
            animate={{ rotate: isEating ? 0 : 35 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute bottom-0 inset-x-0 bg-yellow-400 rounded-b-full origin-top"
            style={{ height: '50%' }}
          />
          {/* Eye */}
          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-black rounded-full z-10" />
        </div>

        {/* Food to be eaten */}
        <AnimatePresence mode="wait">
          {!isEating && (
            <motion.div
              key={foodIndex}
              initial={{ x: 150, opacity: 0, scale: 0.5 }}
              animate={{ x: 80, opacity: 1, scale: 1.5 }}
              exit={{ x: 0, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute text-7xl select-none"
            >
              {FOOD_ITEMS[foodIndex]}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action particles / crumbs */}
        <AnimatePresence>
          {isEating && (
            <div className="absolute right-1/4">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ 
                    x: Math.random() * 40 + 20, 
                    y: (Math.random() - 0.5) * 60,
                    opacity: 0 
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute w-2 h-2 bg-yellow-200 rounded-full"
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="mt-8 text-yellow-400 font-black text-xl tracking-[0.2em] uppercase italic"
      >
        Processing your feast
      </motion.div>
    </div>
  );
}
