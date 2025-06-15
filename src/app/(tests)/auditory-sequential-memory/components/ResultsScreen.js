'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function ResultsScreen({
  forwardScore,
  reverseScore,
  totalSequences,
  onSubmitResults,
  t,
  suppressResultPage = false
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const finalScore = Math.round((forwardScore + reverseScore) / 2);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitResults(finalScore);
    } catch (error) {
      toast.error(t('submit_error_check_connection'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // If results are suppressed, don't render anything
  if (suppressResultPage) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl mx-auto mt-10 border border-blue-200 text-center"
    >
      <CheckCircle size={80} className="mx-auto text-blue-600 mb-6" />
      
      <h2 className="text-4xl font-bold text-gray-800 mb-10">
        {t('challenge_complete')}!
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <motion.div 
          className="bg-blue-50 p-8 rounded-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl text-gray-700 mb-3">{t('forward_score')}</h3>
          <p className="text-4xl font-bold text-blue-600">
            {forwardScore} / {totalSequences}
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-blue-50 p-8 rounded-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl text-gray-700 mb-3">{t('reverse_score')}</h3>
          <p className="text-4xl font-bold text-blue-600">
            {reverseScore} / {totalSequences}
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-blue-100 p-10 rounded-xl mb-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-2xl text-gray-700 mb-3">{t('final_score')}</h3>
        <p className="text-6xl font-extrabold text-blue-600">
          {finalScore} / 10
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.05 } : {}}
          whileTap={!isSubmitting ? { scale: 0.95 } : {}}
          className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-xl font-semibold rounded-xl shadow-md transition-all duration-300 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          {isSubmitting ? (
            <>
              <motion.div
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <span>{t('submitting')}...</span>
            </>
          ) : (
            <>
              <Send size={24} />
              <span>{t('submit_results')}</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Performance feedback */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-gray-600"
      >
        {finalScore >= 8 && (
          <p className="text-green-600 font-medium">
            🎉 {t('excellent_performance')}
          </p>
        )}
        {finalScore >= 6 && finalScore < 8 && (
          <p className="text-blue-600 font-medium">
            👍 {t('good_performance')}
          </p>
        )}
        {finalScore >= 4 && finalScore < 6 && (
          <p className="text-yellow-600 font-medium">
            📈 {t('average_performance')}
          </p>
        )}
        {finalScore < 4 && (
          <p className="text-orange-600 font-medium">
            💪 {t('keep_practicing')}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}