import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";

const DialogIntro = ({ currentDialog, dialog, handleNext, t }) => (
    <>
        <motion.div
            key={currentDialog}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-yellow-100 mb-8 lg:mb-12 min-h-48 sm:min-h-56 lg:min-h-64 xl:min-h-72 flex items-center justify-center font-serif font-medium leading-relaxed text-center px-4"
        >
            <span className="drop-shadow-lg">{dialog[currentDialog]}</span>
        </motion.div>

        <div className="flex justify-center gap-3 mb-8 lg:mb-10">
            {dialog.map((_, index) => (
                <motion.div
                    key={index}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                        index <= currentDialog
                            ? "bg-gradient-to-r from-yellow-200 to-orange-300 shadow-md"
                            : "bg-yellow-100/30"
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
                    currentDialog < dialog.length - 1
                        ? "bg-gradient-to-r from-yellow-50 to-amber-100 text-amber-900 hover:from-orange-50 hover:to-amber-200 hover:shadow-amber-300/50"
                        : "bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 hover:shadow-yellow-400/50"
                }`}
            >
                {currentDialog < dialog.length - 1 ? (
                    <>
                        <span className="drop-shadow-sm">{t("next", "Next")}</span>
                        <ChevronRight className="mt-0.5 drop-shadow-sm" />
                    </>
                ) : (
                    <>
                        <span className="drop-shadow-sm">
                            {t("imReady", "I'm Ready!")}
                        </span>
                        <Check className="mt-0.5 drop-shadow-sm" />
                    </>
                )}
            </motion.button>
        </div>
    </>
);

export default DialogIntro;
