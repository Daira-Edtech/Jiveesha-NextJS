import { motion } from "framer-motion";

const LoadingState = ({ t }) => (
    <div className="flex flex-col items-center justify-center p-8 h-64">
        <motion.div
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-blue-700 font-medium"
        >
            {t ? t("loadingTest", "Loading Test") : "Loading Test"}...
        </motion.p>
    </div>
);

export default LoadingState;
