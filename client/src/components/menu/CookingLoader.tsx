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
        <div className="absolute top-[-20px] flex gap-4 filter blur-xl">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0, scale: 0.5 }}
              animate={{ 
                y: [-10, -80], 
                opacity: [0, 0.4, 0],
                scale: [0.5, 1.8, 2],
                x: [0, (i % 2 === 0 ? 15 : -15)]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.5,
                ease: "linear" 
              }}
              className="w-6 h-20 bg-primary/20 rounded-full"
            />
          ))}
        </div>

        {/* Pan Handle - Smaller scale */}
        <motion.div
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-35px] top-[115px] w-16 h-3.5 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-full origin-right shadow-lg z-10"
        />
        
        {/* Pan Body - Smaller size (w-40 -> w-28, h-20 -> h-14) */}
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-28 h-14 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 rounded-b-[40px] border-t-[8px] border-zinc-600 shadow-2xl z-20"
        >
          {/* Fire below the pan */}
          <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 flex gap-1 z-0">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: [12, 24, 12],
                  opacity: [0.6, 1, 0.6],
                  scaleX: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 0.3, 
                  repeat: Infinity, 
                  delay: i * 0.1,
                  ease: "easeInOut" 
                }}
                className="w-3 bg-gradient-to-t from-orange-600 via-orange-400 to-transparent rounded-full blur-[2px]"
              />
            ))}
          </div>

          {/* Inner Glow (Heat) */}
          <div className="absolute inset-x-2 top-0 h-1.5 bg-orange-500/30 blur-sm rounded-full" />
          
          {/* Sizzling particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 5, opacity: 0 }}
              animate={{ 
                y: [-5, -40], 
                x: [0, (i - 3.5) * 12],
                opacity: [0, 1, 0],
                scale: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 0.4, 
                repeat: Infinity, 
                delay: i * 0.08,
                ease: "easeOut" 
              }}
              className="absolute left-1/2 bottom-2 w-1 h-1 bg-orange-300 rounded-full blur-[1px]"
            />
          ))}

          {/* Jumping Food Item - Bigger and Faster */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={foodIndex}
                initial={{ y: 10, opacity: 0, rotate: -45, scale: 0.5 }}
                animate={{ 
                  y: [-30, -140, -30],
                  rotate: [0, 360, 720],
                  opacity: [0, 1, 0],
                  scale: [1.2, 1.8, 1.2]
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ 
                  duration: 0.8, // Faster duration
                  ease: "circOut",
                  times: [0, 0.5, 1]
                }}
                className="text-5xl filter drop-shadow-lg select-none"
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
