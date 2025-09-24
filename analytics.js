/**
 * T9 Digital Analytics & Monitoring Configuration
 * Comprehensive tracking for performance, user behavior, and conversion metrics
 */

// Analytics Configuration
window.T9Analytics = {
  // Google Analytics 4 Configuration
  GA4: {
    measurementId: 'G-XXXXXXXXXX', // Replace with actual GA4 measurement ID
    config: {
      page_title: 'T9 Digital - Premium Marketing Agency',
      custom_map: {
        'custom_parameter_1': 'client_type',
        'custom_parameter_2': 'lead_source'
      },
      // Enhanced ecommerce for service bookings
      send_page_view: true,
      allow_google_signals: true,
      cookie_expires: 63072000, // 2 years
      anonymize_ip: true
    }
  },

  // Conversion Tracking Events
  events: {
    // Lead Generation Events
    CONTACT_FORM_VIEW: 'contact_form_view',
    CONTACT_FORM_START: 'contact_form_start',
    CONTACT_FORM_SUBMIT: 'contact_form_submit',
    CONTACT_FORM_SUCCESS: 'contact_form_success',

    // Engagement Events
    SCROLL_DEPTH_25: 'scroll_depth_25',
    SCROLL_DEPTH_50: 'scroll_depth_50',
    SCROLL_DEPTH_75: 'scroll_depth_75',
    SCROLL_DEPTH_100: 'scroll_depth_100',

    // Service Interest Events
    SERVICE_VIEW: 'service_view',
    PORTFOLIO_ITEM_CLICK: 'portfolio_item_click',
    CTA_BUTTON_CLICK: 'cta_button_click',

    // Technical Events
    PAGE_LOAD_COMPLETE: 'page_load_complete',
    PERFORMANCE_ISSUE: 'performance_issue',
    ERROR_OCCURRED: 'error_occurred'
  },

  // Performance Monitoring
  performance: {
    // Core Web Vitals thresholds
    thresholds: {
      LCP: 2500, // Largest Contentful Paint (ms)
      FID: 100,  // First Input Delay (ms)
      CLS: 0.1,  // Cumulative Layout Shift
      FCP: 1800, // First Contentful Paint (ms)
      TTFB: 800  // Time to First Byte (ms)
    },

    // Monitor these metrics
    metrics: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP'],

    // Report performance issues
    reportingEnabled: true,
    reportingEndpoint: '/api/performance',
    sampleRate: 0.1 // Report 10% of sessions
  },

  // User Behavior Tracking
  behavior: {
    // Heatmap configuration (if using tools like Hotjar)
    heatmaps: {
      enabled: true,
      siteId: 'HOTJAR_SITE_ID', // Replace with actual Hotjar site ID
      version: 6
    },

    // Session recording
    sessionRecording: {
      enabled: true,
      sampleRate: 0.05, // Record 5% of sessions
      maskInputs: true,
      excludePages: ['/admin', '/dashboard']
    }
  }
};

/**
 * Initialize Google Analytics 4
 */
function initGA4() {
  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${T9Analytics.GA4.measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', T9Analytics.GA4.measurementId, T9Analytics.GA4.config);

  console.log('[T9Analytics] GA4 initialized');
}

/**
 * Track custom events
 */
function trackEvent(eventName, parameters = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      event_category: parameters.category || 'engagement',
      event_label: parameters.label || '',
      value: parameters.value || 0,
      custom_parameter_1: parameters.client_type || 'unknown',
      custom_parameter_2: parameters.lead_source || 'organic',
      ...parameters
    });

    console.log(`[T9Analytics] Event tracked: ${eventName}`, parameters);
  }
}

/**
 * Track scroll depth
 */
function initScrollTracking() {
  const scrollThresholds = [25, 50, 75, 100];
  const triggeredThresholds = new Set();

  function checkScrollDepth() {
    const scrollPercent = Math.round(
      ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100
    );

    scrollThresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !triggeredThresholds.has(threshold)) {
        triggeredThresholds.add(threshold);
        trackEvent(`scroll_depth_${threshold}`, {
          category: 'engagement',
          label: `${threshold}%`,
          value: threshold
        });
      }
    });
  }

  // Throttled scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        checkScrollDepth();
        ticking = false;
      });
      ticking = true;
    }
  });
}

/**
 * Track Core Web Vitals
 */
function initPerformanceMonitoring() {
  // Load web-vitals library
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js';
  script.onload = () => {
    // Track Core Web Vitals
    webVitals.getCLS((metric) => {
      trackEvent('core_web_vital', {
        category: 'performance',
        label: 'CLS',
        value: Math.round(metric.value * 1000),
        metric_name: 'CLS',
        metric_value: metric.value,
        metric_rating: metric.rating
      });
    });

    webVitals.getFID((metric) => {
      trackEvent('core_web_vital', {
        category: 'performance',
        label: 'FID',
        value: Math.round(metric.value),
        metric_name: 'FID',
        metric_value: metric.value,
        metric_rating: metric.rating
      });
    });

    webVitals.getLCP((metric) => {
      trackEvent('core_web_vital', {
        category: 'performance',
        label: 'LCP',
        value: Math.round(metric.value),
        metric_name: 'LCP',
        metric_value: metric.value,
        metric_rating: metric.rating
      });
    });

    webVitals.getTTFB((metric) => {
      trackEvent('core_web_vital', {
        category: 'performance',
        label: 'TTFB',
        value: Math.round(metric.value),
        metric_name: 'TTFB',
        metric_value: metric.value,
        metric_rating: metric.rating
      });
    });
  };
  document.head.appendChild(script);
}

/**
 * Track form interactions
 */
function initFormTracking() {
  // Track contact form views
  const contactSection = document.querySelector('#contact');
  if (contactSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          trackEvent(T9Analytics.events.CONTACT_FORM_VIEW, {
            category: 'lead_generation',
            label: 'contact_form_viewed'
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(contactSection);
  }

  // Track form interactions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    // Form start tracking
    const inputs = form.querySelectorAll('input, textarea, select');
    let formStartTracked = false;

    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (!formStartTracked) {
          trackEvent(T9Analytics.events.CONTACT_FORM_START, {
            category: 'lead_generation',
            label: 'form_interaction_started'
          });
          formStartTracked = true;
        }
      });
    });

    // Form submission tracking
    form.addEventListener('submit', (e) => {
      trackEvent(T9Analytics.events.CONTACT_FORM_SUBMIT, {
        category: 'lead_generation',
        label: 'form_submitted',
        value: 1
      });
    });
  });
}

/**
 * Track CTA button clicks
 */
function initCTATracking() {
  const ctaButtons = document.querySelectorAll('.cta-button, .btn-primary, [data-cta]');

  ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
      const buttonText = button.textContent.trim();
      const buttonSection = button.closest('section')?.id || 'unknown';

      trackEvent(T9Analytics.events.CTA_BUTTON_CLICK, {
        category: 'conversion',
        label: buttonText,
        button_text: buttonText,
        button_section: buttonSection,
        value: 1
      });
    });
  });
}

/**
 * Track service interest
 */
function initServiceTracking() {
  const serviceItems = document.querySelectorAll('.service-item, [data-service]');

  serviceItems.forEach(item => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const serviceName = entry.target.querySelector('h3, .service-title')?.textContent || 'unknown';

          trackEvent(T9Analytics.events.SERVICE_VIEW, {
            category: 'engagement',
            label: serviceName,
            service_name: serviceName
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(item);
  });
}

/**
 * Error tracking
 */
function initErrorTracking() {
  window.addEventListener('error', (e) => {
    trackEvent(T9Analytics.events.ERROR_OCCURRED, {
      category: 'technical',
      label: 'javascript_error',
      error_message: e.message,
      error_filename: e.filename,
      error_line: e.lineno,
      value: 1
    });
  });

  window.addEventListener('unhandledrejection', (e) => {
    trackEvent(T9Analytics.events.ERROR_OCCURRED, {
      category: 'technical',
      label: 'promise_rejection',
      error_message: e.reason?.message || 'Unknown promise rejection',
      value: 1
    });
  });
}

/**
 * Initialize all analytics and monitoring
 */
function initAnalytics() {
  // Only initialize in production or when explicitly enabled
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[T9Analytics] Analytics disabled in development');
    return;
  }

  console.log('[T9Analytics] Initializing comprehensive analytics...');

  // Core tracking
  initGA4();
  initScrollTracking();
  initFormTracking();
  initCTATracking();
  initServiceTracking();
  initErrorTracking();

  // Performance monitoring (with delay to not affect initial load)
  setTimeout(() => {
    initPerformanceMonitoring();
  }, 2000);

  // Track page load completion
  window.addEventListener('load', () => {
    trackEvent(T9Analytics.events.PAGE_LOAD_COMPLETE, {
      category: 'technical',
      label: 'page_loaded',
      load_time: performance.now(),
      value: Math.round(performance.now())
    });
  });

  console.log('[T9Analytics] All tracking systems initialized');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
  initAnalytics();
}

// Export for manual control
window.T9Analytics.track = trackEvent;
window.T9Analytics.init = initAnalytics;