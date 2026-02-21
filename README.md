<p align="center">
<img src="./static/logo.png" alt="Project Banner" width="400px">
</p>

Solar Sense ☀️🎯
Basic Details
Team Name: Astrobiomers
Team Members
Member 1: Swathy Esther Yohannan- Pursuing B.Tech in Computer Science and AI

Member 2: Aleena Sabu- Pursuing B.Tech in Electronics and Communication Engineering

Hosted Project Link
https://solar-sense-1-gxpu.onrender.com

Project Description
Solar Sense is an AI-powered energy management dashboard that predicts solar panel efficiency using live weather data and performs real-time household energy audits. It bridges the gap between meteorological physics and consumer energy independence.

The Problem statement
Many solar homeowners struggle to understand how much energy their system will actually produce under varying weather conditions, leading to inefficient appliance usage and unexpected grid dependence.

The Solution
We use a Linear Regression ML model to predict real-time PV efficiency based on live Kochi weather APIs. Users can "time-travel" through the day to simulate generation and use a "What Can I Run?" calculator to manage night-time energy storage effectively.

Technical Details
Technologies/Components Used
For Software:

Languages used: Python, JavaScript, HTML5, CSS3

Frameworks used: Flask (Backend)

Libraries used: Scikit-Learn (ML), Pandas (Data), Chart.js (Visualization), Requests, Pytz

Tools used: VS Code, Git, Render (Deployment), OpenWeatherMap API

Features
List the key features of your project:

Feature 1: AI Efficiency Prediction: Real-time ML inference predicting energy output based on cloud cover and temperature.

Feature 2: Simulation Slider: Interactive "Time Travel" to forecast solar generation at any specific hour of the day.

Feature 3: Live Load Audit: Toggle switches for common appliances to calculate real-time consumption vs. generation.

Feature 4: Night Analytics: A calculator that uses daily yield and meter readings to predict how long stored energy will last for specific appliances.

Implementation
For Software:
Installation
Bash
pip install flask requests flask-cors pytz pandas scikit-learn gunicorn
Run
Bash
# First, generate the ML dataset and train the model
python train_model.py  

# Then, start the production server
python app.py
