import React from 'react';
import { motion } from 'framer-motion';

const AnimatedScoreCircle = ({ score, total, size = 180 }) => {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const circleVariants = {
    hidden: { strokeDashoffset: circumference },
    visible: {
      strokeDashoffset: offset,
      transition: { duration: 1.5, ease: "circOut", delay: 0.5 },
    },
  };

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Foreground Animated Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          variants={circleVariants}
          initial="hidden"
          animate="visible"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34D399" /> {/* Emerald 400 */}
            <stop offset="100%" stopColor="#FBBF24" /> {/* Amber 400 */}
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <motion.span 
          className="text-4xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {score}
          <span className="text-2xl text-white/80">/{total}</span>
        </motion.span>
        <motion.span 
          className="text-lg font-medium text-amber-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {Math.round(percentage)}%
        </motion.span>
      </div>
    </div>
  );
};

export default AnimatedScoreCircle;