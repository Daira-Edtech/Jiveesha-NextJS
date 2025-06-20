// components/PictureTest/BackButton.js
"use client";
import { motion } from "framer-motion";
import Link from 'next/link'; // Standard Next.js Link
import { FaArrowLeft } from "react-icons/fa";

// Create a motion-compatible Link component
// This HOC (Higher Order Component) from Framer Motion
// allows the Link component to accept motion props.
const MotionLink = motion(Link);

export default function BackButton({ t, targetPath = "/take-tests?skipStart=true" }) {
  return (
    <MotionLink
      href={targetPath} // href is a prop of Link
      // Motion props
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97, opacity: 0.85 }}
      // Styling and other attributes are applied to the <a> tag rendered by Link
      className="fixed top-4 left-4 z-[60] flex items-center gap-2
                 px-4 py-2 rounded-lg
                 font-semibold text-sm sm:text-base
                 border-2 border-white text-white
                 bg-black/20 hover:bg-black/30 focus:bg-black/30
                 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900/50
                 shadow-md hover:shadow-lg transition-colors duration-200 group"
      aria-label={t("backToMap") || "Back to Map"}
    >
      {/* Children of the Link component */}
      <FaArrowLeft className="text-white transition-colors" />
      {t("backToMap") || "Back to Map"}
    </MotionLink>
  );
}