#!/usr/bin/env node
/**
 * Comprehensive Test Verification for SIP Calculator
 * This script performs automated testing of core calculation logic
 */

console.log('═══════════════════════════════════════════════════════════');
console.log('  🧪 SIP CALCULATOR - COMPREHENSIVE TEST VERIFICATION');
console.log('═══════════════════════════════════════════════════════════\n');

// Test Results Tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

// Helper: Assert with descriptive error
function assert(condition, testName, message) {
  results.total++;
  if (condition) {
    results.passed++;
    console.log(`✅ PASS: ${testName}`);
    return true;
  } else {
    results.failed++;
    console.log(`❌ FAIL: ${testName}`);
    console.log(`   Error: ${message}`);
    results.errors.push({ test: testName, error: message });
    return false;
  }
}

function assertInRange(actual, min, max, testName, label) {
  const inRange = actual >= min && actual <= max;
  return assert(
    inRange,
    testName,
    `${label} expected ${min}-${max}, got ${actual}`
  );
}

// ═══════════════════════════════════════════════════════════
// CORE SIP CALCULATION FUNCTION (from sip-calculator.js)
// ═══════════════════════════════════════════════════════════

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
      yearlyInvestment = 0;
    }
  }
  
  return {
    totalInvestment: Math.round(totalInvestment),
    maturityValue: Math.round(currentValue),
    expectedReturns: Math.round(currentValue - totalInvestment),
    absoluteReturn: ((Math.round(currentValue) / Math.round(totalInvestment) - 1) * 100),
    yearlyData: yearlyData
  };
}

function validateInputs(inputs) {
  const errors = [];
  
  if (!inputs.monthlyInvestment || inputs.monthlyInvestment < 500) {
    errors.push('Monthly investment must be at least ₹500');
  }
  if (inputs.monthlyInvestment > 10000000) {
    errors.push('Monthly investment cannot exceed ₹1,00,00,000');
  }
  if (!inputs.returnRate || inputs.returnRate < 1) {
    errors.push('Expected return rate must be at least 1%');
  }
  if (inputs.returnRate > 30) {
    errors.push('Return rate seems unrealistic. Please enter 1-30%');
  }
  if (!inputs.duration || inputs.duration < 1) {
    errors.push('Investment duration must be at least 1 year');
  }
  if (inputs.duration > 50) {
    errors.push('Investment duration cannot exceed 50 years');
  }
  if (inputs.stepupRate < 0) {
    errors.push('Step-up rate cannot be negative');
  }
  if (inputs.stepupRate > 50) {
    errors.push('Step-up rate cannot exceed 50%');
  }
  
  return errors;
}

// ═══════════════════════════════════════════════════════════
// TEST SUITE 1: FUNCTIONAL TESTS
// ═══════════════════════════════════════════════════════════

console.log('\n📊 TEST SUITE 1: FUNCTIONAL TESTS\n');

// Test 1: Basic SIP Calculation (No Step-up)
console.log('Test 1: Basic SIP Calculation (No Step-up)');
const test1 = calculateSIP(5000, 12, 10, 0);
assert(test1.totalInvestment === 600000, 'Test 1.1', 'Total Investment = ₹6,00,000');
assertInRange(test1.maturityValue, 1150000, 1170000, 'Test 1.2', 'Maturity Value ~₹11,61,695');
assert(test1.expectedReturns > 550000, 'Test 1.3', 'Returns > ₹5,50,000');
assert(test1.yearlyData.length === 10, 'Test 1.4', '10 years of data');
console.log(`   Investment: ₹${test1.totalInvestment.toLocaleString('en-IN')}`);
console.log(`   Maturity: ₹${test1.maturityValue.toLocaleString('en-IN')}`);
console.log(`   Returns: ₹${test1.expectedReturns.toLocaleString('en-IN')}\n`);

// Test 2: SIP with Step-up Rate
console.log('Test 2: SIP with 10% Step-up Rate');
const test2 = calculateSIP(10000, 12, 5, 10);
assert(test2.totalInvestment > 600000, 'Test 2.1', 'Step-up increases investment');
assert(test2.maturityValue > test2.totalInvestment, 'Test 2.2', 'Maturity > Investment');
assert(test2.yearlyData.length === 5, 'Test 2.3', '5 years of data');
console.log(`   Investment: ₹${test2.totalInvestment.toLocaleString('en-IN')}`);
console.log(`   Maturity: ₹${test2.maturityValue.toLocaleString('en-IN')}\n`);

// Test 3: Edge Case - Minimum Values
console.log('Test 3: Edge Case - Minimum Values');
const test3 = calculateSIP(500, 1, 1, 0);
assert(test3.totalInvestment === 6000, 'Test 3.1', 'Min investment ₹500 * 12 = ₹6,000');
assert(test3.maturityValue > test3.totalInvestment, 'Test 3.2', 'Even 1% grows');
assert(test3.yearlyData.length === 1, 'Test 3.3', '1 year of data');
console.log(`   Investment: ₹${test3.totalInvestment.toLocaleString('en-IN')}`);
console.log(`   Maturity: ₹${test3.maturityValue.toLocaleString('en-IN')}\n`);

// Test 4: Edge Case - Maximum Duration
console.log('Test 4: Edge Case - 40 Year Duration');
const startTime4 = Date.now();
const test4 = calculateSIP(5000, 12, 40, 0);
const duration4 = Date.now() - startTime4;
assert(test4.totalInvestment === 2400000, 'Test 4.1', '40 years = ₹24,00,000');
assert(test4.maturityValue > 50000000, 'Test 4.2', 'Long-term growth > ₹5 crore');
assert(test4.yearlyData.length === 40, 'Test 4.3', '40 years of data');
assert(duration4 < 100, 'Test 4.4', `Performance < 100ms (took ${duration4}ms)`);
console.log(`   Investment: ₹${test4.totalInvestment.toLocaleString('en-IN')}`);
console.log(`   Maturity: ₹${test4.maturityValue.toLocaleString('en-IN')}`);
console.log(`   Performance: ${duration4}ms\n`);

// Test 5: Large Investment with High Step-up
console.log('Test 5: Large Investment with High Step-up');
const startTime5 = Date.now();
const test5 = calculateSIP(100000, 15, 30, 20);
const duration5 = Date.now() - startTime5;
assert(test5.totalInvestment > 100000 * 12 * 30, 'Test 5.1', 'Step-up increases total');
assert(test5.maturityValue > test5.totalInvestment * 2, 'Test 5.2', '15% compounded doubles');
assert(duration5 < 100, 'Test 5.3', `Performance < 100ms (took ${duration5}ms)`);
console.log(`   Investment: ₹${test5.totalInvestment.toLocaleString('en-IN')}`);
console.log(`   Maturity: ₹${test5.maturityValue.toLocaleString('en-IN')}`);
console.log(`   Performance: ${duration5}ms\n`);

// ═══════════════════════════════════════════════════════════
// TEST SUITE 2: VALIDATION TESTS
// ═══════════════════════════════════════════════════════════

console.log('\n🔒 TEST SUITE 2: INPUT VALIDATION TESTS\n');

// Test 6: Minimum Investment Validation
console.log('Test 6: Minimum Investment Validation');
const val1 = validateInputs({ monthlyInvestment: 400, returnRate: 12, duration: 10, stepupRate: 0 });
assert(val1.length > 0, 'Test 6.1', 'Reject investment < ₹500');
assert(val1.some(e => e.includes('500')), 'Test 6.2', 'Error mentions ₹500');
console.log(`   Validation: ${val1[0]}\n`);

// Test 7: Maximum Investment Validation
console.log('Test 7: Maximum Investment Validation');
const val2 = validateInputs({ monthlyInvestment: 10000001, returnRate: 12, duration: 10, stepupRate: 0 });
assert(val2.length > 0, 'Test 7.1', 'Reject investment > ₹1 crore');
console.log(`   Validation: ${val2[0]}\n`);

// Test 8: Return Rate Validation
console.log('Test 8: Return Rate Validation');
const val3 = validateInputs({ monthlyInvestment: 5000, returnRate: 0.5, duration: 10, stepupRate: 0 });
assert(val3.length > 0, 'Test 8.1', 'Reject return < 1%');
const val4 = validateInputs({ monthlyInvestment: 5000, returnRate: 35, duration: 10, stepupRate: 0 });
assert(val4.length > 0, 'Test 8.2', 'Reject return > 30%');
console.log(`   Low rate: ${val3[0]}`);
console.log(`   High rate: ${val4[0]}\n`);

// Test 9: Duration Validation
console.log('Test 9: Duration Validation');
const val5 = validateInputs({ monthlyInvestment: 5000, returnRate: 12, duration: 0, stepupRate: 0 });
assert(val5.length > 0, 'Test 9.1', 'Reject duration < 1');
const val6 = validateInputs({ monthlyInvestment: 5000, returnRate: 12, duration: 51, stepupRate: 0 });
assert(val6.length > 0, 'Test 9.2', 'Reject duration > 50');
console.log(`   Too short: ${val5[0]}`);
console.log(`   Too long: ${val6[0]}\n`);

// Test 10: Step-up Rate Validation
console.log('Test 10: Step-up Rate Validation');
const val7 = validateInputs({ monthlyInvestment: 5000, returnRate: 12, duration: 10, stepupRate: -5 });
assert(val7.length > 0, 'Test 10.1', 'Reject negative step-up');
const val8 = validateInputs({ monthlyInvestment: 5000, returnRate: 12, duration: 10, stepupRate: 60 });
assert(val8.length > 0, 'Test 10.2', 'Reject step-up > 50%');
console.log(`   Negative: ${val7[0]}`);
console.log(`   Too high: ${val8[0]}\n`);

// ═══════════════════════════════════════════════════════════
// TEST SUITE 3: DATA ACCURACY TESTS
// ═══════════════════════════════════════════════════════════

console.log('\n📐 TEST SUITE 3: DATA ACCURACY TESTS\n');

// Test 11: Year-wise Data Structure
console.log('Test 11: Year-wise Data Structure');
const test11 = calculateSIP(5000, 12, 10, 0);
assert(test11.yearlyData.length === 10, 'Test 11.1', '10 years of data');
test11.yearlyData.forEach((year, idx) => {
  assert(year.year === idx + 1, `Test 11.2.${idx}`, `Year ${idx + 1} correct`);
  assert(typeof year.yearlyInvestment === 'number', `Test 11.3.${idx}`, 'yearlyInvestment is number');
  assert(typeof year.totalInvestment === 'number', `Test 11.4.${idx}`, 'totalInvestment is number');
  assert(typeof year.value === 'number', `Test 11.5.${idx}`, 'value is number');
  assert(typeof year.returns === 'number', `Test 11.6.${idx}`, 'returns is number');
});
console.log(`   All 10 years validated\n`);

// Test 12: Cumulative Growth
console.log('Test 12: Cumulative Investment Growth');
const test12 = calculateSIP(5000, 12, 10, 0);
for (let i = 1; i < test12.yearlyData.length; i++) {
  const prev = test12.yearlyData[i - 1].totalInvestment;
  const curr = test12.yearlyData[i].totalInvestment;
  assert(curr > prev, `Test 12.${i}`, `Year ${i + 1} investment increases`);
}
console.log(`   Investment grows cumulatively\n`);

// Test 13: Returns = Value - Investment
console.log('Test 13: Returns Calculation Accuracy');
const test13 = calculateSIP(5000, 12, 10, 0);
test13.yearlyData.forEach((year, idx) => {
  const calculatedReturns = year.value - year.totalInvestment;
  const diff = Math.abs(year.returns - calculatedReturns);
  assert(diff <= 1, `Test 13.${idx}`, `Year ${idx + 1} returns accurate (diff: ${diff})`);
});
console.log(`   All returns calculations verified\n`);

// ═══════════════════════════════════════════════════════════
// TEST SUITE 4: PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════

console.log('\n⚡ TEST SUITE 4: PERFORMANCE BENCHMARKS\n');

// Test 14: 10-Year Calculation Performance
console.log('Test 14: 10-Year Calculation Performance');
const perf1Start = Date.now();
for (let i = 0; i < 100; i++) {
  calculateSIP(5000, 12, 10, 0);
}
const perf1End = Date.now();
const perf1Avg = (perf1End - perf1Start) / 100;
assert(perf1Avg < 50, 'Test 14', `Avg < 50ms (got ${perf1Avg.toFixed(2)}ms)`);
console.log(`   Average: ${perf1Avg.toFixed(2)}ms over 100 iterations\n`);

// Test 15: 30-Year Calculation Performance
console.log('Test 15: 30-Year Calculation Performance');
const perf2Start = Date.now();
for (let i = 0; i < 50; i++) {
  calculateSIP(5000, 12, 30, 10);
}
const perf2End = Date.now();
const perf2Avg = (perf2End - perf2Start) / 50;
assert(perf2Avg < 75, 'Test 15', `Avg < 75ms (got ${perf2Avg.toFixed(2)}ms)`);
console.log(`   Average: ${perf2Avg.toFixed(2)}ms over 50 iterations\n`);

// Test 16: 40-Year with Step-up Performance
console.log('Test 16: 40-Year with Step-up Performance');
const perf3Start = Date.now();
for (let i = 0; i < 25; i++) {
  calculateSIP(10000, 15, 40, 20);
}
const perf3End = Date.now();
const perf3Avg = (perf3End - perf3Start) / 25;
assert(perf3Avg < 100, 'Test 16', `Avg < 100ms (got ${perf3Avg.toFixed(2)}ms)`);
console.log(`   Average: ${perf3Avg.toFixed(2)}ms over 25 iterations\n`);

// ═══════════════════════════════════════════════════════════
// TEST SUMMARY
// ═══════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  📊 TEST SUMMARY');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`Total Tests: ${results.total}`);
console.log(`Passed: ${results.passed} ✅`);
console.log(`Failed: ${results.failed} ❌`);
console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`);

if (results.failed > 0) {
  console.log('❌ FAILED TESTS:\n');
  results.errors.forEach((err, idx) => {
    console.log(`${idx + 1}. ${err.test}`);
    console.log(`   ${err.error}\n`);
  });
}

console.log('═══════════════════════════════════════════════════════════');

// Exit code based on results
process.exit(results.failed > 0 ? 1 : 0);
