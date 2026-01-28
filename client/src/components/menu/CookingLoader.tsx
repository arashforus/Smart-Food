import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

type Scenario = {
  liquidColor: string;
  liquidName: string;
  foodEmoji: string;
  label: string;
};

const SCENARIOS: Scenario[] = [
  { liquidColor: '#6F4E37', liquidName: 'Coffee', foodEmoji: '🍰', label: 'Morning Brew' },
  { liquidColor: '#722F37', liquidName: 'Wine', foodEmoji: '🧀', label: 'Evening Relax' },
  { liquidColor: '#964B00', liquidName: 'Cola', foodEmoji: '🍔', label: 'Lunch Break' },
  { liquidColor: '#E0E0E0', liquidName: 'Raki', foodEmoji: '🐟', label: 'Dinner Feast' },
  { liquidColor: '#FFD700', liquidName: 'Juice', foodEmoji: '🥐', label: 'Fresh Start' },
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
      }, 1000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scenario = SCENARIOS[index];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative w-64 h-80 flex items-center justify-center">
        
        {/* Pouring Stream */}
        <AnimatePresence>
          {isPouring && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 200, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-[-100px] w-2 z-10 rounded-full"
              style={{ backgroundColor: scenario.liquidColor }}
            />
          )}
        </AnimatePresence>

        {/* The Glass */}
        <div className="relative w-32 h-48 border-x-4 border-b-4 border-white/30 rounded-b-2xl overflow-hidden bg-white/5 backdrop-blur-md">
          {/* Liquid Level */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: isPouring ? '80%' : '0%' }}
            className="absolute bottom-0 w-full transition-colors duration-1000"
            style={{ backgroundColor: scenario.liquidColor }}
          >
            {/* Bubbles for sparkling drinks */}
            {['Cola', 'Raki'].includes(scenario.liquidName) && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [-10, -100], opacity: [0, 1, 0] }}
                    transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: Math.random() }}
                    className="absolute bottom-0 w-1 h-1 bg-white/40 rounded-full"
                    style={{ left: `${Math.random() * 100}%` }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Floating Food */}
        <AnimatePresence mode="wait">
          {isPouring && (
            <motion.div
              key={scenario.foodEmoji}
              initial={{ x: 100, y: 0, opacity: 0, rotate: 0 }}
              animate={{ x: 80, y: -40, opacity: 1, rotate: 15 }}
              exit={{ x: -100, y: 50, opacity: 0, rotate: -45 }}
              transition={{ duration: 0.8, ease: "backOut" }}
              className="absolute text-6xl filter drop-shadow-xl z-30"
            >
              {scenario.foodEmoji}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Steam or Condensation */}
        {scenario.liquidName === 'Coffee' && (
           <div className="absolute top-20 flex gap-4 filter blur-lg">
           {[...Array(3)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ y: [0, -40], opacity: [0, 0.3, 0], scale: [1, 2] }}
               transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
               className="w-4 h-12 bg-white/20 rounded-full"
             />
           ))}
         </div>
        )}
      </div>

      {/* Status Label */}
      <motion.div
        key={scenario.label}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-center"
      >
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          {scenario.label}
        </h2>
        <p className="text-muted-foreground text-sm uppercase tracking-widest mt-1">
          Preparing your {scenario.liquidName.toLowerCase()}...
        </p>
      </motion.div>
    </div>
  );
}
