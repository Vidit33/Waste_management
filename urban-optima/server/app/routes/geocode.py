from flask import Blueprint, request, jsonify
# from app.services.tomtom import get_coordinates

geocode_bp = Blueprint('geocode', __name__)

@geocode_bp.route('/', methods=['POST'])
def geocode():
    data = request.get_json()
    location = data.get('location')
    if not location:
        return jsonify({'error': 'No location provided'}), 400

    result = get_coordinates(location)
    if result:
        return jsonify(result)
    return jsonify({'error': 'Location not found'}), 404
