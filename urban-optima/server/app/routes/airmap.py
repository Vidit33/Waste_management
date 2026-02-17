from flask import Blueprint, request, jsonify
import logging
import requests
import folium
from geopy.geocoders import Nominatim
from app.config import WEATHER_API_KEY

# ✅ Blueprint name MUST match import in __init__.py
air_bp = Blueprint('airmap', __name__)
logger = logging.getLogger(__name__)


# -----------------------------
# Helper: Get Coordinates
# -----------------------------
def get_coordinates(city_name):
    geolocator = Nominatim(user_agent="urban_optima_air")
    location = geolocator.geocode(f"{city_name}, India", exactly_one=True)

    if not location:
        raise Exception("City not found")

    return location.latitude, location.longitude


# -----------------------------
# Helper: AQI Color
# -----------------------------
def get_aqi_color(aqi):
    return {
        1: "green",
        2: "yellow",
        3: "orange",
        4: "red",
        5: "purple"
    }.get(aqi, "gray")


# -----------------------------
# MAIN AIR API
# -----------------------------
@air_bp.route("/api/air", methods=["GET", "POST"])
def get_air_data():

    data = request.get_json(silent=True) or {}
    city = request.args.get("city") or data.get("city")

    if not city:
        return jsonify({"error": "City not provided"}), 400

    try:
        if not WEATHER_API_KEY:
            return jsonify({"error": "OpenWeather API key not configured"}), 503

        # Get coordinates
        lat, lon = get_coordinates(city)

        # API URLs
        aqi_url = (
            "https://api.openweathermap.org/data/2.5/air_pollution"
            f"?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}"
        )
        forecast_url = (
            "https://api.openweathermap.org/data/2.5/air_pollution/forecast"
            f"?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}"
        )
        weather_url = (
            "https://api.openweathermap.org/data/2.5/weather"
            f"?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
        )

        # Fetch data
        aqi_response = requests.get(aqi_url, timeout=10)
        weather_response = requests.get(weather_url, timeout=10)

        if aqi_response.status_code != 200:
            logger.error("Air API error: %s", aqi_response.text)
            return jsonify({"error": "Air quality service failed"}), 502
        if weather_response.status_code != 200:
            logger.error("Weather API error: %s", weather_response.text)
            return jsonify({"error": "Weather service failed"}), 502

        aqi_res = aqi_response.json()
        weather_res = weather_response.json()

        # Extract data
        aqi = aqi_res["list"][0]["main"]["aqi"]
        components = aqi_res["list"][0]["components"]

        temperature = weather_res["main"]["temp"]
        humidity = weather_res["main"]["humidity"]
        wind_speed = weather_res["wind"]["speed"] * 3.6
        weather_desc = weather_res["weather"][0]["description"]

        # AQI Text
        aqi_levels = {
            1: "Good",
            2: "Fair",
            3: "Moderate",
            4: "Poor",
            5: "Very Poor"
        }

        # Health Suggestion
        if aqi == 1:
            suggestion = "Air quality is excellent. Safe for all."
        elif aqi == 2:
            suggestion = "Air quality is fair. Sensitive groups should take care."
        elif aqi == 3:
            suggestion = "Moderate air quality. Reduce prolonged outdoor activity."
        else:
            suggestion = "Air quality is unhealthy. Limit outdoor exposure."

        # Forecast (next 24 hours AQI peak)
        prediction = None
        try:
            forecast_response = requests.get(forecast_url, timeout=10)
            if forecast_response.status_code == 200:
                forecast_res = forecast_response.json()
                next_24 = forecast_res.get("list", [])[:24]
                if next_24:
                    max_aqi = max(item["main"]["aqi"] for item in next_24)
                    avg_aqi = round(sum(item["main"]["aqi"] for item in next_24) / len(next_24), 2)
                    prediction = {
                        "next_24h_max_aqi": max_aqi,
                        "next_24h_avg_aqi": avg_aqi,
                    }
        except Exception:
            logger.exception("Air forecast fetch failed for city=%s", city)

        # Create Map
        popup_text = f"""
        <b>📍 {city}</b><br>
        <b>AQI:</b> {aqi}<br>
        <b>PM2.5:</b> {components['pm2_5']} µg/m³<br>
        <b>Weather:</b> {weather_desc}<br>
        <b>Temp:</b> {temperature} °C<br>
        <b>Humidity:</b> {humidity}%<br>
        <b>Wind:</b> {round(wind_speed, 1)} km/h
        """

        m = folium.Map(location=[lat, lon], zoom_start=11)

        folium.Circle(
            location=[lat, lon],
            radius=10000,
            color=get_aqi_color(aqi),
            fill=True,
            fill_color=get_aqi_color(aqi),
            popup=folium.Popup(popup_text, max_width=300)
        ).add_to(m)

        map_html = m._repr_html_()

        # Return response
        return jsonify({
            "city": city,
            "aqi": aqi,
            "aqi_text": aqi_levels.get(aqi),
            "components": components,
            "temperature": temperature,
            "humidity": humidity,
            "wind_speed": round(wind_speed, 1),
            "weather": weather_desc,
            "suggestion": suggestion,
            "prediction": prediction,
            "lat": lat,
            "lon": lon,
            "map_html": map_html
        })

    except Exception as e:
        logger.exception("AIR API ERROR: %s", e)
        return jsonify({"error": "Failed to fetch air data"}), 500
