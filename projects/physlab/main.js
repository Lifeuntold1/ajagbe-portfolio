let myChart = null;

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    generateGraph();
});

function generateGraph() {
    // 1. Get Inputs
    const rawData = document.getElementById('dataInput').value;
    const title = document.getElementById('chartTitle').value || "Physics Experiment";
    const xLabel = document.getElementById('xLabel').value || "X-Axis";
    const yLabel = document.getElementById('yLabel').value || "Y-Axis";

    // 2. Parse CSV
    const lines = rawData.trim().split('\n');
    let xValues = [];
    let yValues = [];
    let scatterData = [];

    // Clear Table
    const tableBody = document.querySelector('#pointsTable tbody');
    tableBody.innerHTML = "";

    lines.forEach(line => {
        const parts = line.split(',');
        if (parts.length === 2) {
            const x = parseFloat(parts[0].trim());
            const y = parseFloat(parts[1].trim());
            if (!isNaN(x) && !isNaN(y)) {
                xValues.push(x);
                yValues.push(y);
                scatterData.push({ x: x, y: y });

                // Add to Table
                const row = `<tr><td>${x}</td><td>${y}</td></tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            }
        }
    });

    // 3. Regression Logic
    const n = xValues.length;
    if (n > 1) {
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (let i = 0; i < n; i++) {
            sumX += xValues[i];
            sumY += yValues[i];
            sumXY += xValues[i] * yValues[i];
            sumXX += xValues[i] * xValues[i];
        }

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Line Coordinates (Start & End)
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);

        // Extend line slightly beyond points for visual clarity
        const padding = (maxX - minX) * 0.1;
        const lineStart = minX - padding;
        const lineEnd = maxX + padding;

        const lineData = [
            { x: lineStart, y: slope * lineStart + intercept },
            { x: lineEnd, y: slope * lineEnd + intercept }
        ];

        // Update UI
        document.getElementById('countVal').innerText = n;
        document.getElementById('slopeVal').innerText = slope.toFixed(4);
        document.getElementById('interceptVal').innerText = intercept.toFixed(4);

        renderChart(title, xLabel, yLabel, scatterData, lineData);
    } else {
        alert("Please enter at least 2 valid data points.");
    }
}

function renderChart(title, xLabel, yLabel, scatterData, lineData) {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (myChart) myChart.destroy();

    // Chart Configuration
    myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Measured Data',
                    data: scatterData,
                    backgroundColor: 'rgba(0, 0, 255, 0.7)', // Blue dots
                    borderColor: 'blue',
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    type: 'line',
                    label: 'Line of Best Fit',
                    data: lineData,
                    borderColor: 'red',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: 20 },
            plugins: {
                title: { display: true, text: title, font: { size: 18 }, color: '#000' },
                legend: { labels: { color: '#000' } },
                // Custom plugin to white-out background on export
                customCanvasBackgroundColor: { color: 'white' }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: { display: true, text: xLabel, color: '#000', font: { weight: 'bold' } },
                    grid: { color: '#ccc' }, // Major grid lines
                    ticks: { color: '#000' }
                },
                y: {
                    title: { display: true, text: yLabel, color: '#000', font: { weight: 'bold' } },
                    grid: { color: '#ccc' },
                    ticks: { color: '#000' }
                }
            }
        },
        // Plugin to calculate Scale info after rendering
        plugins: [{
            id: 'scaleCalculator',
            afterLayout: (chart) => {
                const xScale = chart.scales.x;
                const yScale = chart.scales.y;

                // Calculate steps
                // Chart.js separates ticks. We assume grid lines match ticks.
                // NOTE: This is an estimation for the student.

                const xStep = (xScale.max - xScale.min) / (xScale.ticks.length - 1);
                const yStep = (yScale.max - yScale.min) / (yScale.ticks.length - 1);

                document.getElementById('scaleDisplay').innerHTML =
                    `X-Axis: ${xStep.toPrecision(2)} units/div | Y-Axis: ${yStep.toPrecision(2)} units/div`;
            },
            // Plugin to draw white background
            id: 'customCanvasBackgroundColor',
            beforeDraw: (chart, args, options) => {
                const { ctx } = chart;
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = options.color || '#ffffff';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        }]
    });
}

function clearData() {
    document.getElementById('dataInput').value = "";
    document.getElementById('chartTitle').value = "";
    document.getElementById('pointsTable').querySelector('tbody').innerHTML = "";
    document.getElementById('scaleDisplay').innerText = "Waiting...";
    if (myChart) myChart.destroy();
}

function exportImage() {
    const canvas = document.getElementById('myChart');
    const link = document.createElement('a');
    link.download = 'physlab_graph.png'; // Meaningful filename
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
}