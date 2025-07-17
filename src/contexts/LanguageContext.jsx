"use client";
import { createContext, useContext, useState } from 'react';
import { getTranslation } from '../translations';
import LanguageTransitionLoader from '../components/LanguageTransitionLoader';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');
  
  const t = (key) => getTranslation(key, language);

  // Enhanced language setter with transition
  const setLanguageWithTransition = (newLanguage) => {
    if (newLanguage === language) return; // No change needed
    
    setTargetLanguage(newLanguage);
    setIsTransitioning(true);
    
    // Simulate processing time for the transition
    setTimeout(() => {
      setLanguage(newLanguage);
    }, 1200); // Change language partway through transition
    
    // Complete transition after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 2500);
  };

  const languagesList = [
    { code: "en", name: "English", short: "EN" },
    { code: "hi", name: "हिंदी", short: "HI" },
    { code: "kn", name: "ಕನ್ನಡ", short: "KN" },
  ];
  
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: setLanguageWithTransition, 
      t, 
      languagesList,
      isTransitioning 
    }}>
      {children}
      <LanguageTransitionLoader 
        isVisible={isTransitioning} 
        onComplete={() => setIsTransitioning(false)}
        currentLanguage={language}
        targetLanguage={targetLanguage}
      />
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);