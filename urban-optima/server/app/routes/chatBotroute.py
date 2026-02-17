from flask import Blueprint, request, jsonify
import numpy as np
import pandas as pd
from ..services.chatBot import call_openrouter

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message")

        if not user_input:
            return jsonify({"error": "No message provided"}), 400

        bot_response = call_openrouter(user_input)
        return jsonify({"response": bot_response})

    except Exception as e:
        print("❌ Chatbot Error:", e)
        return jsonify({"error": "Something went wrong"}), 500