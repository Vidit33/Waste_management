import logging
import requests
from app.config import TOMTOM_API_KEY

logger = logging.getLogger(__name__)

def get_coordinates(location):
    if not TOMTOM_API_KEY:
        return None

    url = f"https://api.tomtom.com/search/2/geocode/{location}.json"
    response = requests.get(url, params={"key": TOMTOM_API_KEY}, timeout=10)
    if response.status_code != 200:
        logger.error("TomTom geocode error: %s", response.text)
        return None

    payload = response.json()
    if payload.get("results"):
        position = payload["results"][0]["position"]
        return {"lat": position["lat"], "lon": position["lon"]}
    return None
