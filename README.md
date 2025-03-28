# FeatherFinder

A Vite + React application for bird identification using AI. This application allows users to upload images of birds and uses a machine learning model to identify the bird species. FeatherFinder combines modern web technologies with machine learning to create an intuitive and educational tool for bird enthusiasts, researchers, and casual nature lovers.

## Features

- **Image Upload**: Easily upload bird images from your device for instant identification
- **AI-powered Recognition**: Utilizes a PyTorch-based machine learning model trained on thousands of bird images for accurate species identification
- **Detailed Bird Information**: Access comprehensive information about identified bird species including habitat, diet, migration patterns, and conservation status
- **Responsive Design**: Beautiful and intuitive UI that works seamlessly across desktop and mobile devices
- **Offline Capability**: Core functionality works even with limited connectivity
- **Educational Content**: Learn about different bird species and their characteristics

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Flask (development), Netlify Functions (production)
- **ML**: PyTorch (bird classification model)

## Skills & Technologies

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Python](https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

## Project Architecture

FeatherFinder follows a modern web application architecture:

- **Frontend**: A React-based single-page application built with TypeScript and styled with TailwindCSS
- **Development Backend**: A Flask server that handles image processing and interfaces with the PyTorch model
- **Production Backend**: Netlify Functions (serverless) that provide API endpoints for the frontend
- **ML Model**: A PyTorch-based convolutional neural network trained on a dataset of bird images

## Deployment to Netlify

This application is configured for deployment on Netlify with serverless functions. The serverless architecture ensures scalability and cost-effectiveness.

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Netlify CLI (optional for local testing)

### Deployment Steps

1. **Install Netlify CLI (optional):**
   ```
   npm install -g netlify-cli
   ```

2. **Install dependencies:**
   ```
   npm install
   cd netlify/functions
   npm install
   cd ../../
   ```

3. **Build the application:**
   ```
   npm run build
   ```

4. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set the build command to: `npm run netlify-build`
   - Set the publish directory to: `dist`

   Or use the Netlify CLI:
   ```
   netlify deploy --prod
   ```

### Local Development

1. **Start the development server:**
   ```
   npm run dev
   ```
   This will start both the Vite frontend and Flask backend.

2. **Test with Netlify Functions locally:**
   ```
   netlify dev
   ```

## Notes on Serverless Deployment

The production deployment uses Netlify Functions instead of the Flask backend. The bird prediction model is mocked in the serverless environment since running PyTorch directly in Netlify Functions is not feasible. For a production implementation, consider using a cloud AI service or deploying the model to a dedicated API service.

## How It Works

1. **Image Upload**: Users upload an image through the drag-and-drop interface or file selector
2. **Image Processing**: The image is processed and prepared for the ML model
3. **Species Identification**: The PyTorch model analyzes the image and identifies the bird species
4. **Information Display**: Detailed information about the identified species is presented to the user

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
