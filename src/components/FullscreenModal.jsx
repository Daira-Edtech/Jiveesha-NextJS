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
     
    </Dialog>
  );
};

export default FullscreenModal;
