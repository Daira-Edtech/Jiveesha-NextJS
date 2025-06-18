// components/PictureTest/PictureDialogContent.jsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaChevronRight, FaEye, FaEyeSlash, FaMicrophone, FaStopCircle } from "react-icons/fa";
import TestProgressBar from "./TestProgressBar";

const TIDEPOOL_BACKGROUND_IMG_PATH_CONTENT = "/picture-test/backgroundImage.png";

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

  const hasValidImageUrl = currentImage && typeof currentImage.imageUrl === 'string' && currentImage.imageUrl.trim() !== "";

  const imageContainerBaseClasses = "relative mb-3 sm:mb-4 w-full shadow-lg overflow-hidden rounded-xl mx-auto";
  const imageContainerBaseStyle = { backgroundColor: "rgba(253, 246, 227, 0.05)" };

  let imageContainerStyle = { ...imageContainerBaseStyle };
  let imageContainerSpecificClasses = "";

  // The step 1 image size is 280px. This will take up a significant portion of the shorter dialog.
  if (step === 1) {
    const sizeStep1 = "280px"; // approx 17.5rem
    imageContainerStyle.height = sizeStep1;
    imageContainerStyle.width = sizeStep1;
    imageContainerSpecificClasses = `max-w-[${sizeStep1}]`;
  } else if (step === 2 || step === 3) {
    imageContainerSpecificClasses = `max-w-md w-full`; 
    imageContainerStyle.aspectRatio = "16/10";
    imageContainerStyle.height = undefined; 
    imageContainerStyle.width = undefined;  
  }

  const baseButtonClasses = "px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-1.5 transition-all duration-150";
  const primaryButtonColors = "bg-[#6CB4A3]/80 hover:bg-[#6CB4A3] focus:ring-2 focus:ring-[#6CB4A3] border-2 border-white/50";
  // Using distinct color for "No, I can't" for better UX differentiation, matching PracticeRound
  const noButtonColors = "bg-[#A3D8D0]/70 hover:bg-[#A3D8D0]/90 border-2 border-white/70 focus:ring-2 focus:ring-white";
  const secondaryButtonColors = "bg-[#A3D8D0]/70 hover:bg-[#A3D8D0]/90 border-2 border-white/70 focus:ring-2 focus:ring-white"; // For other action buttons like voice input
  const disabledButtonClasses = "opacity-50 cursor-not-allowed";
  const submitButtonColors = "!bg-green-600/70 hover:!bg-green-700/80 focus:!bg-green-700/80 border-2 !border-green-400/80";

  // Robust ID for the test image
  const testImageId = `test-image-${currentIndex !== undefined && currentIndex !== null ? currentIndex : 'unknown'}`;


  return (
    <div className="h-screen w-full fixed inset-0 flex flex-col items-center justify-center p-2 sm:p-3 overflow-hidden">
      {TIDEPOOL_BACKGROUND_IMG_PATH_CONTENT && (
        <Image
          src={TIDEPOOL_BACKGROUND_IMG_PATH_CONTENT}
          alt={t('tidepoolBackgroundAlt') || "Tidepool background"}
          fill
          style={{ objectFit: "cover" }}
          className="-z-10 fixed inset-0"
          priority
          sizes="100vw"
          onError={(e) => console.error(`Background Image Load Error: ${e.target.src}`)}
        />
      )}

      <motion.div
        key={currentImage?.id + '-' + step || `card-key-${currentIndex}-${step}`}
        // MODIFIED: Reduced height to h-[32.5rem] (520px).
        // Adjusted max-h to match PracticeRound.jsx for consistency.
        className="w-full max-w-md md:max-w-lg h-[32.5rem] max-h-[90vh] sm:max-h-[88vh] 
                   bg-[#FDF6E3]/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#6CB4A3]/60
                   flex flex-col overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ boxShadow: "0 10px 30px -10px rgba(60, 110, 113, 0.4)" }}
      >
        <div className="bg-gradient-to-r from-[#3C6E71]/90 to-[#4B7F52]/90 p-3 sm:p-4 text-center relative flex-shrink-0">
          <motion.h2
            key={titleText} // Keying by titleText ensures animation on text change
            className="text-lg sm:text-xl md:text-2xl font-bold text-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {titleText || (t("loadingTitle", "Loading Title..."))}
          </motion.h2>
        </div>

        <div className="px-3 sm:px-4 pt-2 pb-1 flex-shrink-0">
          <TestProgressBar
            currentIndex={currentIndex}
            totalImages={totalImages}
            t={t}
          />
        </div>

        {/* This div is the main scrollable content area */}
        <div className="p-3 sm:p-4 flex flex-col items-center flex-1 overflow-y-auto">
          <div
            className={`${imageContainerBaseClasses} ${imageContainerSpecificClasses}`}
            style={imageContainerStyle}
          >
            {hasValidImageUrl ? (
              <>
                <Image
                  src={currentImage.imageUrl}
                  alt={t("altTidepoolReflection") || currentImage.correctAnswer || "Test image"}
                  fill
                  style={{ objectFit: "contain" }}
                  priority={currentIndex === 0} // Only prioritize the very first image of the test
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 480px"
                  onError={(e) => {
                    console.error(`IMAGE LOAD ERROR for src: ${e.target.src}.`);
                    // Optionally, you could set a state here to show a "failed to load" message in the image container
                  }}
                  id={testImageId}
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/20 via-black/10 to-transparent pointer-events-none" />
              </>
            ) : (
              <div 
                className={`w-full h-full flex items-center justify-center text-gray-400 font-semibold p-4 border-2 border-dashed border-gray-400/50 rounded-xl bg-gray-50/10`}
              >
                {currentImage ? (t("imageNotAvailable", "Image not available or path is invalid.")) : (t("loadingImage", "Loading image..."))}
              </div>
            )}
          </div>

          <div className="w-full max-w-md space-y-2 mt-auto pt-2 sm:pt-3"> {/* mt-auto pushes this to the bottom */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                  className={`${baseButtonClasses} ${primaryButtonColors}`}
                  onClick={() => handleCanSeeSelection(true)}
                > <FaEye className="text-white/90 text-sm sm:text-base" /> {t("yesICan") || "Yes, I can"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97, opacity: 0.85 }} 
                  className={`${baseButtonClasses} ${noButtonColors}`} // Changed to noButtonColors
                  onClick={() => handleCanSeeSelection(false)}
                > <FaEyeSlash className="text-white text-sm sm:text-base" /> {t("noICan") || "No, I can't"}
                </motion.button>
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
                >
                  <span>{isLastImage && step === 3 ? (t("submitTest") || "Submit Test") : (t("continue") || "Continue")}</span>
                  {!(isLastImage && step === 3) && <FaChevronRight className="ml-1 transform transition-transform duration-150 group-hover:translate-x-0.5 text-xs sm:text-sm" />}
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}