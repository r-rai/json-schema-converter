/**
 * Download Module
 * Utilities for downloading files from the browser
 * 
 * @file shared/js/download.js
 */

import { showSuccessToast, showErrorToast } from './utils.js';

/**
 * Download text content as a file
 * @param {string} content - File content
 * @param {string} filename - Desired filename
 * @param {string} mimeType - MIME type (default: 'text/plain')
 * @param {boolean} showNotification - Whether to show success notification
 */
export function downloadFile(content, filename, mimeType = 'text/plain', showNotification = true) {
  try {
    // Create blob from content
    const blob = new Blob([content], { type: mimeType });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    if (showNotification) {
      showSuccessToast(`Downloaded ${filename}`);
    }
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    
    if (showNotification) {
      showErrorToast('Download failed');
    }
    
    return false;
  }
}

/**
 * Download JSON object as .json file
 * @param {Object} data - JSON data to download
 * @param {string} filename - Desired filename (without extension)
 * @param {boolean} prettify - Whether to prettify JSON (default: true)
 * @param {boolean} showNotification - Whether to show notification
 */
export function downloadJSON(data, filename, prettify = true, showNotification = true) {
  try {
    const jsonString = prettify 
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);
    
    const fullFilename = filename.endsWith('.json') 
      ? filename 
      : `${filename}.json`;
    
    return downloadFile(jsonString, fullFilename, 'application/json', showNotification);
  } catch (error) {
    console.error('JSON download failed:', error);
    
    if (showNotification) {
      showErrorToast('Failed to download JSON');
    }
    
    return false;
  }
}

/**
 * Download text as .txt file
 * @param {string} text - Text content
 * @param {string} filename - Desired filename (without extension)
 * @param {boolean} showNotification - Whether to show notification
 */
export function downloadText(text, filename, showNotification = true) {
  const fullFilename = filename.endsWith('.txt') 
    ? filename 
    : `${filename}.txt`;
  
  return downloadFile(text, fullFilename, 'text/plain', showNotification);
}

/**
 * Download CSV data
 * @param {string} csvContent - CSV content as string
 * @param {string} filename - Desired filename (without extension)
 * @param {boolean} showNotification - Whether to show notification
 */
export function downloadCSV(csvContent, filename, showNotification = true) {
  const fullFilename = filename.endsWith('.csv') 
    ? filename 
    : `${filename}.csv`;
  
  return downloadFile(csvContent, fullFilename, 'text/csv', showNotification);
}

/**
 * Convert array of objects to CSV and download
 * @param {Array<Object>} data - Array of objects
 * @param {string} filename - Desired filename
 * @param {Array<string>} headers - Optional custom headers
 * @param {boolean} showNotification - Whether to show notification
 */
export function downloadArrayAsCSV(data, filename, headers = null, showNotification = true) {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }
    
    // Get headers from first object if not provided
    const csvHeaders = headers || Object.keys(data[0]);
    
    // Build CSV content
    const csvRows = [];
    
    // Add header row
    csvRows.push(csvHeaders.join(','));
    
    // Add data rows
    data.forEach(row => {
      const values = csvHeaders.map(header => {
        const value = row[header];
        
        // Escape values containing commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        
        return value !== undefined && value !== null ? value : '';
      });
      
      csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    
    return downloadCSV(csvContent, filename, showNotification);
  } catch (error) {
    console.error('CSV download failed:', error);
    
    if (showNotification) {
      showErrorToast('Failed to download CSV');
    }
    
    return false;
  }
}

/**
 * Download HTML content
 * @param {string} htmlContent - HTML content
 * @param {string} filename - Desired filename (without extension)
 * @param {boolean} showNotification - Whether to show notification
 */
export function downloadHTML(htmlContent, filename, showNotification = true) {
  const fullFilename = filename.endsWith('.html') 
    ? filename 
    : `${filename}.html`;
  
  return downloadFile(htmlContent, fullFilename, 'text/html', showNotification);
}

/**
 * Download Markdown content
 * @param {string} markdownContent - Markdown content
 * @param {string} filename - Desired filename (without extension)
 * @param {boolean} showNotification - Whether to show notification
 */
export function downloadMarkdown(markdownContent, filename, showNotification = true) {
  const fullFilename = filename.endsWith('.md') 
    ? filename 
    : `${filename}.md`;
  
  return downloadFile(markdownContent, fullFilename, 'text/markdown', showNotification);
}

/**
 * Download image data URL
 * @param {string} dataURL - Image data URL
 * @param {string} filename - Desired filename
 * @param {boolean} showNotification - Whether to show notification
 */
export function downloadImage(dataURL, filename, showNotification = true) {
  try {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (showNotification) {
      showSuccessToast(`Downloaded ${filename}`);
    }
    
    return true;
  } catch (error) {
    console.error('Image download failed:', error);
    
    if (showNotification) {
      showErrorToast('Download failed');
    }
    
    return false;
  }
}

/**
 * Create download button for text content
 * @param {string|Function} contentOrGetter - Text content or function that returns content
 * @param {string} filename - Filename to download as
 * @param {string} label - Button label (default: 'Download')
 * @param {string} mimeType - MIME type
 * @returns {HTMLButtonElement} Download button
 */
export function createDownloadButton(
  contentOrGetter,
  filename,
  label = 'Download',
  mimeType = 'text/plain'
) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-primary btn-medium';
  button.textContent = label;
  button.setAttribute('aria-label', `Download ${filename}`);
  
  button.addEventListener('click', () => {
    const content = typeof contentOrGetter === 'function' 
      ? contentOrGetter() 
      : contentOrGetter;
    
    downloadFile(content, filename, mimeType, true);
  });
  
  return button;
}

/**
 * Create download JSON button
 * @param {Object|Function} dataOrGetter - JSON data or function that returns data
 * @param {string} filename - Filename (without extension)
 * @param {string} label - Button label (default: 'Download JSON')
 * @returns {HTMLButtonElement} Download button
 */
export function createDownloadJSONButton(
  dataOrGetter,
  filename,
  label = 'Download JSON'
) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-primary btn-medium';
  button.textContent = label;
  button.setAttribute('aria-label', `Download ${filename}.json`);
  
  button.addEventListener('click', () => {
    const data = typeof dataOrGetter === 'function' 
      ? dataOrGetter() 
      : dataOrGetter;
    
    downloadJSON(data, filename, true, true);
  });
  
  return button;
}

/**
 * Create download CSV button
 * @param {Array<Object>|Function} dataOrGetter - Array data or function that returns array
 * @param {string} filename - Filename (without extension)
 * @param {string} label - Button label (default: 'Download CSV')
 * @returns {HTMLButtonElement} Download button
 */
export function createDownloadCSVButton(
  dataOrGetter,
  filename,
  label = 'Download CSV'
) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-primary btn-medium';
  button.textContent = label;
  button.setAttribute('aria-label', `Download ${filename}.csv`);
  
  button.addEventListener('click', () => {
    const data = typeof dataOrGetter === 'function' 
      ? dataOrGetter() 
      : dataOrGetter;
    
    downloadArrayAsCSV(data, filename, null, true);
  });
  
  return button;
}

/**
 * Open content in new window/tab instead of downloading
 * Useful for previewing content before download
 * 
 * @param {string} content - Content to display
 * @param {string} mimeType - MIME type
 * @param {string} title - Window title
 */
export function openInNewWindow(content, mimeType = 'text/html', title = 'Preview') {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.document.title = title;
    }
    
    // Cleanup URL after window is opened
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    return true;
  } catch (error) {
    console.error('Failed to open in new window:', error);
    return false;
  }
}

/**
 * Generate filename with timestamp
 * @param {string} baseName - Base filename
 * @param {string} extension - File extension (with or without dot)
 * @returns {string} Filename with timestamp
 */
export function generateTimestampedFilename(baseName, extension) {
  const timestamp = new Date().toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '');
  
  const ext = extension.startsWith('.') ? extension : `.${extension}`;
  
  return `${baseName}_${timestamp}${ext}`;
}
