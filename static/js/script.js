let myChart; // For the 12-hour predictive curve
let histChart; // For the 30-day historical trends

// Helper function to extract data for each appliance row
function getApplianceData(id) {
    return {
        on: document.getElementById(`${id}_toggle`).checked,
        qty: parseInt(document.getElementById(`${id}_qty`).value) || 0,
        watts: parseInt(document.getElementById(`${id}_watts`).value) || 0
    };
}

// 🕒 Update simulation time label and trigger real-time recalculation
function updateTimeLabel(val) {
    const ampm = val >= 12 ? 'PM' : 'AM';
    const displayHour = val % 12 || 12;
    document.getElementById('time_label').innerText = `Simulation Time: ${displayHour} ${ampm}`;
    updateSimulation();
}

// 📈 Draw the predictive sine wave chart for Kochi's daily sun path
function updatePredictionChart(clouds) {
    const ctx = document.getElementById('predictionChart').getContext('2d');
    const labels = [];
    const predictionData = [];
    const MAX_SOLAR = 3000;

    for (let h = 6; h <= 18; h++) {
        labels.push(`${h}:00`);
        const timeFactor = Math.sin(Math.PI * (h - 6) / 12);
        const efficiency = timeFactor * (1 - (clouds / 100) * 0.75);
        predictionData.push(Math.round(MAX_SOLAR * efficiency));
    }

    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Forecasted Watts (W)',
                data: predictionData,
                borderColor: '#ffc107',
                backgroundColor: 'rgba(255, 193, 7, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

// 📅 Draw the 30-day historical trend chart
function updateHistoryChart(history) {
    const ctx = document.getElementById('historyChart').getContext('2d');

    // Calculate 30-day averages
    const avgGen = history.reduce((sum, d) => sum + d.gen, 0) / (history.length || 1);
    const avgCons = history.reduce((sum, d) => sum + d.cons, 0) / (history.length || 1);
    document.getElementById('avg-gen').innerText = avgGen.toFixed(1);
    document.getElementById('avg-cons').innerText = avgCons.toFixed(1);

    if (histChart) histChart.destroy();
    histChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: history.map(d => d.date),
            datasets: [
                { label: 'Solar Gen (kWh)', data: history.map(d => d.gen), borderColor: '#198754', tension: 0.3 },
                { label: 'Consumption (kWh)', data: history.map(d => d.cons), borderColor: '#0dcaf0', tension: 0.3 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

async function updateSimulation() {
    // Ensure we always have a number, even if the slider is jittery
    const sliderElem = document.getElementById('time_slider');
    const simulatedHour = sliderElem ? parseInt(sliderElem.value) : 12;
    //const simulatedHour = document.getElementById('time_slider').value;
    const appliancePayload = {
        sim_hour: parseInt(simulatedHour),
        ac: getApplianceData('ac'),
        fan: getApplianceData('fan'),
        light: getApplianceData('light'),
        wm: getApplianceData('wm'),
        tv: getApplianceData('tv')
    };

    try {
        const response = await fetch('/get_status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appliancePayload)
        });

        const data = await response.json();

        if (data.is_night) {
            document.body.classList.add('night-mode');
        } else {
            document.body.classList.remove('night-mode');
        }

        // Sync main UI elements
        document.getElementById('gen-val').innerText = data.generation_watts;
        document.getElementById('savings-val').innerText = data.savings;
        document.getElementById('weather-temp').innerText = `${data.temp}°C`;
        document.getElementById('weather-desc').innerText = `Kochi: ${data.clouds}% Clouds`;
        document.getElementById('cloud-val').innerText = `${data.clouds}%`;
        document.getElementById('load-val').innerText = `${data.consumption_watts} W`;
        document.getElementById('status-msg').innerText = `Status: ${data.status} | AI: ${data.advice}`;
        document.getElementById('night-yield').innerText = data.daily_yield; // Sync dynamic yield

        const gridStatus = document.getElementById('grid-status');
        gridStatus.innerText = data.is_solar ? "SOLAR ONLY" : "GRID ACTIVE";
        gridStatus.className = data.is_solar ? "badge bg-success" : "badge bg-danger";

        updatePredictionChart(data.clouds);

        // Auto-fetch history on every refresh to keep trends updated
        fetch('/get_history').then(res => res.json()).then(history => {
            if (history.length > 0) updateHistoryChart(history);
        });

    } catch (err) {
        console.error("Fetch error:", err);
    }
}

function calculateNightMetrics() {
    const morning = parseFloat(document.getElementById('meter_morning').value) || 0;
    const evening = parseFloat(document.getElementById('meter_evening').value) || 0;
    const estYield = parseFloat(document.getElementById('night-yield').innerText) || 0;

    const consumption = Math.max(0, evening - morning);
    const excess = Math.max(0, estYield - consumption);

    document.getElementById('night-used').innerText = consumption.toFixed(1);
    document.getElementById('night-excess').innerText = excess.toFixed(1);

    // Save this interaction to the 30-day history database
    const dailyData = { gen: estYield, cons: consumption };
    fetch('/save_daily_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dailyData)
    }).then(res => res.json()).then(history => updateHistoryChart(history));

    // "What Can I Run" Logic
    const applianceWatts = parseFloat(document.getElementById('check_appliance').value);
    const hours = parseFloat(document.getElementById('check_hours').value);
    const requiredKWh = (applianceWatts * hours) / 1000;

    const resultBox = document.getElementById('run-result');
    if (excess >= requiredKWh) {
        resultBox.className = "mt-3 p-2 rounded text-center small fw-bold bg-success text-white";
        resultBox.innerText = `✅ Success: ${excess.toFixed(1)}kWh available. Used: ${requiredKWh.toFixed(1)}kWh.`;
    } else {
        resultBox.className = "mt-3 p-2 rounded text-center small fw-bold bg-danger text-white";
        resultBox.innerText = `❌ Warning: Needs ${requiredKWh.toFixed(1)}kWh. Only ${excess.toFixed(1)}kWh stored.`;
    }
}

window.onload = updateSimulation;