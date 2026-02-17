from flask import request, jsonify
import requests, os

API_KEY = "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"
API_URL = "https://openrouter.ai/api/v1/chat/completions"

def call_openrouter(prompt):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type":
        "application/json"
    }
    data = {
        "model": "mistralai/mistral-small-24b-instruct-2501:free",  # or correct gemma model name
        "messages": [
            {"role": "system", "content":
                ("You are Advisor Bot, a friendly and knowledgeable sustainability assistant. "
                 "Greet only when someone greets you"
                 "Help users make eco-friendly decisions for a sustainable city by giving personalized suggestions on air quality, traffic, energy use, and water conservation. "
                 "Ask relevant questions to understand user needs and provide simple, actionable advice. "
                 "Offer practical tips on reducing pollution, saving resources, and improving daily habits for a greener urban future.")},
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post(API_URL, headers=headers, json=data)

    try:
        res = response.json()
        
        if 'choices' in res:
            return res['choices'][0]['message']['content']
        else:
            print("API Error:", res)
            return "Error: Could not get chatbot response."
    except Exception as e:
        print("Error decoding JSON:", e, "Response:", response.text)
        return "Error: Invalid response format."