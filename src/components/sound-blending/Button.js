"use client";

import { motion } from "framer-motion";
import { Loader } from "lucide-react";

/**
 * Reusable Button component with different variants and loading state.
 */
export default function Button({
  onClick,
  disabled,
  variant = "primary",
  children,
  className = "",
  isLoading = false,
}) {
  const baseStyle =
    "py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-sm";
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed",
    secondary:
      "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 hover:from-blue-100 hover:to-blue-200 active:scale-98",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 active:scale-98",
    success:
      "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 active:scale-98",
    warning:
      "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 active:scale-98",
  };
  return (
    <motion.button
      // Disable hover/tap animations if disabled or loading
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader className="h-5 w-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
