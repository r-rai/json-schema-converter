# Feature Specification: EMI Calculator with Prepayment Module

**Feature ID:** F-005  
**Feature Name:** Home Loan EMI Calculator with Prepayment Scenarios  
**Priority:** Medium (High Complexity)  
**RICE Score:** 840  
**Timeline:** Weeks 8-10  
**Status:** Specification Complete  
**Last Updated:** March 19, 2026

---

## 1. Feature Overview

### 1.1 Description

A comprehensive home loan EMI calculator with advanced prepayment modeling capabilities. Enables borrowers to calculate monthly EMI, view year-wise amortization schedules, and model multiple prepayment scenarios (lumpsum and recurring) to optimize interest savings. Unique feature: side-by-side comparison of original vs revised loan schedules.

### 1.2 Business Value

- **Differentiation:** Advanced prepayment modeling rare in free calculators
- **High engagement:** Complex tool encourages exploration (5-10 min sessions)
- **Target Indian market:** Growing home loan market (₹25+ trillion outstanding)
- **Viral potential:** Users share savings insights with peers
- **Future monetization:** Premium features (tax calculation, refinancing analysis)
- **Zero infrastructure cost:** Client-side calculations

### 1.3 Target Users

- **Primary:** Homebuyers and existing home loan borrowers (25-45 age group)
- **Secondary:** Financial advisors counseling clients on prepayment strategies
- **Tertiary:** Home buyers comparing loan offers

### 1.4 RICE Score Breakdown

| Component | Score | Rationale |
|-----------|-------|-----------|
| **Reach** | 1200 users/quarter | Large home loan market, high search volume |
| **Impact** | 3 (High) | Significant value - helps save lakhs in interest |
| **Confidence** | 70% | Proven demand, but complex implementation may face challenges |
| **Effort** | 3 weeks | High complexity - multiple calculations, comparisons, charts |
| **RICE Score** | **840** | (1200 × 3 × 0.70) / 3 = 840 |

---

## 2. User Stories

### 2.1 Primary User Story

**US-040:** Basic EMI Calculation with Amortization

> **As a** homebuyer with a loan  
> **I want to** calculate my monthly EMI and see year-wise breakdown of principal and interest  
> **So that** I can understand my monthly commitment and total interest burden

**Acceptance Criteria:**

✅ **AC-401:** User can enter loan amount (INR)  
✅ **AC-402:** User can enter annual interest rate (percentage)  
✅ **AC-403:** User can enter loan tenure (years)  
✅ **AC-404:** Calculator displays monthly EMI amount  
✅ **AC-405:** Calculator displays total interest payable  
✅ **AC-406:** Calculator displays total amount payable (principal + interest)  
✅ **AC-407:** Year-wise amortization table shows: Year, Opening Balance, EMI Paid, Principal Paid, Interest Paid, Closing Balance  
✅ **AC-408:** Table includes totals row at bottom  
✅ **AC-409:** All amounts formatted in INR with thousand separators  
✅ **AC-410:** Calculation completes in <1 second  

### 2.2 Additional User Stories

**US-041:** Prepayment Scenario Modeling

> **As a** loan holder considering prepayments  
> **I want to** model various prepayment scenarios (lumpsum, recurring) and see impact on loan  
> **So that** I can decide optimal prepayment strategy to reduce interest and/or tenure

**Acceptance Criteria:**

✅ **AC-411:** User can add multiple prepayment entries  
✅ **AC-412:** Each prepayment has: Type (Lumpsum/Recurring Monthly/Recurring Annual), Amount, Start Date/Year  
✅ **AC-413:** User can choose prepayment option: Reduce EMI or Reduce Tenure  
✅ **AC-414:** Revised amortization schedule generated with prepayments applied  
✅ **AC-415:** Side-by-side comparison shows Original vs Revised schedule  
✅ **AC-416:** Summary shows interest savings, tenure reduction, and revised EMI  
✅ **AC-417:** User can add, edit, or remove prepayment entries dynamically  

**US-042:** Prepayment Impact Visualization

> **As a** borrower analyzing prepayment benefits  
> **I want to** see visual charts comparing original vs revised loan schedules  
> **So that** I can quickly understand the impact of prepayments

**Acceptance Criteria:**

✅ **AC-418:** Chart 1: Principal vs Interest breakdown over time (stacked bar or area chart)  
✅ **AC-419:** Chart 2: Outstanding balance over time (line chart) - Original vs Revised  
✅ **AC-420:** Charts responsive and readable on mobile devices  
✅ **AC-421:** Legend clearly identifies Original vs Revised series  
✅ **AC-422:** Optional: Hover/tap shows exact values for that year  

**US-043:** Export and Save Scenarios

> **As a** borrower comparing multiple strategies  
> **I want to** export my calculation results and prepayment scenarios  
> **So that** I can review offline or share with family/advisor

**Acceptance Criteria:**

✅ **AC-423:** Export to CSV: Full amortization tables (original and revised)  
✅ **AC-424:** Export to PDF: Summary + charts + tables (optional, may defer to v2)  
✅ **AC-425:** Copy summary to clipboard  
✅ **AC-426:** Export includes all input parameters and prepayment details  

---

## 3. Functional Requirements

### 3.1 Input Fields - Basic EMI Calculator

**FR-501:** Loan Amount
- **Label:** "Loan Amount (₹)"
- **Type:** Number input
- **Minimum:** ₹1,00,000 (1 lakh)
- **Maximum:** ₹10,00,00,000 (10 crore)
- **Default:** ₹25,00,000 (25 lakhs)
- **Validation:** Must be positive integer, show error for invalid input
- **Format:** Display with thousand separators (₹25,00,000)

**FR-502:** Annual Interest Rate
- **Label:** "Annual Interest Rate (%)"
- **Type:** Number input (decimal allowed)
- **Minimum:** 1%
- **Maximum:** 20%
- **Default:** 8.5%
- **Validation:** Must be between 1-20%
- **Help Text:** "Current home loan rates: 8-10% p.a."

**FR-503:** Loan Tenure
- **Label:** "Loan Tenure (Years)"
- **Type:** Number input
- **Minimum:** 1 year
- **Maximum:** 30 years
- **Default:** 20 years
- **Validation:** Must be positive integer
- **Help Text:** "Typical tenures: 15-20 years"

### 3.2 Input Fields - Prepayment Module

**FR-504:** Prepayment Entry Form (Repeatable)

Each prepayment entry includes:

| Field | Type | Options/Range | Description |
|-------|------|---------------|-------------|
| **Prepayment Type** | Radio/Dropdown | Lumpsum, Recurring Monthly, Recurring Annual | How often prepayment occurs |
| **Amount** | Number | ₹1,000 - ₹50,00,000 | Amount per prepayment |
| **Start Year** | Number | 1 to (tenure-1) | When prepayment begins |
| **Start Month** | Number | 1-12 (if Lumpsum or Recurring Monthly) | Specific month for lumpsum/monthly |
| **Prepayment Option** | Radio | Reduce EMI, Reduce Tenure | How to apply prepayment benefit |

**FR-505:** Prepayment Type Details

**Lumpsum:**
- One-time payment at specified year and month
- Example: ₹5,00,000 in Year 3, Month 6

**Recurring Monthly:**
- Additional amount paid every month starting from specified month
- Example: ₹10,000 extra every month starting Year 2, Month 1

**Recurring Annual:**
- Additional amount paid once per year starting from specified year
- Example: ₹1,00,000 extra every year starting Year 2

**FR-506:** Prepayment Option Details

**Reduce EMI:**
- Keep tenure same, reduce monthly EMI after prepayment
- Benefit: Lower monthly burden
- Calculation: Recalculate EMI based on remaining principal and tenure

**Reduce Tenure:**
- Keep EMI same, reduce remaining tenure after prepayment
- Benefit: Finish loan sooner, save more interest
- Calculation: Recalculate tenure based on remaining principal and EMI

**FR-507:** Multiple Prepayments
- User can add up to 10 prepayment entries (reasonable limit)
- Each prepayment is independent
- Applied in chronological order
- UI: "Add Prepayment" button creates new entry form
- "Remove" button deletes a prepayment entry

### 3.3 Calculation Logic

**FR-508:** Basic EMI Formula

```
EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]

Where:
- P = Principal loan amount
- r = Monthly interest rate = Annual Rate / 12 / 100
- n = Total number of months = Years × 12

Total Amount Payable = EMI × n
Total Interest = Total Amount Payable - P
```

**Example:**
```
P = ₹25,00,000
Annual Rate = 8.5%
Tenure = 20 years

r = 8.5 / 12 / 100 = 0.007083
n = 20 × 12 = 240

EMI = [2500000 × 0.007083 × (1.007083)^240] / [(1.007083)^240 - 1]
EMI = [17707.5 × 5.203] / [4.203]
EMI ≈ ₹21,910

Total Payable = 21910 × 240 = ₹52,58,400
Total Interest = 5258400 - 2500000 = ₹27,58,400
```

**FR-509:** Year-Wise Amortization Calculation

For each month M (1 to tenure × 12):
1. **Interest for Month M** = Outstanding Balance × Monthly Interest Rate
2. **Principal for Month M** = EMI - Interest for Month M
3. **Outstanding Balance after M** = Outstanding Balance - Principal for Month M

Aggregate by year:
- **Opening Balance (Year Y)** = Outstanding balance at start of year Y
- **EMI Paid (Year Y)** = EMI × 12
- **Principal Paid (Year Y)** = Sum of monthly principal for 12 months
- **Interest Paid (Year Y)** = Sum of monthly interest for 12 months
- **Closing Balance (Year Y)** = Opening Balance - Principal Paid

**FR-510:** Prepayment Application Logic

**General Algorithm:**
1. Calculate original amortization schedule (month-by-month)
2. For each prepayment in chronological order:
   - Identify the month when prepayment occurs
   - Reduce outstanding principal by prepayment amount
   - If "Reduce EMI" option: Recalculate EMI for remaining tenure
   - If "Reduce Tenure" option: Keep EMI same, calculate new tenure
   - Continue amortization with updated values
3. Generate revised amortization schedule
4. Compare original vs revised for savings

**FR-511:** Reduce EMI Calculation

```
After prepayment at month M:
- New Principal = Outstanding Balance - Prepayment Amount
- Remaining Months = Original Tenure Months - M
- New EMI = [New Principal × r × (1 + r)^Remaining] / [(1 + r)^Remaining - 1]
```

**FR-512:** Reduce Tenure Calculation

```
After prepayment at month M:
- New Principal = Outstanding Balance - Prepayment Amount
- Keep EMI same
- New Remaining Months = Calculate using:
  log(EMI / (EMI - New Principal × r)) / log(1 + r)
- New Total Tenure = M + New Remaining Months
```

**FR-513:** Recurring Prepayment Handling

**Recurring Monthly:**
- Treat as additional EMI component each month
- Effective monthly payment = Original EMI + Recurring Amount
- Recalculate tenure or EMI accordingly each month (complex)
- Simplified approach: Apply prepayment at end of each month, recalculate

**Recurring Annual:**
- Apply once per year on specified month
- Similar to lumpsum but repeats annually
- Recalculate after each annual prepayment

### 3.4 Output Requirements

**FR-514:** Summary Cards (Basic EMI)

Display prominently:
1. **Monthly EMI:** ₹21,910
2. **Total Interest:** ₹27,58,400
3. **Total Amount Payable:** ₹52,58,400
4. **Loan Tenure:** 20 years / 240 months

**FR-515:** Summary Cards (With Prepayments)

| Metric | Original | Revised | Savings / Reduction |
|--------|----------|---------|---------------------|
| Monthly EMI | ₹21,910 | ₹19,500 | - ₹2,410 |
| Total Interest | ₹27,58,400 | ₹20,15,300 | ₹7,43,100 saved |
| Total Payable | ₹52,58,400 | ₹45,15,300 | ₹7,43,100 saved |
| Tenure | 20 years | 17 years 5 months | 2 years 7 months faster |

**FR-516:** Year-Wise Amortization Table (Basic)

| Year | Opening Balance | EMI Paid | Principal Paid | Interest Paid | Closing Balance |
|------|----------------|----------|----------------|---------------|-----------------|
| 1 | ₹25,00,000 | ₹2,62,920 | ₹85,080 | ₹1,77,840 | ₹24,14,920 |
| 2 | ₹24,14,920 | ₹2,62,920 | ₹92,255 | ₹1,70,665 | ₹23,22,665 |
| ... | ... | ... | ... | ... | ... |
| 20 | ₹2,45,123 | ₹2,62,920 | ₹24,52,50 | ₹17,670 | ₹0 |
| **Total** | - | **₹52,58,400** | **₹25,00,000** | **₹27,58,400** | - |

**FR-517:** Side-by-Side Comparison Table (With Prepayments)

Show two tables or split table with Original vs Revised columns for each metric.

**FR-518:** Visual Charts

**Chart 1: Principal vs Interest Payment Over Time**
- **Type:** Stacked bar chart or stacked area chart
- **X-Axis:** Year (1 to tenure)
- **Y-Axis:** Amount (₹)
- **Series 1 (Blue):** Principal Paid each year
- **Series 2 (Red):** Interest Paid each year
- **Comparison:** Show both Original and Revised side-by-side or overlayed

**Chart 2: Outstanding Balance Reduction**
- **Type:** Line chart
- **X-Axis:** Year (1 to tenure)
- **Y-Axis:** Outstanding Balance (₹)
- **Line 1 (Blue):** Original schedule
- **Line 2 (Green):** Revised schedule (with prepayments)
- **Benefit:** Visual impact of prepayments

**Chart 3: Cumulative Interest Paid (Optional)**
- **Type:** Line chart
- **X-Axis:** Year
- **Y-Axis:** Cumulative Interest (₹)
- **Shows:** How prepayments reduce interest burden over time

### 3.5 Error Handling

**FR-519:** Input Validation Errors
- Empty required fields: "Please enter loan amount, interest rate, and tenure"
- Out-of-range values: "Loan amount must be between ₹1,00,000 and ₹10,00,00,000"
- Invalid prepayment: "Prepayment year cannot exceed loan tenure"
- Prepayment > Outstanding: "Prepayment amount exceeds outstanding balance at that time"

**FR-520:** Calculation Warnings
- High interest rate (>15%): "This interest rate seems unusually high. Please verify."
- Very long tenure (>30 years): "Tenure exceeds typical home loan period."
- Total prepayments > Loan amount: "Total prepayments exceed loan amount. Loan will close early."

---

## 4. UI/UX Requirements

### 4.1 Layout Design

**UIR-501:** Page Structure (Desktop)

```
┌──────────────────────────────────────────────────────┐
│ Header: "Home Loan EMI Calculator with Prepayment"  │
├──────────────────────────────────────────────────────┤
│ Section 1: Basic Loan Details                       │
│ [Loan Amount] [Interest Rate] [Tenure]              │
│ [Calculate Button]                                   │
├──────────────────────────────────────────────────────┤
│ Section 2: Basic EMI Results                        │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐                        │
│ │EMI │ │Tot │ │Tot │ │Ten │                        │
│ │    │ │Int │ │Pay │ │ure│                        │
│ └────┘ └────┘ └────┘ └────┘                        │
├──────────────────────────────────────────────────────┤
│ Section 3: Prepayment Module (Collapsible)          │
│ ☐ Enable Prepayment Planning                       │
│                                                      │
│ Prepayment 1:                                       │
│ [Type: Lumpsum ▼] [Amount] [Year] [Month]          │
│ [Option: ⚫ Reduce EMI  ⚪ Reduce Tenure]  [Remove]  │
│                                                      │
│ [+ Add Another Prepayment]                          │
│ [Calculate with Prepayments]                        │
├──────────────────────────────────────────────────────┤
│ Section 4: Comparison Summary (If Prepayments)      │
│ Original vs Revised Comparison:                     │
│ [Comparison Cards showing savings]                  │
├──────────────────────────────────────────────────────┤
│ Section 5: Charts                                   │
│ [Principal vs Interest Chart]                       │
│ [Outstanding Balance Chart]                         │
├──────────────────────────────────────────────────────┤
│ Section 6: Amortization Tables                      │
│ Tabs: [Original Schedule] [Revised Schedule]        │
│ [Year-wise breakdown table]                         │
│ [Download CSV] [Copy Summary]                       │
└──────────────────────────────────────────────────────┘
```

**UIR-502:** Mobile Layout

```
┌────────────────────────────────┐
│ Header: "EMI Calculator"       │
├────────────────────────────────┤
│ Loan Details (Collapsible)     │
│ [Loan Amount]                  │
│ [Interest Rate]                │
│ [Tenure]                       │
│ [Calculate]                    │
├────────────────────────────────┤
│ Results (2×2 Grid):            │
│ ┌────┐ ┌────┐                 │
│ │EMI │ │Tot │                 │
│ └────┘ └────┘                 │
│ ┌────┐ ┌────┐                 │
│ │Int │ │Ten │                 │
│ └────┘ └────┘                 │
├────────────────────────────────┤
│ ☐ Prepayment Planning          │
│ [Expandable section]           │
├────────────────────────────────┤
│ Charts (Full width, stacked)   │
│ [Chart 1]                      │
│ [Chart 2]                      │
├────────────────────────────────┤
│ Table (Horizontally scrollable)│
│ [Download] [Copy]              │
└────────────────────────────────┘
```

**UIR-503:** Input Section Design
- Group basic inputs together (loan amount, rate, tenure)
- Clear labels with help icons (tooltips with examples)
- Input fields: min-width 200px, max-width 300px
- Calculate button: Primary color, prominent
- Currency symbol (₹) shown as prefix in input or label

**UIR-504:** Results Section Design
- 4 summary cards (or more with prepayments)
- Large font for key numbers (32-40px)
- Small labels below (14px)
- Color coding: EMI (blue), Interest (red), Total (purple), Tenure (green)
- Comparison cards show Original vs Revised with delta (green for savings)

**UIR-505:** Prepayment Module Design
- Collapsible/expandable section (default: collapsed)
- Checkbox: "Enable Prepayment Planning"
- Each prepayment entry in a card with light border
- "Remove" button (red, small) on each entry
- "+ Add Prepayment" button (green, prominent)
- "Calculate with Prepayments" button (primary, large)

**UIR-506:** Charts Section Design
- Charts stacked vertically or side-by-side (if space)
- Each chart: 400px height on desktop, 300px on mobile
- Responsive canvas, scales with container
- Legend clearly visible
- Axis labels readable
- Comparison charts use contrasting colors

**UIR-507:** Table Section Design
- Tabs for Original vs Revised (if prepayments enabled)
- Sticky header row
- Alternating row colors
- Right-align numeric columns
- Bold total row at bottom
- Mobile: Horizontally scrollable, smaller font

### 4.2 Component List

| Component | Type | Purpose |
|-----------|------|---------|
| `inputLoanAmount` | Number Input | Loan principal amount |
| `inputInterestRate` | Number Input | Annual interest rate |
| `inputTenure` | Number Input | Loan tenure in years |
| `btnCalculate` | Button | Calculate basic EMI |
| `cardEMI` | Card | Display monthly EMI |
| `cardTotalInterest` | Card | Display total interest |
| `cardTotalPayable` | Card | Display total amount |
| `cardTenure` | Card | Display tenure |
| `checkboxEnablePrepayment` | Checkbox | Toggle prepayment module |
| `divPrepaymentEntries` | Container | Holds all prepayment forms |
| `formPrepaymentEntry` | Form (Repeatable) | Single prepayment entry |
| `btnAddPrepayment` | Button | Add new prepayment entry |
| `btnRemovePrepayment` | Button | Remove prepayment entry |
| `btnCalculateWithPrepayments` | Button | Calculate revised schedule |
| `divComparisonSummary` | Container | Show savings comparison |
| `canvasPrincipalInterestChart` | Canvas | Principal vs Interest chart |
| `canvasBalanceChart` | Canvas | Outstanding balance chart |
| `tableAmortization` | Table | Year-wise schedule |
| `btnDownloadCSV` | Button | Export tables to CSV |
| `btnCopySummary` | Button | Copy summary to clipboard |

### 4.3 Responsive Design Requirements

**UIR-508:** Mobile Layout (320px - 767px)
- Stack all inputs vertically
- Summary cards: 2×2 grid
- Prepayment entries: Full width, stacked
- Charts: Full width, height 300px
- Tables: Horizontally scrollable with smaller font
- Larger touch targets (min 44px)

**UIR-509:** Tablet Layout (768px - 1024px)
- Inputs: 2 or 3 per row
- Summary cards: 4 in a row or 2×2
- Charts: Side-by-side if space allows
- Tables: Full width, no scroll

**UIR-510:** Desktop Layout (1025px+)
- Inputs: 3 in a row with spacing
- Summary cards: 4 (or more) in a row
- Charts: Side-by-side (50/50) or stacked
- Tables: Max-width 1400px, centered
- Hover states for all interactive elements

### 4.4 Accessibility Requirements

**UIR-511:** WCAG 2.1 Level AA Compliance
- All inputs have associated `<label>` elements
- Required fields marked with `aria-required="true"`
- Error messages announced via `aria-live="assertive"`
- Focus indicators visible
- Sufficient contrast (4.5:1 for text)
- Charts have text alternative summaries

**UIR-512:** Keyboard Navigation
- Tab order: Inputs → Calculate → Prepayment toggle → Prepayment fields → Calculate → Export
- Enter key in any input triggers calculation
- Delete key on prepayment entry removes it (with confirmation)

**UIR-513:** Screen Reader Support
- Input labels: "Loan amount in rupees", "Annual interest rate in percentage"
- Results announced after calculation: "EMI calculated. Monthly EMI is X rupees."
- Charts described: "Bar chart showing principal and interest breakdown over 20 years"
- Comparison summary: "With prepayments, you save X rupees in interest and finish Y months earlier"

### 4.5 Theme Support Requirements

**UIR-514:** Light and Dark Mode
- Background: White (light), Dark gray (dark)
- Cards: Light gray bg (light), Darker gray bg (dark)
- Text: Black (light), White (dark)
- Charts: Colors visible in both themes (test contrast)
- Input borders: Subtle, highlighted on focus

---

## 5. Technical Requirements

### 5.1 Client-Side Constraints

**TR-601:** Pure JavaScript Implementation
- No external libraries required for calculations
- Optional: Use Chart.js or similar for charts (~50KB)
- Alternative: Vanilla canvas for charts (more code, zero dependencies)

**TR-602:** Calculation Implementation

**Basic EMI:**
```javascript
function calculateEMI(principal, annualRate, years) {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
              (Math.pow(1 + monthlyRate, months) - 1);
  
  const totalPayable = emi * months;
  const totalInterest = totalPayable - principal;
  
  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayable: Math.round(totalPayable),
    tenure: years
  };
}
```

**Amortization Schedule:**
```javascript
function generateAmortizationSchedule(principal, annualRate, years) {
  const monthlyRate = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, years).emi;
  
  let balance = principal;
  let schedule = [];
  
  for (let year = 1; year <= years; year++) {
    let yearData = {
      year: year,
      openingBalance: balance,
      emiPaid: 0,
      principalPaid: 0,
      interestPaid: 0
    };
    
    for (let month = 1; month <= 12; month++) {
      if (balance <= 0) break;
      
      let interest = balance * monthlyRate;
      let principal = Math.min(emi - interest, balance);
      
      yearData.emiPaid += emi;
      yearData.interestPaid += interest;
      yearData.principalPaid += principal;
      
      balance -= principal;
    }
    
    yearData.closingBalance = Math.max(balance, 0);
    schedule.push(yearData);
    
    if (balance <= 0) break;
  }
  
  return schedule;
}
```

**Prepayment Logic:**
```javascript
function applyPrepayments(principal, annualRate, years, prepayments, option) {
  // Complex logic - calculate month-by-month
  // Apply each prepayment at specified time
  // Recalculate EMI or tenure based on option
  // Return revised schedule
  
  // Pseudo-code:
  // 1. Generate month-by-month amortization
  // 2. Sort prepayments by date
  // 3. For each month:
  //    - Apply EMI
  //    - Check if prepayment due this month
  //    - If yes, reduce balance by prepayment
  //    - If "Reduce EMI", recalculate EMI for remaining months
  //    - If "Reduce Tenure", keep EMI, calculate new end date
  // 4. Aggregate to year-wise
  // 5. Return revised schedule
  
  // Implementation: ~200-300 lines of careful logic
}
```

**TR-603:** Currency Formatting

```javascript
function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Or custom formatter for Indian numbering (lakhs, crores):
function formatIndianCurrency(amount) {
  let x = amount.toString();
  let lastThree = x.substring(x.length - 3);
  let otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers != '')
    lastThree = ',' + lastThree;
  return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
}
```

### 5.2 Performance Requirements

**TR-604:** Response Time Targets
- Basic EMI calculation: <100ms
- Amortization schedule (30 years): <500ms
- Prepayment calculation (complex scenarios): <2 seconds
- Chart rendering: <500ms
- Table rendering (30 rows): <300ms

**TR-605:** Memory Management
- Clear previous calculations before new ones
- Limit prepayments to 10 entries (reasonable)
- Destroy and recreate charts on recalculation

### 5.3 Browser Compatibility

**TR-606:** Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile: Chrome Mobile, Safari iOS

**TR-607:** Required Web APIs
- Standard Math functions
- Intl.NumberFormat for currency
- Canvas or SVG for charts
- localStorage (optional, for saving scenarios)

### 5.4 Data Storage Requirements

**TR-608:** LocalStorage Usage (Optional)
- Store recent calculations (max 5)
- Key: `emiCalculatorHistory`
- Value: JSON array of calculation objects
- No permanent storage, respects privacy

**TR-609:** CSV Export Format

```csv
Home Loan EMI Calculator - Generated on 2026-03-19

Input Parameters:
Loan Amount,₹2500000
Annual Interest Rate,8.5%
Tenure,20 years

Summary:
Monthly EMI,₹21910
Total Interest,₹2758400
Total Amount Payable,₹5258400

Amortization Schedule:
Year,Opening Balance,EMI Paid,Principal Paid,Interest Paid,Closing Balance
1,2500000,262920,85080,177840,2414920
2,2414920,262920,92255,170665,2322665
...
20,245123,262920,245123,17797,0

Prepayments Applied:
Type,Amount,Year,Month,Option
Lumpsum,500000,5,6,Reduce Tenure

Revised Schedule:
Year,Opening Balance,EMI Paid,Principal Paid,Interest Paid,Closing Balance
...
```

---

## 6. Testing Requirements

### 6.1 Test Scenarios

**TS-501:** Basic EMI Calculation
- **Input:** ₹25,00,000, 8.5%, 20 years
- **Expected:** EMI ≈ ₹21,910, Total Interest ≈ ₹27,58,400
- **Validation:** Compare with known EMI calculators (HDFC, ICICI)

**TS-502:** Amortization Schedule Accuracy
- **Input:** Same as above
- **Expected:** Sum of Principal Paid = Loan Amount, Sum of EMI = Total Payable
- **Validation:** Year 1 Interest < Year 1 Principal in later years

**TS-503:** Lumpsum Prepayment (Reduce Tenure)
- **Input:** ₹25L loan, ₹5L prepayment in Year 3, Reduce Tenure
- **Expected:** Tenure reduces, EMI stays same, interest savings calculated
- **Validation:** Manual calculation or comparison with other calculators

**TS-504:** Recurring Monthly Prepayment (Reduce EMI)
- **Input:** ₹25L loan, ₹5K extra per month starting Year 2
- **Expected:** EMI reduces, tenure may reduce, interest savings

**TS-505:** Multiple Prepayments
- **Input:** 2 lumpsum + 1 recurring
- **Expected:** All applied in order, correct revised schedule

**TS-506:** Edge Case - Prepayment Exceeds Balance
- **Input:** Large prepayment that exceeds remaining balance
- **Expected:** Loan closes early, remaining prepayment ignored or refunded in calculation

**TS-507:** Very Short Tenure (1 year)
- **Input:** ₹10L, 10%, 1 year
- **Expected:** High EMI, low interest (short duration)

**TS-508:** Very Long Tenure (30 years)
- **Input:** ₹50L, 9%, 30 years
- **Expected:** Lower EMI, very high total interest

**TS-509:** Performance with Multiple Prepayments
- **Input:** 10 different prepayments
- **Expected:** Calculation completes within 2 seconds

**TS-510:** Chart Rendering
- **Input:** Various scenarios
- **Expected:** Charts display correctly, data accurate

### 6.2 Edge Cases

**EC-501:** Minimum Loan Amount
- **Input:** ₹1,00,000
- **Expected:** Calculation works, reasonable EMI

**EC-502:** Maximum Loan Amount
- **Input:** ₹10,00,00,000 (10 crore)
- **Expected:** Calculation works, large numbers formatted correctly

**EC-503:** Very High Interest Rate
- **Input:** 20% annual rate
- **Expected:** Warning shown, calculation proceeds

**EC-504:** Prepayment in First Year
- **Input:** Prepayment in Year 1
- **Expected:** Applied correctly, schedule updated

**EC-505:** Prepayment in Last Year
- **Input:** Prepayment in final year
- **Expected:** Minimal impact, but calculated correctly

**EC-506:** Decimal Values
- **Input:** Loan amount ₹25,50,123.45, Rate 8.75%
- **Expected:** Handles decimals, rounds final EMI appropriately

**EC-507:** Zero Prepayments
- **Input:** Enable prepayment module but don't add any
- **Expected:** Behaves like basic calculator

**EC-508:** Remove All Prepayments After Calculation
- **Input:** Calculate, then remove all prepayments
- **Expected:** UI updates, can recalculate as basic

### 6.3 Performance Benchmarks

| Scenario | Target Time | Acceptable | Unacceptable |
|----------|-------------|------------|--------------|
| Basic EMI calc | <100ms | <200ms | >500ms |
| 30-year amortization | <500ms | <1s | >2s |
| 1 prepayment | <500ms | <1s | >2s |
| 5 prepayments | <1s | <2s | >5s |
| 10 prepayments | <2s | <3s | >5s |
| Chart render | <500ms | <1s | >2s |
| CSV export | <300ms | <500ms | >1s |

### 6.4 Accessibility Acceptance Criteria

**WCAG 2.1 Level AA Compliance:**

**AAC-501:** Keyboard Navigation (Most Critical for Complex Tool)
- ✅ All form inputs keyboard accessible (Tab navigation)
- ✅ Basic EMI inputs: Loan Amount → Interest Rate → Tenure → Calculate
- ✅ "Add Prepayment" button accessible via Tab
- ✅ Prepayment entry fields: Type → Amount → Year/Month → Option → Remove
- ✅ Navigate between multiple prepayment entries logically
- ✅ "Recalculate" button accessible after prepayment changes
- ✅ Table navigation: Arrow keys scroll through amortization rows (if keyboard-navigable)
- ✅ Enter/Space activates all buttons
- ✅ Focus visible throughout (2px outline, 3:1 contrast)
- ✅ No keyboard traps

**AAC-502:** Screen Reader Support (Complex Announcements)
- ✅ Basic inputs labeled: "Loan Amount in Rupees", "Annual Interest Rate Percentage", "Loan Tenure in Years"
- ✅ EMI result announced: "Monthly EMI: Rupees 25,000"
- ✅ Total interest announced: "Total Interest Payable: Rupees10 lakhs"
- ✅ Prepayment section: aria-label="Prepayment Scenarios" role="region"
- ✅ "Add Prepayment" button: aria-label="Add new prepayment entry"
- ✅ Prepayment type dropdown announced: "Prepayment type: Lumpsum, Recurring Monthly, or Recurring Annual"
- ✅ Prepayment option announced: "Choose to reduce EMI or reduce tenure"
- ✅ Remove button: aria-label="Remove prepayment entry [number]"
- ✅ Calculation in progress: aria-live="polite" "Calculating revised schedule..."
- ✅ Calculation complete: aria-live="polite" "Revised schedule ready. Interest saved: Rupees 5 lakhs. Tenure reduced by 3 years."
- ✅ Error messages: aria-live="assertive" "Error: Loan amount must be positive"

**AAC-503:** Visual Accessibility & Chart Alternatives
- ✅ Color contrast: 4.5:1 text, 3:1 UI components
- ✅ Charts have accessible data table fallback:
  ```html
  <div class="sr-only">
    <table aria-label="Loan amortization data">
      <thead><tr><th>Year</th><th>Principal</th><th>Interest</th></tr></thead>
      <tbody><!-- Year-wise data --></tbody>
    </table>
  </div>
  ```
- ✅ Original vs Revised comparison uses labels + colors (not color alone)
- ✅ Success indicators use checkmark icon + green color
- ✅ Error indicators use X icon + red color
- ✅ Prepayment entries visually distinct (cards/boxes)

**AAC-504:** Complex Form State Management
- ✅ Prepayment entry addition announced: "Prepayment entry 1 added"
- ✅ Prepayment entry removal announced: "Prepayment entry 1 removed"
- ✅ Form validation errors announced immediately
- ✅ Validation errors linked to inputs (aria-describedby)
- ✅ Required fields marked with aria-required="true"
- ✅ Disabled states announced: "Calculate button disabled until inputs valid"

**AAC-505:** Table Accessibility
- ✅ Amortization table has proper structure:
  - `<table>` with `<thead>`, `<tbody>`, `<tfoot>` (for totals)
  - Column headers: `<th scope="col">`
  - Row headers (year): `<th scope="row">`
  - aria-label="Original loan amortization schedule"
- ✅ Revised table: aria-label="Revised loan amortization with prepayments"
- ✅ Comparison table: aria-label="Comparison of original vs revised loan"
- ✅ Tables scrollable with keyboard (overflow visible via focus)

**AAC-506:** Testing Requirements
- **Automated:** axe-core scan, zero Level A violations
- **Manual Keyboard:** Complete full workflow including:
  1. Basic EMI calculation
  2. Add 3 prepayment entries (different types)
  3. Remove 1 prepayment entry
  4. Recalculate and review results
  5. Navigate comparison tables
  6. Export data
- **Screen Reader (NVDA):** Complete prepayment workflow via SR only
- **Touch Target Size:** Min 44px height for all buttons (mobile)
- **Result:** Pass all 4 tests before deployment

**Keyboard Navigation Flow (Complete):**
1. Tab to "Loan Amount" input → Enter amount
2. Tab to "Interest Rate" input → Enter rate
3. Tab to "Tenure" input → Enter years
4. Tab to "Calculate EMI" button → Space/Enter to calculate
5. Tab to "Enable Prepayment" toggle/button → Space/Enter
6. Tab to "Add Prepayment" button → Space/Enter (opens prepayment form)
7. Tab to "Prepayment Type" dropdown → Arrow keys to select
8. Tab to "Amount" input → Enter prepayment amount
9. Tab to "Year/Month" input → Enter timing
10. Tab to "Option" radio buttons → Arrow keys: "Reduce EMI" or "Reduce Tenure"
11. Tab to "Remove" button (if want to delete)
12. Tab to "Recalculate" button → Space/Enter
13. Tab to comparison tables → Scroll/read
14. Tab to "Export to CSV" button → Space/Enter
15. Complete complex workflow without mouse ✅

**Critical Accessibility Challenge:**
Managing focus when prepayment entries are dynamically added/removed. Must announce changes and move focus appropriately.

```javascript
// Focus management example
function addPrepaymentEntry() {
  const entry = createPrepaymentForm();
  container.appendChild(entry);
  
  // Announce to screen readers
  announceToSR('Prepayment entry added');
  
  // Move focus to first input of new entry
  entry.querySelector('select, input').focus();
}
```

---

## 7. Success Metrics

### 7.1 User Engagement Metrics

**EM-501:** Calculation Completion Rate
- **Target:** 70% complete basic EMI calculation
- **Measurement:** (Calculate clicks) / (Users who enter inputs)

**EM-502:** Prepayment Module Usage
- **Target:** 60% of calculator users explore prepayment module
- **Measurement:** (Prepayment enabled) / (Total calculations)
- **Insight:** Differentiating feature adoption

**EM-503:** Multi-Scenario Exploration
- **Target:** Average 2.5 prepayment scenarios per user (among those who use prepayment)
- **Measurement:** Prepayment calculations per user session
- **Insight:** Users finding value in comparison

**EM-504:** Session Duration
- **Target:** Average 5-10 minutes
- **Measurement:** Time on page
- **Insight:** Complex tool encourages deep engagement

### 7.2 Feature Adoption Metrics

**AM-501:** Prepayment Type Distribution
- **Track:** Lumpsum vs Recurring Monthly vs Recurring Annual usage
- **Hypothesis:** 50% Lumpsum, 30% Recurring Monthly, 20% Recurring Annual

**AM-502:** Prepayment Option Preference
- **Track:** Reduce EMI vs Reduce Tenure
- **Hypothesis:** 60% Reduce Tenure (max savings), 40% Reduce EMI

**AM-503:** Export Feature Usage
- **Target:** 30% of users export or copy results
- **Insight:** High value, worth saving

### 7.3 Performance Metrics

**PM-501:** Calculation Time
- **Measure:** 95th percentile calculation time
- **Target:** <2s even with multiple prepayments

**PM-502:** Error Rate
- **Measure:** Calculations resulting in errors
- **Target:** <3%

### 7.4 User Satisfaction Metrics

**SM-501:** Tool Rating
- **Target:** 4.5/5 stars
- **Collection:** Optional feedback form

**SM-502:** Return Usage
- **Target:** 45% return within 30 days
- **Insight:** Ongoing loan management use case

---

## 8. Dependencies

### 8.1 Feature Dependencies

**FD-501:** No Blocking Dependencies
- Standalone tool

### 8.2 Shared Components Needed

**SC-501:** Button Component
**SC-502:** Input Component (Number, with currency prefix)
**SC-503:** Card Component (Summary cards)
**SC-504:** Theme System
**SC-505:** Utility Functions (Currency formatter, CSV export, clipboard copy)

### 8.3 Technical Dependencies

**TD-501:** Charting Library (Optional)
- Chart.js (~50KB) - recommended
- Or vanilla canvas implementation

---

## 9. Implementation Notes

### 9.1 Prepayment Logic Complexity

**Most complex part of this feature.** Recommend:
1. Implement basic EMI and amortization first
2. Test thoroughly
3. Then add lumpsum prepayment (simpler)
4. Test thoroughly
5. Then add recurring prepayments (more complex)
6. Extensive testing with real-world scenarios

### 9.2 Validation Against Existing Tools

**Critical:** Calculations must match established calculators.

Test against:
- HDFC EMI Calculator
- ICICI EMI Calculator
- BankBazaar Calculator
- MoneyControl Calculator

If discrepancies, investigate rounding, formula differences, or bugs.

### 9.3 Disclaimer

**Important:** Display clear disclaimer:

> **Disclaimer:** This calculator provides estimates for planning purposes. Actual EMI and interest may vary based on lender's terms, processing fees, and other charges. Prepayment calculations assume no prepayment penalties. Please consult with your lender for accurate figures.

---

## 10. Appendix

### 10.1 Example Calculation Walkthrough

See roadmap document for detailed formula examples.

### 10.2 Related Resources

- EMI Formula: https://en.wikipedia.org/wiki/Equated_monthly_installment
- Loan Amortization: https://en.wikipedia.org/wiki/Amortization_calculator
- Chart.js: https://www.chartjs.org/

---

**Document Status:** ✅ Complete and Ready for Implementation  
**Approved By:** Product Owner  
**Date:** March 19, 2026  
**Next Step:** Solution Architect to review and integrate into technical architecture  
**Note:** This is the most complex feature. Recommend extra testing and phased implementation.
