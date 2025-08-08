import { motion } from 'framer-motion';

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-deepGreen to-gradientLight flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-cream mb-4"
        >
          AgriSetu
        </motion.div>
        
        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 0.2
              }}
              className="w-3 h-3 bg-accentGreen rounded-full"
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-cream text-sm mt-4"
        >
          Growing Smart Solutions...
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
