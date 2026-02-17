from flask import Flask, request
from flask_cors import CORS
import logging

def create_app():
    app = Flask(__name__)
    CORS(app)
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    # Root test route
    @app.route("/")
    def home():
        return "Urban Optima Backend Running"

    @app.after_request
    def add_private_network_header(response):
        # Allow Private Network Access preflight when UI is served from LAN IP.
        if request.headers.get("Access-Control-Request-Private-Network") == "true":
            response.headers["Access-Control-Allow-Private-Network"] = "true"
        return response

    # Register Blueprints
    from .routes.waste import waste_bp
    from .routes.airmap import air_bp
    from .routes.aqiForecast import aqiforecast_bp
    from .routes.trafficmap import trafficmap_bp
    from .routes.energy import energy_bp
    from .routes.overall import overall_bp
    from .routes.water import water_bp

    app.register_blueprint(waste_bp)
    app.register_blueprint(air_bp)
    app.register_blueprint(aqiforecast_bp)
    app.register_blueprint(trafficmap_bp)
    app.register_blueprint(energy_bp)
    app.register_blueprint(overall_bp)
    app.register_blueprint(water_bp)

    return app
