import pandas as pd
from sklearn.linear_model import LinearRegression
import json
import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
from datetime import datetime
import pytz
import math

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
API_KEY = "d6b71d7e45680baf0a899cd255f300ce"
CITY = "Kochi"
DB_FILE = 'history_data.json'

# --- AI ENGINE: ML MODEL TRAINING ---
print("🤖 AI ENGINE: Training Linear Regression model on Kochi dataset...")

# Load the synthetic dataset (Ensure you ran train_model.py first!)
try:
    df = pd.read_csv('solar_training_data.csv')
    X = df[['clouds', 'temp']]
    y = df['efficiency']
    ml_model = LinearRegression().fit(X, y)
    r_sq = round(ml_model.score(X, y), 2)
    print(f"✅ AI ENGINE: Model trained. Accuracy (R²): {r_sq}")
except Exception as e:
    print(f"❌ AI ENGINE ERROR: Could not load training data. Run train_model.py. {e}")

def get_ml_efficiency(clouds, temp):
    # Use the model to predict efficiency based on live weather
    try:
        prediction = ml_model.predict([[clouds, temp]])
        return round(max(0.1, float(prediction[0])), 3)
    except:
        return 0.5 # Default fallback efficiency

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_status', methods=['POST'])
def get_status():
    try:
        user_data = request.json
        
        # 1. Advanced ECE Load Calculation Engine
        total_load = 0
        for key, details in user_data.items():
            if isinstance(details, dict) and details.get('on'):
                qty = details.get('qty', 0)
                watts = details.get('watts', 0)
                total_load += (qty * watts)

        # 2. Fetch Live Weather Data for Kochi
        weather_url = f"http://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric"
        response = requests.get(weather_url)
        w_data = response.json()
        clouds = w_data.get('clouds', {}).get('all', 0)
        temp = w_data.get('main', {}).get('temp', 30)

        # 3. ECE "Time Travel" Logic - STABLE VERSION
        sim_hour_raw = user_data.get('sim_hour')
        if sim_hour_raw is not None and str(sim_hour_raw).strip() != "":
            hour = float(sim_hour_raw)
        else:
            ist = pytz.timezone('Asia/Kolkata')
            now = datetime.now(ist)
            hour = now.hour + (now.minute / 60)

        # 4. Solar Generation Curve
        MAX_SOLAR_CAPACITY = 3000 
        is_night = hour < 6 or hour > 18 
        
        # Use ML Model to dictate base efficiency
        ml_efficiency_base = get_ml_efficiency(clouds, temp)
        
        if 6 <= hour <= 18:
            time_factor = math.sin(math.pi * (hour - 6) / 12)
            efficiency_factor = time_factor * ml_efficiency_base
        else:
            efficiency_factor = 0

        # Define current_generation early so Step 6 can use it!
        current_generation = round(MAX_SOLAR_CAPACITY * efficiency_factor, 2)

        # 5. NEW: Dynamic Daily Yield Calculation
        daily_est_yield = round(15 * (1 - (clouds / 100) * 0.5), 1)

        # 6. Financials & Advice
        is_sufficient = current_generation > total_load
        savings_per_hour = (current_generation / 1000) * 7 if is_sufficient else 0
        
        if is_night:
            weather_advice = "Night Mode: Use stored energy for high-load appliances."
        elif is_sufficient:
            weather_advice = "Optimal: Running 100% on Solar."
        else:
            weather_advice = "Load exceeds solar. Consider shedding appliances."

        return jsonify({
            "city": CITY,
            "temp": temp,
            "clouds": clouds,
            "generation_watts": current_generation,
            "consumption_watts": total_load,
            "status": "Solar Power Sufficient" if is_sufficient else "Drawing from Grid",
            "is_solar": is_sufficient,
            "is_night": is_night,
            "savings": round(savings_per_hour, 2),
            "advice": weather_advice,
            "daily_yield": daily_est_yield,
            "time": f"{int(hour)}:00" if sim_hour_raw is not None else "Live"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- 30-DAY HISTORY ROUTES ---
@app.route('/save_daily_data', methods=['POST'])
def save_daily_data():
    try:
        data = request.json
        history = []
        if os.path.exists(DB_FILE):
            with open(DB_FILE, 'r') as f:
                history = json.load(f)
        
        history.append({
            "date": datetime.now().strftime("%d %b"),
            "gen": data.get('gen'),
            "cons": data.get('cons')
        })
        
        history = history[-30:] # Keep last 30 entries
        
        with open(DB_FILE, 'w') as f:
            json.dump(history, f)
            
        return jsonify(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_history')
def get_history():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r') as f:
            return jsonify(json.load(f))
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True, port=5000)