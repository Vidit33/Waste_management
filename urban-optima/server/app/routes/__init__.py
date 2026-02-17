from flask import Flask
from flask_cors import CORS
from app.routes.waste import waste_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/")
    def home():
        return "Urban Optima Backend Running"

    app.register_blueprint(waste_bp)

    return app
