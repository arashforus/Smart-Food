import { motion } from 'framer-motion';

export default function CookingLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Pan Handle */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-40px] top-1/2 w-20 h-4 bg-muted-foreground rounded-full origin-right"
        />
        
        {/* Pan Body */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-16 bg-muted-foreground rounded-b-[40px] border-t-8 border-primary relative overflow-hidden"
        >
          {/* Sizzling particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: [-10, -40], 
                x: [0, (i - 2) * 10],
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeOut" 
              }}
              className="absolute left-1/2 bottom-0 w-2 h-2 bg-primary rounded-full"
            />
          ))}
        </motion.div>

        {/* Steam */}
        <div className="absolute top-0 flex gap-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0, scale: 0.5 }}
              animate={{ 
                y: [-20, -60], 
                opacity: [0, 0.5, 0],
                scale: [0.5, 1.5, 1]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.4,
                ease: "easeInOut" 
              }}
              className="w-4 h-12 bg-muted/50 rounded-full blur-md"
            />
          ))}
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 text-xl font-medium text-muted-foreground flex items-center gap-2"
      >
        <span>Chef is cooking</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
        >
          ...
        </motion.span>
      </motion.div>
    </div>
  );
}
