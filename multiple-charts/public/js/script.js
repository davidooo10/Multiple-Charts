// Load Google Charts
google.charts.load('current', { packages: ['corechart'] });

const chartTypeSelect = document.getElementById('chartType');
const formContainer = document.getElementById('formContainer');
const chartContainer = document.getElementById('chartContainer');
const generateBtn = document.getElementById('generateBtn');

generateBtn.addEventListener('click', () => {
  const type = chartTypeSelect.value;
  renderForm(type);
});

// Show different form depending on chart type
function renderForm(type) {
  formContainer.innerHTML = '';

  const titleInput = createInput('Title:', 'chartTitle');
  formContainer.appendChild(titleInput);

  if (type === 'pie') {
    const sectorCountInput = createNumberInput('Number of sectors (2–6):', 'numSectors', 2, 6);
    formContainer.appendChild(sectorCountInput);

    const totalValueInput = createNumberInput('Total value of all sectors:', 'totalValue', 10, 10000);
    formContainer.appendChild(totalValueInput);

    const sectorBtn = document.createElement('button');
    sectorBtn.textContent = 'Add Sector Inputs';
    sectorBtn.addEventListener('click', () => {
      createSectorInputs();
    });
    formContainer.appendChild(sectorBtn);
  } else if (type === 'bar') {
    const barCountInput = createNumberInput('Number of bars (2–6):', 'numBars', 2, 6);
    const gridInput = createNumberInput('Gridline interval (10–100):', 'gridInterval', 10, 100);
    const yLabelInput = createInput('Y-axis Label:', 'yLabel');
    formContainer.appendChild(barCountInput);
    formContainer.appendChild(gridInput);
    formContainer.appendChild(yLabelInput);

    const barBtn = document.createElement('button');
    barBtn.textContent = 'Add Bar Inputs';
    barBtn.addEventListener('click', () => {
      createBarInputs();
    });
    formContainer.appendChild(barBtn);
  }
}

// Helper functions to create inputs
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

function createNumberInput(labelText, id, min, max) {
  const div = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = labelText;
  const input = document.createElement('input');
  input.type = 'number';
  input.id = id;
  input.min = min;
  input.max = max;
  div.appendChild(label);
  div.appendChild(input);
  return div;
}

// PIE CHART FORM HANDLING
function createSectorInputs() {
  const num = parseInt(document.getElementById('numSectors').value);
  const total = parseFloat(document.getElementById('totalValue').value);
  const title = document.getElementById('chartTitle').value;

  if (isNaN(num) || num < 2 || num > 6) return alert('Enter 2–6 sectors.');

  const inputArea = document.createElement('div');
  inputArea.id = 'sectorInputs';
  formContainer.appendChild(inputArea);
  inputArea.innerHTML = '';

  for (let i = 1; i <= num; i++) {
    const div = document.createElement('div');
    const label = createInput(`Label for sector ${i}:`, `sectorLabel${i}`);
    div.appendChild(label);

    if (i < num) {
      const value = createNumberInput(`Value for sector ${i}:`, `sectorValue${i}`, 1, total);
      div.appendChild(value);
    } else {
      const note = document.createElement('p');
      note.textContent = 'Last sector value will be auto-calculated.';
      div.appendChild(note);
    }
    inputArea.appendChild(div);
  }

  const drawBtn = document.createElement('button');
  drawBtn.textContent = 'Draw Pie Chart';
  drawBtn.addEventListener('click', () => {
    drawPieChart(title, total, num);
  });
  inputArea.appendChild(drawBtn);
}

function drawPieChart(title, total, num) {
  google.charts.setOnLoadCallback(() => {
    let dataArr = [['Label', 'Value']];
    let sum = 0;

    for (let i = 1; i <= num; i++) {
      const label = document.getElementById(`sectorLabel${i}`).value;
      if (i < num) {
        const value = parseFloat(document.getElementById(`sectorValue${i}`).value);
        sum += value;
        dataArr.push([label, value]);
      } else {
        dataArr.push([label, total - sum]);
      }
    }

    const data = google.visualization.arrayToDataTable(dataArr);

    const colorPalette = generateColors(num); // unique colors for each sector

    const options = {
      title: title,
      width: 500,
      height: 400,
      colors: colorPalette,
      legend: { position: 'right' },
    };

    const chart = new google.visualization.PieChart(chartContainer);
    chart.draw(data, options);
  });
}

// BAR CHART FORM HANDLING
function createBarInputs() {
  const num = parseInt(document.getElementById('numBars').value);
  const grid = parseInt(document.getElementById('gridInterval').value);
  const yLabel = document.getElementById('yLabel').value;
  const title = document.getElementById('chartTitle').value;

  if (isNaN(num) || num < 2 || num > 6) return alert('Enter 2–6 bars.');

  const inputArea = document.createElement('div');
  inputArea.id = 'barInputs';
  formContainer.appendChild(inputArea);
  inputArea.innerHTML = '';

  for (let i = 1; i <= num; i++) {
    const label = createInput(`Label for bar ${i}:`, `barLabel${i}`);
    const value = createNumberInput(`Value for bar ${i} (max 400):`, `barValue${i}`, 1, 400);
    inputArea.appendChild(label);
    inputArea.appendChild(value);
  }

  const drawBtn = document.createElement('button');
  drawBtn.textContent = 'Draw Bar Chart';
  drawBtn.addEventListener('click', () => {
    drawBarChart(title, yLabel, grid, num);
  });
  inputArea.appendChild(drawBtn);
}

function drawBarChart(title, yLabel, grid, num) {
  google.charts.setOnLoadCallback(() => {
    let dataArr = [['Label', 'Value', { role: 'style' }]]; // Added style column
    const colors = generateColors(num); // Generate unique colors

    for (let i = 1; i <= num; i++) {
      const label = document.getElementById(`barLabel${i}`).value;
      const value = parseFloat(document.getElementById(`barValue${i}`).value);
      dataArr.push([label, value, `color: ${colors[i - 1]}`]);
    }

    const data = google.visualization.arrayToDataTable(dataArr);

    const options = {
      title: title,
      width: 800,
      height: 500,
      hAxis: { title: 'Bars' },
      vAxis: { title: yLabel, gridlines: { count: Math.floor(400 / grid) } },
      legend: { position: 'none' },
      bar: { groupWidth: '70%' },
    };

    const chart = new google.visualization.ColumnChart(chartContainer);
    chart.draw(data, options);
  });
}

// Generate a distinct set of colors
function generateColors(num) {
  const presetColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#A142F4', '#F46D43'];
  return presetColors.slice(0, num);
}
