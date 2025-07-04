"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import testsData from "@/Data/tests.json";
import { useChildren } from "@/hooks/useChildren";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowBack, MdClose, MdFullscreen, MdSchool, MdSearch, MdStars } from "react-icons/md";

export default function SelectStudentPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: childrenData, isLoading, error } = useChildren();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    // Apply fullscreen body class
    document.body.classList.add('fullscreen-page');
    document.documentElement.classList.add('fullscreen-page');

    return () => {
      clearTimeout(timer);
      // Clean up fullscreen classes when leaving
      document.body.classList.remove('fullscreen-page');
      document.documentElement.classList.remove('fullscreen-page');
    };
  }, []);

  useEffect(() => {
    let timeoutId;
    let retryCount = 0;
    const maxRetries = 10;
    
    // Enhanced fullscreen function with better browser compatibility
    const enterFullscreen = async () => {
      try {
        // Check if already in fullscreen
        const isAlreadyFullscreen = !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        );
        
        if (isAlreadyFullscreen) {
          setIsFullscreen(true);
          console.log('Already in fullscreen mode');
          return true;
        }

        console.log(`Attempting to enter fullscreen (attempt ${retryCount + 1}/${maxRetries})`);

        // Try different fullscreen methods with better error handling
        const element = document.documentElement;
        let success = false;

        if (element.requestFullscreen) {
          await element.requestFullscreen({ navigationUI: "hide" });
          success = true;
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen();
          success = true;
        } else if (element.mozRequestFullScreen) {
          await element.mozRequestFullScreen();
          success = true;
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen();
          success = true;
        }
        
        if (success) {
          setIsFullscreen(true);
          console.log('Fullscreen mode entered successfully');
          retryCount = 0; // Reset retry count on success
          return true;
        }
        
        throw new Error('No fullscreen method available');
      } catch (error) {
        console.warn(`Fullscreen attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        
        // Retry with exponential backoff
        if (retryCount < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Max 5 second delay
          timeoutId = setTimeout(() => {
            enterFullscreen();
          }, delay);
        } else {
          console.error('Max fullscreen retries reached. Fullscreen may not be supported.');
        }
        return false;
      }
    };

    // Enhanced fullscreen change handler
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      console.log('Fullscreen state changed:', isCurrentlyFullscreen);
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Aggressively re-enter fullscreen if user exits (but not immediately to avoid infinite loop)
      if (!isCurrentlyFullscreen) {
        console.log('Fullscreen exited, scheduling re-entry...');
        // Delayed retry to avoid infinite loop
        setTimeout(() => {
          enterFullscreen();
        }, 1000);
      }
    };

    // Handle visibility change to re-enter fullscreen when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => {
          const isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
          );
          if (!isFullscreen) {
            console.log('Page became visible and not in fullscreen, attempting to enter...');
            enterFullscreen();
          }
        }, 500);
      }
    };

    // Handle any user interaction to try entering fullscreen
    const handleUserInteraction = (event) => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      if (!isFullscreen) {
        console.log('User interaction detected while not in fullscreen, attempting to enter...');
        enterFullscreen();
      }
    };

    // Add comprehensive event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    // Multiple attempts to enter fullscreen on mount
    const initFullscreen = () => {
      // Try immediately
      enterFullscreen();
      
      // Backup attempts
      setTimeout(() => enterFullscreen(), 500);
      setTimeout(() => enterFullscreen(), 1500);
      setTimeout(() => enterFullscreen(), 3000);
    };

    // Start fullscreen initialization
    if (typeof window !== 'undefined') {
      initFullscreen();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  const forceFullscreen = async () => {
    try {
      console.log('Force fullscreen requested');
      
      // Exit any existing fullscreen first
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      if (isCurrentlyFullscreen) {
        console.log('Exiting current fullscreen before re-entering');
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
        
        // Wait a bit before re-entering
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Now enter fullscreen with navigation UI hidden
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen({ navigationUI: "hide" });
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      
      setIsFullscreen(true);
      console.log('Force fullscreen successful');
    } catch (error) {
      console.warn('Could not force fullscreen:', error);
      // Show more persistent prompt if force fails
      setIsFullscreen(false);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && 
          !document.webkitFullscreenElement && 
          !document.mozFullScreenElement &&
          !document.msFullscreenElement) {
        await forceFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.warn('Could not toggle fullscreen:', error);
    }
  };
  
  const handleStudentSelect = (student) => {
    setSelectedCard(student.id);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      localStorage.setItem("childId", student.id.toString());
      localStorage.setItem('selectedStudent', JSON.stringify(student));
      
      const selectedTestIdString = localStorage.getItem("selectedTestId");
      
      if (selectedTestIdString === "all") {
        router.push("/continuousassessment");
      } else if (selectedTestIdString) {
        const selectedTestId = parseInt(selectedTestIdString, 10);
        const test = testsData.find(t => t.id === selectedTestId);
        if (test && test.routeName) {
          router.push(`/${test.routeName}`);
        } else {
          console.warn(`Test with ID ${selectedTestId} or its routeName not found. Navigating to dashboard.`);
          router.push("/dashboard");
        }
      } else {
        console.warn("selectedTestId not found in localStorage. Navigating to dashboard.");
        router.push("/dashboard");
      }
    }, 500);
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const getAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredStudents = (childrenData?.children || []).filter((student) =>
    student?.name?.toLowerCase().includes(searchTerm) ||
    student?.rollno?.toLowerCase().includes(searchTerm)
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">We couldn&apos;t load the adventurers. Try again?</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="fullscreen-page fixed inset-0 w-screen h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 overflow-hidden"
      onClick={!isFullscreen ? forceFullscreen : undefined}
      onKeyDown={!isFullscreen ? forceFullscreen : undefined}
      onTouchStart={!isFullscreen ? forceFullscreen : undefined}
      style={{ 
        cursor: !isFullscreen ? 'pointer' : 'default',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      }}
      tabIndex={0}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Clouds */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: `${60 + i * 20}px`,
              height: `${30 + i * 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Sparkles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 h-full overflow-y-auto">
        {/* Fullscreen Prompt (if not in fullscreen) */}
        {!isFullscreen && (
          <>
            {/* Overlay to block interaction until fullscreen */}
            <div 
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm cursor-pointer"
              onClick={forceFullscreen}
            />
            
            {/* Fullscreen Required Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl border-4 border-red-500">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                  className="text-6xl mb-4"
                >
                  🔒
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Fullscreen Required</h2>
                <p className="text-gray-600 mb-6">
                  This learning adventure requires fullscreen mode for the best experience.
                  Please click below to enable fullscreen.
                </p>
                <motion.button
                  onClick={forceFullscreen}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg flex items-center gap-3 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(239, 68, 68, 0.5)",
                      "0 0 30px rgba(239, 68, 68, 0.8)",
                      "0 0 20px rgba(239, 68, 68, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MdFullscreen className="w-6 h-6" />
                  Enable Fullscreen
                </motion.button>
                <p className="text-sm text-gray-500 mt-4">
                  Click anywhere on this page to enable fullscreen
                </p>
              </div>
            </motion.div>
          </>
        )}

        {/* Header Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Back Button */}
          <div className="flex justify-start mb-6">
            <motion.button
              onClick={() => router.push('/take-tests?skipStart=true')}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white rounded-xl px-4 py-2 hover:bg-white/20 transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdArrowBack className="w-5 h-5" />
              <span className="font-medium">{t("BacktoMap")}</span>
            </motion.button>
          </div>

          {/* Title */}
          <div className=" p-6 mb-6 1">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-2"
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.5)",
                  "0 0 20px rgba(255,255,255,0.8)",
                  "0 0 10px rgba(255,255,255,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
             {t("ChooseYourPirate")}
            </motion.h1>
            <p className="text-white/80 text-lg">
              {t("ChooseYourPirateDesc")}
            </p>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-md mx-auto"
          >
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('searchStudentsPlaceholder')}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white/90 backdrop-blur-md rounded-full border-2 border-white/50 focus:border-yellow-400 focus:outline-none text-gray-800 placeholder-gray-500 shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Students Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {isLoading ? (
            // Loading Skeletons
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl animate-pulse"
                >
                  <div className="w-20 h-20 bg-white/30 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-white/30 rounded mb-2"></div>
                  <div className="h-3 bg-white/20 rounded mb-4"></div>
                  <div className="h-10 bg-white/30 rounded-full"></div>
                </motion.div>
              ))}
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1, 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 20 
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                  onClick={() => handleStudentSelect(student)}
                >
                  <div className={`relative bg-white backdrop-blur-md rounded-2xl p-6 shadow-xl border-2 transition-all duration-300 ${
                    selectedCard === student.id 
                      ? 'border-yellow-400 bg-yellow-400/20' 
                      : 'border-white/30 hover:border-yellow-400/50'
                  }`}>
                    {/* Character Badge */}
                    <div className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg">
                      <MdStars className="w-5 h-5 text-white" />
                    </div>

                    {/* Loading Indicator for Selected Card */}
                    {selectedCard === student.id && (
                      <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full"
                        />
                      </div>
                    )}

                    {/* Avatar */}
                    <div className="relative mb-4">
                      <motion.div
                        className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                        animate={{
                          boxShadow: [
                            "0 0 20px rgba(59, 130, 246, 0.5)",
                            "0 0 30px rgba(147, 51, 234, 0.7)",
                            "0 0 20px rgba(59, 130, 246, 0.5)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {student.imageUrl ? (
                          <img
                            src={student.imageUrl}
                            alt={student.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(student.name)
                        )}
                      </motion.div>
                      
                      {/* Floating Level Badge */}
                      <motion.div
                        className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full px-2 py-1 text-xs font-bold text-white shadow-lg"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Lv.{getAge(student.dateOfBirth)}
                      </motion.div>
                    </div>

                    {/* Student Info */}
                    <div className="text-center text-gray-800 mb-4">
                      <h3 className="font-bold text-lg mb-1 truncate">
                        {student.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <MdSchool className="w-4 h-4" />
                        <span>{t("labelRoll")}: {student.rollno}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gray-100 rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-600">{t("labelAge")}</div>
                        <div className="text-sm font-bold text-gray-800">
                          {getAge(student.dateOfBirth)}
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-600">{t("labelGender")}</div>
                        <div className="text-sm font-bold text-gray-800">
                          {student.gender}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 rounded-full shadow-lg hover:from-yellow-500 hover:to-orange-600 transition-all"
                      disabled={selectedCard === student.id}
                    >
                      {selectedCard === student.id ? t("Selecting") : t("SelectStudent")}
                    </motion.button>

                    {/* Sparkle Effects on Hover */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      whileHover="hover"
                    >
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${10 + i * 15}%`,
                          }}
                          variants={{
                            hover: {
                              opacity: [0, 1, 0],
                              scale: [0, 1.5, 0],
                              y: [0, -20, -40],
                            },
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Empty State
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-16"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto shadow-xl">
                <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {searchTerm ? t('Nofound'): t('Noready')}
                    </h3>
                    <p className="text-white/80">
                      {searchTerm 
                        ?  t("diffnameroll")
                        :  t("nobraveAvail")
                      }
                    </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                  >
                    {t("ClearSearch")}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
