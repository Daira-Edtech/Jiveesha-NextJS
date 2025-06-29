"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdInfo, MdLanguage, MdBugReport } from 'react-icons/md';
import { useLanguage } from '@/contexts/LanguageContext';
import bg from "../../public/map.png"

const MapLayout = ({ tests, onTestSelect, onQuit }) => {
  const router = useRouter();
  const { t, setLanguage } = useLanguage();
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [hoveredIsland, setHoveredIsland] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, type: null });

  // Island names for each island
  const islandNames = [
    "Goonj Tapu",
    "Varnika Van", 
    "Yantra Kanan",
    "Svara Gufa",
    "Akshara Parvat",
    "Chitra Sarovar",
    "Runa Pathar",
    "Shabd Sagar",
    "Shabd Mandir",
    "Kaal Dhara"
  ];

  const handleAction = (type) => {
    setConfirmDialog({
      show: true,
      type,
      title: t(`confirm${type.charAt(0).toUpperCase() + type.slice(1)}`),
      message: t(`confirm${type.charAt(0).toUpperCase() + type.slice(1)}Message`),
      onConfirm: () => {
        switch(type) {
          case 'quit': onQuit(); break;
          case 'info': setShowInfoDialog(true); break;
          case 'language': setShowLanguageDialog(true); break;
          case 'report': setShowReportDialog(true); break;
        }
      }
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600">
      {/* Background Map Image */}
<div className="relative w-full h-full">
  {/* Blurred Background Image */}
  <div className="absolute inset-0 z-0">
    <img 
      src="/map.png" 
      alt="Adventure Map Background" 
      className="w-full h-full object-cover" 
    />
    <div className="absolute inset-0 backdrop-blur-[5px] bg-white/10" />
  </div>

  {/* Board Map Overlay (Not Blurred) */}
  <div className=" z-10 fixed top-0 flex items-center justify-center">
    <motion.img 
      src="/board-map.png" 
      alt="Board Map" 
      className="max-w-full max-h-full"
      animate={{
        rotate: [-0.5, 0.5, -0.5],
        x: [-2, 2, -2],
        y: [-1, 1, -1]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "mirror"
      }}
    />
  </div>
</div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <motion.button
          onClick={() => {
            console.log('Back button clicked, navigating to /take-tests');
            try {
              router.replace('/take-tests');
            } catch (error) {
              console.error('Navigation error:', error);
              // Fallback to window location
              window.location.href = '/take-tests';
            }
          }}
          className="p-2.5 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all shadow-lg flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-6 h-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          <span className="font-medium">{t('back')}</span>
        </motion.button>
      </div>

      {/* Control Panel */}
      <div className="absolute top-6 right-6 z-20 flex gap-4 scale-110 p-3 rounded-2xl">
        <motion.button
          onClick={() => handleAction('quit')}
          className="p-2.5 bg-red-500/90 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-red-500/20"
          title={t('quit')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MdClose className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={() => handleAction('info')}
          className="p-2.5 bg-blue-500/90 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/20"
          title={t('gameInfo')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MdInfo className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={() => handleAction('language')}
          className="p-2.5 bg-green-500/90 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/20"
          title={t('language')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MdLanguage className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={() => handleAction('report')}
          className="p-2.5 bg-purple-500/90 text-white rounded-xl hover:bg-purple-600 transition-all shadow-lg hover:shadow-purple-500/20"
          title={t('reportIssue')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MdBugReport className="w-6 h-6" />
        </motion.button>
      </div>

    

      {/* Game Map with Islands */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="relative w-full h-full max-w-7xl">
          {/* Connection Lines between Islands */}
    {/* Connection Lines between Islands */}
<svg className="absolute w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
  {/* Connect islands in sequential order: 1→2→3→4→5→6→7→8→9→10 */}
  {tests.slice(0, 10).map((_, index) => {
    if (index === 9) return null; // Don't connect the last island to anything
    
    // Define island positions (percentages from top-left) - moved down
    const islandPositions = [
      { x: 15, y: 30 },  // Island 1 - Top left
      { x: 35, y: 25 },  // Island 2 - Top center-left
      { x: 55, y: 35 },  // Island 3 - Top center
      { x: 75, y: 30 },  // Island 4 - Top right
      { x: 85, y: 50 },  // Island 5 - Right side
      { x: 70, y: 70 },  // Island 6 - Bottom right
      { x: 45, y: 80 },  // Island 7 - Bottom center
      { x: 25, y: 75 },  // Island 8 - Bottom left
      { x: 10, y: 55 },  // Island 9 - Left side
      { x: 50, y: 55 },  // Island 10 - Center (final boss)
    ];
    
    const start = islandPositions[index];
    const end = islandPositions[index + 1];
    
    if (!start || !end) return null;
    
    // Calculate control point for curved path
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    // Add curve by offsetting the control point - make curves more pronounced
    const curveOffset = 15 + Math.abs(start.x - end.x) * 0.3;
    const controlX = midX + (start.x < end.x ? -curveOffset : curveOffset);
    const controlY = midY - 15 - Math.abs(start.x - end.x) * 0.15; // Curve upward
    
    const curvePath = `M${start.x}% ${start.y}% Q${controlX}% ${controlY}% ${end.x}% ${end.y}%`;
    
    return (
      <g key={`path-${index}`}>
        {/* Background shadow for depth */}
        <path
          d={curvePath}
          stroke="rgba(101, 67, 33, 0.4)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="15,10"
          fill="none"
          style={{ 
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
            transform: 'translate(1px, 1px)' 
          }}
        />
        
        {/* Main dotted brown line - more visible */}
        <motion.path
          d={curvePath}
          stroke="#8B4513"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="15,10"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            strokeDashoffset: [0, -100]
          }}
          transition={{ 
            pathLength: { duration: 2, delay: index * 0.3, ease: "easeInOut" },
            opacity: { duration: 1.5, delay: index * 0.3 },
            strokeDashoffset: { 
              duration: 25, 
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.3 + 2
            }
          }}
        />
        
        {/* Lighter brown accent line for better visibility */}
        <motion.path
          d={curvePath}
          stroke="#D2691E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="10,15"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 0.9,
            strokeDashoffset: [0, 50]
          }}
          transition={{ 
            pathLength: { duration: 2, delay: index * 0.3 + 0.3, ease: "easeInOut" },
            opacity: { duration: 1.2, delay: index * 0.3 + 0.3 },
            strokeDashoffset: { 
              duration: 18, 
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.3 + 2.3
            }
          }}
        />
        
        {/* Inner highlight for more definition */}
        <motion.path
          d={curvePath}
          stroke="#CD853F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="8,12"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 0.8,
            strokeDashoffset: [0, -30]
          }}
          transition={{ 
            pathLength: { duration: 2, delay: index * 0.3 + 0.6, ease: "easeInOut" },
            opacity: { duration: 1, delay: index * 0.3 + 0.6 },
            strokeDashoffset: { 
              duration: 12, 
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.3 + 2.6
            }
          }}
        />
      </g>
    );
  })}
</svg>


          {/* Islands positioned across the map */}
          {tests.slice(0, 10).map((test, index) => {
            // Define strategic positions for each island (moved down a bit)
            const islandPositions = [
              { x: 15, y: 30 },  // Island 1 - Top left
              { x: 35, y: 25 },  // Island 2 - Top center-left
              { x: 55, y: 35 },  // Island 3 - Top center
              { x: 75, y: 30 },  // Island 4 - Top right
              { x: 85, y: 50 },  // Island 5 - Right side
              { x: 70, y: 70 },  // Island 6 - Bottom right
              { x: 45, y: 80 },  // Island 7 - Bottom center
              { x: 25, y: 75 },  // Island 8 - Bottom left
              { x: 10, y: 55 },  // Island 9 - Left side
              { x: 50, y: 55 },  // Island 10 - Center (final boss)
            ];
            
            const position = islandPositions[index];
            
            return (
              <IslandItem 
                key={test.id} 
                test={test} 
                index={index}
                position={position}
                islandName={islandNames[index]}
                isHovered={hoveredIsland === index}
                onHoverStart={() => setHoveredIsland(index)}
                onHoverEnd={() => setHoveredIsland(null)}
                onClick={() => onTestSelect(test.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog.show && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDialog({ show: false, type: null })}
            />
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl relative z-10 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-4">{confirmDialog.title}</h3>
              <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDialog({ show: false, type: null })}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog({ show: false, type: null });
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {t('confirm')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Dialog */}
      <AnimatePresence>
        {showInfoDialog && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoDialog(false)}
            />
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl relative z-10 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{t('gameInfo')}</h3>
                <button
                  onClick={() => setShowInfoDialog(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">{t('gameInfoDescription')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tests.map((test, index) => (
                    <div key={test.id} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold">Level {index + 1}: {test.testName}</h4>
                      <p className="text-sm text-gray-600 mt-1">{test.About}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Dialog */}
      <AnimatePresence>
        {showLanguageDialog && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLanguageDialog(false)}
            />
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl relative z-10 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{t('selectLanguage')}</h3>
                <button
                  onClick={() => setShowLanguageDialog(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-2">
                {['en', 'ta', 'hi'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageDialog(false);
                    }}
                    className="w-full p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ்' : 'हिंदी'}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Dialog */}
      <AnimatePresence>
        {showReportDialog && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportDialog(false)}
            />
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl relative z-10 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{t('reportIssue')}</h3>
                <button
                  onClick={() => setShowReportDialog(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>
              <textarea
                placeholder={t('describeIssue')}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
              />
              <div className="flex gap-3 justify-end mt-4">
                <button
                  onClick={() => setShowReportDialog(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={() => setShowReportDialog(false)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  {t('submit')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Island Item Component
const IslandItem = ({ test, index, position, islandName, isHovered, onHoverStart, onHoverEnd, onClick }) => {
  const { t } = useLanguage();
  
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered ? 30 : 20,
      }}
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      whileHover={{ 
        scale: 1.2, 
        zIndex: 30,
        transition: { type: "spring", stiffness: 400, damping: 25, duration: 0.3 }
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.5, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: index * 0.15, 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.6
      }}
      animate={{ 
        y: [0, -8, 0],
        rotate: [0, 1, 0, -1, 0]
      }}
      transition={{ 
        y: { 
          duration: 3 + index * 0.2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        },
        rotate: {
          duration: 4 + index * 0.3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      {/* Island Image */}
      <div className="relative">
        <img
          src={`/images/islands/island${index + 1}.png`}
          alt={`Island ${index + 1} - ${test.testName}`}
          className="w-20 h-20 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain drop-shadow-2xl"
        />
        
        {/* Magical Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-30 blur-lg"
          animate={{
            opacity: isHovered ? [0.3, 0.6, 0.3] : [0.1, 0.3, 0.1],
            scale: isHovered ? [1, 1.3, 1] : [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Level Badge */}
        <motion.div
          className="absolute -top-3 -right-3 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center border-2 border-white"
          animate={{
            scale: isHovered ? [1, 1.2, 1] : [0.9, 1, 0.9],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            scale: { duration: 1.5, repeat: Infinity },
            rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <span className="text-white font-bold text-sm md:text-base lg:text-lg">
            {index + 1}
          </span>
        </motion.div>
      </div>
      
      {/* Brown Name Board below the island - now part of the same animated container */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-6">
        <div className="relative">
          {/* Brown wooden board background - more rounded */}
          <div className="bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950 rounded-xl px-2 py-1 md:px-3 md:py-1.5 shadow-lg border border-amber-700 min-w-max">
            {/* Wood grain effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-700/30 to-transparent rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-amber-600/20 to-transparent rounded-xl"></div>
            
            {/* Island name text - smaller font */}
            <p className="relative text-yellow-100 font-semibold text-xs md:text-sm text-center whitespace-nowrap drop-shadow-md">
              {islandName}
            </p>
            
            {/* Decorative brass corners - smaller */}
            <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-yellow-600 rounded-full border border-yellow-500"></div>
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-600 rounded-full border border-yellow-500"></div>
            <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-yellow-600 rounded-full border border-yellow-500"></div>
            <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-600 rounded-full border border-yellow-500"></div>
          </div>
          
          {/* No connecting rope since board is now overlapping island */}
        </div>
      </motion.div>
      
      {/* Island Name on Hover (Enhanced tooltip) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: -15, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="absolute left-1/2 transform -translate-x-1/2 -mt-4 z-40 pointer-events-none"
          >
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-2xl border border-white/20 min-w-max">
              <div className="text-center">
                <p className="text-blue-600 font-semibold text-sm">
                  {test.testName}
                </p>
                <p className="text-amber-700 font-medium text-xs">
                  {islandName}
                </p>
              </div>
              {/* Arrow pointing down to island */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white/95"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sparkle Effects */}
      {isHovered && (
        <motion.div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 10}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -20, -40],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

IslandItem.propTypes = {
  test: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    testName: PropTypes.string.isRequired,
    About: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  islandName: PropTypes.string.isRequired,
  isHovered: PropTypes.bool.isRequired,
  onHoverStart: PropTypes.func.isRequired,
  onHoverEnd: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

MapLayout.propTypes = {
  tests: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    testName: PropTypes.string.isRequired,
    About: PropTypes.string,
  })).isRequired,
  onTestSelect: PropTypes.func.isRequired,
  onQuit: PropTypes.func.isRequired,
};

export default MapLayout;
