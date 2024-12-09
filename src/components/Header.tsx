import { Bird, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 p-8 shadow-lg backdrop-blur-sm">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                y: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Bird className="w-12 h-12 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white">BirdVision AI</h1>
              <p className="text-white/80 text-sm">Powered by Advanced Machine Learning</p>
            </div>
          </div>
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-3 bg-white/10 rounded-full px-6 py-3"
          >
            <Camera className="w-6 h-6 text-white" />
            <p className="text-white font-medium">Discover the World of Birds</p>
          </motion.div>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-white/90 text-center max-w-2xl mx-auto text-lg"
        >
          Experience the magic of AI-powered bird identification. Upload any bird photo and let our advanced technology reveal its species instantly.
        </motion.p>
      </motion.div>
    </header>
  );
};