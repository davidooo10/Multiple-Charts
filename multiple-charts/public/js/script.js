// =============================
// Load Google Charts library
// =============================
// We load the 'corechart' package which allows us to create Pie and Column (Bar) charts
google.charts.load('current', { packages: ['corechart'] });

// =============================
// DOM Elements
// =============================
// Get references to important HTML elements that we'll manipulate
const chartTypeSelect = document.getElementById('chartType'); // Dropdown to choose chart type
const formContainer = document.getElementById('formContainer'); // Container to hold dynamic input forms
const chartContainer = document.getElementById('chartContainer'); // Container where chart will be drawn
const generateBtn = document.getElementById('generateBtn'); // Button to start generating input form

// =============================
// Event: Generate Chart Button
// =============================
// When user clicks "Generate Chart", determine which chart type is selected
// and call renderForm to display the corresponding input fields
generateBtn.addEventListener('click', () => {
  const type = chartTypeSelect.value; // Get current value of chart type dropdown
  renderForm(type); // Render form inputs dynamically
});

// =============================
// Render dynamic input form
// =============================
// This function generates inputs based on chart type (pie or bar)
function renderForm(type) {
  formContainer.innerHTML = ''; // Clear previous form contents to avoid duplication

  // -----------------------------
  // Chart Title (common to all charts)
  // -----------------------------
  const titleInput = createInput('Title:', 'chartTitle'); // Create text input for chart title
  formContainer.appendChild(titleInput); // Add title input to the form

  // -----------------------------
  // Pie Chart Inputs
  // -----------------------------
  if (type === 'pie') {
    // Input: number of sectors
    const sectorCountInput = createNumberInput('Number of sectors (2–6):', 'numSectors', 2, 6);
    formContainer.appendChild(sectorCountInput);

    // Input: total value of all sectors
    const totalValueInput = createNumberInput('Total value of all sectors:', 'totalValue', 10, 10000);
    formContainer.appendChild(totalValueInput);

    // Button to generate sector input fields dynamically
    const sectorBtn = document.createElement('button');
    sectorBtn.textContent = 'Add Sector Inputs';
    sectorBtn.addEventListener('click', () => {
      clearErrors(); // Remove previous error messages

      // -----------------------------
      // Get values from user inputs
      // -----------------------------
      const numSectors = parseInt(document.getElementById('numSectors').value);
      const totalValue = parseFloat(document.getElementById('totalValue').value);
      const chartTitle = document.getElementById('chartTitle').value.trim();

      let valid = true; // Flag to track if inputs are valid

      // -----------------------------
      // Validate Inputs
      // -----------------------------
      if (isNaN(numSectors) || numSectors < 2 || numSectors > 6) {
        showError('numSectors', 'Enter 2–6 sectors.');
        valid = false;
      }
      if (isNaN(totalValue) || totalValue <= 0) {
        showError('totalValue', 'Enter a valid total value.');
        valid = false;
      }
      if (!chartTitle) {
        showError('chartTitle', 'Enter a chart title.');
        valid = false;
      }

      if (!valid) return; // Stop execution if any input is invalid

      // -----------------------------
      // Generate input fields for each sector
      // -----------------------------
      createSectorInputs();

      // -----------------------------
      // Disable Add button and initial inputs to prevent re-clicking
      // -----------------------------
      sectorBtn.disabled = true;
      disableFields(['numSectors','totalValue','chartTitle']);
    });
    formContainer.appendChild(sectorBtn);
  }

  // -----------------------------
  // Bar Chart Inputs
  // -----------------------------
  else if (type === 'bar') {
    // Input: number of bars
    const barCountInput = createNumberInput('Number of bars (2–6):', 'numBars', 2, 6);
    // Input: gridline interval for Y-axis
    const gridInput = createNumberInput('Gridline interval (10–100):', 'gridInterval', 10, 100);
    // Input: Y-axis label
    const yLabelInput = createInput('Y-axis Label:', 'yLabel');

    formContainer.appendChild(barCountInput);
    formContainer.appendChild(gridInput);
    formContainer.appendChild(yLabelInput);

    // Button to generate bar input fields dynamically
    const barBtn = document.createElement('button');
    barBtn.textContent = 'Add Bar Inputs';
    barBtn.addEventListener('click', () => {
      clearErrors(); // Remove previous error messages

      // -----------------------------
      // Get values from user inputs
      // -----------------------------
      const numBars = parseInt(document.getElementById('numBars').value);
      const gridInterval = parseInt(document.getElementById('gridInterval').value);
      const yLabel = document.getElementById('yLabel').value.trim();
      const chartTitle = document.getElementById('chartTitle').value.trim();

      let valid = true;

      // -----------------------------
      // Validate Inputs
      // -----------------------------
      if (isNaN(numBars) || numBars < 2 || numBars > 6) {
        showError('numBars', 'Enter 2–6 bars.');
        valid = false;
      }
      if (isNaN(gridInterval) || gridInterval < 10 || gridInterval > 100) {
        showError('gridInterval', 'Enter valid grid interval (10–100).');
        valid = false;
      }
      if (!yLabel) {
        showError('yLabel', 'Enter a Y-axis label.');
        valid = false;
      }
      if (!chartTitle) {
        showError('chartTitle', 'Enter a chart title.');
        valid = false;
      }

      if (!valid) return; // Stop execution if inputs are invalid

      // -----------------------------
      // Generate input fields for each bar
      // -----------------------------
      createBarInputs();

      // -----------------------------
      // Disable Add button and initial inputs
      // -----------------------------
      barBtn.disabled = true;
      disableFields(['numBars','gridInterval','yLabel','chartTitle']);
    });
    formContainer.appendChild(barBtn);
  }
}

// =============================
// Helper Function: Create text input
// =============================
function createInput(labelText, id) {
  const div = document.createElement('div');
  div.className = 'input-group';
  const label = document.createElement('label');
  label.textContent = labelText;
  const input = document.createElement('input');
  input.type = 'text';
  input.id = id;
  div.appendChild(label);
  div.appendChild(input);
  return div;
}

// =============================
// Helper Function: Create number input with min/max enforcement
// =============================
function createNumberInput(labelText, id, min, max) {
  const div = document.createElement('div');
  div.className = 'input-group';
  const label = document.createElement('label');
  label.textContent = labelText;
  const input = document.createElement('input');
  input.type = 'number';
  input.id = id;
  input.min = min;
  input.max = max;

  // Dynamically enforce maximum value
  input.addEventListener('input', () => { 
    if (parseFloat(input.value) > max) input.value = max; 
  });

  div.appendChild(label);
  div.appendChild(input);
  return div;
}

// =============================
// Helper Function: Show inline error for a specific input
// =============================
function showError(id, msg) {
  const input = document.getElementById(id);
  input.style.border = '2px solid red'; // Highlight input in red
  let error = document.createElement('small');
  error.className = 'error';
  error.textContent = msg;

  // Add error message only if it doesn't already exist
  if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error')) {
    input.parentNode.appendChild(error);
  }
}

// =============================
// Helper Function: Clear all errors
// =============================
function clearErrors() {
  document.querySelectorAll('.error').forEach(e => e.remove()); // Remove all error messages
  document.querySelectorAll('input').forEach(i => i.style.border = ''); // Reset input borders
}

// =============================
// Helper Function: Disable multiple fields by ID
// =============================
function disableFields(ids) {
  ids.forEach(id => document.getElementById(id).disabled = true);
}

// =============================
// Create dynamic inputs for Pie chart sectors
// =============================
function createSectorInputs() {
  const num = parseInt(document.getElementById('numSectors').value);
  const total = parseFloat(document.getElementById('totalValue').value);
  const title = document.getElementById('chartTitle').value;

  const inputArea = document.createElement('div');
  inputArea.id = 'sectorInputs';
  formContainer.appendChild(inputArea);
  inputArea.innerHTML = ''; // Clear previous sector inputs

  // Generate input fields for each sector
  for (let i = 1; i <= num; i++) {
    const div = document.createElement('div');
    const label = createInput(`Label for sector ${i}:`, `sectorLabel${i}`);
    div.appendChild(label);

    if (i < num) {
      const value = createNumberInput(`Value for sector ${i}:`, `sectorValue${i}`, 1, total);
      div.appendChild(value);
    } else {
      // Last sector value is auto-calculated
      const note = document.createElement('p');
      note.textContent = 'Last sector value will be auto-calculated.';
      div.appendChild(note);
    }
    inputArea.appendChild(div);
  }

  // Button to draw the Pie chart
  const drawBtn = document.createElement('button');
  drawBtn.textContent = 'Draw Pie Chart';
  drawBtn.addEventListener('click', () => drawPieChart(title, total, num));
  inputArea.appendChild(drawBtn);
}

// =============================
// Draw Pie chart using Google Charts
// =============================
function drawPieChart(title, total, num) {
  google.charts.setOnLoadCallback(() => {
    const dataArr = [['Label', 'Value']];
    let sum = 0;

    // Collect values from inputs
    for (let i = 1; i <= num; i++) {
      const label = document.getElementById(`sectorLabel${i}`).value;
      if (i < num) {
        const value = parseFloat(document.getElementById(`sectorValue${i}`).value);
        sum += value;
        dataArr.push([label, value]);
      } else {
        // Last sector value = total - sum of previous
        dataArr.push([label, total - sum]);
      }
    }

    const data = google.visualization.arrayToDataTable(dataArr);

    const options = {
      title,
      width: 500,
      height: 400,
      colors: generateColors(num), // Assign colors
      legend: { position: 'right' },
      chartArea: { left: '10%', top: 80, width: '80%', height: '70%' }
    };

    new google.visualization.PieChart(chartContainer).draw(data, options);
  });
}

// =============================
// Create dynamic inputs for Bar chart
// =============================
function createBarInputs() {
  const num = parseInt(document.getElementById('numBars').value);
  const grid = parseInt(document.getElementById('gridInterval').value);
  const yLabel = document.getElementById('yLabel').value;
  const title = document.getElementById('chartTitle').value;

  const inputArea = document.createElement('div');
  inputArea.id = 'barInputs';
  formContainer.appendChild(inputArea);
  inputArea.innerHTML = ''; // Clear previous bar inputs

  // Generate label/value inputs for each bar
  for (let i = 1; i <= num; i++) {
    inputArea.appendChild(createInput(`Label for bar ${i}:`, `barLabel${i}`));
    inputArea.appendChild(createNumberInput(`Value for bar ${i} (max 400):`, `barValue${i}`, 1, 400));
  }

  // Button to draw the Bar chart
  const drawBtn = document.createElement('button');
  drawBtn.textContent = 'Draw Bar Chart';
  drawBtn.addEventListener('click', () => drawBarChart(title, yLabel, grid, num));
  inputArea.appendChild(drawBtn);
}

// =============================
// Draw Bar chart using Google Charts
// =============================
function drawBarChart(title, yLabel, gridInterval, num) {
  google.charts.setOnLoadCallback(() => {
    const dataArr = [['Label', 'Value', { role: 'style' }]];
    const colors = generateColors(num);
    let maxValue = 0;

    // Collect values from inputs and find maximum
    for (let i = 1; i <= num; i++) {
      const label = document.getElementById(`barLabel${i}`).value;
      const value = parseFloat(document.getElementById(`barValue${i}`).value);

      // Validate values
      if (isNaN(value) || value < 0) return showError(`barValue${i}`, 'Enter positive number');
      if (value > 400) return showError(`barValue${i}`, 'Max value 400');

      if (value > maxValue) maxValue = value;

      dataArr.push([label, value, `color: ${colors[i - 1]}`]);
    }

    const data = google.visualization.arrayToDataTable(dataArr);

    // Round maximum Y-axis value up to nearest multiple of gridInterval
    const roundedMax = Math.ceil(maxValue / gridInterval) * gridInterval;

    const options = {
      title,
      width: 800,
      height: 500,
      hAxis: { title: 'Bars' },
      vAxis: {
        title: yLabel,
        viewWindow: { min: 0, max: roundedMax },
        gridlines: { count: Math.floor(roundedMax / gridInterval) + 1 },
        ticks: Array.from({ length: roundedMax / gridInterval + 1 }, (_, i) => i * gridInterval)
      },
      legend: { position: 'none' },
      bar: { groupWidth: '70%' }
    };

    new google.visualization.ColumnChart(chartContainer).draw(data, options);
  });
}

// =============================
// Generate a color palette for charts
// =============================
function generateColors(num) {
  const presetColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#A142F4', '#F46D43'];
  return presetColors.slice(0, num); // Return only as many colors as needed
}