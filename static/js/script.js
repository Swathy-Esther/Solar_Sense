async function refreshOptimization() {
    const acWatts = document.getElementById('ac_watts').value;
    const acCount = document.getElementById('ac_count').value;

    const response = await fetch('http://127.0.0.1:5000/get_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ac_watts: parseInt(acWatts),
            ac_count: parseInt(acCount),
            fan_count: 2 // You can add more later
        })
    });

    const data = await response.json();
    
    // Update the UI with the results
    document.getElementById('gen-display').innerText = data.generation_watts + " W";
    document.getElementById('status-text').innerText = data.status;
}