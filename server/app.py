import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import torch
from torchvision import transforms, models
from PIL import Image
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flask setup
app = Flask(__name__, static_folder="static")

# Configuration
app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER', './static/uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Class names
class_names = [
    "001.Black_footed_Albatross", "002.Laysan_Albatross", "003.Sooty_Albatross", 
    "004.Groove_billed_Ani", "005.Crested_Auklet", "006.Least_Auklet", 
    "007.Parakeet_Auklet", "008.Rhinoceros_Auklet", "009.Brewer_Blackbird", 
    "010.Red_winged_Blackbird", "011.Rusty_Blackbird", "012.Yellow_headed_Blackbird", 
    "013.Bobolink", "014.Indigo_Bunting", "015.Lazuli_Bunting", "016.Painted_Bunting", 
    "017.Cardinal", "018.Spotted_Catbird", "019.Gray_Catbird", 
    "020.Yellow_breasted_Chat", "021.Eastern_Towhee", "022.Chuck_will_Widow", 
    "023.Brandt_Cormorant", "024.Red_faced_Cormorant", "025.Pelagic_Cormorant", 
    "026.Bronzed_Cowbird", "027.Shiny_Cowbird", "028.Brown_Creeper", 
    "029.American_Crow", "030.Fish_Crow", "031.Black_billed_Cuckoo", 
    "032.Mangrove_Cuckoo", "033.Yellow_billed_Cuckoo", "034.Gray_crowned_Rosy_Finch", 
    "035.Purple_Finch", "036.Northern_Flicker", "037.Acadian_Flycatcher", 
    "038.Great_Crested_Flycatcher", "039.Least_Flycatcher", "040.Olive_sided_Flycatcher", 
    "041.Scissor_tailed_Flycatcher", "042.Vermilion_Flycatcher", 
    "043.Yellow_bellied_Flycatcher", "044.Frigatebird", "045.Northern_Fulmar", 
    "046.Gadwall", "047.American_Goldfinch", "048.European_Goldfinch", 
    "049.Boat_tailed_Grackle", "050.Eared_Grebe", "051.Horned_Grebe", 
    "052.Pied_billed_Grebe", "053.Western_Grebe", "054.Blue_Grosbeak", 
    "055.Evening_Grosbeak", "056.Pine_Grosbeak", "057.Rose_breasted_Grosbeak", 
    "058.Pigeon_Guillemot", "059.California_Gull", "060.Glaucous_winged_Gull", 
    "061.Heermann_Gull", "062.Herring_Gull", "063.Ivory_Gull", 
    "064.Ring_billed_Gull", "065.Slaty_backed_Gull", "066.Western_Gull", 
    "067.Anna_Hummingbird", "068.Ruby_throated_Hummingbird", 
    "069.Rufous_Hummingbird", "070.Green_Violetear", "071.Long_tailed_Jaeger", 
    "072.Pomarine_Jaeger", "073.Blue_Jay", "074.Florida_Jay", "075.Green_Jay", 
    "076.Dark_eyed_Junco", "077.Tropical_Kingbird", "078.Gray_Kingbird", 
    "079.Belted_Kingfisher", "080.Green_Kingfisher", "081.Pied_Kingfisher", 
    "082.Ringed_Kingfisher", "083.White_breasted_Kingfisher", 
    "084.Red_legged_Kittiwake", "085.Horned_Lark", "086.Pacific_Loon", 
    "087.Mallard", "088.Western_Meadowlark", "089.Hooded_Merganser", 
    "090.Red_breasted_Merganser", "091.Mockingbird", "092.Nighthawk", 
    "093.Clark_Nutcracker", "094.White_breasted_Nuthatch", 
    "095.Baltimore_Oriole", "096.Hooded_Oriole", "097.Orchard_Oriole", 
    "098.Scott_Oriole", "099.Ovenbird", "100.Brown_Pelican", "unknown"
]

def load_model():
    try:
        model = models.resnet50(weights=None)
        model.fc = torch.nn.Linear(model.fc.in_features, len(class_names))
        
        # Look for model in multiple locations
        possible_model_paths = [
            os.path.join(os.path.dirname(__file__), 'new_bird_model.pth'),
            os.path.join(os.getcwd(), 'new_bird_model.pth'),
            './new_bird_model.pth'
        ]
        
        model_path = None
        for path in possible_model_paths:
            if os.path.exists(path):
                model_path = path
                break
                
        if not model_path:
            return None, "Model file 'new_bird_model.pth' not found in any of the expected locations."
        
        state_dict = torch.load(model_path, map_location=device)
        model.load_state_dict(state_dict)
        model = model.to(device)
        model.eval()
        logger.info(f"Model loaded successfully from {model_path}")
        return model, None
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return None, f"Error loading model: {str(e)}"

# Load model at startup
model, model_error = load_model()

# Transformations for the input image
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/static/uploads/<filename>')
def serve_upload(filename):
    """Serve uploaded files."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Handle image upload and return the prediction."""
    if model_error:
        logger.error(f"Model error: {model_error}")
        return jsonify({'error': model_error}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    if not file or not file.filename:
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Allowed types are PNG, JPG, JPEG'}), 400

    try:
        # Create a unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        original_filename = secure_filename(file.filename)
        filename = f"{timestamp}_{original_filename}"
        
        # Ensure upload directory exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        logger.info(f"File saved successfully at {filepath}")

        # Process the image
        image = Image.open(filepath).convert('RGB')
        image_tensor = transform(image).unsqueeze(0).to(device)

        # Make prediction
        with torch.no_grad():
            output = model(image_tensor)
            _, predicted = torch.max(output, 1)

        predicted_class = class_names[predicted.item()]
        
        # Get the public URL for the image
        file_url = f'/static/uploads/{filename}'
        
        logger.info(f"Prediction successful: {predicted_class}")
        return jsonify({
            'class': predicted_class,
            'file_path': file_url,
            'confidence': float(torch.nn.functional.softmax(output, dim=1).max())
        }), 200

    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({
            'error': f"An error occurred during prediction. Please try again. Details: {str(e)}"
        }), 500

if __name__ == '__main__':
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    if model_error:
        logger.warning(f"Warning: {model_error}")
        logger.warning("The application will start, but predictions won't work until the model is properly loaded.")
    
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)