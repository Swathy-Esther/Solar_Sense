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

        # 3. ECE "Time Travel" Logic
        sim_hour = user_data.get('sim_hour')
        if sim_hour is not None:
            hour = float(sim_hour)
        else:
            ist = pytz.timezone('Asia/Kolkata')
            now = datetime.now(ist)
            hour = now.hour + (now.minute / 60)

        # 4. Solar Generation Curve
        MAX_SOLAR_CAPACITY = 3000 
        is_night = hour < 6 or hour > 18 
        
        if 6 <= hour <= 18:
            time_factor = math.sin(math.pi * (hour - 6) / 12)
            efficiency_factor = time_factor * (1 - (clouds / 100) * 0.75)
        else:
            efficiency_factor = 0 

        current_generation = MAX_SOLAR_CAPACITY * efficiency_factor

        # 5. NEW: Dynamic Daily Yield Calculation
        # Max yield for 3kW plant is ~15-18kWh. Scale it by cloud cover.
        daily_est_yield = round(15 * (1 - (clouds / 100) * 0.5), 1)

        # 6. Financials & Advice
        is_sufficient = current_generation > total_load
        savings_per_hour = (current_generation / 1000) * 7 if is_sufficient else 0
        
        # Predictive Analytics for Night Mode
        if is_night:
            weather_advice = f"Night Mode: Use stored energy for high-load appliances."
        elif is_sufficient:
            weather_advice = "Optimal: Running 100% on Solar."
        else:
            weather_advice = "Load exceeds solar. Consider shedding appliances."

        return jsonify({
            "city": CITY,
            "temp": temp,
            "clouds": clouds,
            "generation_watts": round(max(0, current_generation), 2),
            "consumption_watts": total_load,
            "status": "Solar Power Sufficient" if is_sufficient else "Drawing from Grid",
            "is_solar": is_sufficient,
            "is_night": is_night,
            "savings": round(savings_per_hour, 2),
            "advice": weather_advice,
            "daily_yield": daily_est_yield, # Sent to the Night Analytics card
            "time": f"{int(hour)}:00" if sim_hour is not None else "Live"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)