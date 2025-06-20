"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

const BackToMapButton = ({ 
  className = "", 
  variant = "default",
  position = "top-left",
  showText = true,
  onClick 
}) => {
  const router = useRouter();
  const { t } = useLanguage();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push('/take-tests?skipStart=true');
    }
  };

  // Position styles - separated positioning from z-index for better override control
  const positionStyles = {
    'top-left': 'fixed top-4 left-4',
    'top-right': 'fixed top-4 right-4',
    'absolute-top-left': 'absolute top-4 left-4',
    'absolute-top-right': 'absolute top-4 right-4',
    'relative': 'relative'
  };

  // Default z-index (can be overridden by className)
  const defaultZIndex = 'z-50';

  // Variant styles
  const variantStyles = {
    default: "bg-white/80 hover:bg-white text-gray-800 border border-gray-200",
    primary: "bg-blue-500/90 hover:bg-blue-600 text-white",
    dark: "bg-gray-800/90 hover:bg-gray-900 text-white",
    glass: "bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20",
    minimal: "bg-transparent hover:bg-black/10 text-gray-600 hover:text-gray-800"
  };

  const baseClasses = `
    flex items-center gap-2 px-3 py-2 rounded-lg 
    font-medium text-sm transition-all duration-200 
    shadow-md hover:shadow-lg active:scale-95
    ${variantStyles[variant]}
    ${positionStyles[position]}
    ${className || defaultZIndex}
  `;

  return (
    <motion.button
      onClick={handleClick}
      className={baseClasses}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      aria-label={t('backToMap') || 'Back to Map'}
      title={t('backToMap') || 'Back to Map'}
    >
      <FaArrowLeft className="w-4 h-4" />
      {showText && (
        <span className="hidden sm:inline">
          {t('backToMap') || 'Back to Map'}
        </span>
      )}
    </motion.button>
  );
};

export default BackToMapButton;
