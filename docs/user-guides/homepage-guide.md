# DevToolbox Homepage Guide

## Overview
The DevToolbox homepage is your gateway to 5 developer tools with a culturally-inspired Heritage Evolution Design featuring dual-theme support and modern Material Symbols icons.

---

## 🎨 Features

### Dual-Theme Support
DevToolbox features two distinct visual themes that adapt to your preference:

#### Light Mode: "Indic Futurism"
- **Visual Character:** Warm, organic, sophisticated professional aesthetic
- **Colors:** Terracotta red (#C84B31), honey gold accents (#E3A857), warm off-white background
- **Design Elements:** 
  - Soft drop shadows
  - Arch-shaped card tops (inspired by traditional architecture)
  - Rounded tag pills
  - Warm, inviting atmosphere

#### Dark Mode: "Neon Heritage"
- **Visual Character:** Cyberpunk, sharp, neon-infused aesthetic
- **Colors:** Neon orange (#FF6B35), cyan accents (#00F0FF), near-black background
- **Design Elements:**
  - Neon glow effects (radial gradients)
  - Cyan border highlights
  - Sharp, modern corners
  - High-tech atmosphere

**Toggle Theme:** Click the sun ☀️ or moon 🌙 icon in the top-right corner to switch themes. Your preference is saved automatically.

---

## 🛠️ Available Tools

### 1. JSON Schema Validator
**Icon:** 📋 (data_object)  
**Purpose:** Validate JSON documents against JSON Schema specifications  
**Use Cases:**
- API contract validation
- Configuration file validation
- Data structure verification

**Link:** [/tools/json-schema/](../../tools/json-schema/)

---

### 2. HTML ↔ Markdown Converter
**Icon:** 📝 (code_blocks)  
**Purpose:** Bidirectional conversion between HTML and Markdown  
**Use Cases:**
- Blog post conversion
- Documentation format switching
- Content migration

**Link:** [/tools/html-markdown/](../../tools/html-markdown/)

---

### 3. Text Diff Checker
**Icon:** 🔀 (difference)  
**Purpose:** Compare two text files and visualize differences  
**Use Cases:**
- Code review
- Content comparison
- Change detection

**Link:** [/tools/text-diff/](../../tools/text-diff/)

---

### 4. SIP Calculator
**Icon:** 📈 (trending_up)  
**Purpose:** Calculate Systematic Investment Plan returns with compound interest  
**Use Cases:**
- Investment planning
- Wealth projection
- Financial goal setting

**Link:** [/tools/sip-calculator/](../../tools/sip-calculator/)

---

### 5. EMI Calculator
**Icon:** 🏦 (account_balance)  
**Purpose:** Calculate Equated Monthly Installments for loans  
**Use Cases:**
- Loan planning
- Mortgage calculations
- Debt management

**Link:** [/tools/emi-calculator/](../../tools/emi-calculator/)

---

## 📱 Responsive Design

The homepage adapts seamlessly to your device:

### Mobile (320px - 639px)
- **Layout:** Single column
- **Cards:** Stacked vertically, full width
- **Navigation:** Hamburger menu (button visible)
- **Padding:** Compact (16px sides)

### Tablet (640px - 1023px)
- **Layout:** Two columns
- **Cards:** 2-up grid layout
- **Navigation:** Visible in header
- **Padding:** Medium (40px sides)

### Desktop (1024px+)
- **Layout:** Three columns
- **Cards:** 3-up grid layout
- **Navigation:** Full horizontal menu
- **Padding:** Spacious (160px sides)

---

## ♿ Accessibility

The homepage is designed to be accessible to all users:

### Keyboard Navigation
1. **Tab** through interactive elements in logical order:
   - Logo/home link
   - Navigation links (Home, Tools, About)
   - Theme toggle button
   - Tool cards (1-5)
2. **Enter** or **Space** to activate links/buttons
3. **Shift + Tab** to reverse direction

### Screen Reader Support
- Semantic HTML structure with proper headings
- ARIA labels on all interactive elements
- Skip links for quick navigation
- Descriptive alt text on icons

### Visual Accessibility
- **Color Contrast:** WCAG 2.1 AA compliant (4.5:1+ for text)
- **Focus Indicators:** Visible focus rings on all interactive elements
- **Text Scaling:** Layout adapts to browser text zoom
- **Motion:** Smooth transitions without rapid flashing

---

## 🔒 Privacy & Security

DevToolbox is **privacy-first** by design:

- ✅ **Zero Tracking:** No analytics, no cookies, no data collection
- ✅ **Browser-Only:** All tools run entirely in your browser
- ✅ **No Backend:** No data ever leaves your device
- ✅ **Open Source:** Code is transparent and auditable
- ✅ **Offline Capable:** Works without internet (after initial load)

**Privacy Badge:** The 🔒 "No tracking" badge in the hero section confirms this commitment.

---

## 🎯 Getting Started

1. **Choose Your Theme:** Click the sun/moon icon to switch between light and dark modes
2. **Browse Tools:** Scroll through the 5 tool cards
3. **Select a Tool:** Click any card to navigate to that tool
4. **Return Home:** Click "DevToolbox" logo or "Home" link to return

---

## 🔧 Technical Details

For developers interested in the implementation:

### Design System
- **Framework:** Heritage Evolution Design System
- **CSS Approach:** Utility-first (Tailwind-inspired)
- **Icons:** Material Symbols Outlined (Google Fonts)
- **Typography:** 
  - Headings: Rozha One (serif)
  - Body: Plus Jakarta Sans (sans-serif)

### Performance
- **HTML Size:** 409 lines (91% reduction from legacy)
- **CSS Bundle:** 64KB total (utilities + themes + variables)
- **JavaScript:** Minimal (<5KB) - theme toggle only
- **Load Time:** <3 seconds (target)

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## ❓ Frequently Asked Questions

### How do I change themes?
Click the sun ☀️ (light mode) or moon 🌙 (dark mode) icon in the top-right corner. Your preference is saved automatically.

### Do I need to create an account?
No! All tools work immediately without sign-up, login, or any account creation.

### Is my data stored anywhere?
No. All tools run entirely in your browser. Your data never leaves your device.

### Can I use DevToolbox offline?
Yes! After the initial page load, most tools work offline (except features requiring external resources).

### Are the tools free?
Yes, all tools are completely free with no usage limits or premium tiers.

### Where is the mobile menu?
The hamburger menu button is visible on mobile devices but navigation links are also available by scrolling.

---

## 📚 Additional Resources

- **Documentation:** [/docs/README.md](../README.md)
- **Architecture:** [/docs/ARCHITECTURE.md](../ARCHITECTURE.md)
- **Design System:** [/docs/design/DESIGN_SYSTEM_FOUNDATION.md](../design/DESIGN_SYSTEM_FOUNDATION.md)
- **Testing Guide:** [/docs/testing/INDEX.md](../testing/INDEX.md)

---

## 🤝 Feedback & Support

DevToolbox is an open-source project welcoming feedback and contributions:

- **Report Issues:** Use your feedback mechanism (GitHub issues, etc.)
- **Request Features:** Share ideas for new tools or improvements
- **Contribute:** See [/docs/DEVELOPER_GUIDE.md](../DEVELOPER_GUIDE.md)

---

**Last Updated:** March 23, 2026  
**Version:** Phase 2 (Heritage Evolution Design)  
**Status:** ✅ Production Ready

---

[← Back to Documentation](../README.md)
