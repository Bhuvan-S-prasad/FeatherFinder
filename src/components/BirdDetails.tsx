import { motion } from 'framer-motion';
import { MapPin, Utensils, Clock, FileText } from 'lucide-react';
import { birdData } from '../data/birdData';
import { Tilt } from 'react-tilt';

interface BirdDetailsProps {
  birdClass: string;
}

export const BirdDetails = ({ birdClass }: BirdDetailsProps) => {
  const bird = birdData[birdClass];

  if (!bird) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-6"
    >
      <Tilt options={{ max: 10, scale: 1.02, speed: 1000 }}>
        <div className="bg-white rounded-xl shadow-lg p-6 transform-gpu">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <img
                src={bird.image}
                alt={bird.name}
                className="w-full h-72 object-cover rounded-lg shadow-md"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <h2 className="text-2xl font-bold text-gray-800">{bird.name}</h2>
                <p className="text-gray-600 italic">{bird.scientificName}</p>
              </motion.div>
            </motion.div>
            
            <div className="space-y-4">
              {[
                { icon: MapPin, color: 'blue', title: 'Habitat', content: bird.habitat },
                { icon: Utensils, color: 'green', title: 'Diet', content: bird.diet },
                { icon: Clock, color: 'purple', title: 'Lifespan', content: bird.lifespan },
                { icon: FileText, color: 'orange', title: 'Description', content: bird.description }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <item.icon className={`w-5 h-5 text-${item.color}-500 mt-1`} />
                  <div>
                    <h3 className="font-semibold text-gray-700">{item.title}</h3>
                    <p className="text-gray-600">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};