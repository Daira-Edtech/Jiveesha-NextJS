// components/PictureTest/PictureDialogContent.jsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaChevronRight,
  FaEye,
  FaEyeSlash,
  FaMicrophone,
  FaStopCircle,
} from "react-icons/fa";
import TestProgressBar from "./TestProgressBar";

const TIDEPOOL_BACKGROUND_IMG_PATH_CONTENT =
  "/picture-test/backgroundImage.png";

export default function PictureDialogContent({
  currentImage,
  currentIndex,
  step,
  answer,
  setAnswer,
  description,
  setDescription,
  handleCanSeeSelection,
  isRecording,
  mediaRecorderRef,
  toggleRecording,
  handleNext,
  isSubmitting,
  isLastImage,
  t,
  totalImages,
}) {
  const titleText =
    step === 1
      ? t("canYouSeeThisPicture") || "Can you see this picture?"
      : step === 2
      ? t("whatIsIt") || "What is it?"
      : t("describeThePicture") || "Describe the picture.";

  const hasValidImageUrl =
    currentImage &&
    typeof currentImage.imageUrl === "string" &&
    currentImage.imageUrl.trim() !== "";

  const imageContainerBaseClasses =
    "relative mb-3 sm:mb-4 w-full shadow-lg overflow-hidden rounded-xl mx-auto";
  const imageContainerBaseStyle = {
    backgroundColor: "rgba(253, 246, 227, 0.05)",
  };

  let imageContainerStyle = { ...imageContainerBaseStyle };
  let imageContainerSpecificClasses = "";

  // The step 1 image size is 340px. This will take up a significant portion of the shorter dialog.
  if (step === 1) {
    const sizeStep1 = "340px"; // increased size for all steps
    imageContainerStyle.height = sizeStep1;
    imageContainerStyle.width = sizeStep1;
    imageContainerSpecificClasses = `max-w-[${sizeStep1}]`;
  } else if (step === 2 || step === 3) {
    const sizeStep23 = "420px"; // larger image for steps 2 and 3
    imageContainerStyle.height = sizeStep23;
    imageContainerStyle.width = sizeStep23;
    imageContainerSpecificClasses = `max-w-[${sizeStep23}]`;
    imageContainerStyle.aspectRatio = undefined;
  }

  const baseButtonClasses =
    "px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-1.5 transition-all duration-150";
  const primaryButtonColors =
    "bg-[#6CB4A3]/80 hover:bg-[#6CB4A3] focus:ring-2 focus:ring-[#6CB4A3] border-2 border-white/50";
  // Using distinct color for "No, I can't" for better UX differentiation, matching PracticeRound
  const noButtonColors =
    "bg-[#A3D8D0]/70 hover:bg-[#A3D8D0]/90 border-2 border-white/70 focus:ring-2 focus:ring-white";
  const secondaryButtonColors =
    "bg-[#A3D8D0]/70 hover:bg-[#A3D8D0]/90 border-2 border-white/70 focus:ring-2 focus:ring-white"; // For other action buttons like voice input
  const disabledButtonClasses = "opacity-50 cursor-not-allowed";
  const submitButtonColors =
    "!bg-green-600/70 hover:!bg-green-700/80 focus:!bg-green-700/80 border-2 !border-green-400/80";

  // Robust ID for the test image
  const testImageId = `test-image-${
    currentIndex !== undefined && currentIndex !== null
      ? currentIndex
      : "unknown"
  }`;

  return (
    <div className="h-screen w-full fixed inset-0 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {TIDEPOOL_BACKGROUND_IMG_PATH_CONTENT && (
        <Image
          src={TIDEPOOL_BACKGROUND_IMG_PATH_CONTENT}
          alt={t("tidepoolBackgroundAlt") || "Tidepool background"}
          fill
          style={{ objectFit: "cover" }}
          className="-z-10 fixed inset-0 filter blur-sm"
          priority
          sizes="100vw"
          onError={(e) =>
            console.error(`Background Image Load Error: ${e.target.src}`)
          }
        />
      )}
      <motion.div
        key={
          currentImage?.id + "-" + step || `card-key-${currentIndex}-${step}`
        }
        className="w-full max-w-3xl bg-[#FDF6E3]/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-[#6CB4A3]/50 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          boxShadow: "0 10px 30px -10px rgba(60, 110, 113, 0.3)",
        }}
      >
        {/* Question Section */}
        <div className="bg-gradient-to-r from-[#3C6E71]/90 to-[#4B7F52]/90 p-6 text-center relative overflow-hidden">
          <motion.h2
            key={step} // Use step as key to re-animate on change
            className="text-2xl md:text-3xl font-bold text-white relative z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {titleText}
          </motion.h2>
        </div>

        <div className="px-6 sm:px-8 pt-4 pb-2 flex-shrink-0">
          <TestProgressBar
            currentIndex={currentIndex}
            totalImages={totalImages}
            t={t}
          />
        </div>

        {/* Image Container & Response Area */}
        <div className="p-6 flex flex-col items-center overflow-y-auto">
          <motion.div
            className="relative rounded-xl overflow-hidden border-2 border-[#6CB4A3]/50 shadow-lg"
            whileHover={{ scale: 1.01 }}
            style={{
              maxWidth: "100%",
              width: "fit-content",
              backgroundColor: "rgba(253, 246, 227, 0.1)",
            }}
          >
            {hasValidImageUrl ? (
              <>
                <Image
                  src={currentImage.imageUrl}
                  alt={
                    t("altTidepoolReflection") ||
                    currentImage.correctAnswer ||
                    "Test image"
                  }
                  width={500} // Provide explicit width
                  height={350} // Provide explicit height
                  className="max-h-80 sm:max-h-96 object-contain mx-auto"
                  style={{ maxWidth: "100%", height: "auto", display: "block" }}
                  priority={currentIndex === 0}
                  id={testImageId}
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#3C6E71]/30 to-transparent pointer-events-none" />
              </>
            ) : (
              <div className="w-96 h-80 flex items-center justify-center text-gray-400 font-semibold p-4 border-2 border-dashed border-gray-400/50 rounded-xl bg-gray-50/10">
                {currentImage ? t("imageNotAvailable") : t("loadingImage")}
              </div>
            )}
          </motion.div>

          {/* Response Area */}
          <div className="mt-8 w-full max-w-md space-y-4">
            {step === 1 ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 5px 15px rgba(75, 127, 82, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#4B7F52] to-[#6CB4A3] text-white font-bold rounded-xl shadow-lg relative overflow-hidden"
                  onClick={() => handleCanSeeSelection(true)}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <FaEye className="text-white/90" />
                    {t("yesICan") || "Yes, I can"}
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 5px 15px rgba(255, 202, 212, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#FFCAD4] to-[#FFE57F] text-[#3E2F2F] font-bold rounded-xl shadow-lg relative overflow-hidden"
                  onClick={() => handleCanSeeSelection(false)}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <FaEyeSlash className="text-[#3E2F2F]/90" />
                    {t("noICan") || "No, I can't"}
                  </span>
                </motion.button>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={step === 2 ? answer : description}
                      onChange={(e) =>
                        step === 2
                          ? setAnswer(e.target.value)
                          : setDescription(e.target.value)
                      }
                      className="w-full p-4 border-2 border-[#A3D8D0] rounded-xl focus:border-[#3C6E71] focus:ring-2 focus:ring-[#A3D8D0] outline-none transition-all text-lg bg-[#FDF6E3]/90 backdrop-blur-sm text-gray-800 placeholder:text-gray-500"
                      placeholder={
                        step === 2
                          ? t("typeWhatYouSee") || "Type what you see..."
                          : t("describeThePicture") || "Describe the picture..."
                      }
                      aria-label={
                        step === 2
                          ? t("typeWhatYouSee") || "Type what you see..."
                          : t("describeThePicture") || "Describe the picture..."
                      }
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleRecording}
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold relative overflow-hidden transition-all ${
                      isRecording
                        ? "bg-gradient-to-r from-[#FFCAD4] to-[#FFE57F] text-[#3E2F2F]"
                        : "bg-gradient-to-r from-[#3C6E71] to-[#4B7F52] text-white"
                    }`}
                  >
                    {isRecording ? (
                      <div className="relative z-10 flex items-center gap-2">
                        <div className="flex space-x-1 items-center">
                          <motion.div
                            key={1}
                            className="w-2 h-2 bg-[#3E2F2F] rounded-full"
                            animate={{ height: [2, 10, 2] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: 0.2,
                            }}
                          />
                          <motion.div
                            key={2}
                            className="w-2 h-2 bg-[#3E2F2F] rounded-full"
                            animate={{ height: [2, 10, 2] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: 0.4,
                            }}
                          />
                          <motion.div
                            key={3}
                            className="w-2 h-2 bg-[#3E2F2F] rounded-full"
                            animate={{ height: [2, 10, 2] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: 0.6,
                            }}
                          />
                        </div>
                        {t("stopRecording")}
                      </div>
                    ) : (
                      <div className="relative z-10 flex items-center gap-2">
                        <FaMicrophone />
                        {t("useVoiceInput")}
                      </div>
                    )}
                  </motion.button>
                </motion.div>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 5px 20px rgba(60, 110, 113, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white relative overflow-hidden transition-all ${
                    isLastImage && step === 3
                      ? "bg-gradient-to-r from-[#3C6E71] to-[#4B7F52]"
                      : "bg-gradient-to-r from-[#3C6E71] to-[#6CB4A3]"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLastImage && step === 3
                      ? t("submitTest") || "Submit Test"
                      : t("continue") || "Continue"}
                    {!(isLastImage && step === 3) && <FaChevronRight />}
                  </span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
