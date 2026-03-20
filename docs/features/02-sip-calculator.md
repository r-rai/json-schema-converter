# Feature Specification: SIP Calculator

**Feature ID:** F-002  
**Feature Name:** Systematic Investment Plan (SIP) Calculator  
**Priority:** High  
**RICE Score:** 1800  
**Timeline:** Weeks 2-3  
**Status:** Specification Complete  
**Last Updated:** March 19, 2026

---

## 1. Feature Overview

### 1.1 Description

A comprehensive SIP (Systematic Investment Plan) calculator enabling Indian investors to calculate expected returns from monthly investments with step-up functionality. Provides visualizations, year-wise breakdown, and export capabilities to help users make informed investment decisions.

### 1.2 Business Value

- **Target high-growth market:** Indian retail investor base (50M+ active SIP investors as of 2026)
- **High user engagement:** Financial calculators see repeat usage for planning purposes
- **Differentiation:** Step-up SIP feature not commonly found in free tools
- **Monetization potential:** Future premium features (goal-based planning, tax calculations)
- **Zero infrastructure cost:** Client-side calculations

### 1.3 Target Users

- **Primary:** Retail investors (25-45 age group) planning mutual fund SIP investments
- **Secondary:** Financial advisors demonstrating SIP benefits to clients
- **Tertiary:** Students and young professionals learning about investment planning

### 1.4 RICE Score Breakdown

| Component | Score | Rationale |
|-----------|-------|-----------|
| **Reach** | 1000 users/quarter | Large target market of SIP investors + searchers |
| **Impact** | 3 (High) | Significant value - aids financial planning decisions |
| **Confidence** | 90% | Proven demand, well-understood feature |
| **Effort** | 1.5 weeks | Moderate complexity - calculations, tables, charts |
| **RICE Score** | **1800** | (1000 × 3 × 0.90) / 1.5 = 1800 |

---

## 2. User Stories

### 2.1 Primary User Story

**US-010:** SIP Return Calculation with Step-Up

> **As an** investor planning for long-term wealth creation  
> **I want to** calculate expected returns from monthly SIP investments with optional step-up increases  
> **So that** I can make informed investment decisions and visualize my financial growth over time

**Acceptance Criteria:**

✅ **AC-101:** User can enter monthly investment amount (INR)  
✅ **AC-102:** User can enter expected annual return rate (percentage)  
✅ **AC-103:** User can enter investment duration (years)  
✅ **AC-104:** User can optionally enable step-up with annual increase rate  
✅ **AC-105:** Calculator displays total investment amount  
✅ **AC-106:** Calculator displays expected returns (gains)  
✅ **AC-107:** Calculator displays maturity value (total corpus)  
✅ **AC-108:** Year-wise breakdown table shows cumulative investment and returns  
✅ **AC-109:** Visual chart displays investment vs returns over time  
✅ **AC-110:** All calculations complete within 500ms  

### 2.2 Additional User Stories

**US-011:** Year-Wise Investment Breakdown

> **As an** investor tracking long-term investments  
> **I want to** see year-by-year breakdown of my investment growth  
> **So that** I can understand compounding effects and plan milestones

**Acceptance Criteria:**

✅ **AC-111:** Table displays columns: Year, Investment This Year, Cumulative Investment, Expected Value, Returns  
✅ **AC-112:** Table scrollable for long durations (15+ years)  
✅ **AC-113:** Currency formatted with INR symbol and thousand separators  
✅ **AC-114:** Total row at bottom showing final sums

**US-012:** Visual Growth Representation

> **As a** visual learner  
> **I want to** see a chart showing investment vs returns over time  
> **So that** I can quickly grasp the power of compounding

**Acceptance Criteria:**

✅ **AC-115:** Line or bar chart with two series: Total Investment, Expected Value  
✅ **AC-116:** X-axis: Years, Y-axis: Amount (INR)  
✅ **AC-117:** Chart responsive and readable on mobile devices  
✅ **AC-118:** Legend clearly identifies each series  
✅ **AC-119:** Optional: Hovering shows exact values for that year

**US-013:** Export and Share Results

> **As an** investor comparing scenarios  
> **I want to** save or share my SIP calculation results  
> **So that** I can compare multiple plans or discuss with advisors

**Acceptance Criteria:**

✅ **AC-120:** "Download" button exports results as CSV or PDF  
✅ **AC-121:** "Copy" button copies summary to clipboard  
✅ **AC-122:** Export includes all input parameters and calculated results  
✅ **AC-123:** Exported data is properly formatted and readable

---

## 3. Functional Requirements

### 3.1 Input Fields and Validation

**FR-101:** Monthly SIP Amount
- **Label:** "Monthly Investment (₹)"
- **Type:** Number input
- **Minimum:** ₹500 (typical minimum SIP amount)
- **Maximum:** ₹10,00,000 (1 million INR)
- **Default:** ₹5,000
- **Validation:** Must be positive integer, show error for invalid input
- **Format:** Display with thousand separators (₹5,000)

**FR-102:** Expected Annual Return Rate
- **Label:** "Expected Annual Return Rate (%)"
- **Type:** Number input (decimal allowed)
- **Minimum:** 1%
- **Maximum:** 30%
- **Default:** 12%
- **Validation:** Must be between 1-30%, show error otherwise
- **Help Text:** "Historical equity mutual fund returns: 10-15% p.a."

**FR-103:** Investment Duration
- **Label:** "Investment Duration (Years)"
- **Type:** Number input
- **Minimum:** 1 year
- **Maximum:** 50 years
- **Default:** 10 years
- **Validation:** Must be positive integer
- **Help Text:** "Long-term investments (5+ years) show better compounding"

**FR-104:** Step-Up Rate (Optional)
- **Label:** "Annual Step-Up Rate (%) [Optional]"
- **Type:** Number input or checkbox to enable
- **Minimum:** 0%
- **Maximum:** 20%
- **Default:** 0% (disabled)
- **Validation:** If enabled, must be 0-20%
- **Help Text:** "Increase monthly investment by this % each year"

### 3.2 Calculation Logic

**FR-105:** SIP Future Value Formula

**Standard SIP (without step-up):**
```
FV = P × [((1 + r)^n - 1) / r] × (1 + r)

Where:
- FV = Future Value (Maturity Amount)
- P = Monthly SIP amount
- r = Monthly interest rate = Annual Rate / 12 / 100
- n = Total number of months = Years × 12
```

**SIP with Step-Up:**
```
Calculate yearly:
For each year Y (1 to duration):
  Monthly SIP for year Y = Initial SIP × (1 + step-up_rate)^(Y-1)
  Calculate FV for that year's investments
  Sum all yearly FVs
```

**FR-106:** Derived Calculations
- **Total Investment:** Sum of all monthly investments made
  - Without step-up: `Monthly SIP × Duration × 12`
  - With step-up: Sum of stepped-up monthly investments
- **Expected Returns:** `Maturity Value - Total Investment`
- **Absolute Return:** `(Maturity Value / Total Investment - 1) × 100`

**FR-107:** Year-Wise Breakdown Calculation

For each year Y (1 to duration):
- **Investment This Year:** Sum of 12 months of SIP for that year (adjusted for step-up)
- **Cumulative Investment:** Sum of all investments up to year Y
- **Expected Value at End of Year Y:** FV of all investments made up to year Y
- **Returns to Date:** `Expected Value - Cumulative Investment`

### 3.3 Output Requirements

**FR-108:** Summary Cards
Display prominently at top:
1. **Total Investment:** ₹X,XX,XXX (total amount invested)
2. **Expected Returns:** ₹X,XX,XXX (gains from compounding)
3. **Maturity Value:** ₹X,XX,XXX (total corpus at end)
4. **Absolute Return:** XX.X% (percentage gain)

**FR-109:** Year-Wise Breakdown Table

| Year | Investment This Year | Cumulative Investment | Expected Value | Returns |
|------|---------------------|----------------------|----------------|---------|
| 1 | ₹60,000 | ₹60,000 | ₹63,600 | ₹3,600 |
| 2 | ₹60,000 | ₹1,20,000 | ₹1,34,832 | ₹14,832 |
| ... | ... | ... | ... | ... |
| 10 | ₹60,000 | ₹6,00,000 | ₹11,61,695 | ₹5,61,695 |
| **Total** | **₹6,00,000** | - | **₹11,61,695** | **₹5,61,695** |

**FR-110:** Visual Chart Requirements
- **Type:** Line chart or combined line/bar chart
- **X-Axis:** Year (1 to duration)
- **Y-Axis:** Amount (₹)
- **Series 1:** Cumulative Investment (Blue line/bar)
- **Series 2:** Expected Value (Green line/bar)
- **Shaded Area:** Gap between investment and value (represents returns)
- **Interactive:** Hover to see exact values (optional but recommended)

### 3.4 Error Handling

**FR-111:** Validation Errors
- Empty required fields: "Please enter monthly investment amount"
- Out-of-range values: "Monthly investment must be between ₹500 and ₹10,00,000"
- Non-numeric input: "Please enter a valid number"
- Return rate too high: "Return rate seems unrealistic. Please enter 1-30%"

**FR-112:** Calculation Errors
- If calculation results in Infinity or NaN: "Unable to calculate. Please check your inputs."
- If duration exceeds reasonable limits: "For durations >50 years, results may be less reliable"

---

## 4. UI/UX Requirements

### 4.1 Layout Design

**UIR-101:** Page Structure
```
┌─────────────────────────────────────────┐
│ Header: "SIP Calculator"                │
├─────────────────────────────────────────┤
│ Input Section:                          │
│  [Monthly Investment]  [Return Rate]    │
│  [Duration]            [Step-Up Rate]   │
│  [Calculate Button]    [Reset Button]   │
├─────────────────────────────────────────┤
│ Results Section:                        │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │Total│ │Expec│ │Matur│ │Absol│      │
│  │Invst│ │Ret. │ │Value│ │Ret. │      │
│  └─────┘ └─────┘ └─────┘ └─────┘      │
├─────────────────────────────────────────┤
│ Chart Section:                          │
│  [Visual chart: Investment vs Returns]  │
├─────────────────────────────────────────┤
│ Table Section:                          │
│  [Year-wise breakdown table]            │
│  [Download CSV] [Copy to Clipboard]     │
└─────────────────────────────────────────┘
```

**UIR-102:** Input Section Design
- Group related inputs together
- Labels above inputs or inline (depending on space)
- Input fields: min-width 200px, max-width 300px
- Help icons (❓) next to labels with tooltips
- Calculate button: Primary color, prominent placement
- Reset button: Secondary color, clears all inputs and results

**UIR-103:** Results Section Design
- 4 summary cards in a row (desktop) or 2×2 grid (mobile)
- Each card: Large number (36px font) with label below (14px)
- Color coding: 
  - Total Investment: Blue (#2563eb)
  - Expected Returns: Green (#10b981)
  - Maturity Value: Purple (#8b5cf6)
  - Absolute Return: Orange (#f59e0b)
- Cards have subtle shadow/border for visual separation

**UIR-104:** Chart Section Design
- Chart height: 300px on mobile, 400px on desktop
- Responsive canvas that scales with container
- Legend positioned above or below chart (not overlapping)
- Grid lines for easier reading
- Axis labels clearly visible

**UIR-105:** Table Section Design
- Sticky header row when scrolling
- Alternating row colors for readability
- Right-align numeric columns
- Bold font for total row
- Mobile: Horizontally scrollable (smaller font if needed)

### 4.2 Component List

| Component | Type | Purpose |
|-----------|------|---------|
| `inputMonthlySIP` | Number Input | Monthly investment amount |
| `inputReturnRate` | Number Input | Expected annual return % |
| `inputDuration` | Number Input | Investment duration in years |
| `inputStepUp` | Number Input / Checkbox | Optional step-up rate |
| `btnCalculate` | Button | Trigger calculation |
| `btnReset` | Button | Clear all inputs and results |
| `cardTotalInvestment` | Card | Display total invested amount |
| `cardExpectedReturns` | Card | Display expected gains |
| `cardMaturityValue` | Card | Display final corpus |
| `cardAbsoluteReturn` | Card | Display percentage return |
| `chartSIPGrowth` | Canvas/SVG | Visual representation |
| `tableBreakdown` | Table | Year-wise breakdown |
| `btnDownload` | Button | Export to CSV |
| `btnCopy` | Button | Copy summary to clipboard |
| `tooltipHelp` | Tooltip | Contextual help for inputs |

### 4.3 Responsive Design Requirements

**UIR-106:** Mobile Layout (320px - 767px)
- Inputs stacked vertically (100% width)
- Summary cards: 2×2 grid
- Chart: Full width, height 300px
- Table: Horizontally scrollable
- Larger touch targets (min 44px height)
- Reduced font sizes for space efficiency

**UIR-107:** Tablet Layout (768px - 1024px)
- Inputs: 2×2 grid
- Summary cards: 2×2 or 4 in a row (depending on space)
- Chart: Full width, height 350px
- Table: Full width, no horizontal scroll

**UIR-108:** Desktop Layout (1025px+)
- Inputs: 2×2 grid or 4 in a row with help tooltips
- Summary cards: 4 in a row
- Chart: Max-width 1000px, centered, height 400px
- Table: Max-width 1000px, centered
- Hover states for all interactive elements

### 4.4 Accessibility Requirements

**UIR-109:** WCAG 2.1 Level AA Compliance
- All inputs have associated `<label>` elements
- Required fields marked with `aria-required="true"`
- Error messages announced via `aria-live="assertive"`
- Focus indicators visible (outline or border highlight)
- Sufficient color contrast: 4.5:1 for text, 3:1 for large text
- Chart has text alternative summary

**UIR-110:** Keyboard Navigation
- Tab order: Inputs → Calculate button → Reset button → Download → Copy
- Enter key in any input triggers calculation
- Chart and table skip links for screen readers

**UIR-111:** Screen Reader Support
- Input labels: "Monthly SIP amount in rupees", "Expected annual return rate percentage"
- Results announced when calculation completes
- Chart described: "Line chart showing investment growth from year 1 to X"
- Table summary: "Year-wise breakdown of SIP investment growth over X years"

### 4.5 Theme Support Requirements

**UIR-112:** Light and Dark Mode
- Background colors: White (light), Dark gray (#1f2937) (dark)
- Card backgrounds: Light gray (light), Darker gray (#374151) (dark)
- Text colors: Dark gray (light), Light gray (dark)
- Chart colors: Maintain visibility in both themes
- Input borders: Subtle in both themes, highlighted on focus

---

## 5. Technical Requirements

### 5.1 Client-Side Constraints

**TR-201:** Pure JavaScript Implementation
- No external libraries required for calculations
- Optional: Use Chart.js or similar library for charting (lightweight <50KB)
- Alternative: Vanilla JavaScript canvas/SVG for charts (more control, zero dependencies)

**TR-202:** Calculation Implementation
```javascript
function calculateSIP(monthly, annualRate, years, stepUpRate = 0) {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  
  if (stepUpRate === 0) {
    // Standard SIP formula
    const fv = monthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvested = monthly * months;
    const returns = fv - totalInvested;
    
    return {
      totalInvested,
      maturityValue: fv,
      returns,
      absoluteReturn: ((fv / totalInvested) - 1) * 100
    };
  } else {
    // SIP with step-up: calculate year-by-year
    // Implementation details...
  }
}
```

**TR-203:** Year-Wise Breakdown Generation
```javascript
function generateYearWiseBreakdown(monthly, annualRate, years, stepUpRate = 0) {
  let breakdown = [];
  let cumulativeInvestment = 0;
  
  for (let year = 1; year <= years; year++) {
    let yearlySIP = monthly * (1 + stepUpRate) ** (year - 1);
    let yearlyInvestment = yearlySIP * 12;
    cumulativeInvestment += yearlyInvestment;
    
    // Calculate expected value at end of this year
    let expectedValue = calculateFVUpToYear(monthly, annualRate, year, stepUpRate);
    let returns = expectedValue - cumulativeInvestment;
    
    breakdown.push({
      year,
      yearlyInvestment,
      cumulativeInvestment,
      expectedValue,
      returns
    });
  }
  
  return breakdown;
}
```

**TR-204:** Currency Formatting
```javascript
function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
```

### 5.2 Performance Requirements

**TR-205:** Response Time Targets
- Calculation completion: <500ms for durations up to 50 years
- Chart rendering: <300ms
- Table rendering: <200ms (for up to 50 rows)
- Total page load: <2 seconds

**TR-206:** Memory Management
- Clear previous results before new calculation
- Limit table rows to 100 years max (reasonable constraint)
- Destroy and recreate chart on recalculation (prevent memory leaks)

### 5.3 Browser Compatibility

**TR-207:** Supported Browsers
- Chrome 90+ (priority - 70% of users)
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers: Chrome Mobile, Safari iOS

**TR-208:** Required Web APIs
- Standard Math functions (Math.pow, Math.round)
- Intl.NumberFormat for currency formatting
- Canvas API or SVG for charts
- localStorage for potential future enhancements

### 5.4 Data Storage Requirements

**TR-209:** LocalStorage Usage (Optional for MVP)
- Store recently calculated scenarios (max 5)
- Store user preferences (chart type, currency format)
- Key: `sipCalculatorHistory`
- Value: JSON array of calculation objects

**TR-210:** No Server-Side Storage
- All calculations happen client-side
- No user data sent to servers
- Export functionality generates files locally

---

## 6. Testing Requirements

### 6.1 Test Scenarios

**TS-201:** Basic SIP Calculation (No Step-Up)
- **Input:** Monthly: ₹5,000, Rate: 12%, Duration: 10 years
- **Expected Output:** 
  - Total Investment: ₹6,00,000
  - Maturity Value: ~₹11,61,695
  - Returns: ~₹5,61,695
  - Absolute Return: ~93.6%
- **Validation:** Compare with known SIP calculator results

**TS-202:** SIP with Step-Up
- **Input:** Monthly: ₹5,000, Rate: 12%, Duration: 10 years, Step-Up: 10%
- **Expected Output:** 
  - Total Investment: ~₹9,47,190
  - Maturity Value: ~₹18,78,236
  - Returns: ~₹9,31,046
- **Validation:** Manual verification or comparison with step-up calculators

**TS-203:** Edge Case - Minimum Values
- **Input:** Monthly: ₹500, Rate: 1%, Duration: 1 year
- **Expected:** Calculation completes without errors, reasonable results

**TS-204:** Edge Case - Maximum Values
- **Input:** Monthly: ₹10,00,000, Rate: 30%, Duration: 50 years
- **Expected:** Calculation completes, warning about high return rate

**TS-205:** Long Duration Performance
- **Input:** Duration: 50 years
- **Expected:** Calculation completes in <500ms, table renders all 50 rows

**TS-206:** Chart Rendering
- **Input:** Various scenarios
- **Expected:** Chart displays correctly, scales properly, both series visible and distinguishable

**TS-207:** Export Functionality
- **Action:** Click "Download CSV"
- **Expected:** CSV file downloads with correct data, proper formatting

**TS-208:** Responsive Design
- **Action:** Test on mobile (375px), tablet (768px), desktop (1920px)
- **Expected:** Layout adapts appropriately, all elements accessible

### 6.2 Edge Cases

**EC-201:** Zero Step-Up Rate
- **Input:** Step-up rate = 0%
- **Expected:** Behaves identically to no step-up

**EC-202:** Very Low Return Rate
- **Input:** Return rate = 1%
- **Expected:** Calculation works, modest growth shown

**EC-203:** Very High Step-Up Rate
- **Input:** Step-up rate = 20%
- **Expected:** Warning about aggressive step-up, calculation proceeds

**EC-204:** Short Duration with High Step-Up
- **Input:** Duration = 1 year, Step-up = 10%
- **Expected:** Step-up doesn't apply (happens annually starting year 2)

**EC-205:** Invalid Inputs
- **Input:** Negative values, non-numeric characters
- **Expected:** Validation errors prevent calculation, helpful error messages

**EC-206:** Decimal Values
- **Input:** Monthly = ₹5,500.50, Rate = 12.5%
- **Expected:** Handles decimals correctly, rounds final values appropriately

### 6.3 Performance Benchmarks

| Scenario | Target Time | Acceptable | Unacceptable |
|----------|-------------|------------|--------------|
| Calculate 10-year SIP | <100ms | <200ms | >500ms |
| Calculate 30-year SIP | <200ms | <400ms | >1s |
| Calculate 50-year SIP | <500ms | <800ms | >2s |
| Render chart | <300ms | <500ms | >1s |
| Render 50-row table | <200ms | <400ms | >1s |
| Export CSV | <200ms | <500ms | >1s |

---

## 7. Success Metrics

### 7.1 User Engagement Metrics

**EM-201:** Calculation Completion Rate
- **Target:** 70% of users who enter inputs complete full calculation
- **Measurement:** (Users who click Calculate) / (Users who enter any input)
- **Success Indicator:** High completion = good UX, clear value proposition

**EM-202:** Multi-Scenario Exploration
- **Target:** Average 2.5 calculations per user session
- **Measurement:** Count of Calculate button clicks per unique visitor
- **Insight:** Users comparing different investment scenarios

**EM-203:** Duration Distribution
- **Tracking:** What investment durations users most commonly enter
- **Hypothesis:** 10-20 year durations most popular
- **Insight:** Understand typical user planning horizons

**EM-204:** Step-Up Feature Usage
- **Target:** 40% of calculations include step-up rate
- **Measurement:** (Calculations with step-up > 0) / (Total calculations)
- **Success Indicator:** Feature adoption validates development effort

### 7.2 Feature Adoption Metrics

**AM-201:** Export Feature Usage
- **Target:** 25% of completed calculations result in export/copy
- **Measurement:** (Export or Copy clicks) / (Calculate clicks)
- **Insight:** Users finding value worth saving

**AM-202:** Mobile vs Desktop Usage
- **Target:** 50% mobile usage
- **Measurement:** Device type from analytics
- **Insight:** Validates mobile-first design importance

### 7.3 Performance Metrics

**PM-201:** Calculation Response Time
- **Measure:** Actual time from Calculate click to results display
- **Target:** 95th percentile <500ms
- **Monitoring:** Track performance across different browsers/devices

**PM-202:** Page Load Time
- **Measure:** Time to interactive
- **Target:** <2 seconds on 4G connection
- **Monitoring:** Use browser performance APIs

**PM-203:** Error Rate
- **Measure:** (Calculations resulting in errors) / (Total calculation attempts)
- **Target:** <5% (mostly user input errors)
- **Monitoring:** Track unexpected errors (bugs) separately

### 7.4 User Satisfaction Metrics

**SM-201:** Tool Rating
- **Collection:** Optional feedback form
- **Target:** 4.5/5 stars average
- **Qualitative:** Read comments for feature requests

**SM-202:** Return Usage Rate
- **Measure:** Users who return within 30 days
- **Target:** 40% return rate
- **Insight:** Tool provides ongoing value

**SM-203:** Session Duration
- **Measure:** Average time spent on SIP calculator page
- **Target:** 3+ minutes (indicates exploration, not confusion)
- **Insight:** Balance between quick utility and deep engagement

---

## 8. Dependencies

### 8.1 Feature Dependencies

**FD-201:** No Blocking Dependencies
- SIP calculator is a standalone tool
- Does not require other features to be completed first
- Can be developed in parallel with JSON Schema enhancement

### 8.2 Shared Components Needed

**SC-201:** Button Component
- Primary and secondary variants
- Loading state for Calculate button (optional)
- Disabled state for empty inputs

**SC-202:** Input Component
- Number input with validation
- Label and help text support
- Error state display

**SC-203:** Card Component
- Summary card with large number and label
- Color-coded variants
- Responsive sizing

**SC-204:** Theme System
- CSS variables for colors
- Light/dark mode toggle
- Consistent across all tools

**SC-205:** Utility Functions
- Currency formatter (INR with thousand separators)
- Number validation
- CSV export helper
- Clipboard copy helper

### 8.3 Technical Dependencies

**TD-201:** Charting Solution
- **Option 1:** Chart.js (~50KB) - Easy integration, feature-rich
- **Option 2:** Vanilla JavaScript Canvas - Zero dependencies, full control
- **Decision:** Architect to recommend based on overall platform strategy

**TD-202:** CSV Generation
- Simple comma-separated format
- No library required (vanilla JS implementation)
- Fallback for browsers that don't support download attribute

---

## 9. Implementation Notes

### 9.1 Calculation Accuracy

**Important:** Financial calculations must be accurate to avoid user mistrust.

- Use `Math.round()` for final display values (to nearest rupee)
- Maintain full precision during intermediate calculations
- Test against established calculators (e.g., Groww, ET Money, MoneyControl)
- Consider adding disclaimer: "Results are estimates based on assumed returns"

### 9.2 Step-Up Implementation

Step-up SIP requires year-by-year calculation:

```javascript
function calculateSIPWithStepUp(initialMonthly, annualRate, years, stepUpRate) {
  let totalInvested = 0;
  let maturityValue = 0;
  
  for (let year = 1; year <= years; year++) {
    let yearlyMonthly = initialMonthly * Math.pow(1 + stepUpRate / 100, year - 1);
    let yearlyInvestment = yearlyMonthly * 12;
    totalInvested += yearlyInvestment;
    
    // Calculate FV of this year's investments at the end of total period
    let remainingMonths = (years - year + 1) * 12;
    let monthlyRate = annualRate / 12 / 100;
    let yearlyFV = yearlyMonthly * (((Math.pow(1 + monthlyRate, remainingMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    
    maturityValue += yearlyFV;
  }
  
  return {
    totalInvested,
    maturityValue,
    returns: maturityValue - totalInvested
  };
}
```

### 9.3 Chart Implementation Tips

**For Chart.js:**
```javascript
const ctx = document.getElementById('sipChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: yearLabels, // [1, 2, 3, ..., years]
    datasets: [
      {
        label: 'Total Investment',
        data: investmentData,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4
      },
      {
        label: 'Expected Value',
        data: valueData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    // Additional options...
  }
});
```

**For Vanilla Canvas:**
- Calculate scaling factors based on data range
- Draw axes with labels
- Plot lines point-by-point
- Add legend manually
- More control but more code

### 9.4 CSV Export Format

```csv
SIP Calculator Results - Generated on 2026-03-19

Input Parameters:
Monthly SIP Amount,₹5000
Expected Annual Return,12%
Duration,10 years
Step-Up Rate,0%

Summary:
Total Investment,₹600000
Expected Returns,₹561695
Maturity Value,₹1161695
Absolute Return,93.62%

Year-wise Breakdown:
Year,Investment This Year,Cumulative Investment,Expected Value,Returns
1,60000,60000,63600,3600
2,60000,120000,134832,14832
...
10,60000,600000,1161695,561695
```

---

## 10. Appendix

### 10.1 Example Calculation

**Scenario:** Monthly ₹5,000, 12% annual, 10 years, no step-up

**Formula:**
```
Monthly rate r = 12 / 12 / 100 = 0.01
Months n = 10 × 12 = 120

FV = 5000 × [((1.01^120 - 1) / 0.01)] × 1.01
FV = 5000 × [(3.3004 - 1) / 0.01] × 1.01
FV = 5000 × 230.04 × 1.01
FV = 5000 × 232.34
FV = 1,161,695

Total Invested = 5000 × 120 = 600,000
Returns = 1,161,695 - 600,000 = 561,695
Absolute Return = (1,161,695 / 600,000 - 1) × 100 = 93.62%
```

### 10.2 Related Resources

- **SIP Concept:** https://www.moneycontrol.com/mf/mf_sip_article.php
- **Compound Interest Formula:** https://en.wikipedia.org/wiki/Compound_interest
- **Chart.js Documentation:** https://www.chartjs.org/docs/
- **Intl.NumberFormat:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat

### 10.3 Disclaimer Text

Recommended disclaimer to display on the tool:

> **Disclaimer:** This calculator provides estimates based on assumed rates of return. Actual investment returns may vary and are subject to market risks. Past performance is not indicative of future results. Please consult with a financial advisor before making investment decisions.

---

**Document Status:** ✅ Complete and Ready for Implementation  
**Approved By:** Product Owner  
**Date:** March 19, 2026  
**Next Step:** Solution Architect to review and integrate into technical architecture
