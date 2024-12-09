import { useState } from 'react';
import { Header } from './components/Header';
import { DropZone } from './components/DropZone';
import { Result } from './components/Result';
import { BirdFacts } from './components/BirdFacts';

export function App() {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.error) {
        alert(data.error);
      } else {
        setPrediction(data.class);
        setImageUrl(data.file_path);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Identify Birds with AI
          </h2>
          <p className="text-gray-600 text-lg">
            Upload a photo of any bird and our AI will help you identify its species
            from our database of 100 different bird species.
          </p>
        </div>

        <DropZone onImageUpload={handleImageUpload} isLoading={isLoading} />
        <Result prediction={prediction} imageUrl={imageUrl} />
        {!prediction && <BirdFacts />}
      </main>

      <footer className="mt-16 py-8 bg-gray-800 text-white text-center">
        <p className="text-sm opacity-80">
          Powered by Advanced Machine Learning
        </p>
      </footer>
    </div>
  );
}