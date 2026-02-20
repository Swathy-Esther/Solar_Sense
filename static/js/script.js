let myChart; // Global variable to store the chart instance

// Helper function to extract data for each appliance row
function getApplianceData(id) {
    return {
        on: document.getElementById(`${id}_toggle`).checked,
        qty: parseInt(document.getElementById(`${id}_qty`).value) || 0,
        watts: parseInt(document.getElementById(`${id}_watts`).value) || 0
    };
}

// 🕒 Update simulation time label
function updateTimeLabel(val) {
    const ampm = val >= 12 ? 'PM' : 'AM';
    const displayHour = val % 12 || 12;
    document.getElementById('time_label').innerText = `Simulation Time: ${displayHour} ${ampm}`;
    updateSimulation();
}

// 📈 Draw the predictive sine wave chart
function updatePredictionChart(clouds) {
    const ctx = document.getElementById('predictionChart').getContext('2d');
    const labels = [];
    const predictionData = [];
    const MAX_SOLAR = 3000;

    // ECE Sine Wave Logic: 6 AM to 6 PM
    for (let h = 6; h <= 18; h++) {
        labels.push(`${h}:00`);
        const timeFactor = Math.sin(Math.PI * (h - 6) / 12);
        const efficiency = timeFactor * (1 - (clouds / 100) * 0.75);
        predictionData.push(Math.round(MAX_SOLAR * efficiency));
    }

    if (myChart) myChart.destroy(); // Clear old chart before redrawing

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
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#ffc107'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { color: '#666' } } }
        }
    });
}

async function updateSimulation() {
    // 1. Prepare Payload
    const simulatedHour = document.getElementById('time_slider').value;
    const appliancePayload = {
        sim_hour: parseInt(simulatedHour),
        ac: getApplianceData('ac'),
        fan: getApplianceData('fan'),
        light: getApplianceData('light'),
        wm: getApplianceData('wm'),
        tv: getApplianceData('tv')
    };

    const statusMsg = document.getElementById('status-msg');
    statusMsg.innerText = "Processing energy audit...";

    try {
        const response = await fetch('/get_status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appliancePayload)
        });

        const data = await response.json();

        if (data.error) {
            statusMsg.innerText = "Error: " + data.error;
            return;
        }

        // 2. Night Mode Theme Toggle
        if (data.is_night) {
            document.body.classList.add('night-mode');
        } else {
            document.body.classList.remove('night-mode');
        }

        // 3. Update Text Data
        document.getElementById('gen-val').innerText = data.generation_watts;
        document.getElementById('savings-val').innerText = data.savings;
        document.getElementById('weather-temp').innerText = `${data.temp}°C`;
        document.getElementById('weather-desc').innerText = `Kochi: ${data.clouds}% Clouds`;
        document.getElementById('cloud-val').innerText = `${data.clouds}%`;
        document.getElementById('load-val').innerText = `${data.consumption_watts} W`;
        statusMsg.innerText = `Status: ${data.status} | AI: ${data.advice}`;

        // 4. Update Status Badge
        const gridStatus = document.getElementById('grid-status');
        gridStatus.innerText = data.is_solar ? "SOLAR ONLY" : "GRID ACTIVE";
        gridStatus.className = data.is_solar ? "badge bg-success" : "badge bg-danger";

        // 5. Update the Graph
        updatePredictionChart(data.clouds);

    } catch (err) {
        console.error("Fetch error:", err);
        statusMsg.innerText = "Check if Python server is running!";
    }
}
function calculateNightMetrics() {
    // 1. Get Meter Readings
    const morning = parseFloat(document.getElementById('meter_morning').value) || 0;
    const evening = parseFloat(document.getElementById('meter_evening').value) || 0;

    // 2. Fetch constants
    const estYield = 18.5; // This is a fixed daily estimate for a 3kW plant
    const consumption = Math.max(0, evening - morning);
    const excess = Math.max(0, estYield - consumption);

    // 3. Update UI
    document.getElementById('night-yield').innerText = estYield;
    document.getElementById('night-used').innerText = consumption.toFixed(1);
    document.getElementById('night-excess').innerText = excess.toFixed(1);

    // 4. "What Can I Run" Logic
    const applianceWatts = parseFloat(document.getElementById('check_appliance').value);
    const hours = parseFloat(document.getElementById('check_hours').value);
    const requiredKWh = (applianceWatts * hours) / 1000;

    const resultBox = document.getElementById('run-result');
    if (excess >= requiredKWh) {
        resultBox.className = "mt-3 p-2 rounded text-center small fw-bold bg-success text-white";
        resultBox.innerText = `✅ Success: You have ${excess.toFixed(1)}kWh available. This uses ${requiredKWh.toFixed(1)}kWh.`;
    } else {
        resultBox.className = "mt-3 p-2 rounded text-center small fw-bold bg-danger text-white";
        resultBox.innerText = `❌ Warning: This requires ${requiredKWh.toFixed(1)}kWh, but you only have ${excess.toFixed(1)}kWh excess.`;
    }
}

// Initial run to populate the dashboard on page load
window.onload = updateSimulation;