<p align="center">
  <img src="./static/logo.png" alt="Solar Sense Logo" width="250px">
</p>

# Solar Sense ☀️🎯

## Basic Details

### Team Name: Hel Tech

### Team Members
- Member 1: Swathy Esther - B.Tech Computer Science & AI
- Member 2: Aleena Sabu - B.Tech Electronics & Communication Engineering

### Hosted Project Link
[https://solar-sense-1.onrender.com](https://solar-sense-1.onrender.com)

### Project Description
Solar Sense is an AI-powered energy management dashboard that predicts solar panel efficiency using live weather data and performs real-time household energy audits. It bridges the gap between meteorological physics and consumer energy independence.

### The Problem statement
Many solar homeowners struggle to understand how much energy their system will actually produce under varying weather conditions, leading to inefficient appliance usage and unexpected grid dependence.

### The Solution
We use a **Linear Regression ML model** to predict real-time PV efficiency based on live Kochi weather APIs. Users can "time-travel" through the day to simulate generation and use a "What Can I Run?" calculator to manage night-time energy storage effectively.

---

## Technical Details

### Technologies/Components Used

**For Software:**
- **Languages used:** Python, JavaScript, HTML5, CSS3
- **Frameworks used:** Flask (Backend)
- **Libraries used:** Scikit-Learn (ML), Pandas (Data), Chart.js (Visualization), Requests, Pytz
- **Tools used:** VS Code, Git, Render (Deployment), OpenWeatherMap API

---

## Features

- **AI Efficiency Prediction:** Real-time ML inference predicting energy output based on cloud cover and temperature.
- **Simulation Slider:** Interactive "Time Travel" to forecast solar generation at any specific hour of the day.
- **Live Load Audit:** Toggle switches for common appliances to calculate real-time consumption vs. generation.
- **Night Analytics:** A calculator that uses daily yield and meter readings to predict how long stored energy will last for specific appliances.

---

## Implementation

### For Software:
### installation
```bash
pip install flask requests flask-cors pytz pandas scikit-learn gunicorn
```



#### Installation
```bash
pip install flask requests flask-cors pytz pandas scikit-learn gunicorn
```

### Run
```bash
# Train the AI engine first
python train_model.py  

# Start the Flask production server
python app.py
```
### Project Documentation
### For Software
### Screenshots
<img width="1915" height="865" alt="Screenshot 2026-02-21 090354" src="https://github.com/user-attachments/assets/6f24e7eb-c4b8-4cb2-80ba-9ae3cba0a9ec" />
<img width="1889" height="869" alt="Screenshot 2026-02-21 090424" src="https://github.com/user-attachments/assets/ff7456a9-2cb1-4a3e-8266-0d348ffe6f10" />
<img width="1915" height="865" alt="Screenshot 2026-02-21 090354" src="https://github.com/user-attachments/assets/5f0e5f99-1f7c-4a2a-abee-c025591c35d3" />
<img width="1895" height="865" alt="Screenshot 2026-02-21 090322" src="https://github.com/user-attachments/assets/fa6086db-6733-46cb-912f-2c8d58048c05" />




