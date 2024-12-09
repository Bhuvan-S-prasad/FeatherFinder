import os
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import torch
from torchvision import transforms, models
from PIL import Image

# Flask setup
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './static/uploads'
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
        model_path = os.path.join(os.path.dirname(__file__), 'new_bird_model.pth')
        
        if not os.path.exists(model_path):
            return None, "Model file 'new_bird_model.pth' not found. Please ensure it's in the server directory."
        
        state_dict = torch.load(model_path, map_location=device)
        model.load_state_dict(state_dict)
        model = model.to(device)
        model.eval()
        return model, None
    except Exception as e:
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

@app.route('/predict', methods=['POST'])
def predict():
    """Handle image upload and return the prediction."""
    if model_error:
        return jsonify({'error': model_error}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    if not file or not file.filename:
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Allowed types are PNG, JPG, JPEG'}), 400

    try:
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        file.save(filepath)

        # Process the image
        image = Image.open(filepath).convert('RGB')
        image_tensor = transform(image).unsqueeze(0).to(device)

        # Make prediction
        with torch.no_grad():
            output = model(image_tensor)
            _, predicted = torch.max(output, 1)

        # Get the class name
        predicted_class = class_names[predicted.item()]

        return jsonify({
            'class': predicted_class,
            'file_path': f'/static/uploads/{filename}'
        }), 200

    except Exception as e:
        error_message = str(e)
        print(f"Error during prediction: {error_message}")  # Log the error
        return jsonify({
            'error': f"An error occurred during prediction. Please try again. Details: {error_message}"
        }), 500

if __name__ == '__main__':
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    if model_error:
        print(f"Warning: {model_error}")
        print("The application will start, but predictions won't work until the model is properly loaded.")
    
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))