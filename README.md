Solar Sense: AI-Driven Smart Energy Auditor
Solar Sense is a real-time energy management and audit dashboard designed to optimize household solar consumption. By integrating live meteorological data with Machine Learning, the system helps users transition from grid dependence to sustainable solar self-sufficiency.

🚀 Key Features
AI-Powered Generation Forecast: Uses a Linear Regression model to predict solar efficiency based on live cloud cover and temperature data from Kochi.

Predictive Time-Travel: A dynamic simulation slider that allows users to forecast energy surplus or deficits for any hour of the day.

Demand-Side Audit: Interactive appliance control to calculate real-time household load vs. solar output.

Night Analytics & Capacity Check: An ECE-focused tool that calculates how long stored energy can sustain specific appliances after sunset.

30-Day Energy Trends: Visualizes historical solar yield vs. actual consumption patterns using persistent JSON storage.

🧠 Technical Architecture
1. Machine Learning Engine
The system utilizes a Physically-Informed Linear Regression model.

Features: Cloud Cover (%), Ambient Temperature (°C).

Target: Photovoltaic (PV) Efficiency Factor.

Logic: Trained on a 100-day synthetic dataset modeled after Kerala's tropical weather patterns.

2. Electrical Simulation
Irradiance Model: Uses a Sine Wave curve to simulate the sun's path from 6 AM to 6 PM.

Load Calculation: Aggregates wattage from active appliance states (AC, Fans, LEDs, etc.).

3. Tech Stack
Backend: Python (Flask)

Frontend: JavaScript (Chart.js), HTML5, CSS3 (Bootstrap)

ML Library: Scikit-Learn

API: OpenWeatherMap API
