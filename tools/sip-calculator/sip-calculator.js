/**
 * SIP Calculator Tool
 * Calculate returns from Systematic Investment Plans
 * Sprint 3: Added input validation framework and secure storage
 * 
 * @file tools/sip-calculator/sip-calculator.js
 */

import { copyToClipboard } from '/shared/js/clipboard.js';
import { downloadFile } from '/shared/js/download.js';
import { formatCurrency, formatNumber, formatPercentage } from '/shared/js/utils.js';
import { Validator } from '/shared/js/validator.js';
import { secureStorage } from '/shared/js/secure-storage.js';

// DOM Elements
let elements = {};

// State
const state = {
  calculationResults: null,
  chartInstance: null
};

/**
 * Initialize the SIP Calculator Tool
 */
function init() {
  console.log('SIP Calculator tool initializing...');
  
  // Cache DOM elements
  cacheElements();
  
  // Attach event listeners
  attachEventListeners();
  
  console.log('SIP Calculator tool ready');
}

/**
 * Cache DOM element references
 */
function cacheElements() {
  elements = {
    // Form elements
    form: document.getElementById('sip-form'),
    monthlyInvestment: document.getElementById('monthly-investment'),
    returnRate: document.getElementById('return-rate'),
    duration: document.getElementById('duration'),
    stepupRate: document.getElementById('stepup-rate'),
    calculateBtn: document.getElementById('calculate-btn'),
    resetBtn: document.getElementById('reset-btn'),
    formErrors: document.getElementById('form-errors'),
    
    // Results section
    resultsSection: document.getElementById('results-section'),
    totalInvestment: document.getElementById('total-investment'),
    expectedReturns: document.getElementById('expected-returns'),
    maturityValue: document.getElementById('maturity-value'),
    absoluteReturn: document.getElementById('absolute-return'),
    
    // Table
    breakdownTbody: document.getElementById('breakdown-tbody'),
    
    // Chart
    chartCanvas: document.getElementById('sip-chart'),
    chartDataTable: document.getElementById('chart-data-table'),
    
    // Export buttons
    copyResultsBtn: document.getElementById('copy-results-btn'),
    downloadCsvBtn: document.getElementById('download-csv-btn')
  };
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
  elements.form.addEventListener('submit', handleFormSubmit);
  elements.form.addEventListener('reset', handleFormReset);
  elements.copyResultsBtn.addEventListener('click', handleCopyResults);
  elements.downloadCsvBtn.addEventListener('click', handleDownloadCSV);
  
  // Initialize help modal
  initHelpModal();
}

/**
 * Handle form submission
 * Sprint 3: Made async for secure storage
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  // Clear previous errors
  clearErrors();
  
  // Get form values
  const inputs = getFormInputs();
  
  // Validate inputs
  const validationErrors = validateInputs(inputs);
  
  if (validationErrors.length > 0) {
    showErrors(validationErrors);
    return;
  }
  
  // Calculate SIP
  const startTime = performance.now();
  const results = calculateSIP(
    inputs.monthlyInvestment,
    inputs.returnRate,
    inputs.duration,
    inputs.stepupRate
  );
  const endTime = performance.now();
  const calculationTime = Math.round(endTime - startTime);
  
  console.log(`SIP calculation completed in ${calculationTime}ms`);
  
  // Store results in state
  state.calculationResults = results;
  
  // Sprint 3: Store encrypted calculation history
  try {
    await secureStorage.setSecure('sip-last-calculation', {
      timestamp: new Date().toISOString(),
      inputs: inputs,
      results: {
        totalInvestment: results.totalInvestment,
        expectedReturns: results.expectedReturns,
        maturityValue: results.maturityValue,
        absoluteReturn: results.absoluteReturn
      }
    });
    console.debug('[SIP] Calculation saved securely');
  } catch (error) {
    console.warn('[SIP] Failed to save calculation securely:', error);
    // Continue without storing - not critical
  }
  
  // Display results
  displayResults(results);
  
  // Show results section
  elements.resultsSection.classList.remove('hidden');
  
  // Scroll to results
  elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  // Announce to screen readers
  announceResults(results);
}

/**
 * Handle form reset
 */
function handleFormReset() {
  clearErrors();
  elements.resultsSection.classList.add('hidden');
  state.calculationResults = null;
  
  // Destroy chart if exists
  if (state.chartInstance) {
    state.chartInstance.destroy();
    state.chartInstance = null;
  }
}

/**
 * Get form input values
 */
function getFormInputs() {
  return {
    monthlyInvestment: parseFloat(elements.monthlyInvestment.value) || 0,
    returnRate: parseFloat(elements.returnRate.value) || 0,
    duration: parseInt(elements.duration.value, 10) || 0,
    stepupRate: parseFloat(elements.stepupRate.value) || 0
  };
}

/**
 * Validate form inputs using Sprint 3 Validator framework
 */
function validateInputs(inputs) {
  const errors = [];
  let isValid = true;
  
  // Monthly Investment validation
  const amountResult = Validator.isPositiveNumber(
    inputs.monthlyInvestment, 
    500, 
    10000000
  );
  if (!amountResult.valid) {
    errors.push(`Monthly Investment: ${amountResult.error}`);
    Validator.showValidationError(elements.monthlyInvestment, amountResult.error);
    isValid = false;
  } else {
    Validator.clearValidationError(elements.monthlyInvestment);
  }
  
  // Return Rate validation
  const rateResult = Validator.isPositiveNumber(
    inputs.returnRate,
    0.1,
    30
  );
  if (!rateResult.valid) {
    errors.push(`Return Rate: ${rateResult.error}`);
    Validator.showValidationError(elements.returnRate, rateResult.error);
    isValid = false;
  } else {
    Validator.clearValidationError(elements.returnRate);
  }
  
  // Duration validation
  const durationResult = Validator.isInteger(
    inputs.duration,
    1,
    50
  );
  if (!durationResult.valid) {
    errors.push(`Duration: ${durationResult.error}`);
    Validator.showValidationError(elements.duration, durationResult.error);
    isValid = false;
  } else {
    Validator.clearValidationError(elements.duration);
  }
  
  // Step-up Rate validation (optional, can be 0)
  if (inputs.stepupRate !== undefined && inputs.stepupRate !== null && inputs.stepupRate !== '') {
    const stepupResult = Validator.isPositiveNumber(
      inputs.stepupRate,
      -0.1, // Allow 0
      50
    );
    if (!stepupResult.valid) {
      errors.push(`Step-up Rate: ${stepupResult.error}`);
      Validator.showValidationError(elements.stepupRate, stepupResult.error);
      isValid = false;
    } else {
      Validator.clearValidationError(elements.stepupRate);
    }
  }
  
  return errors;
}

/**
 * Calculate SIP returns with optional step-up
 * 
 * @param {number} monthlyInvestment - Monthly SIP amount (INR)
 * @param {number} annualReturnRate - Expected return rate (percentage)
 * @param {number} years - Investment duration (years)
 * @param {number} stepUpRate - Annual step-up rate (percentage, default 0)
 * @returns {Object} Calculation results
 */
function calculateSIP(monthlyInvestment, annualReturnRate, years, stepUpRate = 0) {
  const monthlyRate = annualReturnRate / 12 / 100;
  const totalMonths = years * 12;
  
  let totalInvestment = 0;
  let currentValue = 0;
  let currentMonthlyInvestment = monthlyInvestment;
  
  const yearlyData = [];
  let yearlyInvestment = 0;
  
  for (let month = 1; month <= totalMonths; month++) {
    // Apply step-up at the start of each year (except first year)
    if (month > 12 && (month - 1) % 12 === 0 && stepUpRate > 0) {
      currentMonthlyInvestment *= (1 + stepUpRate / 100);
    }
    
    // Add monthly investment
    totalInvestment += currentMonthlyInvestment;
    yearlyInvestment += currentMonthlyInvestment;
    
    // Calculate future value with compound interest
    // FV formula: Previous balance grows, then add new investment
    currentValue = currentValue * (1 + monthlyRate) + currentMonthlyInvestment;
    
    // Store year-end data
    if (month % 12 === 0 || month === totalMonths) {
      yearlyData.push({
        year: Math.ceil(month / 12),
        yearlyInvestment: Math.round(yearlyInvestment),
        totalInvestment: Math.round(totalInvestment),
        value: Math.round(currentValue),
        returns: Math.round(currentValue - totalInvestment)
      });
      
      // Reset yearly investment counter
      yearlyInvestment = 0;
    }
  }
  
  const finalTotalInvestment = Math.round(totalInvestment);
  const finalMaturityValue = Math.round(currentValue);
  const finalExpectedReturns = Math.round(currentValue - totalInvestment);
  const absoluteReturn = ((finalMaturityValue / finalTotalInvestment - 1) * 100);
  
  return {
    totalInvestment: finalTotalInvestment,
    maturityValue: finalMaturityValue,
    expectedReturns: finalExpectedReturns,
    absoluteReturn: absoluteReturn,
    yearlyData: yearlyData,
    inputs: {
      monthlyInvestment,
      annualReturnRate,
      years,
      stepUpRate
    }
  };
}

/**
 * Display calculation results
 */
function displayResults(results) {
  // Update summary cards
  elements.totalInvestment.textContent = formatCurrency(results.totalInvestment);
  elements.expectedReturns.textContent = formatCurrency(results.expectedReturns);
  elements.maturityValue.textContent = formatCurrency(results.maturityValue);
  elements.absoluteReturn.textContent = formatPercentage(results.absoluteReturn, 2);
  
  // Generate table
  generateBreakdownTable(results.yearlyData);
  
  // Generate chart
  renderChart(results.yearlyData);
  
  // Update accessible data table
  updateChartDataTable(results.yearlyData);
}

/**
 * Generate year-wise breakdown table
 */
function generateBreakdownTable(yearlyData) {
  const tbody = elements.breakdownTbody;
  tbody.innerHTML = '';
  
  yearlyData.forEach(row => {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
      <td>${row.year}</td>
      <td>${formatCurrency(row.yearlyInvestment)}</td>
      <td>${formatCurrency(row.totalInvestment)}</td>
      <td>${formatCurrency(row.value)}</td>
      <td>${formatCurrency(row.returns)}</td>
    `;
    
    tbody.appendChild(tr);
  });
  
  // Add total row
  const lastRow = yearlyData[yearlyData.length - 1];
  const totalRow = document.createElement('tr');
  totalRow.innerHTML = `
    <td><strong>Total</strong></td>
    <td><strong>${formatCurrency(lastRow.totalInvestment)}</strong></td>
    <td>-</td>
    <td><strong>${formatCurrency(lastRow.value)}</strong></td>
    <td><strong>${formatCurrency(lastRow.returns)}</strong></td>
  `;
  tbody.appendChild(totalRow);
}

/**
 * Render chart using Chart.js
 */
function renderChart(yearlyData) {
  // Ensure Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.error('Chart.js library not loaded');
    showErrorToast('Chart library not available. Please refresh the page.');
    return;
  }
  
  // Destroy existing chart if any
  if (state.chartInstance) {
    state.chartInstance.destroy();
  }
  
  const ctx = elements.chartCanvas.getContext('2d');
  
  const labels = yearlyData.map(d => `Year ${d.year}`);
  const investmentData = yearlyData.map(d => d.totalInvestment);
  const valueData = yearlyData.map(d => d.value);
  
  state.chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Total Investment',
          data: investmentData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5
        },
        {
          label: 'Expected Value',
          data: valueData,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.parsed.y;
              return `${context.dataset.label}: ${formatCurrency(value)}`;
            }
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 13
          },
          bodyFont: {
            size: 12
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            }
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₹' + formatNumber(value);
            },
            font: {
              size: 11
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    }
  });
}

/**
 * Update accessible data table for screen readers
 */
function updateChartDataTable(yearlyData) {
  const tbody = elements.chartDataTable;
  tbody.innerHTML = '';
  
  yearlyData.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <th scope="row">Year ${row.year}</th>
      <td>${formatCurrency(row.totalInvestment)}</td>
      <td>${formatCurrency(row.value)}</td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Handle copy results to clipboard
 */
async function handleCopyResults() {
  if (!state.calculationResults) return;
  
  const text = generateResultsText(state.calculationResults);
  const success = await copyToClipboard(text, false);
  
  if (success) {
    showSuccessToast('Results copied to clipboard');
  } else {
    showErrorToast('Failed to copy results');
  }
}

/**
 * Generate text representation of results
 */
function generateResultsText(results) {
  const { inputs, totalInvestment, expectedReturns, maturityValue, absoluteReturn, yearlyData } = results;
  
  let text = '═══ SIP CALCULATION RESULTS ═══\n\n';
  
  text += '📊 INPUT PARAMETERS:\n';
  text += `Monthly Investment: ${formatCurrency(inputs.monthlyInvestment)}\n`;
  text += `Expected Return: ${inputs.annualReturnRate}% p.a.\n`;
  text += `Duration: ${inputs.years} years\n`;
  if (inputs.stepUpRate > 0) {
    text += `Annual Step-Up: ${inputs.stepUpRate}%\n`;
  }
  text += '\n';
  
  text += '💰 SUMMARY:\n';
  text += `Total Investment: ${formatCurrency(totalInvestment)}\n`;
  text += `Expected Returns: ${formatCurrency(expectedReturns)}\n`;
  text += `Maturity Value: ${formatCurrency(maturityValue)}\n`;
  text += `Absolute Return: ${formatPercentage(absoluteReturn, 2)}\n`;
  text += '\n';
  
  text += '📅 YEAR-WISE BREAKDOWN:\n';
  text += 'Year | Yearly Inv. | Total Inv. | Value | Returns\n';
  text += '─────┼─────────────┼────────────┼───────┼────────\n';
  
  yearlyData.forEach(row => {
    text += `${String(row.year).padStart(4)} | `;
    text += `${formatCurrency(row.yearlyInvestment).padStart(11)} | `;
    text += `${formatCurrency(row.totalInvestment).padStart(10)} | `;
    text += `${formatCurrency(row.value).padStart(5)} | `;
    text += `${formatCurrency(row.returns)}\n`;
  });
  
  return text;
}

/**
 * Handle download results as CSV
 */
function handleDownloadCSV() {
  if (!state.calculationResults) return;
  
  const csv = generateCSV(state.calculationResults);
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `sip-calculation-${timestamp}.csv`;
  
  const success = downloadFile(csv, filename, 'text/csv', false);
  
  if (success) {
    showSuccessToast(`Downloaded ${filename}`);
  } else {
    showErrorToast('Download failed');
  }
}

/**
 * Generate CSV content
 */
function generateCSV(results) {
  const { inputs, totalInvestment, expectedReturns, maturityValue, absoluteReturn, yearlyData } = results;
  
  let csv = 'SIP CALCULATION RESULTS\n\n';
  
  csv += 'INPUT PARAMETERS\n';
  csv += `Monthly Investment,${inputs.monthlyInvestment}\n`;
  csv += `Expected Annual Return (%),${inputs.annualReturnRate}\n`;
  csv += `Duration (Years),${inputs.years}\n`;
  csv += `Annual Step-Up Rate (%),${inputs.stepUpRate}\n\n`;
  
  csv += 'SUMMARY\n';
  csv += `Total Investment,${totalInvestment}\n`;
  csv += `Expected Returns,${expectedReturns}\n`;
  csv += `Maturity Value,${maturityValue}\n`;
  csv += `Absolute Return (%),${absoluteReturn.toFixed(2)}\n\n`;
  
  csv += 'YEAR-WISE BREAKDOWN\n';
  csv += 'Year,Yearly Investment,Total Investment,Expected Value,Returns\n';
  
  yearlyData.forEach(row => {
    csv += `${row.year},${row.yearlyInvestment},${row.totalInvestment},${row.value},${row.returns}\n`;
  });
  
  return csv;
}

/**
 * Show validation errors
 */
function showErrors(errors) {
  elements.formErrors.innerHTML = errors.map(err => `• ${err}`).join('<br>');
}

/**
 * Clear validation errors
 */
function clearErrors() {
  elements.formErrors.innerHTML = '';
}

/**
 * Announce results to screen readers
 */
function announceResults(results) {
  const announcement = `Calculation complete. Maturity value: ${formatCurrency(results.maturityValue)}. ` +
    `Expected returns: ${formatCurrency(results.expectedReturns)}.`;
  
  // Create temporary live region for announcement
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.className = 'sr-only';
  liveRegion.textContent = announcement;
  
  document.body.appendChild(liveRegion);
  
  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, 3000);
}

/**
 * Show success toast notification
 */
function showSuccessToast(message) {
  console.log('✓', message);
  // Could add a toast notification UI here
}

/**
 * Show error toast notification
 */
function showErrorToast(message) {
  console.error('✕', message);
  // Could add a toast notification UI here
}

/**
 * Initialize Help Modal
 */
function initHelpModal() {
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const helpClose = document.getElementById('help-close');
  const helpOk = document.getElementById('help-ok');
  
  if (!helpBtn || !helpModal) return;
  
  // Open modal
  helpBtn.addEventListener('click', () => {
    helpModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    helpClose.focus();
  });
  
  // Close modal functions
  const closeModal = () => {
    helpModal.classList.add('hidden');
    document.body.style.overflow = '';
    helpBtn.focus();
  };
  
  // Close button
  helpClose.addEventListener('click', closeModal);
  helpOk.addEventListener('click', closeModal);
  
  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !helpModal.classList.contains('hidden')) {
      closeModal();
    }
  });
  
  // Click outside
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
      closeModal();
    }
  });
}

// Export initialization function for router
window.initSipCalculator = init;

// Auto-initialize if loaded directly (not via router)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('sip-calculator')) {
      init();
    }
  });
} else {
  if (window.location.pathname.includes('sip-calculator')) {
    init();
  }
}
