import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaCloudSun, FaBrain, FaSeedling, FaChartLine, FaDatabase, FaLeaf } from 'react-icons/fa';

const APIAnimation = ({ type = 'recommendation', isVisible = true }) => {
  const [currentStage, setCurrentStage] = useState(0);

  const recommendationStages = [
    {
      icon: FaMapMarkerAlt,
      title: "Detecting Location",
      description: "Finding your precise location for regional insights",
      duration: 2000,
      color: "text-blue-400"
    },
    {
      icon: FaCloudSun,
      title: "Analyzing Weather",
      description: "Gathering current weather and seasonal data",
      duration: 2500,
      color: "text-yellow-400"
    },
    {
      icon: FaBrain,
      title: "AI Processing",
      description: "Analyzing your farming history and preferences",
      duration: 3000,
      color: "text-purple-400"
    },
    {
      icon: FaSeedling,
      title: "Generating Results",
      description: "Creating personalized crop recommendations",
      duration: 2000,
      color: "text-green-400"
    }
  ];

  const analyticsStages = [
    {
      icon: FaMapMarkerAlt,
      title: "Location Analysis",
      description: "Identifying regional market conditions",
      duration: 2000,
      color: "text-blue-400"
    },
    {
      icon: FaChartLine,
      title: "Market Research",
      description: "Gathering latest pricing and trend data",
      duration: 2500,
      color: "text-orange-400"
    },
    {
      icon: FaDatabase,
      title: "Data Processing",
      description: "Processing market insights and patterns",
      duration: 3000,
      color: "text-purple-400"
    },
    {
      icon: FaLeaf,
      title: "Generating Insights",
      description: "Creating comprehensive analytics report",
      duration: 2000,
      color: "text-green-400"
    }
  ];

  const stages = type === 'analytics' ? analyticsStages : recommendationStages;

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        }
        return 0; // Loop back to start
      });
    }, stages[currentStage]?.duration || 2000);

    return () => clearInterval(timer);
  }, [currentStage, stages, isVisible]);

  if (!isVisible) return null;

  const IconComponent = stages[currentStage]?.icon || FaSeedling;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-deepGreen/95 via-gradientLight/95 to-accentGreen/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-8 max-w-lg mx-4 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="text-4xl md:text-5xl font-bold text-cream mb-2 text-center"
        >
          🌾 AgriSetu
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-gradient-to-r from-accentGreen to-green-300 h-3 rounded-full shadow-lg"
          />
        </div>

        {/* Stage Progress Dots */}
        <div className="flex justify-center gap-3 mb-6">
          {stages.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: index === currentStage ? 1.3 : 0.9,
                opacity: index <= currentStage ? 1 : 0.4
              }}
              transition={{ duration: 0.3, type: "spring" }}
              className={`w-4 h-4 rounded-full border-2 ${
                index <= currentStage 
                  ? 'bg-accentGreen border-green-300 shadow-lg shadow-green-400/50' 
                  : 'bg-white/20 border-white/30'
              }`}
            />
          ))}
        </div>

        {/* Main Animation Area */}
        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.8 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Animated Icon with Pulse Effect */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`text-7xl md:text-8xl ${stages[currentStage]?.color} mb-2 drop-shadow-lg`}
                >
                  <IconComponent />
                </motion.div>
                
                {/* Pulse Ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full border-4 border-accentGreen/30"
                />
              </div>

              {/* Stage Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-cream text-center"
              >
                {stages[currentStage]?.title}
              </motion.h3>

              {/* Stage Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-cream/80 text-center text-sm md:text-base max-w-sm leading-relaxed"
              >
                {stages[currentStage]?.description}
              </motion.p>

              {/* Loading Dots */}
              <div className="flex gap-2 mt-4">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: index * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-3 h-3 bg-accentGreen rounded-full shadow-lg"
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-cream/70 text-xs md:text-sm text-center mt-4"
        >
          Please wait while we prepare your personalized insights...
        </motion.div>
      </div>
    </div>
  );
};

export default APIAnimation;
