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

<<<<<<< HEAD
  // The step 1 image size is 340px. This will take up a significant portion of the shorter dialog.
  if (step === 1) {
    const sizeStep1 = "340px"; // increased size for all steps
=======
  // The step 1 image size is 280px. This will take up a significant portion of the shorter dialog.
  if (step === 1) {
    const sizeStep1 = "280px"; // approx 17.5rem
>>>>>>> ebbb870 (Added Instructions component)
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

<<<<<<< HEAD
  const baseButtonClasses =
    "px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-1.5 transition-all duration-150";
  const primaryButtonColors =
    "bg-[#6CB4A3]/80 hover:bg-[#6CB4A3] focus:ring-2 focus:ring-[#6CB4A3] border-2 border-white/50";
  // Using distinct color for "No, I can't" for better UX differentiation, matching PracticeRound
  const noButtonColors =
    "bg-[#A3D8D0]/70 hover:bg-[#A3D8D0]/90 border-2 border-white/70 focus:ring-2 focus:ring-white";
  const secondaryButtonColors =
    "bg-[#A3D8D0]/70 hover:bg-[#A3D8D0]/90 border-2 border-white/70 focus:ring-2 focus:ring-white"; // For other action buttons like voice input
=======
  const baseButtonClasses = "px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-1.5 transition-all duration-150";
  const primaryButtonColors = "bg-[#6CB4A3]/80 hover:bg-[#6CB4A3] focus:ring-2 focus:ring-[#6CB4A3] border-2 border-white/50";
  // Using distinct color for "No, I can't" for better UX differentiation, matching PracticeRound
  const noButtonColors = "bg-[#A3D8D0]/70 hover:bg-[#A3D8D0]/90 border-2 border-white/70 focus:ring-2 focus:ring-white";
  const secondaryButtonColors = "bg-[#A3D8D0]/70 hover:bg-[#A3D8D0]/90 border-2 border-white/70 focus:ring-2 focus:ring-white"; // For other action buttons like voice input
>>>>>>> ebbb870 (Added Instructions component)
  const disabledButtonClasses = "opacity-50 cursor-not-allowed";
  const submitButtonColors =
    "!bg-green-600/70 hover:!bg-green-700/80 focus:!bg-green-700/80 border-2 !border-green-400/80";

  // Robust ID for the test image
  const testImageId = `test-image-${
    currentIndex !== undefined && currentIndex !== null
      ? currentIndex
      : "unknown"
  }`;

  // Robust ID for the test image
  const testImageId = `test-image-${currentIndex !== undefined && currentIndex !== null ? currentIndex : 'unknown'}`;


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
<<<<<<< HEAD
        key={
          currentImage?.id + "-" + step || `card-key-${currentIndex}-${step}`
        }
        className="w-full max-w-3xl bg-[#FDF6E3]/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-[#6CB4A3]/50 relative"
=======
        key={currentImage?.id + '-' + step || `card-key-${currentIndex}-${step}`}
        // MODIFIED: Reduced height to h-[32.5rem] (520px).
        // Adjusted max-h to match PracticeRound.jsx for consistency.
        className="w-full max-w-md md:max-w-lg h-[32.5rem] max-h-[90vh] sm:max-h-[88vh] 
                   bg-[#FDF6E3]/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#6CB4A3]/60
                   flex flex-col overflow-hidden"
>>>>>>> ebbb870 (Added Instructions component)
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
<<<<<<< HEAD
            key={step} // Use step as key to re-animate on change
            className="text-2xl md:text-3xl font-bold text-white relative z-10"
=======
            key={titleText} // Keying by titleText ensures animation on text change
            className="text-lg sm:text-xl md:text-2xl font-bold text-white"
>>>>>>> ebbb870 (Added Instructions component)
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
<<<<<<< HEAD
            {titleText}
=======
            {titleText || (t("loadingTitle", "Loading Title..."))}
>>>>>>> ebbb870 (Added Instructions component)
          </motion.h2>
        </div>

        <div className="px-6 sm:px-8 pt-4 pb-2 flex-shrink-0">
          <TestProgressBar
            currentIndex={currentIndex}
            totalImages={totalImages}
            t={t}
          />
        </div>

<<<<<<< HEAD
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
=======
        {/* This div is the main scrollable content area */}
        <div className="p-3 sm:p-4 flex flex-col items-center flex-1 overflow-y-auto">
          <div
            className={`${imageContainerBaseClasses} ${imageContainerSpecificClasses}`}
            style={imageContainerStyle}
>>>>>>> ebbb870 (Added Instructions component)
          >
            {hasValidImageUrl ? (
              <>
                <Image
                  src={currentImage.imageUrl}
<<<<<<< HEAD
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
=======
                  alt={t("altTidepoolReflection") || currentImage.correctAnswer || "Test image"}
                  fill
                  style={{ objectFit: "contain" }}
                  priority={currentIndex === 0} // Only prioritize the very first image of the test
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 480px"
                  onError={(e) => {
                    console.error(`IMAGE LOAD ERROR for src: ${e.target.src}.`);
                    // Optionally, you could set a state here to show a "failed to load" message in the image container
                  }}
>>>>>>> ebbb870 (Added Instructions component)
                  id={testImageId}
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#3C6E71]/30 to-transparent pointer-events-none" />
              </>
            ) : (
<<<<<<< HEAD
              <div className="w-96 h-80 flex items-center justify-center text-gray-400 font-semibold p-4 border-2 border-dashed border-gray-400/50 rounded-xl bg-gray-50/10">
                {currentImage ? t("imageNotAvailable") : t("loadingImage")}
=======
              <div 
                className={`w-full h-full flex items-center justify-center text-gray-400 font-semibold p-4 border-2 border-dashed border-gray-400/50 rounded-xl bg-gray-50/10`}
              >
                {currentImage ? (t("imageNotAvailable", "Image not available or path is invalid.")) : (t("loadingImage", "Loading image..."))}
>>>>>>> ebbb870 (Added Instructions component)
              </div>
            )}
          </motion.div>

<<<<<<< HEAD
          {/* Response Area */}
          <div className="mt-8 w-full max-w-md space-y-4">
            {step === 1 ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
=======
          <div className="w-full max-w-md space-y-2 mt-auto pt-2 sm:pt-3"> {/* mt-auto pushes this to the bottom */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3"
              >
>>>>>>> ebbb870 (Added Instructions component)
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
<<<<<<< HEAD
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 5px 15px rgba(255, 202, 212, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#FFCAD4] to-[#FFE57F] text-[#3E2F2F] font-bold rounded-xl shadow-lg relative overflow-hidden"
=======
                  whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97, opacity: 0.85 }} 
                  className={`${baseButtonClasses} ${noButtonColors}`} // Changed to noButtonColors
>>>>>>> ebbb870 (Added Instructions component)
                  onClick={() => handleCanSeeSelection(false)}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <FaEyeSlash className="text-[#3E2F2F]/90" />
                    {t("noICan") || "No, I can't"}
                  </span>
                </motion.button>
<<<<<<< HEAD
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
=======
              </motion.div>
            )}

            {(step === 2 || step === 3) && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} 
                className="space-y-2 sm:space-y-3"
              >
                <input
                  type="text"
                  value={step === 2 ? answer : description}
                  onChange={(e) => step === 2 ? setAnswer(e.target.value) : setDescription(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm border-2 border-white/50 focus:border-white 
                           bg-black/20 backdrop-blur-sm text-white placeholder:text-gray-300/70 
                           rounded-lg focus:ring-2 focus:ring-white/60 outline-none transition-all text-center"
                  placeholder={step === 2 ? (t("typeWhatYouSee") || "Type what you see...") : (t("describeThePicture") || "Describe the picture...")}
                  aria-label={step === 2 ? (t("typeWhatYouSee") || "Type what you see...") : (t("describeThePicture") || "Describe the picture...")}
                />
                <motion.button
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97, opacity: 0.85 }}
                    onClick={toggleRecording}
                    // Updated disabled logic: disable if recording AND stream is inactive (e.g., mic permission denied after starting)
                    // OR if isSubmitting (to prevent new recordings during final submission)
                    disabled={(isRecording && !mediaRecorderRef?.current?.stream?.active) || isSubmitting}
                    className={`w-full ${baseButtonClasses} ${secondaryButtonColors} group
                                ${isRecording ? "ring-2 ring-red-500 ring-opacity-70 !bg-red-500/70 hover:!bg-red-600/80" : ""}`}
                >
                  {isRecording ? (
                    <>
                      <FaStopCircle className="text-sm sm:text-base" /> 
                      <div className="flex space-x-0.5 items-center h-3.5 sm:h-4">
                        {[1,2,3].map((i) => ( <motion.div key={i} className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full" animate={{height:[1,6,1], opacity: [0.5, 1, 0.5]}} transition={{duration:0.8,repeat:Infinity,delay:i*0.1}} /> ))}
                      </div> 
                      <span className="ml-1">{t("stopRecording") || "Stop Recording"}</span>
                    </>
                  ) : (
                    <>
                      <FaMicrophone className="text-sm sm:text-base" /> 
                      {t("useVoiceInput") || "Use Voice Input"}
                    </>
                  )}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97, opacity: 0.85 }}
                    onClick={handleNext}
                    // Slightly refined disabled logic for clarity
                    disabled={isSubmitting || (isLastImage && step === 3 && !description.trim() && !answer.trim() && (typeof currentImage?.canSee === 'boolean' ? currentImage.canSee : true))}
                    className={`w-full ${baseButtonClasses} group
                              ${isLastImage && step === 3 ? submitButtonColors : secondaryButtonColors}
                              ${(isSubmitting || (isLastImage && step === 3 && !description.trim() && !answer.trim() && (typeof currentImage?.canSee === 'boolean' ? currentImage.canSee : true))) ? disabledButtonClasses : ""}`
                            }
>>>>>>> ebbb870 (Added Instructions component)
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
