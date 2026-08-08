/**
 * DEV ELEMENT GRABBER - Development Tool Only
 * 
 * This tool helps you grab HTML element code for debugging with GitHub Copilot
 * Similar to react-grab but for vanilla HTML/CSS/JS projects
 * 
 * Usage: Hold Ctrl and click on any element to copy its HTML to clipboard
 */

(function() {
  'use strict';

  // Only run in development (when file is localhost or file://)
  const isDevelopment = window.location.hostname === 'localhost' 
    || window.location.hostname === '127.0.0.1'
    || window.location.protocol === 'file:';

  if (!isDevelopment) {
    console.log('🚫 Element Grabber: Disabled in production');
    return;
  }

  console.log('🎯 Element Grabber: Active (Ctrl+Click to grab element)');

  let isGrabMode = false;
  let highlightedElement = null;

  // Create overlay styles
  const style = document.createElement('style');
  style.textContent = `
    .element-grabber-highlight {
      outline: 3px dashed #2563EB !important;
      outline-offset: 2px !important;
      background: rgba(37, 99, 235, 0.1) !important;
      cursor: crosshair !important;
      position: relative !important;
    }
    
    .element-grabber-tooltip {
      position: fixed;
      background: #1e293b;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-family: monospace;
      z-index: 10000;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-width: 300px;
      word-break: break-all;
    }

    .element-grabber-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // Create tooltip element
  let tooltip = null;

  function createTooltip() {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'element-grabber-tooltip';
      document.body.appendChild(tooltip);
    }
    return tooltip;
  }

  function getElementSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }
    if (element.className && typeof element.className === 'string') {
      const classes = element.className.split(' ').filter(c => c).slice(0, 2).join('.');
      return `.${classes}`;
    }
    return element.tagName.toLowerCase();
  }

  function getElementHTML(element) {
    // Get clean HTML with proper formatting
    const clone = element.cloneNode(true);
    
    // Remove any grabber classes
    clone.classList.remove('element-grabber-highlight');
    
    // Format HTML nicely
    let html = clone.outerHTML;
    
    // Add line breaks for readability
    html = html
      .replace(/></g, '>\n<')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .join('\n');
    
    return html;
  }

  function getElementInfo(element) {
    const tag = element.tagName.toLowerCase();
    const selector = getElementSelector(element);
    const classes = element.className ? ` class="${element.className}"` : '';
    const id = element.id ? ` id="${element.id}"` : '';
    
    return `<${tag}${id}${classes}>`;
  }

  function copyToClipboard(text) {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text)
        .then(() => true)
        .catch(() => false);
    }
    
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return Promise.resolve(successful);
    } catch (err) {
      document.body.removeChild(textarea);
      return Promise.resolve(false);
    }
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'element-grabber-notification';
    notification.innerHTML = `✅ ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 2000);
  }

  // Event listeners
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      isGrabMode = true;
      document.body.style.cursor = 'crosshair';
    }
  });

  document.addEventListener('keyup', (e) => {
    if (!e.ctrlKey && !e.metaKey) {
      isGrabMode = false;
      document.body.style.cursor = '';
      if (highlightedElement) {
        highlightedElement.classList.remove('element-grabber-highlight');
        highlightedElement = null;
      }
      if (tooltip) {
        tooltip.style.display = 'none';
      }
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isGrabMode) {
      const element = document.elementFromPoint(e.clientX, e.clientY);
      
      if (element && element !== highlightedElement && !element.classList.contains('element-grabber-tooltip')) {
        // Remove highlight from previous element
        if (highlightedElement) {
          highlightedElement.classList.remove('element-grabber-highlight');
        }
        
        // Highlight current element
        highlightedElement = element;
        element.classList.add('element-grabber-highlight');
        
        // Show tooltip
        const tooltipEl = createTooltip();
        tooltipEl.textContent = getElementInfo(element);
        tooltipEl.style.display = 'block';
        tooltipEl.style.left = `${e.clientX + 15}px`;
        tooltipEl.style.top = `${e.clientY + 15}px`;
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (isGrabMode) {
      e.preventDefault();
      e.stopPropagation();
      
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element && !element.classList.contains('element-grabber-tooltip')) {
        const html = getElementHTML(element);
        const selector = getElementSelector(element);
        
        // Copy to clipboard
        copyToClipboard(html).then(success => {
          if (success) {
            showNotification(`Copied: ${selector}`);
            console.log('📋 Copied element HTML:', html);
          } else {
            showNotification('❌ Failed to copy');
          }
        });
        
        // Remove highlight
        element.classList.remove('element-grabber-highlight');
        highlightedElement = null;
        
        // Hide tooltip
        if (tooltip) {
          tooltip.style.display = 'none';
        }
      }
    }
  }, true);

  // Show initial message
  console.log('%c🎯 Element Grabber Ready!', 'font-size: 16px; font-weight: bold; color: #2563EB;');
  console.log('%cHow to use:', 'font-weight: bold;');
  console.log('1. Hold Ctrl (or Cmd on Mac)');
  console.log('2. Hover over any element (it will highlight)');
  console.log('3. Click to copy HTML to clipboard');
  console.log('4. Paste into GitHub Copilot chat for fixes!');
  
})();
