import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const ErrorState = ({ message }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-8"
    >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <p className="text-red-600 font-medium">{message}</p>
    </motion.div>
);

export default ErrorState;
