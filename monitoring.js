/**
 * T9 Digital Real-time Monitoring & Health Check System
 * Monitors website performance, uptime, and user experience
 */

window.T9Monitor = {
  config: {
    // Monitoring endpoints
    healthCheckUrl: '/api/health',
    metricsEndpoint: '/api/metrics',
    alertsEndpoint: '/api/alerts',

    // Monitoring intervals (milliseconds)
    performanceCheckInterval: 30000, // 30 seconds
    healthCheckInterval: 60000,      // 1 minute
    metricsSendInterval: 300000,     // 5 minutes

    // Alert thresholds
    thresholds: {
      pageLoadTime: 3000,      // 3 seconds
      errorRate: 0.05,         // 5%
      memoryUsage: 50,         // 50MB
      connectionSpeed: 1000,    // 1 second for DNS+connect
      bounceRate: 0.7          // 70%
    },

    // Enable/disable features
    realTimeMonitoring: true,
    performanceTracking: true,
    userExperienceTracking: true,
    errorReporting: true,
    uptimeMonitoring: true
  },

  // Storage for metrics
  metrics: {
    pageViews: 0,
    uniqueVisitors: new Set(),
    errors: [],
    performanceData: [],
    userSessions: [],
    currentSession: null
  },

  // Status tracking
  status: {
    isHealthy: true,
    lastHealthCheck: null,
    uptime: Date.now(),
    alerts: []
  }
};

/**
 * Performance Monitoring Class
 */
class PerformanceMonitor {
  constructor() {
    this.observer = null;
    this.metrics = {
      navigation: {},
      paint: {},
      layout: {},
      resources: []
    };
  }

  start() {
    this.collectNavigationMetrics();
    this.collectPaintMetrics();
    this.collectResourceMetrics();
    this.monitorLayoutShifts();
    this.startContinuousMonitoring();

    console.log('[T9Monitor] Performance monitoring started');
  }

  collectNavigationMetrics() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.metrics.navigation = {
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
          loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
          dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
          connect: Math.round(navigation.connectEnd - navigation.connectStart),
          request: Math.round(navigation.responseStart - navigation.requestStart),
          response: Math.round(navigation.responseEnd - navigation.responseStart),
          domProcessing: Math.round(navigation.domComplete - navigation.domLoading),
          ttfb: Math.round(navigation.responseStart - navigation.navigationStart)
        };

        // Check thresholds
        if (this.metrics.navigation.ttfb > T9Monitor.config.thresholds.connectionSpeed) {
          this.reportIssue('slow_connection', {
            ttfb: this.metrics.navigation.ttfb,
            threshold: T9Monitor.config.thresholds.connectionSpeed
          });
        }
      }
    }
  }

  collectPaintMetrics() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        this.metrics.paint[entry.name] = Math.round(entry.startTime);
      });
    }
  }

  collectResourceMetrics() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource');
      this.metrics.resources = resources.map(resource => ({
        name: resource.name.split('/').pop(),
        type: resource.initiatorType,
        size: resource.transferSize,
        duration: Math.round(resource.duration),
        cached: resource.transferSize === 0 && resource.decodedBodySize > 0
      }));

      // Identify slow resources
      const slowResources = this.metrics.resources.filter(r => r.duration > 1000);
      if (slowResources.length > 0) {
        this.reportIssue('slow_resources', { resources: slowResources });
      }
    }
  }

  monitorLayoutShifts() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          let totalShift = 0;
          for (const entry of list.getEntries()) {
            totalShift += entry.value;
          }

          if (totalShift > 0.1) { // CLS threshold
            this.reportIssue('layout_shift', {
              totalShift: totalShift,
              threshold: 0.1
            });
          }
        });

        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('[T9Monitor] Layout shift monitoring not supported');
      }
    }
  }

  startContinuousMonitoring() {
    setInterval(() => {
      this.checkMemoryUsage();
      this.checkConnectionQuality();
      this.sendMetricsToServer();
    }, T9Monitor.config.performanceCheckInterval);
  }

  checkMemoryUsage() {
    if ('memory' in performance) {
      const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
      this.metrics.memoryUsage = memoryMB;

      if (memoryMB > T9Monitor.config.thresholds.memoryUsage) {
        this.reportIssue('high_memory_usage', {
          usage: memoryMB,
          threshold: T9Monitor.config.thresholds.memoryUsage
        });
      }
    }
  }

  checkConnectionQuality() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      this.metrics.connection = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      };

      // Alert on poor connection
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        this.reportIssue('poor_connection', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink
        });
      }
    }
  }

  reportIssue(type, data) {
    const issue = {
      type,
      data,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    T9Monitor.metrics.errors.push(issue);
    console.warn(`[T9Monitor] Performance issue detected: ${type}`, data);

    // Send to analytics if available
    if (window.T9Analytics && window.T9Analytics.track) {
      window.T9Analytics.track('performance_issue', {
        category: 'technical',
        label: type,
        issue_type: type,
        ...data
      });
    }
  }

  async sendMetricsToServer() {
    if (!T9Monitor.config.realTimeMonitoring) return;

    const payload = {
      timestamp: Date.now(),
      url: window.location.href,
      metrics: this.metrics,
      session: T9Monitor.metrics.currentSession
    };

    try {
      // In production, send to actual monitoring endpoint
      console.log('[T9Monitor] Metrics collected:', payload);

      // Uncomment for production:
      // await fetch(T9Monitor.config.metricsEndpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
    } catch (error) {
      console.error('[T9Monitor] Failed to send metrics:', error);
    }
  }
}

/**
 * User Experience Monitor
 */
class UserExperienceMonitor {
  constructor() {
    this.sessionStart = Date.now();
    this.interactions = [];
    this.pageViews = 1;
    this.scrollDepth = 0;
    this.timeOnPage = 0;
  }

  start() {
    this.trackUserInteractions();
    this.trackScrollBehavior();
    this.trackTimeOnPage();
    this.detectUserFrustration();

    console.log('[T9Monitor] User experience monitoring started');
  }

  trackUserInteractions() {
    const interactionEvents = ['click', 'keydown', 'touchstart', 'mousemove'];

    interactionEvents.forEach(event => {
      document.addEventListener(event, (e) => {
        this.interactions.push({
          type: event,
          timestamp: Date.now(),
          target: e.target.tagName,
          x: e.clientX || 0,
          y: e.clientY || 0
        });

        // Keep only last 100 interactions
        if (this.interactions.length > 100) {
          this.interactions = this.interactions.slice(-100);
        }
      }, { passive: true });
    });
  }

  trackScrollBehavior() {
    let scrollTimeout;
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((currentScrollY / documentHeight) * 100);

      this.scrollDepth = Math.max(this.scrollDepth, scrollPercent);

      // Detect rapid scrolling (potential frustration)
      const scrollSpeed = Math.abs(currentScrollY - lastScrollY);
      if (scrollSpeed > 500) {
        this.reportUserBehavior('rapid_scrolling', { speed: scrollSpeed });
      }

      lastScrollY = currentScrollY;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.reportUserBehavior('scroll_pause', {
          position: scrollPercent,
          depth: this.scrollDepth
        });
      }, 2000);
    }, { passive: true });
  }

  trackTimeOnPage() {
    setInterval(() => {
      this.timeOnPage = Date.now() - this.sessionStart;
    }, 1000);

    // Track when user leaves
    window.addEventListener('beforeunload', () => {
      this.reportUserBehavior('page_exit', {
        timeOnPage: this.timeOnPage,
        scrollDepth: this.scrollDepth,
        interactions: this.interactions.length
      });
    });
  }

  detectUserFrustration() {
    let rapidClicks = 0;
    let lastClickTime = 0;

    document.addEventListener('click', () => {
      const now = Date.now();
      if (now - lastClickTime < 300) { // Clicks within 300ms
        rapidClicks++;
        if (rapidClicks >= 3) {
          this.reportUserBehavior('potential_frustration', {
            rapidClicks,
            timeWindow: now - lastClickTime
          });
          rapidClicks = 0;
        }
      } else {
        rapidClicks = 0;
      }
      lastClickTime = now;
    });

    // Detect rage clicks
    let mouseEvents = [];
    document.addEventListener('mousedown', (e) => {
      mouseEvents.push({ time: Date.now(), x: e.clientX, y: e.clientY });
      mouseEvents = mouseEvents.filter(event => Date.now() - event.time < 1000);

      if (mouseEvents.length >= 5) {
        const sameArea = mouseEvents.every(event =>
          Math.abs(event.x - mouseEvents[0].x) < 50 &&
          Math.abs(event.y - mouseEvents[0].y) < 50
        );

        if (sameArea) {
          this.reportUserBehavior('rage_clicks', {
            clicks: mouseEvents.length,
            area: { x: mouseEvents[0].x, y: mouseEvents[0].y }
          });
        }
      }
    });
  }

  reportUserBehavior(type, data) {
    const behavior = {
      type,
      data,
      timestamp: Date.now(),
      sessionDuration: this.timeOnPage,
      pageUrl: window.location.href
    };

    console.log(`[T9Monitor] User behavior: ${type}`, data);

    // Send to analytics
    if (window.T9Analytics && window.T9Analytics.track) {
      window.T9Analytics.track('user_behavior', {
        category: 'user_experience',
        label: type,
        behavior_type: type,
        ...data
      });
    }
  }
}

/**
 * Health Check System
 */
class HealthChecker {
  constructor() {
    this.isHealthy = true;
    this.checks = [];
  }

  async runHealthChecks() {
    const checks = [
      this.checkDOMHealth(),
      this.checkJavaScriptErrors(),
      this.checkResourceLoading(),
      this.checkLocalStorageAccess(),
      this.checkServiceWorker()
    ];

    const results = await Promise.allSettled(checks);
    const failedChecks = results.filter(result => result.status === 'rejected');

    this.isHealthy = failedChecks.length === 0;
    T9Monitor.status.isHealthy = this.isHealthy;
    T9Monitor.status.lastHealthCheck = Date.now();

    if (!this.isHealthy) {
      console.error('[T9Monitor] Health check failed:', failedChecks);
      this.reportHealthIssue(failedChecks);
    } else {
      console.log('[T9Monitor] All health checks passed');
    }

    return this.isHealthy;
  }

  async checkDOMHealth() {
    return new Promise((resolve, reject) => {
      if (document.readyState === 'complete') {
        const essentialElements = ['header', 'main', 'footer', '#contact'];
        const missingElements = essentialElements.filter(selector =>
          !document.querySelector(selector)
        );

        if (missingElements.length > 0) {
          reject(new Error(`Missing essential elements: ${missingElements.join(', ')}`));
        } else {
          resolve('DOM healthy');
        }
      } else {
        reject(new Error('DOM not ready'));
      }
    });
  }

  async checkJavaScriptErrors() {
    return new Promise((resolve, reject) => {
      const recentErrors = T9Monitor.metrics.errors.filter(
        error => Date.now() - error.timestamp < 60000 // Last minute
      );

      if (recentErrors.length > 5) {
        reject(new Error(`Too many recent errors: ${recentErrors.length}`));
      } else {
        resolve('JavaScript healthy');
      }
    });
  }

  async checkResourceLoading() {
    return new Promise((resolve, reject) => {
      const criticalResources = ['styles.css', 'script.js'];
      const loadedResources = performance.getEntriesByType('resource');

      const missingResources = criticalResources.filter(resource =>
        !loadedResources.some(loaded => loaded.name.includes(resource))
      );

      if (missingResources.length > 0) {
        reject(new Error(`Missing critical resources: ${missingResources.join(', ')}`));
      } else {
        resolve('Resources loaded successfully');
      }
    });
  }

  async checkLocalStorageAccess() {
    return new Promise((resolve, reject) => {
      try {
        const testKey = 'T9Monitor_health_check';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        resolve('LocalStorage accessible');
      } catch (error) {
        reject(new Error('LocalStorage not accessible'));
      }
    });
  }

  async checkServiceWorker() {
    return new Promise((resolve) => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration && registration.active) {
            resolve('Service Worker active');
          } else {
            resolve('Service Worker not registered (optional)');
          }
        });
      } else {
        resolve('Service Worker not supported (optional)');
      }
    });
  }

  reportHealthIssue(issues) {
    const alert = {
      type: 'health_check_failed',
      issues: issues.map(issue => issue.reason?.message || 'Unknown error'),
      timestamp: Date.now(),
      severity: 'high'
    };

    T9Monitor.status.alerts.push(alert);

    // Send to monitoring system
    if (window.T9Analytics && window.T9Analytics.track) {
      window.T9Analytics.track('system_health_issue', {
        category: 'technical',
        label: 'health_check_failed',
        alert_count: issues.length,
        severity: 'high'
      });
    }
  }
}

/**
 * Initialize complete monitoring system
 */
async function initMonitoring() {
  console.log('[T9Monitor] Initializing comprehensive monitoring system...');

  // Initialize session
  T9Monitor.metrics.currentSession = {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startTime: Date.now(),
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    url: window.location.href
  };

  // Start monitoring systems
  if (T9Monitor.config.performanceTracking) {
    const perfMonitor = new PerformanceMonitor();
    perfMonitor.start();
  }

  if (T9Monitor.config.userExperienceTracking) {
    const uxMonitor = new UserExperienceMonitor();
    uxMonitor.start();
  }

  // Health checks
  const healthChecker = new HealthChecker();
  await healthChecker.runHealthChecks();

  // Periodic health checks
  setInterval(() => {
    healthChecker.runHealthChecks();
  }, T9Monitor.config.healthCheckInterval);

  console.log('[T9Monitor] All monitoring systems active');
}

// Error handling
window.addEventListener('error', (e) => {
  T9Monitor.metrics.errors.push({
    type: 'javascript_error',
    message: e.message,
    filename: e.filename,
    line: e.lineno,
    column: e.colno,
    timestamp: Date.now()
  });
});

window.addEventListener('unhandledrejection', (e) => {
  T9Monitor.metrics.errors.push({
    type: 'promise_rejection',
    message: e.reason?.message || 'Unknown promise rejection',
    timestamp: Date.now()
  });
});

// Initialize when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMonitoring);
} else {
  initMonitoring();
}

// Export for external access
window.T9Monitor.init = initMonitoring;