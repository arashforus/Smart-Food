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
      }, 1200);
    }, 4500);
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

      <div className="relative w-64 h-80 flex items-center justify-center">
        
        {/* Pouring Stream with realistic gradient */}
        <AnimatePresence>
          {isPouring && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 220, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-[-120px] w-2.5 z-10 rounded-full blur-[0.5px]"
              style={{ 
                background: `linear-gradient(to bottom, transparent, ${scenario.liquidColor}, ${scenario.secondaryColor || scenario.liquidColor})` 
              }}
            />
          )}
        </AnimatePresence>

        {/* The Glass - Realistic Design */}
        <div className="relative w-32 h-52 perspective-[1000px]">
          {/* Glass Rim Highlight */}
          <div className="absolute top-0 left-0 w-full h-4 border-2 border-white/20 rounded-[100%] z-30 pointer-events-none" />
          
          <div className="relative w-full h-full border-x-[3px] border-b-[3px] border-white/20 rounded-b-[40px] overflow-hidden bg-white/5 backdrop-blur-[8px] shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
            
            {/* Liquid Content */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: isPouring ? '85%' : '0%' }}
              className="absolute bottom-0 w-full transition-all duration-1000 ease-out"
              style={{ 
                background: `linear-gradient(180deg, ${scenario.secondaryColor || scenario.liquidColor} 0%, ${scenario.liquidColor} 100%)` 
              }}
            >
              {/* Surface Reflection/Wave */}
              <motion.div 
                animate={{ y: [-2, 2, -2], x: [-1, 1, -1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 left-0 w-full h-2 bg-white/20 blur-[2px]"
              />

              {/* Sparkling Bubbles */}
              {scenario.isSparkling && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        y: [200, -20], 
                        x: [0, (Math.random() - 0.5) * 20],
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1, 0.8]
                      }}
                      transition={{ 
                        duration: 1.5 + Math.random(), 
                        repeat: Infinity, 
                        delay: Math.random() * 2,
                        ease: "easeOut"
                      }}
                      className="absolute bottom-0 w-1 h-1 bg-white/40 rounded-full blur-[0.5px]"
                      style={{ left: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Glass Base Reflection */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-white/5 blur-md rounded-full" />
        </div>

        {/* Floating Food with High Quality Shadow */}
        <AnimatePresence mode="wait">
          {isPouring && (
            <motion.div
              key={scenario.foodEmoji}
              initial={{ x: 120, y: 20, opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ x: 90, y: -60, opacity: 1, scale: 1, rotate: 12 }}
              exit={{ x: -120, y: 80, opacity: 0, scale: 0.5, rotate: -45 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.2
              }}
              className="absolute text-7xl select-none z-40"
              style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
            >
              {scenario.foodEmoji}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Realistic Steam for Hot Drinks */}
        {scenario.isHot && (
           <div className="absolute top-10 flex gap-8 filter blur-[15px] pointer-events-none">
           {[...Array(4)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ 
                 y: [0, -120], 
                 x: [0, (i % 2 === 0 ? 20 : -20)],
                 opacity: [0, 0.4, 0], 
                 scale: [1, 2.5] 
               }}
               transition={{ 
                 duration: 3, 
                 repeat: Infinity, 
                 delay: i * 0.7,
                 ease: "linear"
               }}
               className="w-6 h-16 bg-white/10 rounded-full"
             />
           ))}
         </div>
        )}
      </div>

      {/* Premium Status Label */}
      <div className="mt-16 text-center space-y-3 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-3xl font-black tracking-tighter italic text-white uppercase">
              {scenario.label}
            </h2>
            <div className="h-1 w-12 bg-primary rounded-full mt-1 mb-3" />
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
              Curating your {scenario.liquidName} experience
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
