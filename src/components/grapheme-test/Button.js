"use client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

const Button = ({
  onClick,
  disabled,
  children,
  className = "",
  variant = "primary",
  isLoading = false,
}) => {
  const baseStyle =
    "py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm text-sm";
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed",
    secondary:
      "bg-blue-100 text-blue-700 hover:bg-blue-200 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed",
  };
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </motion.button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "danger"]),
  isLoading: PropTypes.bool,
};

export default Button;