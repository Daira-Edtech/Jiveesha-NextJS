import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../contexts/LanguageContext";  
import { FaChevronRight, FaCheck, FaArrowLeft } from "react-icons/fa";

const backgroundImage = "/visual-test/rockvision.png";
const blinkCharacter = "/visual-test/BlinkingStone.png";


const CharacterDialog = ({ onComplete }) => {
  const [currentDialog, setcurrentDialog] = useState(0);
  const { t } = useLanguage();
  const router = useRouter();

  const dialogs = useMemo(
    () => [
      t("visualTestGhadiyakshDialogWelcome"),
      t("visualTestGhadiyakshDialogShiftingPatterns"),
      t("visualTestGhadiyakshDialogWatchClosely"),
      t("visualTestGhadiyakshDialogReward"),
      t("visualTestGhadiyakshDialogReadyPrompt"),
    ],
    [t]
  );

  const handleNext = () => {
    if (currentDialog < dialogs.length - 1) {
      setcurrentDialog(currentDialog + 1);
    } else {
      onComplete();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Back to Map Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ delay: 0.5 }}
        onClick={() => router.push("/take-tests?skipStart=true")} 
        className="fixed top-4 left-4 z-[70] flex items-center gap-2.5 bg-gradient-to-r from-white/90 to-lime-100/90 hover:from-white hover:to-lime-50 text-green-900 font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all backdrop-blur-sm border border-white/50"
        whileHover={{ scale: 1.05, y: -1, shadow:"lg" }} 
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft className="text-green-700" /> {t("backToMap")}
      </motion.button>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative max-w-7xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12"
        >
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: [1, 1.03, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              y: { duration: 0.6, ease: "backOut" },
              opacity: { duration: 0.8 },
              scale: {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="flex-shrink-0 order-2 lg:order-1"
          >
            <img
              src={blinkCharacter}
              alt={t("altBlinkTheGuardian")}
              className="h-64 sm:h-80 lg:h-96 xl:h-112 object-contain"
            />
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-green-800/70 to-yellow-800/70 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border-2 border-white/20 shadow-2xl flex-1 relative overflow-hidden w-full max-w-none lg:max-w-4xl order-1 lg:order-2"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lime-300 to-amber-300"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-400/20 rounded-full filter blur-xl"></div>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-300/20 rounded-full filter blur-xl"></div>
            <div className="absolute top-1/2 right-8 w-24 h-24 bg-lime-400/10 rounded-full filter blur-lg"></div>
            <div className="absolute bottom-8 left-8 w-32 h-32 bg-green-300/10 rounded-full filter blur-lg"></div>
            <motion.div
              key={currentDialog}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white mb-8 lg:mb-12 min-h-48 sm:min-h-56 lg:min-h-64 xl:min-h-72 flex items-center justify-center font-serif font-medium leading-relaxed text-center px-4"
            >
              <span className="drop-shadow-lg">{dialogs[currentDialog]}</span>
            </motion.div>
            <div className="flex justify-center gap-3 mb-8 lg:mb-10">
              {dialogs.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                    index <= currentDialog
                      ? "bg-gradient-to-r from-white to-lime-200 shadow-lg"
                      : "bg-white/30"
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: index === currentDialog ? 1.3 : 1,
                    y: index === currentDialog ? -4 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              ))}
            </div>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className={`flex items-center justify-center gap-3 py-4 px-8 lg:px-12 rounded-xl font-bold text-lg lg:text-xl shadow-2xl transition-all duration-300 ${
                  currentDialog < dialogs.length - 1
                    ? "bg-gradient-to-r from-white to-lime-100 text-green-900 hover:from-lime-50 hover:to-amber-100 hover:shadow-lime-200/50"
                    : "bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 hover:shadow-amber-500/50"
                }`}
              >
                {currentDialog < dialogs.length - 1 ? (
                  <>
                    <span className="drop-shadow-sm">{t("next")}</span>
                    <FaChevronRight className="mt-0.5 drop-shadow-sm" />
                  </>
                ) : (
                  <>
                    <span className="drop-shadow-sm">{t("imReady")}</span>
                    <FaCheck className="mt-0.5 drop-shadow-sm" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default CharacterDialog;