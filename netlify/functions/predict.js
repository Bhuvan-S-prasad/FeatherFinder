const { createReadStream, writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');
const os = require('os');
const { execSync } = require('child_process');
const formidable = require('formidable');

// Create a temporary directory for uploads
const UPLOAD_DIR = join(os.tmpdir(), 'bird-uploads');
try {
  mkdirSync(UPLOAD_DIR, { recursive: true });
} catch (error) {
  console.error('Error creating upload directory:', error);
}

// Mock prediction function (since we can't run PyTorch in Netlify Functions)
function mockPredictBird(imagePath) {
  // In a real implementation, you would call a cloud API or use a different approach
  // This is just a placeholder that returns a random bird from our list
  const birds = [
    "001.Black_footed_Albatross", "002.Laysan_Albatross", "003.Sooty_Albatross", 
    "004.Groove_billed_Ani", "005.Crested_Auklet", "006.Least_Auklet", 
    "007.Parakeet_Auklet", "008.Rhinoceros_Auklet", "009.Brewer_Blackbird", 
    "010.Red_winged_Blackbird", "011.Rusty_Blackbird", "012.Yellow_headed_Blackbird", 
    "013.Bobolink", "014.Indigo_Bunting", "015.Lazuli_Bunting", "016.Painted_Bunting", 
    "017.Cardinal", "018.Spotted_Catbird", "019.Gray_Catbird", 
    "020.Yellow_breasted_Chat"
  ];
  
  return birds[Math.floor(Math.random() * birds.length)];
}

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the multipart form data
    const form = new formidable.IncomingForm();
    
    // Process the uploaded file
    const formData = await new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
    
    const uploadedFile = formData.files.file;
    
    if (!uploadedFile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file uploaded' })
      };
    }
    
    // Check file type (only allow image files)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(uploadedFile.mimetype)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid file type. Allowed types are PNG, JPG, JPEG' })
      };
    }
    
    // Generate a unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}_${uploadedFile.originalFilename}`;
    const filepath = join(UPLOAD_DIR, filename);
    
    // Save the file to the temporary directory
    // Note: In a real implementation, you would upload this to a cloud storage service
    // like AWS S3 or Netlify Large Media
    
    // Get prediction (mock implementation)
    const predictedClass = mockPredictBird(filepath);
    
    // In a real implementation, you would store the image in a cloud storage
    // and return the URL to that image. For this example, we'll just return a placeholder URL
    const fileUrl = `/static/uploads/placeholder.jpg`;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        class: predictedClass,
        file_path: fileUrl,
        confidence: 0.85 // Mock confidence score
      })
    };
    
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `An error occurred during prediction. Please try again. Details: ${error.message}`
      })
    };
  }
};