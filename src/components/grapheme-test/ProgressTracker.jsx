// components/ProgressTracker.jsx
"use client"; // Add if using client-side hooks in App Router
import { useLanguage } from "../contexts/LanguageContext"; // Adjust path as needed

const ProgressTracker = ({ current, total }) => {
  const { t } = useLanguage(); // Your t() function

  return (
    <div className="my-4 text-lg font-medium text-gray-700">
      {t("progressTrackerLabelPrefix")} 
      {current + 1}
      {t("progressTrackerLabelMiddle_Of")}
      {total}
    </div>
  );
};

export default ProgressTracker;