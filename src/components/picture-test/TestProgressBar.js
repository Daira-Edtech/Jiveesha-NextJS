// components/PictureTest/TestProgressBar.js
"use client";
import { motion } from "framer-motion";

export default function TestProgressBar({ currentIndex, totalImages, t }) {
  // Ensure totalImages is a positive number before calculating percentage
  const progressPercentage = (totalImages > 0 && currentIndex >= 0) ? ((currentIndex + 1) / totalImages) * 100 : 0;

  // Fallback text
  if (totalImages === undefined || totalImages === null || totalImages <= 0) {
    return (
      <div className="w-full px-2 sm:px-4 py-3 text-center text-sm text-gray-300">
        {t("loadingProgress") || "Loading progress..."}
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 py-2">
      <motion.div
        // MODIFIED: Container style to better match dialog background
        className="relative p-3 bg-[#FDF6E3]/15 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-md"
        // Using a slightly more opaque version of the dialog's base color (#FDF6E3)
        // or a darker slate for dark mode.
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
      >
        <h3 className="text-center text-white font-semibold mb-2 text-xs sm:text-sm">
          {t("pictureTestProgressBarTitle") || "Progress"}{" "}
          <span className="font-bold text-[#A3D8D0]"> {/* Light teal for numbers */}
            {currentIndex + 1} / {totalImages}
          </span>
        </h3>
        <div className="relative h-3 sm:h-4 bg-white/25 dark:bg-slate-500/40 rounded-full overflow-hidden shadow-inner"> {/* MODIFIED: Track style for contrast */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full" // Original fill style
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          >
            {/* Optional: Animated Shine Effect */}
            {progressPercentage > 5 && (
                 <motion.div
                    className="absolute top-0 left-0 h-full w-full opacity-50"
                    style={{
                        backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)",
                    }}
                    animate={{ x: ["-100%", "120%"] }}
                    transition={{
                        x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 1.2,
                        ease: "linear",
                        },
                    }}
                />
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}