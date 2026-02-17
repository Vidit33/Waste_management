import os

# API keys are read from environment variables to avoid hardcoding secrets.
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "").strip()
ORS_API_KEY = os.getenv("ORS_API_KEY", "").strip()
TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY", "").strip()
EMBER_API_KEY = os.getenv("EMBER_API_KEY", "").strip()