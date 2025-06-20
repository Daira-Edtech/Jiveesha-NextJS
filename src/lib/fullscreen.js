/**
 * Fullscreen utilities for the education app
 */

/**
 * Check if the current device/browser benefits from fullscreen mode
 * @returns {boolean} Whether fullscreen is recommended for this device
 */
export const shouldRecommendFullscreen = () => {
  // Check if it's a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check screen size
  const isSmallScreen = window.innerWidth < 768 || window.innerHeight < 600;
  
  // Check if fullscreen is supported
  const isFullscreenSupported = !!(
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled
  );

  // Recommend fullscreen for larger screens and supported browsers
  return isFullscreenSupported && !isMobile && !isSmallScreen;
};

/**
 * Get the current fullscreen element
 * @returns {Element|null} The current fullscreen element or null
 */
export const getCurrentFullscreenElement = () => {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    null
  );
};

/**
 * Check if currently in fullscreen mode
 * @returns {boolean} Whether currently in fullscreen
 */
export const isCurrentlyFullscreen = () => {
  return !!getCurrentFullscreenElement();
};

/**
 * Get fullscreen change event names for cross-browser compatibility
 * @returns {string[]} Array of event names
 */
export const getFullscreenChangeEvents = () => {
  return [
    "fullscreenchange",
    "webkitfullscreenchange", 
    "mozfullscreenchange",
    "MSFullscreenChange"
  ];
};

/**
 * Request fullscreen with cross-browser compatibility
 * @param {Element} element - The element to make fullscreen (default: document.documentElement)
 * @returns {Promise<boolean>} Whether the operation was successful
 */
export const requestFullscreen = async (element = document.documentElement) => {
  try {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      await element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      await element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      await element.msRequestFullscreen();
    } else {
      throw new Error("Fullscreen not supported");
    }
    return true;
  } catch (error) {
    console.warn("Could not enter fullscreen mode:", error);
    return false;
  }
};

/**
 * Exit fullscreen with cross-browser compatibility
 * @returns {Promise<boolean>} Whether the operation was successful
 */
export const exitFullscreen = async () => {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      await document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      await document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      await document.msExitFullscreen();
    } else {
      throw new Error("Exit fullscreen not supported");
    }
    return true;
  } catch (error) {
    console.warn("Could not exit fullscreen mode:", error);
    return false;
  }
};

/**
 * Toggle fullscreen mode
 * @param {Element} element - The element to make fullscreen (default: document.documentElement)
 * @returns {Promise<boolean>} Whether the operation was successful
 */
export const toggleFullscreen = async (element = document.documentElement) => {
  if (isCurrentlyFullscreen()) {
    return await exitFullscreen();
  } else {
    return await requestFullscreen(element);
  }
};

/**
 * Add fullscreen change event listener with cross-browser compatibility
 * @param {Function} callback - The callback function
 * @returns {Function} Cleanup function to remove listeners
 */
export const addFullscreenChangeListener = (callback) => {
  const events = getFullscreenChangeEvents();
  
  events.forEach(event => {
    document.addEventListener(event, callback);
  });

  // Return cleanup function
  return () => {
    events.forEach(event => {
      document.removeEventListener(event, callback);
    });
  };
};
