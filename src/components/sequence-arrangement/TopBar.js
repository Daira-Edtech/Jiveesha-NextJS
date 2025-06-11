// components/test7/TopBar.js
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Next.js router
import { IoIosInformationCircleOutline } from "react-icons/io";

const TopBar = ({ mode, currentItem, score, onShowInfo, onSkipTest, t, totalTestItems }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-0 left-0 right-0 z-30 p-4" // Lower z-index than modals
    >
      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }} whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/take-tests")} 
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-700/80 to-yellow-600/80 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-yellow-400"
        >
          <motion.span animate={{ x: [-2, 0, -2] }} transition={{ duration: 2, repeat: Infinity }} className="text-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-6 h-6 text-white-400 drop-shadow-lg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </motion.span>
          <span className="font-semibold text-lg">{t("backToTests")}</span>
        </motion.button>

        {mode === "test" && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="flex items-center gap-4 bg-black/60 backdrop-blur-md rounded-full px-6 py-3 border-2 border-amber-400/50"
          >
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-bold text-lg">{t("progress")}:</span>
              <div className="flex gap-1">
                {Array(totalTestItems).fill(0).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.05 }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index < currentItem ? "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="w-px h-6 bg-amber-400/50"></div>
            <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2 text-amber-300">
              <span className="text-3xl">🏆</span>
              <span className="font-bold text-xl">{score.correct}/{score.total}</span>
            </motion.div>
          </motion.div>
        )}

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }}
            onClick={onShowInfo}
            className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-amber-300"
          >
            <IoIosInformationCircleOutline className="text-3xl text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onSkipTest}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-red-400"
          >
            <span className="text-2xl">🚪</span>
            <span className="font-semibold text-lg">{t("skipTest")}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TopBar;