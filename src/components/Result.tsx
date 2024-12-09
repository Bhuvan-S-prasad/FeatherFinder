import { motion } from 'framer-motion';
import { Share2, Download } from 'lucide-react';
import { BirdDetails } from './BirdDetails';
import { Tilt } from 'react-tilt';

interface ResultProps {
  prediction: string | null;
  imageUrl: string | null;
}

export const Result = ({ prediction, imageUrl }: ResultProps) => {
  if (!prediction || !imageUrl) return null;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Bird Recognition Result',
        text: `I identified a ${prediction.replace(/_/g, ' ')} using BirdVision AI!`,
        url: window.location.href
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `bird-${prediction.toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 space-y-6 max-w-4xl mx-auto"
    >
      <Tilt
        options={{
          max: 15,
          scale: 1.05,
          speed: 1000,
          glare: true,
          "max-glare": 0.5
        }}
      >
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform-gpu"
        >
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg">
              <motion.img
                src={imageUrl}
                alt="Uploaded bird"
                className="w-full h-64 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-4 flex space-x-2"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white"
                >
                  <Share2 className="w-5 h-5 text-gray-700" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDownload}
                  className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white"
                >
                  <Download className="w-5 h-5 text-gray-700" />
                </motion.button>
              </motion.div>
            </div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-800">Identified Bird:</h3>
              <p className="text-lg text-blue-600 mt-2 font-medium">
                {prediction.replace(/_/g, ' ').replace(/\d+\./g, '')}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </Tilt>
      
      <BirdDetails birdClass={prediction} />
    </motion.div>
  );
};