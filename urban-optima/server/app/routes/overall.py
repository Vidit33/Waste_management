from flask import Blueprint, jsonify
import requests

overall_bp = Blueprint('overall', __name__)

@overall_bp.route('/api/overall-data', methods=['GET'])
def overall_data():
    """
    Combines Air, Traffic, Energy, etc. data into one sustainability summary.
    """

    try:
        # Fetch existing data from your other APIs
        air_data = requests.get("http://127.0.0.1:5000/api/air", params={"city": "Jaipur"}).json()
        traffic_data = requests.get(
            "http://127.0.0.1:5000/api/traffic",
            params={"from": "Jaipur", "to": "Jaipur"},
        ).json()
        energy_data = requests.get("http://127.0.0.1:5000/api/energy").json()

        # Safely extract values (use whatever your endpoints return)
        air_aqi = air_data.get("aqi", 100)
        traffic_congestion = traffic_data.get("congestion", 60)
        renewable_share = energy_data.get("renewable_percent", 30)

        # Example scoring logic
        air_score = max(0, 100 - air_aqi)
        traffic_score = 100 - traffic_congestion
        energy_score = renewable_share
        water_score = 75  # Placeholder (you can add water later)

        overall_score = round((air_score + traffic_score + energy_score + water_score) / 4, 2)

        status = (
            "Sustainable" if overall_score >= 75
            else "Needs Improvement" if overall_score >= 50
            else "Critical"
        )

        return jsonify({
            "overall_score": overall_score,
            "status": status,
            "air": air_aqi,
            "traffic": traffic_congestion,
            "energy": renewable_share,
            "water": water_score
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
