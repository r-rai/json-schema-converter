#!/usr/bin/env node

/**
 * Bundle Size Checker
 * Validates file sizes against performance budget
 * 
 * @file tools/check-bundle-size.js
 * Sprint 2 - Day 5 - Performance Monitoring
 * Created: March 20, 2026
 * 
 * Usage:
 *   node tools/check-bundle-size.js
 *   node tools/check-bundle-size.js --verbose
 *   node tools/check-bundle-size.js --json
 */

const fs = require('fs');
const path = require('path');

/**
 * Simple glob pattern matching
 * @param {string} pattern - Glob pattern
 * @param {string} basePath - Base directory path
 * @returns {string[]} - Matching file paths
 */
function matchGlob(pattern, basePath) {
  const results = [];
  
  // Handle simple wildcard patterns
  if (pattern.includes('*')) {
    const dir = path.dirname(pattern);
    const filePattern = path.basename(pattern);
    const fullDir = path.join(basePath, dir);
    
    if (!fs.existsSync(fullDir)) {
      return results;
    }
    
    const files = fs.readdirSync(fullDir);
    const regex = new RegExp('^' + filePattern.replace(/\*/g, '.*') + '$');
    
    files.forEach(file => {
      if (regex.test(file)) {
        results.push(path.join(dir, file));
      }
    });
  } else {
    // Exact file path
    if (fs.existsSync(path.join(basePath, pattern))) {
      results.push(pattern);
    }
  }
  
  return results;
}

/**
 * Parse size string to bytes
 * @param {string} sizeStr - Size string (e.g., "10KB", "1.5MB")
 * @returns {number} - Size in bytes
 */
function parseSize(sizeStr) {
  const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*(KB|MB|B)?$/i);
  if (!match) {
    throw new Error(`Invalid size format: ${sizeStr}`);
  }

  const value = parseFloat(match[1]);
  const unit = (match[2] || 'B').toUpperCase();

  const multipliers = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024
  };

  return Math.ceil(value * multipliers[unit]);
}

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted string
 */
function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Get status emoji
 * @param {boolean} passed - Whether budget passed
 * @param {boolean} critical - Whether budget is critical
 * @returns {string} - Status emoji
 */
function getStatusEmoji(passed, critical) {
  if (passed) {
    return '✅';
  }
  return critical ? '❌' : '⚠️';
}

/**
 * Get progress bar
 * @param {number} percentage - Percentage (0-100+)
 * @param {number} width - Bar width in characters
 * @returns {string} - Progress bar string
 */
function getProgressBar(percentage, width = 20) {
  const filled = Math.min(Math.floor((percentage / 100) * width), width);
  const empty = Math.max(width - filled, 0);
  
  const fillChar = percentage > 100 ? '█' : '▓';
  const emptyChar = '░';
  
  return fillChar.repeat(filled) + emptyChar.repeat(empty);
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');
  const jsonOutput = args.includes('--json');
  
  // Read budget configuration
  const budgetPath = path.join(__dirname, '../performance-budget.json');
  
  if (!fs.existsSync(budgetPath)) {
    console.error('❌ Error: performance-budget.json not found');
    console.error(`   Expected at: ${budgetPath}`);
    process.exit(1);
  }

  const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
  const basePath = path.join(__dirname, '..');

  if (!jsonOutput) {
    console.log('📊 Performance Budget Check');
    console.log('='.repeat(70));
    console.log();
  }

  let allPassed = true;
  const results = [];

  // Check each budget item
  budget.budgets.forEach(item => {
    let totalSize = 0;
    const fileDetails = [];

    // Process each file pattern
    item.files.forEach(pattern => {
      const matches = matchGlob(pattern, basePath);
      
      matches.forEach(file => {
        const filePath = path.join(basePath, file);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
          fileDetails.push({
            file: file,
            size: stats.size
          });
        }
      });
    });

    // Calculate results
    const maxBytes = parseSize(item.maxSize);
    const passed = totalSize <= maxBytes;
    const percentage = ((totalSize / maxBytes) * 100);
    
    if (!passed && item.critical) {
      allPassed = false;
    }
    
    if (!passed && !item.critical && percentage > 110) {
      allPassed = false; // Fail non-critical if >110%
    }

    results.push({
      name: item.name,
      description: item.description,
      totalSize,
      maxSize: maxBytes,
      passed,
      percentage: percentage.toFixed(1),
      critical: item.critical || false,
      files: fileDetails,
      info: item.info || null
    });
  });

  // Output results
  if (jsonOutput) {
    console.log(JSON.stringify({
      success: allPassed,
      timestamp: new Date().toISOString(),
      results: results.map(r => ({
        name: r.name,
        passed: r.passed,
        size: formatSize(r.totalSize),
        limit: formatSize(r.maxSize),
        percentage: r.percentage,
        critical: r.critical
      }))
    }, null, 2));
  } else {
    // Display results
    results.forEach(result => {
      const status = getStatusEmoji(result.passed, result.critical);
      const sizeStr = formatSize(result.totalSize);
      const maxStr = formatSize(result.maxSize);
      const criticalLabel = result.critical ? ' [CRITICAL]' : '';
      const bar = getProgressBar(parseFloat(result.percentage));

      console.log(`${status} ${result.name}${criticalLabel}`);
      console.log(`   ${result.description}`);
      console.log(`   Size: ${sizeStr} / ${maxStr} (${result.percentage}%)`);
      console.log(`   ${bar}`);

      // Show file details if verbose or over budget
      if (verbose || !result.passed) {
        result.files.forEach(f => {
          console.log(`     - ${f.file}: ${formatSize(f.size)}`);
        });
      }

      if (result.info) {
        console.log(`   ℹ️  ${result.info}`);
      }

      console.log();
    });

    console.log('='.repeat(70));

    // Summary
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    const criticalFailed = results.filter(r => !r.passed && r.critical).length;

    if (allPassed) {
      console.log('✅ All budgets passed!');
      console.log(`   ${passedCount}/${totalCount} budgets within limits`);
    } else {
      console.log('❌ Some budgets exceeded!');
      console.log(`   ${passedCount}/${totalCount} budgets passed`);
      
      if (criticalFailed > 0) {
        console.log(`   ⚠️  ${criticalFailed} CRITICAL budget(s) failed`);
      }
      
      console.log();
      console.log('🔧 Actions required:');
      console.log('   1. Review and optimize large files');
      console.log('   2. Consider code splitting');
      console.log('   3. Remove unused dependencies');
      console.log('   4. Run minification if not already done');
    }

    console.log();
    console.log('💡 Tips:');
    console.log('   - Run with --verbose to see all file sizes');
    console.log('   - Run with --json for CI/CD integration');
    console.log('   - Gzip typically reduces sizes by 60-70%');
  }

  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { parseSize, formatSize, matchGlob };
