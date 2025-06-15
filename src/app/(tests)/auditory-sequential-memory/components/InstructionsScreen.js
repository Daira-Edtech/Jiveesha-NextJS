import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export default function InstructionsScreen({ onStart, t }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center p-10 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto border border-gray-100"
    >
      <div className="mb-8">
        <HelpCircle size={64} className="mx-auto text-blue-600" />
      </div>
      <h2 className="text-4xl font-bold text-gray-800 mb-8">
        {t('level_up_reverse_challenge')}
      </h2>
      <div className="space-y-6 mb-10">
        <p className="text-xl text-gray-600 leading-relaxed">
          {t('now_exciting_twist')}
        </p>
        <div className="bg-blue-50 p-8 rounded-xl max-w-2xl mx-auto">
          <p className="text-xl text-gray-700">
            {t('if_i_say')}{' '}
            <span className="font-bold text-blue-600">1 - 3 - 5</span>
            <br />
            {t('you_say')}{' '}
            <span className="font-bold text-blue-600">5 - 3 - 1</span>
          </p>
        </div>
      </div>
      <button
        onClick={onStart}
        className="group relative px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
      >
        {t('start_reverse_challenge')}
      </button>
    </motion.div>
  );
}