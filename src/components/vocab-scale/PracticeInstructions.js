import { motion } from "framer-motion";
import { Lightbulb, Volume2, Mic, Type, CheckCircle } from "lucide-react";

const PracticeInstructions = ({ onStartPractice, t, language }) => {
  const instructions = [
    {
      icon: <Volume2 className="h-6 w-6" />,
      title: "Listen to the Word",
      description: "We'll show you a word on the screen. Read it carefully and think about what it means.",
      title_ta: "சொல்லைக் கேளுங்கள்",
      description_ta: "நாங்கள் உங்களுக்கு ஒரு சொல்லைக் காட்டுவோம். அதை கவனமாகப் படித்து அதன் பொருளைப் பற்றி யோசியுங்கள்.",
      title_hi: "शब्द को सुनें",
      description_hi: "हम आपको स्क्रीन पर एक शब्द दिखाएंगे। इसे ध्यान से पढ़ें और सोचें कि इसका क्या मतलब है।"
    },
    {
      icon: <Type className="h-6 w-6" />,
      title: "Type Your Answer",
      description: "Type what you think the word means in the text box. Don't worry about perfect spelling!",
      title_ta: "உங்கள் பதிலைத் தட்டச்சு செய்யுங்கள்",
      description_ta: "சொல்லின் பொருள் என்னவென்று நீங்கள் நினைக்கிறீர்களோ அதை உரைப்பெட்டியில் தட்டச்சு செய்யுங்கள். சரியான எழுத்துப்பிழை பற்றி கவலைப்பட வேண்டாம்!",
      title_hi: "अपना उत्तर टाइप करें",
      description_hi: "आपको लगता है कि शब्द का क्या मतलब है, उसे टेक्स्ट बॉक्स में टाइप करें। सही स्पेलिंग की चिंता न करें!"
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Or Speak Your Answer",
      description: "You can also click the microphone button and speak your answer out loud!",
      title_ta: "அல்லது உங்கள் பதிலைச் சொல்லுங்கள்",
      description_ta: "நீங்கள் மைக்ரோஃபோன் பொத்தானைக் கிளிக் செய்து உங்கள் பதிலை உரக்கச் சொல்லலாம்!",
      title_hi: "या अपना उत्तर बोलें",
      description_hi: "आप माइक्रोफोन बटन पर क्लिक करके अपना उत्तर जोर से भी बोल सकते हैं!"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Get Feedback",
      description: "We'll tell you if your answer is correct and help you if you need it!",
      title_ta: "கருத்துக்களைப் பெறுங்கள்",
      description_ta: "உங்கள் பதில் சரியானதா என்று நாங்கள் உங்களுக்குச் சொல்வோம், தேவைப்பட்டால் உங்களுக்கு உதவுவோம்!",
      title_hi: "प्रतिक्रिया प्राप्त करें",
      description_hi: "हम आपको बताएंगे कि आपका उत्तर सही है या नहीं और यदि आपको इसकी आवश्यकता है तो आपकी सहायता करेंगे!"
    }
  ];

  const getLocalizedText = (item, key) => {
    if (language === "ta" && item[`${key}_ta`]) return item[`${key}_ta`];
    if (language === "hi" && item[`${key}_hi`]) return item[`${key}_hi`];
    return item[key];
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full text-blue-200 text-sm mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Lightbulb className="h-4 w-4" />
          How to Take the Test
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-3">
          Let's Learn How This Works!
        </h2>

        <p className="text-white/80 max-w-2xl mx-auto text-lg">
          Before we start, let me show you how to take this vocabulary test. It's easy and fun!
        </p>
      </motion.div>

      {/* Instructions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 flex-1">
        {instructions.map((instruction, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {instruction.icon}
              </motion.div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-2">
                  {getLocalizedText(instruction, "title")}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {getLocalizedText(instruction, "description")}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Example Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-400/30 mb-8"
      >
        <div className="text-center">
          <h3 className="text-white font-semibold text-lg mb-3">
            Example: If we show you the word "CAT"
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-green-200">
              ✅ "A small furry animal"
            </div>
            <div className="text-green-200">
              ✅ "Pet that says meow"
            </div>
            <div className="text-green-200">
              ✅ "Animal with whiskers"
            </div>
          </div>
        </div>
      </motion.div>

      {/* Start Button */}
      <div className="text-center">
        <motion.button
          onClick={onStartPractice}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          🎯 Start Practice Round
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-white/60 text-sm mt-3"
        >
          Don't worry, this is just for practice!
        </motion.p>
      </div>
    </div>
  );
};

export default PracticeInstructions;
