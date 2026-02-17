from flask import Blueprint, request, jsonify
import numpy as np
import cv2
import tempfile
import os

waste_bp = Blueprint("waste_bp", __name__)

@waste_bp.route("/api/waste/full-cycle", methods=["POST"])
def full_cycle():

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    temp = tempfile.NamedTemporaryFile(delete=False)
    file.save(temp.name)

    image = cv2.imread(temp.name)
    os.unlink(temp.name)

    if image is None:
        return jsonify({"error": "Invalid image"}), 400

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # 🔥 EDGE DETECTION (Better than brightness)
    edges = cv2.Canny(gray, 50, 150)
    edge_density = float(np.sum(edges > 0)) / (edges.shape[0] * edges.shape[1])

    print("Edge Density:", edge_density)

    # 🎯 SMARTER THRESHOLD
    if edge_density > 0.08:
        waste_detected = True
        clutter_score = round(edge_density * 1000, 2)
        cleaning_triggered = True
        cleaning_successful = True
    else:
        waste_detected = False
        clutter_score = round(edge_density * 1000, 2)
        cleaning_triggered = False
        cleaning_successful = False

    return jsonify({
        "waste_detected": bool(waste_detected),
        "clutter_score": float(clutter_score),
        "cleaning_triggered": bool(cleaning_triggered),
        "cleaning_successful": bool(cleaning_successful)
    })

