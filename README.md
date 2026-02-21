<p align="center">
  <img src="./static/logo.png" alt="Solar Sense Logo" width="250px">
</p>

# Solar Sense ☀️🎯

## Basic Details

### Team Name: Astrobiomers

### Team Members
- Member 1: Swathy Esther - B.Tech Computer Science & AI
- Member 2: [Partner's Name] - B.Tech Electronics & Communication Engineering

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
