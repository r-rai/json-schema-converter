/**
 * EMI Calculator - Main Logic
 * Implements EMI calculation with prepayment scenarios
 * Sprint 3: Added input validation framework and secure storage
 * 
 * @file emi-calculator.js
 */

// Theme is handled globally by app.js - no need to import
import { Validator } from '/shared/js/validator.js';
import { secureStorage } from '/shared/js/secure-storage.js';

/**
 * EMI Calculator Application
 * Uses reducer pattern for complex state management
 */
class EMICalculator {
  constructor() {
    this.state = {
      loanAmount: 2500000,
      interestRate: 8.5,
      tenure: 20,
      monthlyEMI: 0,
      totalInterest: 0,
      totalAmount: 0,
      prepayments: [],
      amortizationSchedule: [],
      revisedSchedule: null,
      chartInstance: null
    };
    
    this.init();
  }
  
  /**
   * Initialize the application
   */
  init() {
    this.cacheElements();
    this.attachEventListeners();
    this.loadPersistedState();
    // Theme is handled globally by app.js
  }
  
  /**
   * Cache DOM elements
   */
  cacheElements() {
    // Form inputs
    this.loanAmountInput = document.getElementById('loan-amount');
    this.interestRateInput = document.getElementById('interest-rate');
    this.loanTenureInput = document.getElementById('loan-tenure');
    
    // Buttons
    this.calculateBtn = document.getElementById('calculate-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.togglePrepaymentBtn = document.getElementById('toggle-prepayment-btn');
    this.addPrepaymentBtn = document.getElementById('add-prepayment-btn');
    this.cancelPrepaymentBtn = document.getElementById('cancel-prepayment-btn');
    this.recalculateBtn = document.getElementById('recalculate-btn');
    this.copyTableBtn = document.getElementById('copy-table-btn');
    this.exportCsvBtn = document.getElementById('export-csv-btn');
    this.calculatePrepaymentBtn = document.getElementById('calculate-prepayment-btn');
    
    // Prepayment form (new simple prepayment calculator)
    this.prepaymentAmountNew = document.getElementById('prepayment-amount');
    this.prepaymentMonthNew = document.getElementById('prepayment-month');
    this.prepaymentResults = document.getElementById('prepayment-results');
    
    // Prepayment form (legacy)
    this.prepaymentFormContainer = document.getElementById('prepayment-form-container');
    this.prepaymentType = document.getElementById('prepayment-type');
    this.prepaymentAmount = document.getElementById('prepayment-amount');
    this.prepaymentStart = document.getElementById('prepayment-start');
    this.prepaymentOption = document.querySelector('input[name="prepayment-option"]:checked');
    
    // Sections
    this.resultsSection = document.getElementById('results-section');
    this.prepaymentSection = document.getElementById('prepayment-section');
    this.comparisonSection = document.getElementById('comparison-section');
    this.chartSection = document.getElementById('chart-section');
    this.amortizationSection = document.getElementById('amortization-section');
    
    // Result displays
    this.monthlyEmiDisplay = document.getElementById('monthly-emi');
    this.totalInterestDisplay = document.getElementById('total-interest');
    this.totalAmountDisplay = document.getElementById('total-amount');
    this.principalAmountDisplay = document.getElementById('principal-amount');
    
    // Other containers
    this.prepaymentList = document.getElementById('prepayment-list');
    this.recalculateContainer = document.getElementById('recalculate-container');
    this.amortizationTbody = document.getElementById('amortization-tbody');
    this.amortizationTfoot = document.getElementById('amortization-tfoot');
    this.loanChart = document.getElementById('loan-chart');
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    this.calculateBtn.addEventListener('click', () => this.calculateEMI());
    this.resetBtn.addEventListener('click', () => this.resetForm());
    this.togglePrepaymentBtn.addEventListener('click', () => this.togglePrepaymentForm());
    this.addPrepaymentBtn.addEventListener('click', () => this.addPrepayment());
    this.cancelPrepaymentBtn.addEventListener('click', () => this.togglePrepaymentForm());
    this.recalculateBtn.addEventListener('click', () => this.calculateWithPrepayments());
    this.copyTableBtn.addEventListener('click', () => this.copyTable());
    this.exportCsvBtn.addEventListener('click', () => this.exportCSV());
    
    // New simple prepayment calculator
    if (this.calculatePrepaymentBtn) {
      this.calculatePrepaymentBtn.addEventListener('click', () => this.calculatePrepayment());
    }
    
    // Initialize help modal
    this.initHelpModal();
  }
  
  /**
   * Initialize Help Modal
   */
  initHelpModal() {
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
  
  /**
   * Calculate EMI
   */
  calculateEMI() {
    // Get input values
    this.state.loanAmount = parseFloat(this.loanAmountInput.value);
    this.state.interestRate = parseFloat(this.interestRateInput.value);
    this.state.tenure = parseInt(this.loanTenureInput.value);
    
    // Validate inputs
    if (!this.validateInputs()) {
      return;
    }
    
    const startTime = performance.now();
    
    // Calculate monthly EMI using formula
    const principal = this.state.loanAmount;
    const monthlyRate = this.state.interestRate / 12 / 100;
    const tenureMonths = this.state.tenure * 12;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    this.state.monthlyEMI = Math.round(emi);
    this.state.totalAmount = Math.round(emi * tenureMonths);
    this.state.totalInterest = this.state.totalAmount - principal;
    
    // Generate amortization schedule
    this.state.amortizationSchedule = this.generateAmortizationSchedule(
      principal,
      this.state.interestRate,
      this.state.tenure,
      this.state.monthlyEMI,
      []
    );
    
    const endTime = performance.now();
    console.log(`EMI calculated in ${(endTime - startTime).toFixed(2)}ms`);
    
    // Display results
    this.displayResults();
    this.renderAmortizationTable(this.state.amortizationSchedule, false);
    this.renderChart(this.state.amortizationSchedule, null);
    
    // Show sections
    this.resultsSection.style.display = 'block';
    this.prepaymentSection.classList.remove('hidden');
    this.amortizationSection.style.display = 'block';
    this.chartSection.style.display = 'block';
    
    // Set max month for prepayment
    const maxMonthSpan = document.getElementById('max-month');
    if (maxMonthSpan) {
      maxMonthSpan.textContent = tenureMonths;
    }
    if (this.prepaymentMonthNew) {
      this.prepaymentMonthNew.max = tenureMonths;
    }
    
    // Hide prepayment results on new calculation
    if (this.prepaymentResults) {
      this.prepaymentResults.classList.add('hidden');
    }
    
    // Scroll to results
    this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Persist state
    this.persistState();
    
    this.showToast('EMI calculated successfully!', 'success');
  }
  
  /**
   * Validate input values using Sprint 3 Validator framework
   */
  validateInputs() {
    let isValid = true;
    
    // Loan Amount validation
    const amountResult = Validator.isPositiveNumber(
      this.state.loanAmount,
      100000,
      100000000
    );
    if (!amountResult.valid) {
      this.showToast(`Loan Amount: ${amountResult.error}`, 'error');
      Validator.showValidationError(this.loanAmountInput, amountResult.error);
      isValid = false;
    } else {
      Validator.clearValidationError(this.loanAmountInput);
    }
    
    // Interest Rate validation
    const rateResult = Validator.isPositiveNumber(
      this.state.interestRate,
      0.1,
      20
    );
    if (!rateResult.valid) {
      this.showToast(`Interest Rate: ${rateResult.error}`, 'error');
      Validator.showValidationError(this.interestRateInput, rateResult.error);
      isValid = false;
    } else {
      Validator.clearValidationError(this.interestRateInput);
    }
    
    // Tenure validation
    const tenureResult = Validator.isInteger(
      this.state.tenure,
      1,
      30
    );
    if (!tenureResult.valid) {
      this.showToast(`Tenure: ${tenureResult.error}`, 'error');
      Validator.showValidationError(this.loanTenureInput, tenureResult.error);
      isValid = false;
    } else {
      Validator.clearValidationError(this.loanTenureInput);
    }
    
    return isValid;
  }
  
  /**
   * Display EMI results
   */
  displayResults() {
    this.monthlyEmiDisplay.textContent = this.formatCurrency(this.state.monthlyEMI);
    this.totalInterestDisplay.textContent = this.formatCurrency(this.state.totalInterest);
    this.totalAmountDisplay.textContent = this.formatCurrency(this.state.totalAmount);
    this.principalAmountDisplay.textContent = this.formatCurrency(this.state.loanAmount);
  }
  
  /**
   * Generate amortization schedule
   */
  generateAmortizationSchedule(principal, annualRate, tenureYears, emi, prepayments) {
    let balance = principal;
    const monthlyRate = annualRate / 12 / 100;
    const schedule = [];
    const tenureMonths = tenureYears * 12;
    
    for (let month = 1; month <= tenureMonths; month++) {
      if (balance <= 0) break;
      
      const interest = balance * monthlyRate;
      let principalPaid = emi - interest;
      
      // Apply prepayments for this month
      const prepayment = this.getPrepaymentForMonth(month, prepayments);
      if (prepayment > 0) {
        principalPaid += prepayment;
      }
      
      balance -= principalPaid;
      balance = Math.max(0, balance);
      
      schedule.push({
        month,
        year: Math.ceil(month / 12),
        openingBalance: balance + principalPaid,
        emi: Math.round(emi),
        principal: Math.round(principalPaid),
        interest: Math.round(interest),
        prepayment: Math.round(prepayment),
        closingBalance: Math.round(balance)
      });
    }
    
    return schedule;
  }
  
  /**
   * Get prepayment amount for a specific month
   */
  getPrepaymentForMonth(month, prepayments) {
    let total = 0;
    
    prepayments.forEach(prep => {
      if (prep.type === 'lumpsum' && month === prep.startMonth) {
        total += prep.amount;
      } else if (prep.type === 'monthly' && month >= prep.startMonth) {
        total += prep.amount;
      } else if (prep.type === 'annual' && month >= prep.startMonth) {
        // Annual prepayment on year anniversary
        if ((month - prep.startMonth) % 12 === 0) {
          total += prep.amount;
        }
      }
    });
    
    return total;
  }
  
  /**
   * Render amortization table (year-wise)
   */
  renderAmortizationTable(schedule, showComparison) {
    // Group by year
    const yearlyData = this.groupByYear(schedule);
    
    let html = '';
    let totalEmi = 0;
    let totalPrincipal = 0;
    let totalInterest = 0;
    let totalPrepayment = 0;
    
    yearlyData.forEach(year => {
      const hasPrep = year.prepayment > 0;
      
      html += `<tr${hasPrep ? ' class="prepayment-row"' : ''}>`;
      html += `<td>${year.year}</td>`;
      html += `<td>${this.formatCurrency(year.openingBalance)}</td>`;
      html += `<td>${this.formatCurrency(year.emiPaid)}</td>`;
      html += `<td>${this.formatCurrency(year.principal)}</td>`;
      html += `<td>${this.formatCurrency(year.interest)}</td>`;
      html += `<td class="text-warning">${year.prepayment > 0 ? this.formatCurrency(year.prepayment) : '-'}</td>`;
      html += `<td>${this.formatCurrency(year.closingBalance)}</td>`;
      html += `</tr>`;
      
      totalEmi += year.emiPaid;
      totalPrincipal += year.principal;
      totalInterest += year.interest;
      totalPrepayment += year.prepayment;
    });
    
    this.amortizationTbody.innerHTML = html;
    
    // Update footer with totals
    this.amortizationTfoot.innerHTML = `
      <tr>
        <td><strong>Total</strong></td>
        <td>-</td>
        <td><strong>${this.formatCurrency(totalEmi)}</strong></td>
        <td><strong>${this.formatCurrency(totalPrincipal)}</strong></td>
        <td><strong>${this.formatCurrency(totalInterest)}</strong></td>
        <td class="text-warning"><strong>${totalPrepayment > 0 ? this.formatCurrency(totalPrepayment) : '-'}</strong></td>
        <td>-</td>
      </tr>
    `;
  }
  
  /**
   * Group monthly schedule by year
   */
  groupByYear(schedule) {
    const yearlyData = [];
    
    for (let year = 1; year <= Math.ceil(schedule.length / 12); year++) {
      const yearMonths = schedule.filter(m => m.year === year);
      
      if (yearMonths.length === 0) continue;
      
      const openingBalance = yearMonths[0].openingBalance;
      const closingBalance = yearMonths[yearMonths.length - 1].closingBalance;
      const emiPaid = yearMonths.reduce((sum, m) => sum + m.emi, 0);
      const principal = yearMonths.reduce((sum, m) => sum + m.principal, 0);
      const interest = yearMonths.reduce((sum, m) => sum + m.interest, 0);
      const prepayment = yearMonths.reduce((sum, m) => sum + m.prepayment, 0);
      
      yearlyData.push({
        year,
        openingBalance: Math.round(openingBalance),
        emiPaid: Math.round(emiPaid),
        principal: Math.round(principal),
        interest: Math.round(interest),
        prepayment: Math.round(prepayment),
        closingBalance: Math.round(closingBalance)
      });
    }
    
    return yearlyData;
  }
  
  /**
   * Toggle prepayment form visibility
   */
  togglePrepaymentForm() {
    const isVisible = this.prepaymentFormContainer.style.display !== 'none';
    this.prepaymentFormContainer.style.display = isVisible ? 'none' : 'block';
    this.togglePrepaymentBtn.querySelector('span').textContent = 
      isVisible ? '+ Add Prepayment' : '- Hide Form';
  }
  
  /**
   * Add prepayment to list
   */
  addPrepayment() {
    const type = this.prepaymentType.value;
    const amount = parseFloat(this.prepaymentAmount.value);
    const startMonth = parseInt(this.prepaymentStart.value);
    const option = document.querySelector('input[name="prepayment-option"]:checked').value;
    
    if (!amount || amount < 1000) {
      this.showToast('Prepayment amount must be at least ₹1,000', 'error');
      return;
    }
    
    if (!startMonth || startMonth < 1 || startMonth > this.state.tenure * 12) {
      this.showToast(`Start month must be between 1 and ${this.state.tenure * 12}`, 'error');
      return;
    }
    
    const prepayment = {
      id: Date.now(),
      type,
      amount,
      startMonth,
      option
    };
    
    this.state.prepayments.push(prepayment);
    this.renderPrepaymentList();
    this.recalculateContainer.style.display = 'block';
    
    // Clear form
    this.prepaymentAmount.value = '';
    this.prepaymentStart.value = '12';
    this.togglePrepaymentForm();
    
    this.showToast('Prepayment added successfully!', 'success');
    this.persistState();
  }
  
  /**
   * Render prepayment list
   */
  renderPrepaymentList() {
    if (this.state.prepayments.length === 0) {
      this.prepaymentList.innerHTML = '<div class="empty-state"><p>No prepayments added yet.</p></div>';
      return;
    }
    
    let html = '';
    
    this.state.prepayments.forEach(prep => {
      const typeLabel = {
        'lumpsum': 'One-time Lumpsum',
        'monthly': 'Monthly Recurring',
        'annual': 'Annual Recurring'
      }[prep.type];
      
      const optionLabel = prep.option === 'reduce-tenure' ? 'Reduce Tenure' : 'Reduce EMI';
      
      html += `
        <div class="prepayment-item">
          <div class="prepayment-info">
            <div class="prepayment-type">${typeLabel}</div>
            <div class="prepayment-details">
              Amount: ${this.formatCurrency(prep.amount)} | 
              Start: Month ${prep.startMonth} | 
              Option: ${optionLabel}
            </div>
          </div>
          <div class="prepayment-actions">
            <button class="btn btn-ghost btn-icon" onclick="emiApp.removePrepayment(${prep.id})">
              🗑️
            </button>
          </div>
        </div>
      `;
    });
    
    this.prepaymentList.innerHTML = html;
  }
  
  /**
   * Remove prepayment from list
   */
  removePrepayment(id) {
    this.state.prepayments = this.state.prepayments.filter(p => p.id !== id);
    this.renderPrepaymentList();
    
    if (this.state.prepayments.length === 0) {
      this.recalculateContainer.style.display = 'none';
      this.comparisonSection.style.display = 'none';
    }
    
    this.showToast('Prepayment removed', 'success');
    this.persistState();
  }
  
  /**
   * Calculate with prepayments
   */
  calculateWithPrepayments() {
    if (this.state.prepayments.length === 0) {
      this.showToast('Please add at least one prepayment', 'error');
      return;
    }
    
    const startTime = performance.now();
    
    // Generate revised schedule with prepayments
    this.state.revisedSchedule = this.generateAmortizationSchedule(
      this.state.loanAmount,
      this.state.interestRate,
      this.state.tenure,
      this.state.monthlyEMI,
      this.state.prepayments
    );
    
    const endTime = performance.now();
    console.log(`Prepayment calculation completed in ${(endTime - startTime).toFixed(2)}ms`);
    
    // Calculate comparison metrics
    this.displayComparison();
    this.renderAmortizationTable(this.state.revisedSchedule, true);
    this.renderChart(this.state.amortizationSchedule, this.state.revisedSchedule);
    
    // Show comparison section
    this.comparisonSection.style.display = 'block';
    this.comparisonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    this.showToast('Prepayment impact calculated!', 'success');
    this.persistState();
  }
  
  /**
   * Display comparison between original and revised loan
   */
  displayComparison() {
    const original = this.state.amortizationSchedule;
    const revised = this.state.revisedSchedule;
    
    const originalTenure = original.length;
    const revisedTenure = revised.length;
    
    const originalInterest = original.reduce((sum, m) => sum + m.interest, 0);
    const revisedInterest = revised.reduce((sum, m) => sum + m.interest, 0);
    
    const interestSaved = originalInterest - revisedInterest;
    const tenureReduced = originalTenure - revisedTenure;
    
    // Update comparison displays
    document.getElementById('original-emi').textContent = this.formatCurrency(this.state.monthlyEMI);
    document.getElementById('original-tenure').textContent = `${Math.ceil(originalTenure / 12)} years`;
    document.getElementById('original-interest').textContent = this.formatCurrency(originalInterest);
    
    document.getElementById('revised-emi').textContent = this.formatCurrency(this.state.monthlyEMI);
    document.getElementById('revised-tenure').textContent = `${Math.ceil(revisedTenure / 12)} years`;
    document.getElementById('revised-interest').textContent = this.formatCurrency(revisedInterest);
    
    document.getElementById('interest-saved').textContent = this.formatCurrency(interestSaved);
    document.getElementById('tenure-reduced').textContent = `${tenureReduced} months`;
  }
  
  /**
   * Calculate Prepayment Impact (New Simple Prepayment Calculator)
   */
  calculatePrepayment() {
    // Validate that main EMI is calculated
    if (!this.state.monthlyEMI || this.state.monthlyEMI === 0) {
      this.showToast('Please calculate EMI first', 'error');
      return;
    }
    
    // Get prepayment inputs
    const prepaymentAmount = parseFloat(this.prepaymentAmountNew.value);
    const prepaymentMonth = parseInt(this.prepaymentMonthNew.value);
    const prepaymentOption = document.querySelector('input[name="prepayment-option"]:checked').value;
    
    // Validate inputs
    if (!prepaymentAmount || prepaymentAmount <= 0) {
      this.showToast('Please enter valid prepayment amount', 'error');
      Validator.showValidationError(this.prepaymentAmountNew, 'Amount must be greater than 0');
      return;
    }
    
    Validator.clearValidationError(this.prepaymentAmountNew);
    
    const tenureMonths = this.state.tenure * 12;
    
    if (!prepaymentMonth || prepaymentMonth < 1 || prepaymentMonth > tenureMonths) {
      this.showToast(`Prepayment month must be between 1 and ${tenureMonths}`, 'error');
      Validator.showValidationError(this.prepaymentMonthNew, `Month must be between 1 and ${tenureMonths}`);
      return;
    }
    
    Validator.clearValidationError(this.prepaymentMonthNew);
    
    // Calculate outstanding balance at prepayment month
    let outstandingBalance = this.state.loanAmount;
    const monthlyRate = this.state.interestRate / 12 / 100;
    
    for (let i = 1; i <= prepaymentMonth; i++) {
      const interestForMonth = outstandingBalance * monthlyRate;
      const principalForMonth = this.state.monthlyEMI - interestForMonth;
      outstandingBalance -= principalForMonth;
    }
    
    // Apply prepayment
    const newPrincipal = outstandingBalance - prepaymentAmount;
    
    if (newPrincipal <= 0) {
      this.showToast('Prepayment amount covers entire remaining balance! Loan paid off.', 'success');
      this.prepaymentResults.classList.remove('hidden');
      
      // Display full loan payoff
      document.getElementById('interest-saved').textContent = 
        this.formatCurrency(this.state.totalInterest - (this.state.monthlyEMI * prepaymentMonth - this.state.loanAmount));
      document.getElementById('time-saved').textContent = 
        `${tenureMonths - prepaymentMonth} months (${Math.floor((tenureMonths - prepaymentMonth) / 12)} years ${(tenureMonths - prepaymentMonth) % 12} months)`;
      document.getElementById('new-tenure').textContent = 
        `${Math.floor(prepaymentMonth / 12)} years ${prepaymentMonth % 12} months`;
      
      document.getElementById('time-saved-card').classList.remove('hidden');
      document.getElementById('new-emi-card').classList.add('hidden');
      
      return;
    }
    
    let newEMI, newTenure, interestSaved, timeSaved;
    
    if (prepaymentOption === 'reduce-tenure') {
      // Keep EMI same, reduce tenure
      newEMI = this.state.monthlyEMI;
      
      // Calculate new tenure using the EMI formula rearranged for n
      newTenure = Math.ceil(
        Math.log(newEMI / (newEMI - newPrincipal * monthlyRate)) / 
        Math.log(1 + monthlyRate)
      );
      
      const totalNewTenure = prepaymentMonth + newTenure;
      timeSaved = tenureMonths - totalNewTenure;
      
      // Calculate interest without prepayment (from prepayment month onwards)
      const remainingMonthsOld = tenureMonths - prepaymentMonth;
      const remainingInterestOld = (this.state.monthlyEMI * remainingMonthsOld) - outstandingBalance;
      
      // Calculate interest with prepayment
      const remainingInterestNew = (newEMI * newTenure) - newPrincipal;
      
      interestSaved = remainingInterestOld - remainingInterestNew;
      
    } else {
      // Keep tenure same, reduce EMI
      const remainingMonths = tenureMonths - prepaymentMonth;
      
      // Calculate new EMI using standard EMI formula
      newEMI = (newPrincipal * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
               (Math.pow(1 + monthlyRate, remainingMonths) - 1);
      
      newTenure = tenureMonths; // Tenure stays same
      timeSaved = 0;
      
      // Calculate interest saved
      const remainingInterestOld = (this.state.monthlyEMI * remainingMonths) - outstandingBalance;
      const remainingInterestNew = (newEMI * remainingMonths) - newPrincipal;
      
      interestSaved = remainingInterestOld - remainingInterestNew;
    }
    
    // Display results
    this.displayPrepaymentResults({
      interestSaved,
      timeSaved,
      newEMI,
      newTenure: prepaymentOption === 'reduce-tenure' ? 
        (prepaymentMonth + newTenure) : tenureMonths,
      prepaymentOption,
      prepaymentAmount,
      prepaymentMonth
    });
    
    this.showToast('Prepayment impact calculated!', 'success');
  }
  
  /**
   * Display Prepayment Results
   */
  displayPrepaymentResults(results) {
    // Show results section
    this.prepaymentResults.classList.remove('hidden');
    
    // Interest Saved
    document.getElementById('interest-saved').textContent = 
      this.formatCurrency(Math.round(results.interestSaved));
    
    // Time Saved or New EMI
    if (results.prepaymentOption === 'reduce-tenure') {
      document.getElementById('time-saved-card').classList.remove('hidden');
      document.getElementById('new-emi-card').classList.add('hidden');
      const years = Math.floor(results.timeSaved / 12);
      const months = results.timeSaved % 12;
      document.getElementById('time-saved').textContent = 
        `${results.timeSaved} months (${years} years ${months} months)`;
    } else {
      document.getElementById('time-saved-card').classList.add('hidden');
      document.getElementById('new-emi-card').classList.remove('hidden');
      document.getElementById('new-emi-amount').textContent = 
        this.formatCurrency(Math.round(results.newEMI));
    }
    
    // New Tenure
    const years = Math.floor(results.newTenure / 12);
    const months = results.newTenure % 12;
    document.getElementById('new-tenure').textContent = 
      `${years} years ${months} months`;
    
    // Comparison Table
    const tenureMonths = this.state.tenure * 12;
    const comparisonHTML = `
      <tr class="border-b border-muted-light/10 dark:border-accent-dark/10">
        <td class="py-2 px-2 text-muted-light dark:text-muted-dark">Total Interest</td>
        <td class="text-right py-2 px-2 text-text-light dark:text-text-dark">${this.formatCurrency(this.state.totalInterest)}</td>
        <td class="text-right py-2 px-2 text-text-light dark:text-text-dark">${this.formatCurrency(Math.round(this.state.totalInterest - results.interestSaved))}</td>
        <td class="text-right py-2 px-2 text-green-600 dark:text-green-400">-${this.formatCurrency(Math.round(results.interestSaved))}</td>
      </tr>
      <tr class="border-b border-muted-light/10 dark:border-accent-dark/10">
        <td class="py-2 px-2 text-muted-light dark:text-muted-dark">Total Amount Paid</td>
        <td class="text-right py-2 px-2 text-text-light dark:text-text-dark">${this.formatCurrency(this.state.totalAmount)}</td>
        <td class="text-right py-2 px-2 text-text-light dark:text-text-dark">${this.formatCurrency(Math.round(this.state.totalAmount - results.interestSaved))}</td>
        <td class="text-right py-2 px-2 text-green-600 dark:text-green-400">-${this.formatCurrency(Math.round(results.interestSaved))}</td>
      </tr>
      ${results.prepaymentOption === 'reduce-tenure' ? `
      <tr>
        <td class="py-2 px-2 text-muted-light dark:text-muted-dark">Loan Tenure</td>
        <td class="text-right py-2 px-2 text-text-light dark:text-text-dark">${tenureMonths} months</td>
        <td class="text-right py-2 px-2 text-text-light dark:text-text-dark">${results.newTenure} months</td>
        <td class="text-right py-2 px-2 text-green-600 dark:text-green-400">-${results.timeSaved} months</td>
      </tr>
      ` : `
      <tr>
        <td class="py-2 px-2 text-muted-light dark:text-muted-dark">Monthly EMI</td>
        <td class="text-right py-2 px-2 text-text-light dark:text-text-dark">${this.formatCurrency(this.state.monthlyEMI)}</td>
        <td class="text-right py-2 px-2 text-text-light dark:text-text-dark">${this.formatCurrency(Math.round(results.newEMI))}</td>
        <td class="text-right py-2 px-2 text-green-600 dark:text-green-400">-${this.formatCurrency(Math.round(this.state.monthlyEMI - results.newEMI))}</td>
      </tr>
      `}
    `;
    
    document.getElementById('prepayment-comparison').innerHTML = comparisonHTML;
    
    // Scroll to results
    this.prepaymentResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  /**
   * Render loan balance chart
   */
  renderChart(originalSchedule, revisedSchedule) {
    // Ensure Chart.js is loaded (check window.Chart since we're in a module)
    console.log('[EMICalculator] Checking for library. window.Chart:', typeof window.Chart, window.Chart);
    if (typeof window.Chart === 'undefined') {
      console.error('[EMICalculator] Chart.js library not loaded properly');
      console.error('[EMICalculator] window.Chart:', window.Chart);
      this.showToast('Chart library not available. Please refresh the page.', 'error');
      return;
    }
    
    const Chart = window.Chart;
    const ctx = this.loanChart.getContext('2d');
    
    // Destroy existing chart
    if (this.state.chartInstance) {
      this.state.chartInstance.destroy();
    }
    
    // Group by year for chart
    const originalYearly = this.groupByYear(originalSchedule);
    const years = originalYearly.map(y => `Year ${y.year}`);
    const originalBalances = originalYearly.map(y => y.closingBalance);
    
    const datasets = [{
      label: 'Original Loan',
      data: originalBalances,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.3,
      fill: true
    }];
    
    // Add revised schedule if available
    if (revisedSchedule) {
      const revisedYearly = this.groupByYear(revisedSchedule);
      const revisedBalances = revisedYearly.map(y => y.closingBalance);
      
      // Pad with zeros if revised is shorter
      while (revisedBalances.length < originalBalances.length) {
        revisedBalances.push(0);
      }
      
      datasets.push({
        label: 'With Prepayments',
        data: revisedBalances,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.3,
        fill: true
      });
    }
    
    this.state.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => this.formatCurrency(value, false)
            }
          }
        }
      }
    });
  }
  
  /**
   * Copy table to clipboard
   */
  async copyTable() {
    const table = document.getElementById('amortization-table');
    let text = '';
    
    // Header
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent);
    text += headers.join('\t') + '\n';
    
    // Body
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    rows.forEach(row => {
      const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent);
      text += cells.join('\t') + '\n';
    });
    
    // Footer
    const footerCells = Array.from(table.querySelectorAll('tfoot td')).map(td => td.textContent);
    text += footerCells.join('\t') + '\n';
    
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Table copied to clipboard!', 'success');
    } catch (err) {
      this.showToast('Failed to copy table', 'error');
    }
  }
  
  /**
   * Export amortization schedule to CSV
   */
  exportCSV() {
    const schedule = this.state.revisedSchedule || this.state.amortizationSchedule;
    const yearlyData = this.groupByYear(schedule);
    
    let csv = 'Year,Opening Balance,EMI Paid,Principal Paid,Interest Paid,Prepayment,Closing Balance\n';
    
    yearlyData.forEach(year => {
      csv += `${year.year},${year.openingBalance},${year.emiPaid},${year.principal},${year.interest},${year.prepayment},${year.closingBalance}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emi-schedule-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.showToast('CSV exported successfully!', 'success');
  }
  
  /**
   * Reset form and state
   */
  resetForm() {
    this.loanAmountInput.value = '2500000';
    this.interestRateInput.value = '8.5';
    this.loanTenureInput.value = '20';
    
    // Clear prepayment form
    if (this.prepaymentAmountNew) {
      this.prepaymentAmountNew.value = '';
    }
    if (this.prepaymentMonthNew) {
      this.prepaymentMonthNew.value = '12';
    }
    
    this.state = {
      ...this.state,
      prepayments: [],
      amortizationSchedule: [],
      revisedSchedule: null
    };
    
    this.resultsSection.style.display = 'none';
    this.prepaymentSection.classList.add('hidden');
    if (this.prepaymentResults) {
      this.prepaymentResults.classList.add('hidden');
    }
    this.comparisonSection.style.display = 'none';
    this.chartSection.style.display = 'none';
    this.amortizationSection.style.display = 'none';
    
    if (this.state.chartInstance) {
      this.state.chartInstance.destroy();
      this.state.chartInstance = null;
    }
    
    localStorage.removeItem('emi-calculator-state');
    this.showToast('Form reset successfully', 'success');
  }
  
  /**
   * Format number as currency
   */
  formatCurrency(amount, includeSymbol = true) {
    const formatted = Math.round(amount).toLocaleString('en-IN');
    return includeSymbol ? `₹${formatted}` : formatted;
  }
  
  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 24px;
      background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      border-radius: 6px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  
  /**
   * Persist state to localStorage
   */
  persistState() {
    const state = {
      loanAmount: this.state.loanAmount,
      interestRate: this.state.interestRate,
      tenure: this.state.tenure,
      prepayments: this.state.prepayments
    };
    
    localStorage.setItem('emi-calculator-state', JSON.stringify(state));
  }
  
  /**
   * Load persisted state from localStorage
   */
  loadPersistedState() {
    const saved = localStorage.getItem('emi-calculator-state');
    if (!saved) return;
    
    try {
      const state = JSON.parse(saved);
      
      if (state.loanAmount) {
        this.loanAmountInput.value = state.loanAmount;
      }
      
      if (state.interestRate) {
        this.interestRateInput.value = state.interestRate;
      }
      
      if (state.tenure) {
        this.loanTenureInput.value = state.tenure;
      }
      
      if (state.prepayments && state.prepayments.length > 0) {
        this.state.prepayments = state.prepayments;
      }
    } catch (err) {
      console.error('Failed to load persisted state:', err);
    }
  }
}

// Export initialization function for router
let emiApp;

window.initEmiCalculator = function() {
  emiApp = new EMICalculator();
  window.emiApp = emiApp; // For inline onclick handlers
};

// Auto-initialize if loaded directly (not via router)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('emi-calculator')) {
      emiApp = new EMICalculator();
      window.emiApp = emiApp;
    }
  });
} else {
  if (window.location.pathname.includes('emi-calculator')) {
    emiApp = new EMICalculator();
    window.emiApp = emiApp;
  }
}
