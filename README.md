# DevToolbox Platform

**A comprehensive suite of browser-based developer tools with zero backend dependencies.**

[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Status](https://img.shields.io/badge/status-production--ready-brightgreen)](./docs/reports/FINAL_QUALITY_VALIDATION_REPORT.md)
[![Security](https://img.shields.io/badge/security-A-brightgreen)](./docs/compliance/SECURITY_POLICY.md)

## 🎯 What is DevToolbox?

DevToolbox is a collection of professional-grade developer utilities that run entirely in your browser. No installation, no data transmission, no tracking—just powerful tools at your fingertips.

### 🛠️ Available Tools

1. **JSON Schema Converter & Validator**
   - Generate JSON schemas from data (Draft-04 through 2020-12)
   - Validate JSON against schemas
   - Format detection (email, URI, date-time)
   - [Documentation](./docs/features/01-json-schema-enhancement.md)

2. **SIP Calculator** 
   - Systematic Investment Planning with step-up rates
   - Compound interest projections
   - Visual growth charts
   - [Documentation](./docs/features/02-sip-calculator.md)

3. **HTML ↔ Markdown Converter**
   - Bidirectional conversion
   - XSS-protected with DOMPurify
   - Live preview
   - [Documentation](./docs/features/03-html-markdown-converter.md)

4. **Text Diff Checker**
   - Side-by-side comparison
   - Line-by-line differences
   - Character-level highlighting
   - [Documentation](./docs/features/04-text-diff-checker.md)

5. **EMI Calculator** 
   - Advanced loan calculator
   - Prepayment modeling
   - Amortization schedules
   - [Documentation](./docs/features/05-emi-calculator.md)

## 🚀 Quick Start

### Option 1: Use Online
Visit: `https://app.mydomain.com`

### Option 2: Local Development
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/json-schema-converter.git
cd json-schema-converter

# Start local server
python3 -m http.server 8000

# Open browser
open http://localhost:8000
```

## 📚 Documentation

**📖 Quick Access:** [Documentation Quick Reference](DOCUMENTATION_QUICK_REFERENCE.md) | [Complete Docs Index](docs/README.md)

### Getting Started
- [Quick Start Guide](./docs/QUICK_START.md) - Get up and running in 5 minutes
- [Developer Guide](./docs/DEVELOPER_GUIDE.md) - Contributing and development setup
- [Visual Walkthrough](./docs/user-guides/VISUAL_WALKTHROUGH.md) - Step-by-step visual guide
- [Manual Testing Guide](./docs/testing/guides/manual-testing.md) - Test the platform manually

### Architecture & Design
- [Architecture Overview](./docs/ARCHITECTURE.md) - System design and technical decisions
- [Architecture Quick Reference](./docs/architecture/overview.md) - 15-minute system overview
- [Repository Index](./docs/architecture/repo-index.md) - Navigate the codebase
- [Function Call Graph](./docs/architecture/function-call-graph.md) - Understand code execution
- [Security Policy](./docs/security/security-policy.md) - Security features and best practices
- [Product Roadmap](./docs/product/roadmap.md) - Future plans and priorities

### Testing & Quality
- [Testing Documentation](./docs/testing/INDEX.md) - Comprehensive testing guide
- [Final Validation Report](./docs/reports/FINAL_QUALITY_VALIDATION_REPORT.md) - Production readiness validation
- [Full Documentation Index](./docs/README.md) - Complete documentation map

### Current Status
- [Current Status](./docs/reports/current-status.md) - **📍 Latest project status and metrics**
- [Project Completion Report](./docs/reports/PROJECT_COMPLETION_REPORT.md) - Final delivery summary

## 🔒 Security & Privacy

- ✅ **100% Client-Side**: All processing happens locally in your browser
- ✅ **Zero Data Transmission**: Your data never leaves your device
- ✅ **No Tracking**: No analytics, no cookies, no third-party scripts
- ✅ **Content Security Policy**: Strict CSP prevents XSS attacks
- ✅ **Input Validation**: Comprehensive validation framework
- ✅ **Open Source**: Full transparency - review the code yourself

[Read Full Security Policy →](./docs/security/security-policy.md)

## 🎨 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Libraries**: 
  - Chart.js (visualizations)
  - DiffMatchPatch (text comparison)
  - Marked.js (Markdown parsing)
  - DOMPurify (XSS protection)
  - Turndown (HTML-to-Markdown)
- **Hosting**: Cloudflare Pages (free tier)
- **CI/CD**: GitHub Actions
- **Zero Backend**: No server-side code, no database

## 📊 Project Status

**Status**: ✅ Production Ready (March 2026)

- ✅ 5/5 features complete and tested
- ✅ 92.3% test pass rate (48/52 tests)
- ✅ 0 critical bugs
- ✅ 60% faster than performance targets
- ✅ $0/month infrastructure cost
- ✅ Comprehensive security audit passed

[View Full Project Report →](./docs/reports/PROJECT_COMPLETION_REPORT.md)

## 🤝 Contributing

Contributions welcome! Please read our [Developer Guide](./docs/DEVELOPER_GUIDE.md) before submitting pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run manual tests (see [Testing Guide](./docs/testing/guides/manual-testing.md))
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🐛 Support & Issues

- **Bug Reports**: [GitHub Issues](https://github.com/YOUR_USERNAME/json-schema-converter/issues)
- **Security Issues**: See [Security Policy](./docs/compliance/SECURITY_POLICY.md#reporting-vulnerabilities)
- **Documentation**: [Full Documentation Index](./docs/README.md)
- **Questions**: Check [Developer Guide](./docs/DEVELOPER_GUIDE.md) or open a discussion

## 🎯 Roadmap

- [x] JSON Schema Converter & Validator
- [x] SIP Calculator with step-up rates
- [x] HTML ↔ Markdown Converter
- [x] Text Diff Checker
- [x] EMI Calculator with prepayment
- [ ] Code Formatter (JSON/XML/CSS/JS)
- [ ] Base64 Encoder/Decoder
- [ ] JWT Decoder
- [ ] Regular Expression Tester

[View Full Roadmap →](./docs/PRODUCT_ROADMAP.md)

---

**Built with ❤️ for developers, by developers.**

Last Updated: March 19, 2026
