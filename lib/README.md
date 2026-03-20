# Third-Party Libraries

This directory contains third-party JavaScript libraries used by the JSON Schema Converter tools.

## Libraries Included

### Chart.js v4.4.0
- **File:** `chart.umd.min.js`
- **Homepage:** https://www.chartjs.org/
- **License:** MIT License
- **SRI Hash:** `sha384-e6nUZLBkQ86NJ6TVVKAeSaK8jWa3NhkYWZFomE39AvDbQWeie9PlQqM3pmYW5d1g`
- **Used By:** SIP Calculator, EMI Calculator
- **Purpose:** Chart rendering for financial calculations and visualizations

### DOMPurify v3.0.6
- **File:** `purify.min.js`
- **Homepage:** https://github.com/cure53/DOMPurify
- **License:** Apache License 2.0 OR Mozilla Public License 2.0
- **SRI Hash:** `sha384-cwS6YdhLI7XS60eoDiC+egV0qHp8zI+Cms46R0nbn8JrmoAzV9uFL60etMZhAnSu`
- **Used By:** HTML/Markdown Converter
- **Purpose:** Sanitizing HTML to prevent XSS attacks

### Marked v9.1.6
- **File:** `marked.min.js`
- **Homepage:** https://marked.js.org/
- **License:** MIT License
- **SRI Hash:** `sha384-odPBjvtXVM/5hOYIr3A1dB+flh0c3wAT3bSesIOqEGmyUA4JoKf/YTWy0XKOYAY7`
- **Used By:** HTML/Markdown Converter
- **Purpose:** Converting Markdown to HTML

### Turndown v7.1.2
- **File:** `turndown.min.js`
- **Homepage:** https://github.com/mixmark-io/turndown
- **License:** MIT License
- **SRI Hash:** `sha384-4E5fAjneTPSZB7TRmAH/1xQBJJTzeTfqpmhmI/uCnSvowQXSeDCRqAr0KWF7io1G`
- **Used By:** HTML/Markdown Converter
- **Purpose:** Converting HTML to Markdown

### jsdiff v5.1.0
- **File:** `diff.min.js`
- **Homepage:** https://github.com/kpdecker/jsdiff
- **License:** BSD-3-Clause License
- **SRI Hash:** `sha384-kfJm1UHujU89hXr0VHT0u0t4lqavqaoomP6wix8D9fhzTeFvC9DYyaT36//Qd144`
- **Used By:** Text Diff Checker
- **Purpose:** Text comparison and diff generation

## Security

All libraries are:
1. Downloaded from trusted CDN (jsDelivr)
2. Verified with Subresource Integrity (SRI) hashes
3. Served locally to eliminate external dependencies
4. Versioned and locked to prevent automatic updates

## Updates

To update a library:
1. Download the new version from the official CDN
2. Generate a new SRI hash: `cat <file> | openssl dgst -sha384 -binary | openssl base64 -A`
3. Update the SRI hash in this file and in all tools that use it
4. Test thoroughly before deploying

## License Compliance

This project uses third-party libraries under their respective licenses:
- MIT License: Chart.js, Marked, Turndown
- Apache/MPL 2.0: DOMPurify
- BSD-3-Clause: jsdiff

All licenses permit commercial and non-commercial use with proper attribution.
