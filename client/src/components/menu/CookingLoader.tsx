import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

type Scenario = {
  liquidColor: string;
  liquidName: string;
  foodEmoji: string;
  label: string;
  secondaryColor?: string;
  isSparkling?: boolean;
  isHot?: boolean;
};

const SCENARIOS: Scenario[] = [
  { 
    liquidColor: '#3d2b1f', 
    secondaryColor: '#4e3629',
    liquidName: 'Coffee', 
    foodEmoji: '🍰', 
    label: 'Morning Ritual',
    isHot: true
  },
  { 
    liquidColor: '#4a0e0e', 
    secondaryColor: '#722F37',
    liquidName: 'Red Wine', 
    foodEmoji: '🧀', 
    label: 'Vintage Selection' 
  },
  { 
    liquidColor: '#1a0d0d', 
    secondaryColor: '#2d1810',
    liquidName: 'Cola', 
    foodEmoji: '🍔', 
    label: 'Classic Refreshment',
    isSparkling: true
  },
  { 
    liquidColor: 'rgba(255, 255, 255, 0.3)', 
    secondaryColor: 'rgba(255, 255, 255, 0.1)',
    liquidName: 'Raki', 
    foodEmoji: '🐟', 
    label: 'Traditional Dinner',
    isSparkling: true 
  },
  { 
    liquidColor: '#ffb347', 
    secondaryColor: '#ffcc33',
    liquidName: 'Orange Juice', 
    foodEmoji: '🥐', 
    label: 'Zesty Breakfast' 
  },
];

export default function CookingLoader() {
  const [index, setIndex] = useState(0);
  const [isPouring, setIsPouring] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPouring(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % SCENARIOS.length);
        setIsPouring(true);
      }, 500); // Faster transition
    }, 2000); // Faster cycle
    return () => clearInterval(interval);
  }, []);

  const scenario = SCENARIOS[index];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Ambient background glow */}
      <motion.div 
        animate={{ 
          background: `radial-gradient(circle at center, ${scenario.liquidColor}22 0%, transparent 70%)` 
        }}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="relative w-64 h-80 flex items-center justify-center scale-90"> {/* Slightly smaller overall container */}
        
        {/* Pouring Stream with realistic gradient */}
        <AnimatePresence>
          {isPouring && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 180, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-[-100px] w-2 z-10 rounded-full blur-[0.5px]"
              style={{ 
                background: `linear-gradient(to bottom, transparent, ${scenario.liquidColor}, ${scenario.secondaryColor || scenario.liquidColor})` 
              }}
            />
          )}
        </AnimatePresence>

        {/* The Glass - Smaller size */}
        <div className="relative w-24 h-40 perspective-[1000px]"> {/* Reduced from 32/52 to 24/40 */}
          {/* Glass Rim Highlight */}
          <div className="absolute top-0 left-0 w-full h-3 border border-white/20 rounded-[100%] z-30 pointer-events-none" />
          
          <div className="relative w-full h-full border-x-2 border-b-2 border-white/20 rounded-b-[30px] overflow-hidden bg-white/5 backdrop-blur-[8px] shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]">
            
            {/* Liquid Content */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: isPouring ? '85%' : '0%' }}
              className="absolute bottom-0 w-full transition-all duration-700 ease-out" // Faster fill
              style={{ 
                background: `linear-gradient(180deg, ${scenario.secondaryColor || scenario.liquidColor} 0%, ${scenario.liquidColor} 100%)` 
              }}
            >
              {/* Surface Reflection/Wave */}
              <motion.div 
                animate={{ y: [-1, 1, -1], x: [-1, 1, -1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-0 left-0 w-full h-1.5 bg-white/20 blur-[2px]"
              />

              {/* Sparkling Bubbles */}
              {scenario.isSparkling && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        y: [160, -10], 
                        x: [0, (Math.random() - 0.5) * 15],
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1, 0.8]
                      }}
                      transition={{ 
                        duration: 1 + Math.random(), 
                        repeat: Infinity, 
                        delay: Math.random() * 1,
                        ease: "easeOut"
                      }}
                      className="absolute bottom-0 w-0.5 h-0.5 bg-white/40 rounded-full blur-[0.5px]"
                      style={{ left: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Glass Base Reflection */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-white/5 blur-md rounded-full" />
        </div>

        {/* Floating Food - Bigger and Faster */}
        <AnimatePresence mode="wait">
          {isPouring && (
            <motion.div
              key={scenario.foodEmoji}
              initial={{ x: 140, y: 30, opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ x: 100, y: -70, opacity: 1, scale: 1.2, rotate: 15 }} // Increased scale to 1.2
              exit={{ x: -140, y: 100, opacity: 0, scale: 0.5, rotate: -45 }}
              transition={{ 
                type: "spring",
                stiffness: 150, // Faster spring
                damping: 12,
                delay: 0.1
              }}
              className="absolute text-8xl select-none z-40" // Increased text size to 8xl
              style={{ filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.6))' }}
            >
              {scenario.foodEmoji}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Realistic Steam for Hot Drinks */}
        {scenario.isHot && (
           <div className="absolute top-10 flex gap-6 filter blur-[12px] pointer-events-none">
           {[...Array(4)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ 
                 y: [0, -100], 
                 x: [0, (i % 2 === 0 ? 15 : -15)],
                 opacity: [0, 0.4, 0], 
                 scale: [1, 2.2] 
               }}
               transition={{ 
                 duration: 2, // Faster steam
                 repeat: Infinity, 
                 delay: i * 0.5,
                 ease: "linear"
               }}
               className="w-5 h-14 bg-white/10 rounded-full"
             />
           ))}
         </div>
        )}
      </div>
    </div>
  );
}
