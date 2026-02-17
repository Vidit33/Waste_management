from flask import Blueprint, request, jsonify
import logging
import pandas as pd
import openmeteo_requests
import requests_cache
from retry_requests import retry
from geopy.geocoders import Nominatim

water_bp = Blueprint("water", __name__)
logger = logging.getLogger(__name__)


def _get_coordinates(area):
    geolocator = Nominatim(user_agent="urban_optima_water")
    location = geolocator.geocode(area, exactly_one=True)
    if not location:
        raise ValueError("Area not found")
    return location.latitude, location.longitude


def _fetch_water_series(lat, lon):
    cache_session = requests_cache.CachedSession(".cache", expire_after=1800)
    retry_session = retry(cache_session, retries=3, backoff_factor=0.2)
    openmeteo = openmeteo_requests.Client(session=retry_session)

    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": [
            "precipitation_sum",
            "temperature_2m_max",
            "temperature_2m_min",
            "et0_fao_evapotranspiration",
        ],
        "timezone": "auto",
        "past_days": 7,
        "forecast_days": 3,
    }

    responses = openmeteo.weather_api(url, params=params)
    response = responses[0]
    daily = response.Daily()

    data = {
        "date": pd.date_range(
            start=pd.to_datetime(daily.Time(), unit="s", utc=True),
            end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True),
            freq=pd.Timedelta(seconds=daily.Interval()),
            inclusive="left",
        ),
        "precip_mm": daily.Variables(0).ValuesAsNumpy(),
        "temp_max": daily.Variables(1).ValuesAsNumpy(),
        "temp_min": daily.Variables(2).ValuesAsNumpy(),
        "et0_mm": daily.Variables(3).ValuesAsNumpy(),
    }

    return pd.DataFrame(data)


@water_bp.route("/api/water", methods=["GET", "POST"])
def get_water_data():
    payload = request.get_json(silent=True) or {}
    area = request.args.get("area") or payload.get("area")

    if not area:
        return jsonify({"error": "Area not provided"}), 400

    try:
        lat, lon = _get_coordinates(area)
        df = _fetch_water_series(lat, lon)

        df["date"] = pd.to_datetime(df["date"])
        today = pd.Timestamp.utcnow().normalize()

        history = df[df["date"] <= today].tail(7)
        forecast = df[df["date"] > today].head(3)

        precip_mm = history["precip_mm"].sum()
        et0_mm = history["et0_mm"].sum()

        # Use per-square-kilometer conversion for liters from mm of water.
        liters_per_mm_per_km2 = 1_000_000
        area_km2 = 1.0

        total_usage = max(et0_mm, 0) * liters_per_mm_per_km2 * area_km2
        needed = max(et0_mm + 5, 0) * liters_per_mm_per_km2 * area_km2
        consumed = max(et0_mm - (precip_mm * 0.4), 0) * liters_per_mm_per_km2 * area_km2
        consumption_percentage = round((consumed / needed) * 100, 1) if needed else 0

        reservoir_level = max(0, min(100, round(100 - consumption_percentage + (precip_mm / max(et0_mm, 1)) * 10, 1)))

        next_day = forecast.iloc[0] if not forecast.empty else None
        predicted_consumption = None
        if next_day is not None:
            predicted_consumption = max(
                next_day["et0_mm"] - (next_day["precip_mm"] * 0.4),
                0,
            ) * liters_per_mm_per_km2 * area_km2

        suggestion = "Water usage is within optimal range."
        if consumption_percentage >= 85:
            suggestion = "High consumption detected. Initiate conservation alerts and optimize supply."
        elif consumption_percentage >= 60:
            suggestion = "Moderate usage. Encourage mindful consumption and leakage checks."

        return jsonify({
            "area": area,
            "total_usage": round(total_usage),
            "needed": round(needed),
            "consumed": round(consumed),
            "consumption_percentage": consumption_percentage,
            "reservoir_level": reservoir_level,
            "prediction": {
                "next_day_consumption": round(predicted_consumption) if predicted_consumption is not None else None
            },
            "suggestion": suggestion,
            "source": {
                "provider": "open-meteo",
                "lat": lat,
                "lon": lon,
            },
        })
    except ValueError:
        return jsonify({"error": "Area not found"}), 404
    except Exception:
        logger.exception("Water API error for area=%s", area)
        return jsonify({"error": "Water service unavailable"}), 500
