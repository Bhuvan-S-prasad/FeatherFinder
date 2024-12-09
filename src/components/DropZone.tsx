import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Bird } from 'lucide-react';
import { motion } from 'framer-motion';

interface DropZoneProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

export const DropZone = ({ onImageUpload, isLoading }: DropZoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false,
    disabled: isLoading
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full max-w-xl mx-auto mt-8 p-8 rounded-xl border-2 border-dashed
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-200 ease-in-out`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-4">
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Bird className="w-12 h-12 text-blue-500" />
          </motion.div>
        ) : isDragActive ? (
          <Upload className="w-12 h-12 text-blue-500" />
        ) : (
          <ImageIcon className="w-12 h-12 text-gray-400" />
        )}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            {isLoading ? 'Analyzing image...' : 
             isDragActive ? 'Drop your image here' : 
             'Drag & drop a bird image'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {!isLoading && 'or click to select a file'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};