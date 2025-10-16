// Load the Google Charts library and specify that we’ll use the 'corechart' package
google.charts.load('current', { packages: ['corechart'] });

// Get references to key DOM elements from index.html
const chartTypeSelect = document.getElementById('chartType');
const formContainer = document.getElementById('formContainer');
const chartContainer = document.getElementById('chartContainer');
const generateBtn = document.getElementById('generateBtn');

// When user clicks “Generate Chart”, show the correct form (Pie or Bar)
generateBtn.addEventListener('click', () => {
  const type = chartTypeSelect.value; // Get the selected chart type
  renderForm(type); // Generate the corresponding form inputs
});

// =============================
// Render dynamic input form
// =============================
function renderForm(type) {
  formContainer.innerHTML = ''; // Clear any existing form content

  // Create chart title input (common to both chart types)
  const titleInput = createInput('Title:', 'chartTitle');
  formContainer.appendChild(titleInput);

  // ---------- Pie Chart Form ----------
  if (type === 'pie') {
    const sectorCountInput = createNumberInput('Number of sectors (2–6):', 'numSectors', 2, 6);
    formContainer.appendChild(sectorCountInput);

    const totalValueInput = createNumberInput('Total value of all sectors:', 'totalValue', 10, 10000);
    formContainer.appendChild(totalValueInput);

    // Button to create sector inputs (labels and values)
    const sectorBtn = document.createElement('button');
    sectorBtn.textContent = 'Add Sector Inputs';
    sectorBtn.addEventListener('click', () => {
      createSectorInputs(); // Generate inputs for sectors dynamically
      sectorBtn.disabled = true; // Disable the button after click

        // Disable the initial inputs
        document.getElementById('numSectors').disabled = true;
        document.getElementById('totalValue').disabled = true;
        document.getElementById('chartTitle').disabled = true;
    });
    formContainer.appendChild(sectorBtn);
  }

  // ---------- Bar Chart Form ----------
  else if (type === 'bar') {
    const barCountInput = createNumberInput('Number of bars (2–6):', 'numBars', 2, 6);
    const gridInput = createNumberInput('Gridline interval (10–100):', 'gridInterval', 10, 100);
    const yLabelInput = createInput('Y-axis Label:', 'yLabel');
    formContainer.appendChild(barCountInput);
    formContainer.appendChild(gridInput);
    formContainer.appendChild(yLabelInput);

    // Button to create bar inputs (labels and values)
    const barBtn = document.createElement('button');
    barBtn.textContent = 'Add Bar Inputs';
    barBtn.addEventListener('click', () => {
      createBarInputs(); // Generate inputs for bars dynamically
      barBtn.disabled = true;

        document.getElementById('numBars').disabled = true;
        document.getElementById('gridInterval').disabled = true;
        document.getElementById('yLabel').disabled = true;
        document.getElementById('chartTitle').disabled = true;
    });
    formContainer.appendChild(barBtn);
  }
}

// =============================
// Helper functions for creating input elements
// =============================

// Creates a labeled text input (used for titles, labels, axis names)
function createInput(labelText, id) {
  const div = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = labelText;
  const input = document.createElement('input');
  input.type = 'text';
  input.id = id;
  div.appendChild(label);
  div.appendChild(input);
  return div;
}

// Creates a labeled number input with a range (used for numeric fields)
function createNumberInput(labelText, id, min, max) {
  const div = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = labelText;
  const input = document.createElement('input');
  input.type = 'number';
  input.id = id;
  input.min = min;
  input.max = max;

  // Real-time enforcement of the max value
  input.addEventListener('input', () => {
    if (parseFloat(input.value) > max) input.value = max;
  });

  div.appendChild(label);
  div.appendChild(input);
  return div;
}

// =============================
// PIE CHART FORM HANDLING
// =============================
function createSectorInputs() {
  // Get user input for number of sectors and total chart value
  const num = parseInt(document.getElementById('numSectors').value);
  const total = parseFloat(document.getElementById('totalValue').value);
  const title = document.getElementById('chartTitle').value;

  // Validate input range
  if (isNaN(num) || num < 2 || num > 6) return alert('Enter 2–6 sectors.');

  // Create container to hold sector input fields
  const inputArea = document.createElement('div');
  inputArea.id = 'sectorInputs';
  formContainer.appendChild(inputArea);
  inputArea.innerHTML = '';

  // Generate input fields for each sector
  for (let i = 1; i <= num; i++) {
    const div = document.createElement('div');
    const label = createInput(`Label for sector ${i}:`, `sectorLabel${i}`);
    div.appendChild(label);

    if (i < num) {
      // All sectors except the last require a value
      const value = createNumberInput(`Value for sector ${i}:`, `sectorValue${i}`, 1, total);
      div.appendChild(value);
    } else {
      // The last sector value is auto-calculated
      const note = document.createElement('p');
      note.textContent = 'Last sector value will be auto-calculated.';
      div.appendChild(note);
    }
    inputArea.appendChild(div);
  }

  // Button to draw the pie chart
  const drawBtn = document.createElement('button');
  drawBtn.textContent = 'Draw Pie Chart';
  drawBtn.addEventListener('click', () => {
    drawPieChart(title, total, num);
  });
  inputArea.appendChild(drawBtn);
}

// Draw the Pie Chart using Google Charts
function drawPieChart(title, total, num) {
  google.charts.setOnLoadCallback(() => {
    let dataArr = [['Label', 'Value']];
    let sum = 0;

    // Build data array from user inputs
    for (let i = 1; i <= num; i++) {
      const label = document.getElementById(`sectorLabel${i}`).value;
      if (i < num) {
        const value = parseFloat(document.getElementById(`sectorValue${i}`).value);
        sum += value;
        dataArr.push([label, value]);
      } else {
        // Calculate the remaining sector value automatically
        dataArr.push([label, total - sum]);
      }
    }

    // Convert to Google Charts DataTable
    const data = google.visualization.arrayToDataTable(dataArr);

    // Assign unique colors to each sector
    const colorPalette = generateColors(num);

    // Chart display options
    const options = {
      title: title,
      width: 500,
      height: 400,
      colors: colorPalette,
      legend: { position: 'right' },
      chartArea: { left: '10%', top: 80, width: '80%', height: '70%' } // helps keep chart centered
    };

    // Draw the pie chart
    const chart = new google.visualization.PieChart(chartContainer);
    chart.draw(data, options);
  });
}

// =============================
// BAR CHART FORM HANDLING
// =============================
function createBarInputs() {
  // Get basic parameters for the bar chart
  const num = parseInt(document.getElementById('numBars').value);
  const grid = parseInt(document.getElementById('gridInterval').value);
  const yLabel = document.getElementById('yLabel').value;
  const title = document.getElementById('chartTitle').value;

  // Validate range for number of bars
  if (isNaN(num) || num < 2 || num > 6) return alert('Enter 2–6 bars.');

  // Container for bar inputs
  const inputArea = document.createElement('div');
  inputArea.id = 'barInputs';
  formContainer.appendChild(inputArea);
  inputArea.innerHTML = '';

  // Generate label/value inputs for each bar
  for (let i = 1; i <= num; i++) {
    const label = createInput(`Label for bar ${i}:`, `barLabel${i}`);
    const value = createNumberInput(`Value for bar ${i} (max 400):`, `barValue${i}`, 1, 400);
    inputArea.appendChild(label);
    inputArea.appendChild(value);
  }

  // Button to draw bar chart
  const drawBtn = document.createElement('button');
  drawBtn.textContent = 'Draw Bar Chart';
  drawBtn.addEventListener('click', () => {
    drawBarChart(title, yLabel, grid, num);
  });
  inputArea.appendChild(drawBtn);
}

// Draw Bar Chart with unique bar colors and enforced limits
function drawBarChart(title, yLabel, gridInterval, num) {
  google.charts.setOnLoadCallback(() => {
    let dataArr = [['Label', 'Value', { role: 'style' }]];
    const colors = generateColors(num);

    let maxValue = 0; // Track maximum value for setting the Y-axis

    // Collect bar data and validate
    for (let i = 1; i <= num; i++) {
      const label = document.getElementById(`barLabel${i}`).value;
      const value = parseFloat(document.getElementById(`barValue${i}`).value);

      if (isNaN(value) || value < 0) {
        alert(`Bar ${i}: please enter a valid positive number.`);
        return;
      }
      if (value > 400) {
        alert(`Bar ${i}: value exceeds maximum (400).`);
        return;
      }

      if (value > maxValue) maxValue = value;
      dataArr.push([label, value, `color: ${colors[i - 1]}`]);
    }

    // Convert to Google DataTable
    const data = google.visualization.arrayToDataTable(dataArr);

    // Round maxValue up to the next multiple of gridInterval
    const roundedMax = Math.ceil(maxValue / gridInterval) * gridInterval;

    const options = {
      title: title,
      width: 800,
      height: 500,
      hAxis: { title: 'Bars' },
      vAxis: {
        title: yLabel,
        viewWindow: { min: 0, max: roundedMax }, // set min and max
        gridlines: { count: Math.floor(roundedMax / gridInterval) + 1 }, // approximate grid count
        ticks: Array.from({length: roundedMax / gridInterval + 1}, (_, i) => i * gridInterval) // force exact intervals
      },
      legend: { position: 'none' },
      bar: { groupWidth: '70%' },
    };

    // Draw the column chart (vertical bars)
    const chart = new google.visualization.ColumnChart(chartContainer);
    chart.draw(data, options);
  });
}


// =============================
// Color Generator
// =============================
// Returns a list of distinct preset colors (max 6)
function generateColors(num) {
  const presetColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#A142F4', '#F46D43'];
  return presetColors.slice(0, num);
}