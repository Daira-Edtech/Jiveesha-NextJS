"use client";
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdInfo, MdLanguage, MdBugReport } from 'react-icons/md';
import { useLanguage } from '@/contexts/LanguageContext';

const MapLayout = ({ tests, onTestSelect, onQuit }) => {
  const { t, setLanguage } = useLanguage();
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [hoveredIsland, setHoveredIsland] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, type: null });

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
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/Main-Map/image.png" 
          alt="Map Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <motion.button
          onClick={() => window.history.back()}
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
      <div className="absolute top-6 right-6 z-20 flex gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl shadow-xl">
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

      {/* Title */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-10"
      >
        <h1 className="text-4xl font-black text-white text-center drop-shadow-lg">
          {t('adventureMap')}
        </h1>
        <p className="text-lg font-medium text-white/90 text-center mt-2 drop-shadow-md">
          {t('chooseYourChallenge')}
        </p>
      </motion.div>

      {/* Game Map */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="relative max-w-7xl w-full">
          {/* Connection Lines */}
          <svg className="absolute w-full h-full pointer-events-none z-0">
            {tests.map((_, index) => {
              if (index === tests.length - 1) return null;
              
              const getPosition = (idx) => {
                const row = idx < 4 ? 0 : idx < 8 ? 1 : 2;
                const col = row === 2 ? (idx - 8) * 2 + 1 : idx % 4;
                const x = 20 + (col * 20);
                const y = 25 + (row * 25);
                return { x, y };
              };
              
              const start = getPosition(index);
              const end = getPosition(index + 1);
              const controlX = (start.x + end.x) / 2;
              const controlY = (start.y + end.y) / 2 - 10;
              
              const path = `M${start.x}% ${start.y}% Q${controlX}% ${controlY}% ${end.x}% ${end.y}%`;
              
              return (
                <g key={`path-${index}`}>
                  <motion.path
                    d={path}
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                  />
                  <motion.path
                    d={path}
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="8,8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: 0.8,
                      strokeDashoffset: [0, -100]
                    }}
                    transition={{ 
                      pathLength: { duration: 1.5, delay: index * 0.2 },
                      opacity: { duration: 1, delay: index * 0.2 },
                      strokeDashoffset: { 
                        duration: 10, 
                        repeat: Infinity,
                        ease: "linear"
                      }
                    }}
                  />
                </g>
              );
            })}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Islands Grid */}
          <div className="grid gap-y-20">
            {/* First Row - 4 islands */}
            <div className="grid grid-cols-4 gap-x-8 md:gap-x-16">
              {tests.slice(0, 4).map((test, index) => (
                <IslandItem 
                  key={test.id} 
                  test={test} 
                  index={index}
                  isHovered={hoveredIsland === index}
                  onHoverStart={() => setHoveredIsland(index)}
                  onHoverEnd={() => setHoveredIsland(null)}
                  onClick={() => onTestSelect(test.id)}
                />
              ))}
            </div>
            
            {/* Second Row - 4 islands */}
            <div className="grid grid-cols-4 gap-x-8 md:gap-x-16">
              {tests.slice(4, 8).map((test, index) => (
                <IslandItem 
                  key={test.id} 
                  test={test} 
                  index={index + 4}
                  isHovered={hoveredIsland === index + 4}
                  onHoverStart={() => setHoveredIsland(index + 4)}
                  onHoverEnd={() => setHoveredIsland(null)}
                  onClick={() => onTestSelect(test.id)}
                />
              ))}
            </div>
            
            {/* Third Row - remaining islands centered */}
            {tests.length > 8 && (
              <div className="grid grid-cols-2 gap-x-8 md:gap-x-16 w-1/2 mx-auto">
                {tests.slice(8, 10).map((test, index) => (
                  <IslandItem 
                    key={test.id} 
                    test={test} 
                    index={index + 8}
                    isHovered={hoveredIsland === index + 8}
                    onHoverStart={() => setHoveredIsland(index + 8)}
                    onHoverEnd={() => setHoveredIsland(null)}
                    onClick={() => onTestSelect(test.id)}
                  />
                ))}
              </div>
            )}
          </div>
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
const IslandItem = ({ test, index, isHovered, onHoverStart, onHoverEnd, onClick }) => {
  const { t } = useLanguage();
  
  return (
    <motion.div
      className="relative cursor-pointer flex flex-col items-center"
      onClick={onClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Island Base - using a circular design as fallback for island image */}
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        <div className="w-full h-full bg-gradient-to-b from-green-400 to-green-600 rounded-full shadow-2xl flex items-center justify-center">
          <div className="w-4/5 h-4/5 bg-gradient-to-b from-green-300 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl md:text-2xl">{index + 1}</span>
          </div>
        </div>
        {/* Floating animation */}
        <motion.div
          className="absolute inset-0"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Level Number and Name */}
      <div className="mt-4 text-center">
        <motion.p 
          className="font-bold text-white text-lg md:text-xl drop-shadow-lg mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          {t('level')} {index + 1}
        </motion.p>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-10"
            >
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg whitespace-nowrap max-w-xs">
                <p className="text-gray-800 font-medium text-sm">
                  {test.testName}
                </p>
                {test.About && (
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {test.About.substring(0, 100)}...
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
