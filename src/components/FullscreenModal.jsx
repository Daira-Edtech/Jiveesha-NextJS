"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize2, X } from "lucide-react";

const FullscreenModal = ({ isOpen, onClose, onStartGame, translations }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if we're already in fullscreen mode
  useEffect(() => {
    const checkFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", checkFullscreen);
    checkFullscreen(); // Check initial state

    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
    };
  }, []);

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        await document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.msRequestFullscreen) {
        await document.documentElement.msRequestFullscreen();
      }
    } catch (error) {
      console.warn("Could not enter fullscreen mode:", error);
      // Continue anyway if fullscreen fails
      onStartGame();
    }
  };

  const handleEnterFullscreen = async () => {
    await enterFullscreen();
    onStartGame();
  };

  const handleStartWithoutFullscreen = () => {
    onStartGame();
  };

  const handleQuit = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-blue-800 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center justify-center gap-2"
            >
              <Maximize2 className="w-8 h-8 text-blue-600" />
              {translations?.enhanceExperience || "Enhance Experience"}
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Recommendation Text */}
          <div className="text-center">
            <p className="text-gray-700 text-lg leading-relaxed">
              {translations?.fullScreenRecommendation || "For the best experience, we recommend using fullscreen mode."}
            </p>
          </div>

          {/* Fullscreen Preview */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-4 border-2 border-blue-200 shadow-inner"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-md h-20 flex items-center justify-center">
              <Maximize2 className="w-8 h-8 text-white" />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Immersive fullscreen experience
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            {!isFullscreen && (
              <Button
                onClick={handleEnterFullscreen}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Maximize2 className="w-5 h-5 mr-2" />
                {translations?.enterFullscreen || "Enter Fullscreen"}
              </Button>
            )}

            <Button
              onClick={handleStartWithoutFullscreen}
              variant={isFullscreen ? "default" : "outline"}
              className={`w-full font-semibold py-3 text-lg transition-all duration-300 ${
                isFullscreen
                  ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                  : "border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
              }`}
            >
              {translations?.startGame || "Start Game"}
            </Button>

            <Button
              onClick={handleQuit}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300"
            >
              <X className="w-4 h-4 mr-2" />
              {translations?.quit || "Quit"}
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default FullscreenModal;
