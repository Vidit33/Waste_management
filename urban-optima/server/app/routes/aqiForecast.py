from flask import Blueprint, request, jsonify
import logging
import pandas as pd
import openmeteo_requests
from geopy.geocoders import Nominatim
import requests_cache
from retry_requests import retry

# ✅ Blueprint name MUST match __init__.py import
aqiforecast_bp = Blueprint('aqiforecast', __name__)
logger = logging.getLogger(__name__)


@aqiforecast_bp.route('/api/airForecast', methods=['GET'])
def airForecast():

    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City not provided"}), 400

    # -----------------------------
    # Step 1: Get coordinates
    # -----------------------------
    geolocator = Nominatim(user_agent="urban_optima_forecast")
    try:
        location = geolocator.geocode(f"{city}, India", exactly_one=True)
    except Exception:
        logger.exception("AQI forecast geocoding failed for city=%s", city)
        return jsonify({"error": "Failed to resolve city location"}), 502

    if not location:
        return jsonify({"error": "City not found"}), 404

    lat, lon = location.latitude, location.longitude

    # -----------------------------
    # Step 2: Setup Open-Meteo
    # -----------------------------
    cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
    retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
    openmeteo = openmeteo_requests.Client(session=retry_session)

    url = "https://air-quality-api.open-meteo.com/v1/air-quality"

    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": [
            "pm10", "pm2_5", "carbon_monoxide", "ozone",
            "ammonia", "sulphur_dioxide", "nitrogen_dioxide"
        ]
    }

    try:
        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]
    except Exception:
        logger.exception("AQI forecast API failed for city=%s", city)
        return jsonify({"error": "Air quality forecast service unavailable"}), 502

    hourly = response.Hourly()

    hourly_data = {
        "date": pd.date_range(
            start=pd.to_datetime(hourly.Time(), unit="s", utc=True),
            end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True),
            freq=pd.Timedelta(seconds=hourly.Interval()),
            inclusive="left"
        ),
        "pm10": hourly.Variables(0).ValuesAsNumpy(),
        "pm2_5": hourly.Variables(1).ValuesAsNumpy(),
        "carbon_monoxide": hourly.Variables(2).ValuesAsNumpy(),
        "ozone": hourly.Variables(3).ValuesAsNumpy(),
        "ammonia": hourly.Variables(4).ValuesAsNumpy(),
        "sulphur_dioxide": hourly.Variables(5).ValuesAsNumpy(),
        "nitrogen_dioxide": hourly.Variables(6).ValuesAsNumpy()
    }

    df = pd.DataFrame(hourly_data)

    # -----------------------------
    # Step 3: Filter Next 3 Days
    # -----------------------------
    forecast_start = df["date"].iloc[0].normalize()
    start_date = forecast_start + pd.Timedelta(days=2)
    end_date = start_date + pd.Timedelta(days=4)

    df_filtered = df[(df["date"] >= start_date) & (df["date"] < end_date)].copy()

    # -----------------------------
    # Step 4: Indian AQI Logic
    # -----------------------------
    breakpoints = {
        "pm2_5": [(0, 30, 0, 50), (31, 60, 51, 100), (61, 90, 101, 200), (91, 120, 201, 300), (121, 250, 301, 400), (251, 350, 401, 500)],
        "pm10": [(0, 50, 0, 50), (51, 100, 51, 100), (101, 250, 101, 200), (251, 350, 201, 300), (351, 430, 301, 400), (431, 500, 401, 500)],
        "nitrogen_dioxide": [(0, 40, 0, 50), (41, 80, 51, 100), (81, 180, 101, 200), (181, 280, 201, 300), (281, 400, 301, 400), (401, 500, 401, 500)],
        "sulphur_dioxide": [(0, 40, 0, 50), (41, 80, 51, 100), (81, 380, 101, 200), (381, 800, 201, 300), (801, 1600, 301, 400), (1601, 2000, 401, 500)],
        "carbon_monoxide": [(0, 1, 0, 50), (1.1, 2, 51, 100), (2.1, 10, 101, 200), (10.1, 17, 201, 300), (17.1, 34, 301, 400), (34.1, 50, 401, 500)],
        "ozone": [(0, 50, 0, 50), (51, 100, 51, 100), (101, 168, 101, 200), (169, 208, 201, 300), (209, 748, 301, 400), (749, 1000, 401, 500)]
    }

    def calc_sub_index(value, bp_list):
        for (c_low, c_high, i_low, i_high) in bp_list:
            if c_low <= value <= c_high:
                return ((i_high - i_low) / (c_high - c_low)) * (value - c_low) + i_low
        return None

    def compute_india_aqi(row):
        sub_indices = []
        for pollutant, bp in breakpoints.items():
            val = row[pollutant]
            if pd.notnull(val):
                sub_idx = calc_sub_index(val, bp)
                if sub_idx is not None:
                    sub_indices.append(sub_idx)
        return max(sub_indices) if sub_indices else None

    df_filtered["india_aqi"] = df_filtered.apply(compute_india_aqi, axis=1)
    df_filtered["date_str"] = df_filtered["date"].dt.strftime("%d %b")

    def aqi_bucket(aqi_value):
        if aqi_value is None or pd.isna(aqi_value):
            return None
        if aqi_value <= 50:
            return 1
        if aqi_value <= 100:
            return 2
        if aqi_value <= 200:
            return 3
        if aqi_value <= 300:
            return 4
        return 5

    result = df_filtered.groupby("date_str").apply(
        lambda group: pd.Series({
            "exp_aqi": round(group["india_aqi"].max(), 0)
        })
    ).reset_index()

    result["aqi_range"] = result["exp_aqi"].apply(aqi_bucket)

    return jsonify(result.to_dict(orient="records"))

