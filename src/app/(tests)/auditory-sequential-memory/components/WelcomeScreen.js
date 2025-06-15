import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

export default function WelcomeScreen({ onStart, t }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center p-10 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto border border-gray-100"
    >
      <div className="mb-8">
        <Volume2 size={64} className="mx-auto text-blue-600" />
      </div>
      <h2 className="text-4xl font-bold text-gray-800 mb-8">
        {t('memory_test')}
      </h2>
      <div className="space-y-6 mb-10">
        <p className="text-xl text-gray-600 leading-relaxed">
          {t('welcome_memory_game')}
        </p>
        <ul className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
          <li className="flex items-center gap-4 bg-blue-50 p-6 rounded-xl">
            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-lg">
              1
            </span>
            <span className="text-lg text-gray-700">
              {t('listen_carefully_numbers')}
            </span>
          </li>
          <li className="flex items-center gap-4 bg-blue-50 p-6 rounded-xl">
            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-lg">
              2
            </span>
            <span className="text-lg text-gray-700">
              {t('repeat_back_exactly')}
            </span>
          </li>
          <li className="flex items-center gap-4 bg-blue-50 p-6 rounded-xl">
            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-lg">
              3
            </span>
            <span className="text-lg text-gray-700">
              {t('start_easy_get_harder')}
            </span>
          </li>
        </ul>
      </div>
      <button
        onClick={onStart}
        className="group relative px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
      >
        {t('start_test')}
      </button>
    </motion.div>
  );
}