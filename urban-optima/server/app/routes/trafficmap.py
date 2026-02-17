from flask import Blueprint, request, jsonify
import logging
import folium
import openrouteservice
from app.config import WEATHER_API_KEY, ORS_API_KEY, TOMTOM_API_KEY
from app.services.tomtom import get_coordinates as tomtom_coordinates
import requests

# ✅ Blueprint name MUST match __init__.py import
trafficmap_bp = Blueprint('trafficmap', __name__)
logger = logging.getLogger(__name__)

# ORS client
client = openrouteservice.Client(key=ORS_API_KEY) if ORS_API_KEY else None


# ---------------------------------------------------
# MAP ROUTE (HTML MAP)
# ---------------------------------------------------
@trafficmap_bp.route('/map', methods=['GET'])
def show_map():

    from_location = request.args.get('from')
    to_location = request.args.get('to')

    if not from_location or not to_location:
        return "Missing locations", 400

    try:
        if not client:
            return "OpenRouteService API key not configured", 503
        # Geocode using ORS
        from_coords = client.pelias_search(text=from_location)['features'][0]['geometry']['coordinates']
        to_coords = client.pelias_search(text=to_location)['features'][0]['geometry']['coordinates']

        coords = [from_coords, to_coords]

        route = client.directions(coordinates=coords, profile='driving-car', format='geojson')
        geometry = route['features'][0]['geometry']['coordinates']

        # Build map
        m = folium.Map(location=[from_coords[1], from_coords[0]], zoom_start=13)

        folium.Marker([from_coords[1], from_coords[0]], popup="From").add_to(m)
        folium.Marker([to_coords[1], to_coords[0]], popup="To").add_to(m)

        folium.PolyLine(
            locations=[(lat, lon) for lon, lat in geometry],
            color='blue'
        ).add_to(m)

        return m._repr_html_()

    except Exception as e:
        logger.exception("MAP ERROR: %s", e)
        return "Error generating map", 500


# ---------------------------------------------------
# TRAFFIC API (JSON RESPONSE)
# ---------------------------------------------------
@trafficmap_bp.route('/api/traffic', methods=['GET', 'POST'])
def get_traffic_data():

    data = request.get_json(silent=True) or {}

    from_location = request.args.get('from') or data.get('from')
    to_location = request.args.get('to') or data.get('to')

    if not from_location or not to_location:
        return jsonify({'error': 'Missing from or to location'}), 400

    try:
        if not TOMTOM_API_KEY:
            return jsonify({"error": "TomTom API key not configured"}), 503

        # Geocode using TomTom
        start = tomtom_coordinates(from_location)
        end = tomtom_coordinates(to_location)

        if not start or not end:
            return jsonify({"error": "Invalid location(s)"}), 400

        # TomTom routing with traffic
        route_url = (
            "https://api.tomtom.com/routing/1/calculateRoute/"
            f"{start['lat']},{start['lon']}:{end['lat']},{end['lon']}/json"
        )
        route_params = {
            "key": TOMTOM_API_KEY,
            "traffic": "true",
        }
        route_response = requests.get(route_url, params=route_params, timeout=10)
        if route_response.status_code != 200:
            logger.error("TomTom routing error: %s", route_response.text)
            return jsonify({"error": "Traffic routing service failed"}), 502

        route_data = route_response.json()
        summary = route_data["routes"][0]["summary"]

        distance_km = summary["lengthInMeters"] / 1000
        duration_min = summary["travelTimeInSeconds"] / 60
        no_traffic_min = summary.get("noTrafficTravelTimeInSeconds", summary["travelTimeInSeconds"]) / 60
        delay_min = summary.get("trafficDelayInSeconds", 0) / 60
        delay_percent = (
            (delay_min / no_traffic_min) * 100 if no_traffic_min else 0
        )
        speed_kmh = round(distance_km / (duration_min / 60), 2) if duration_min else 0

        suggestion = "Traffic conditions are normal."
        if delay_percent >= 40:
            suggestion = "Heavy congestion detected. Consider alternate routes or public transport."
        elif delay_percent >= 20:
            suggestion = "Moderate congestion. Allow extra travel time."

        # Optional weather context
        weather_payload = {}
        if WEATHER_API_KEY:
            weather_url = (
                "https://api.openweathermap.org/data/2.5/weather"
                f"?lat={end['lat']}&lon={end['lon']}&appid={WEATHER_API_KEY}&units=metric"
            )
            weather_response = requests.get(weather_url, timeout=10)
            if weather_response.status_code == 200:
                weather_data = weather_response.json()
                weather_payload = {
                    "temperature": weather_data["main"]["temp"],
                    "humidity": weather_data["main"]["humidity"],
                    "weather": weather_data["weather"][0]["description"],
                }

        return jsonify({
            "from": from_location,
            "to": to_location,
            "distance": round(distance_km, 2),
            "eta": round(duration_min, 2),
            "delay": round(delay_percent, 1),
            "congestion_index": round(delay_percent, 1),
            "speed": speed_kmh,
            "prediction": {
                "next_30_min_delay": round(min(delay_percent * 1.1, 100), 1)
            },
            "suggestion": suggestion,
            **weather_payload,
        })

    except Exception as e:
        logger.exception("TRAFFIC API ERROR: %s", e)
        return jsonify({"error": "Traffic calculation failed"}), 500
