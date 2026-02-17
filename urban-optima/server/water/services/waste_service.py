# server/water/services/waste_service.py

from ultralytics import YOLO
import os

# -----------------------------
# Load trained waste classifier
# -----------------------------

MODEL_PATH = os.path.join("models", "waste_classifier.pt")
model = YOLO(MODEL_PATH)

# TrashNet Classes
WASTE_CLASSES = [
    "cardboard",
    "glass",
    "metal",
    "paper",
    "plastic",
    "trash"
]

# -----------------------------
# Main Waste Detection Function
# -----------------------------

def get_waste_report(image_path="water/waste_detection/test.jpg"):
    """
    Runs waste classification on an image
    Returns:
        waste_detected (bool)
        predicted_type (str)
        confidence (float)
        severity (str)
    """

    # Run model
    results = model(image_path)
    probs = results[0].probs

    top_index = probs.top1
    confidence = float(probs.top1conf)

    predicted_class = WASTE_CLASSES[top_index]

    # ---------------------------------
    # Waste Presence Logic
    # ---------------------------------
    # If model is confident (>30%), we assume waste exists
    waste_detected = confidence > 0.30

    # ---------------------------------
    # Severity Mapping
    # ---------------------------------
    if predicted_class in ["plastic", "metal"]:
        severity = "high"
    elif predicted_class in ["paper", "cardboard", "trash", "glass"]:
        severity = "medium"
    else:
        severity = "none"

    # If no waste detected, override
    if not waste_detected:
        severity = "none"
        predicted_class = "none"

    return {
        "waste_detected": waste_detected,
        "predicted_type": predicted_class,
        "confidence": round(confidence, 3),
        "severity": severity
    }
