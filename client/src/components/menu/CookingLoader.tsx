import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const FOOD_ITEMS = ['🍔', '🍕', '🍤', '🍟', '🍰', '🌮', '🍩'];

export default function CookingLoader() {
  const [foodIndex, setFoodIndex] = useState(0);
  const [isEating, setIsEating] = useState(false);

  useEffect(() => {
    // Initial sync: force an immediate state update to line up with the interval
    setIsEating(false);

    const interval = setInterval(() => {
      setIsEating(true);
      setTimeout(() => {
        setIsEating(false);
        setFoodIndex((prev) => (prev + 1) % FOOD_ITEMS.length);
      }, 150);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]">
      <div className="relative w-64 h-64 flex items-center justify-center scale-75">
        
        {/* Pac-Man Body */}
        <div className="relative w-24 h-24 mr-16">
          {/* Upper Jaw */}
          <motion.div
            animate={{ rotate: isEating ? 0 : -35 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="absolute inset-0 bg-yellow-400 rounded-t-full origin-bottom"
            style={{ height: '50%' }}
          />
          {/* Lower Jaw */}
          <motion.div
            animate={{ rotate: isEating ? 0 : 35 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="absolute bottom-0 inset-x-0 bg-yellow-400 rounded-b-full origin-top"
            style={{ height: '50%' }}
          />
          {/* Eye */}
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-black rounded-full z-10" />
        </div>

        {/* Dots (Static Trail) */}
        <div className="absolute flex gap-6 translate-x-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-yellow-200/40 rounded-full" />
          ))}
        </div>

        {/* Food moving toward Pac-Man */}
        <AnimatePresence mode="wait">
          {!isEating && (
            <motion.div
              key={foodIndex}
              initial={{ x: 200, opacity: 1, scale: 0.8 }}
              animate={{ x: 10, opacity: 1, scale: 1.1 }}
              exit={{ x: 25, opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.45, ease: "linear" }}
              className="absolute text-6xl select-none"
            >
              {FOOD_ITEMS[foodIndex]}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action particles */}
        <AnimatePresence>
          {isEating && (
            <div className="absolute left-1/2">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ 
                    x: Math.random() * 30 + 10, 
                    y: (Math.random() - 0.5) * 40,
                    opacity: 0 
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full"
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
