// Security monitoring script to detect suspicious activity
(function() {
  'use strict';
  
  // List of known malicious domains to block
  const blockedDomains = [
    'ai-tradingbot.ru',
    'suspicious-domain.com',
    // Add more as needed
  ];
  
  // Detect suspicious script injections
  if (typeof window !== 'undefined') {
    // Monitor for external script injections
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0]?.toString() || '';
      
      // Block requests to known malicious domains
      for (const domain of blockedDomains) {
        if (url.includes(domain)) {
          console.warn(`[Security] Blocked request to suspicious domain: ${domain}`);
          return Promise.reject(new Error('Blocked by security policy'));
        }
      }
      
      return originalFetch.apply(this, args);
    };
    
    // Monitor for XMLHttpRequest to malicious domains
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      const urlStr = url?.toString() || '';
      
      for (const domain of blockedDomains) {
        if (urlStr.includes(domain)) {
          console.warn(`[Security] Blocked XHR request to suspicious domain: ${domain}`);
          throw new Error('Blocked by security policy');
        }
      }
      
      return originalXHROpen.call(this, method, url, ...rest);
    };
    
    // Warn about suspicious global variables (injected by malicious scripts)
    const suspiciousGlobals = ['deal', 'tradingbot', '__MALICIOUS__'];
    
    setTimeout(() => {
      const foundSuspicious = [];
      for (const key of suspiciousGlobals) {
        if (window[key]) {
          foundSuspicious.push(key);
        }
      }
      
      if (foundSuspicious.length > 0) {
        console.warn('[Security] Detected suspicious global variables:', foundSuspicious);
        console.warn('[Security] This may indicate a malicious browser extension is active.');
      }
    }, 1000);
    
    // Monitor for script injections
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'SCRIPT') {
            const src = node.src || '';
            
            // Check if script is from blocked domain
            for (const domain of blockedDomains) {
              if (src.includes(domain)) {
                console.error(`[Security] Blocked malicious script injection from: ${domain}`);
                node.remove();
              }
            }
            
            // Warn about inline scripts from unknown sources
            if (!src && node.textContent && !node.dataset.allowed) {
              const content = node.textContent.toLowerCase();
              if (content.includes('tradingbot') || content.includes('mining')) {
                console.error('[Security] Blocked suspicious inline script');
                node.remove();
              }
            }
          }
        });
      });
    });
    
    // Start observing
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
})();
