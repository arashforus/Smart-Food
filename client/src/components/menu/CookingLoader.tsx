import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const FOOD_ITEMS = ['🍔', '🍕', '🍳', '🥦', '🥕', '🍤', '🥩', '🥘'];

export default function CookingLoader() {
  const [foodIndex, setFoodIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFoodIndex((prev) => (prev + 1) % FOOD_ITEMS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Realistic Steam */}
        <div className="absolute top-0 flex gap-6 filter blur-xl">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0, scale: 0.8 }}
              animate={{ 
                y: [-20, -100], 
                opacity: [0, 0.4, 0],
                scale: [0.8, 2, 2.5],
                x: [0, (i % 2 === 0 ? 20 : -20)]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                delay: i * 0.6,
                ease: "linear" 
              }}
              className="w-8 h-24 bg-primary/20 rounded-full"
            />
          ))}
        </div>

        {/* Pan Handle - Realistic Texture/Shape */}
        <motion.div
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-50px] top-[110px] w-24 h-5 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-full origin-right shadow-lg z-10"
        />
        
        {/* Pan Body - Realistic Gradient and Shape */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-40 h-20 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 rounded-b-[50px] border-t-[10px] border-zinc-600 shadow-2xl z-20"
        >
          {/* Inner Glow (Heat) */}
          <div className="absolute inset-x-4 top-0 h-2 bg-orange-500/20 blur-md rounded-full" />
          
          {/* Sizzling particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 10, opacity: 0 }}
              animate={{ 
                y: [-10, -50], 
                x: [0, (i - 3.5) * 15],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 0.6, 
                repeat: Infinity, 
                delay: i * 0.1,
                ease: "easeOut" 
              }}
              className="absolute left-1/2 bottom-4 w-1.5 h-1.5 bg-orange-400 rounded-full blur-[1px]"
            />
          ))}

          {/* Jumping Food Item */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={foodIndex}
                initial={{ y: 20, opacity: 0, rotate: -45, scale: 0.5 }}
                animate={{ 
                  y: [-40, -120, -40],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8]
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ 
                  duration: 1.2,
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }}
                className="text-4xl filter drop-shadow-md select-none"
              >
                {FOOD_ITEMS[foodIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Heat Distort (Lower half) */}
        <div className="absolute bottom-10 w-48 h-10 bg-orange-600/10 blur-3xl animate-pulse" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 flex flex-col items-center gap-2"
      >
        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent uppercase tracking-tighter">
          Chef is crafting magic
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
