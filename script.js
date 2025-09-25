// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===== ADVANCED FEATURES & EASTER EGGS =====
let konamiSequence = [];
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

// ===== EASTER EGGS =====
const initEasterEggs = () => {
  // Konami Code easter egg
  document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.code);

    if (konamiSequence.length > konamiCode.length) {
      konamiSequence.shift();
    }

    if (konamiSequence.join(',') === konamiCode.join(',')) {
      triggerKonamiEasterEgg();
      konamiSequence = [];
    }
  });

  // Secret click pattern (click T9 logo 9 times)
  let logoClickCount = 0;
  const logo = $('.nav__logo, .hero__logo, [data-logo]');
  if (logo) {
    logo.addEventListener('click', (e) => {
      logoClickCount++;
      if (logoClickCount >= 9) {
        triggerSecretAnimation();
        logoClickCount = 0;
      }

      // Reset count after 3 seconds of no clicks
      clearTimeout(logo.resetTimer);
      logo.resetTimer = setTimeout(() => {
        logoClickCount = 0;
      }, 3000);
    });
  }

  // Hidden developer console message
  console.log('%cT9 Digital 🚀', 'color: #00d4ff; font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
  console.log('%cLooks like you found the developer console! 👨‍💻', 'color: #39ff14; font-size: 14px;');
  console.log('%cWe love curious minds. Check out our careers page!', 'color: #ffffff; font-size: 12px;');
};

const triggerKonamiEasterEgg = () => {
  // Create rainbow particle explosion
  const particleCount = 50;
  const colors = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'konami-particle';
    particle.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      left: 50%;
      top: 50%;
      animation: konamiExplosion ${1 + Math.random()}s ease-out forwards;
      --angle: ${Math.random() * 360}deg;
      --distance: ${200 + Math.random() * 300}px;
    `;

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 2000);
  }

  // Show secret message
  showNotification('🎉 Konami Code activated! You\'re a true gamer! 🎮', 'success');

  // Add special CSS for the explosion animation
  if (!$('#konami-styles')) {
    const konamiStyles = document.createElement('style');
    konamiStyles.id = 'konami-styles';
    konamiStyles.textContent = `
      @keyframes konamiExplosion {
        0% {
          transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance));
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(konamiStyles);
  }
};

const triggerSecretAnimation = () => {
  document.body.classList.add('party-mode');
  showNotification('🎊 Secret unlocked! Party mode activated! 🎉', 'success');

  // Add party mode styles
  if (!$('#party-styles')) {
    const partyStyles = document.createElement('style');
    partyStyles.id = 'party-styles';
    partyStyles.textContent = `
      .party-mode {
        animation: partyHue 2s infinite linear;
      }
      @keyframes partyHue {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(partyStyles);
  }

  // Remove party mode after 5 seconds
  setTimeout(() => {
    document.body.classList.remove('party-mode');
  }, 5000);
};

// ===== CUSTOM CURSOR SYSTEM =====
const initCustomCursor = () => {
  if (window.innerWidth < 768) return; // Skip on mobile

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';

  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor__dot';

  const cursorOutline = document.createElement('div');
  cursorOutline.className = 'custom-cursor__outline';

  cursor.appendChild(cursorDot);
  cursor.appendChild(cursorOutline);
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let outlineX = 0, outlineY = 0;

  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animate cursor
  const animateCursor = () => {
    // Smooth following for dot
    dotX += (mouseX - dotX) * 0.8;
    dotY += (mouseY - dotY) * 0.8;

    // Slower following for outline
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
    cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0)`;

    requestAnimationFrame(animateCursor);
  };

  animateCursor();

  // Cursor interactions
  const interactiveElements = 'a, button, [role="button"], .card, input, textarea, select';

  document.addEventListener('mouseenter', () => cursor.classList.add('visible'));
  document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));

  // Hover effects
  $$(interactiveElements).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      document.body.style.cursor = 'none';
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      document.body.style.cursor = '';
    });
  });

  // Click effect
  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('click'));
};

// ===== SCROLL PROGRESS INDICATOR =====
const initScrollProgress = () => {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';

  const progressFill = document.createElement('div');
  progressFill.className = 'scroll-progress__fill';

  progressBar.appendChild(progressFill);
  document.body.appendChild(progressBar);

  let ticking = false;

  const updateScrollProgress = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    progressFill.style.width = scrollPercent + '%';

    // Add reading time estimate
    const readingTime = Math.max(1, Math.ceil((docHeight - scrollTop) / 200)); // Rough estimate
    progressBar.setAttribute('title', `${Math.round(scrollPercent)}% complete • ~${readingTime}min remaining`);

    ticking = false;
  };

  const requestScrollProgressUpdate = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestScrollProgressUpdate, { passive: true });
  updateScrollProgress(); // Initial update
};

// ===== READING TIME ESTIMATES =====
const initReadingTimeEstimates = () => {
  const contentSections = $$('section[id]');
  const averageWPM = 200; // Average reading speed

  contentSections.forEach(section => {
    const textContent = section.textContent || section.innerText;
    const wordCount = textContent.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / averageWPM);

    if (readingTime > 0) {
      const timeIndicator = document.createElement('div');
      timeIndicator.className = 'reading-time';
      timeIndicator.textContent = `${readingTime} min read`;
      timeIndicator.setAttribute('aria-label', `Estimated reading time: ${readingTime} minutes`);

      const sectionHeader = section.querySelector('h2, h3, .section__header');
      if (sectionHeader) {
        sectionHeader.appendChild(timeIndicator);
      }
    }
  });
};

// ===== MICRO-INTERACTIONS =====
const initMicroInteractions = () => {
  // Button press animations
  $$('button, .btn').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.95)';
      btn.style.transition = 'transform 0.1s ease';
    });

    btn.addEventListener('mouseup', () => {
      btn.style.transform = 'scale(1)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
    });
  });

  // Input field focus rings
  $$('input, textarea, select').forEach(input => {
    input.addEventListener('focus', () => {
      input.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.2)';
      input.style.borderColor = 'var(--primary-400)';
      input.style.transition = 'all 0.2s ease';
    });

    input.addEventListener('blur', () => {
      input.style.boxShadow = 'none';
      input.style.borderColor = 'var(--border-color)';
    });
  });

  // Image zoom on hover
  $$('img, .portfolio__image').forEach(img => {
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.05)';
      img.style.transition = 'transform 0.3s ease';
    });

    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });

  // Card hover effects
  $$('.card, .service__card, .portfolio__item').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
      card.style.transition = 'all 0.3s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'var(--shadow-card)';
    });
  });
};


// ===== BROWSER COMPATIBILITY =====
const initBrowserCompatibility = () => {
  // CSS fallbacks
  const addCSSFallbacks = () => {
    const style = document.createElement('style');
    style.textContent = `
      /* Fallbacks for older browsers */
      @supports not (backdrop-filter: blur(10px)) {
        .header--scrolled {
          background: rgba(10, 10, 10, 0.95) !important;
        }
      }

      @supports not (aspect-ratio: 16 / 9) {
        .video-container {
          padding-bottom: 56.25%;
          height: 0;
        }
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }

      @supports not (gap: 1rem) {
        .grid > * + * {
          margin-left: 1rem;
        }
      }

      /* IE11 flexbox fixes */
      @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
        .flex {
          display: -ms-flexbox;
          display: flex;
        }
        .flex-1 {
          -ms-flex: 1;
          flex: 1;
        }
      }
    `;
    document.head.appendChild(style);
  };

  // Polyfills
  const addPolyfills = () => {
    // IntersectionObserver polyfill check
    if (!window.IntersectionObserver) {
      console.warn('IntersectionObserver not supported. Loading polyfill...');
      const script = document.createElement('script');
      script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
      document.head.appendChild(script);
    }

    // Custom properties (CSS variables) fallback
    if (!window.CSS || !CSS.supports('color', 'var(--fake-var)')) {
      document.documentElement.style.setProperty = function(property, value) {
        this.style[property.replace(/^--/, '')] = value;
      };
    }

    // Object.assign polyfill for IE11
    if (typeof Object.assign !== 'function') {
      Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) {
          if (target == null) throw new TypeError('Cannot convert undefined or null to object');
          const to = Object(target);
          for (let index = 1; index < arguments.length; index++) {
            const nextSource = arguments[index];
            if (nextSource != null) {
              for (const nextKey in nextSource) {
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                  to[nextKey] = nextSource[nextKey];
                }
              }
            }
          }
          return to;
        },
        writable: true,
        configurable: true
      });
    }
  };

  // Browser detection and warnings
  const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    const isIE = userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident') !== -1;
    const isOldEdge = userAgent.indexOf('Edge') !== -1;
    const isOldChrome = /Chrome\/(\d+)/.test(userAgent) && parseInt(RegExp.$1) < 60;
    const isOldFirefox = /Firefox\/(\d+)/.test(userAgent) && parseInt(RegExp.$1) < 55;

    if (isIE || isOldEdge || isOldChrome || isOldFirefox) {
      const warning = document.createElement('div');
      warning.className = 'browser-warning';
      warning.innerHTML = `
        <div class="browser-warning__content">
          <h3>Browser Update Recommended</h3>
          <p>For the best experience, please update to the latest version of your browser.</p>
          <button class="browser-warning__close">&times;</button>
        </div>
      `;

      const warningStyles = `
        .browser-warning {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #ff6b6b;
          color: white;
          padding: 1rem;
          z-index: 10000;
          text-align: center;
        }
        .browser-warning__content {
          max-width: 600px;
          margin: 0 auto;
          position: relative;
        }
        .browser-warning__close {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }
      `;

      const style = document.createElement('style');
      style.textContent = warningStyles;
      document.head.appendChild(style);
      document.body.appendChild(warning);

      warning.querySelector('.browser-warning__close').addEventListener('click', () => {
        warning.remove();
      });
    }
  };

  addCSSFallbacks();
  addPolyfills();
  detectBrowser();
};

// ===== QUALITY ASSURANCE CHECKS =====
const initQualityAssurance = () => {
  const runQAChecks = () => {
    const issues = [];

    // Check for missing alt text
    const images = $$('img:not([alt]), img[alt=""]');
    if (images.length > 0) {
      issues.push(`${images.length} images missing alt text`);
    }

    // Check for empty links
    const emptyLinks = $$('a:not([href]), a[href=""], a[href="#"]');
    if (emptyLinks.length > 0) {
      issues.push(`${emptyLinks.length} empty or placeholder links`);
    }

    // Check for missing form labels
    const unlabeledInputs = $$('input:not([aria-label]):not([id])');
    unlabeledInputs.forEach(input => {
      const hasLabel = $(`label[for="${input.id}"]`);
      if (!hasLabel) {
        issues.push('Unlabeled form inputs found');
      }
    });

    // Check for contrast issues (basic check)
    const lightTextOnLightBg = $$('.text-light');
    lightTextOnLightBg.forEach(el => {
      const bgColor = getComputedStyle(el).backgroundColor;
      const textColor = getComputedStyle(el).color;
      // Basic contrast warning - in production you'd use a proper contrast calculation
      if (bgColor.includes('255') && textColor.includes('255')) {
        issues.push('Potential contrast issue detected');
      }
    });

    // Check for performance issues
    const largeImages = $$('img');
    largeImages.forEach(img => {
      if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
        issues.push('Large unoptimized images detected');
      }
    });

    // Log issues in development
    if (issues.length > 0 && window.location.hostname === 'localhost') {
      console.warn('QA Issues found:', issues);
    }

    return issues;
  };

  // Validate HTML structure
  const validateHTML = () => {
    const warnings = [];

    // Check for required meta tags
    const requiredMeta = ['description', 'viewport', 'charset'];
    requiredMeta.forEach(meta => {
      const exists = $(`meta[name="${meta}"], meta[charset], meta[property="${meta}"]`);
      if (!exists) {
        warnings.push(`Missing meta tag: ${meta}`);
      }
    });

    // Check heading hierarchy
    const headings = $$('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    headings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName.substring(1));
      if (currentLevel > previousLevel + 1) {
        warnings.push('Heading hierarchy issue - skipped heading level');
      }
      previousLevel = currentLevel;
    });

    return warnings;
  };

  // Run checks in development
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
    setTimeout(() => {
      const qaIssues = runQAChecks();
      const htmlWarnings = validateHTML();

      if (qaIssues.length > 0 || htmlWarnings.length > 0) {
        console.group('Quality Assurance Report');
        if (qaIssues.length > 0) {
          console.warn('QA Issues:', qaIssues);
        }
        if (htmlWarnings.length > 0) {
          console.warn('HTML Validation:', htmlWarnings);
        }
        console.groupEnd();
      } else {
        console.log('✅ Quality assurance checks passed');
      }
    }, 2000);
  }

  // Automated link checking
  const checkLinks = () => {
    const links = $$('a[href^="http"]');
    links.forEach(async (link) => {
      try {
        // In a real implementation, you'd make HEAD requests to check links
        // For demo purposes, just log what would be checked
        console.log('Would check link:', link.href);
      } catch (error) {
        console.warn('Link check failed:', link.href, error);
      }
    });
  };

  // Form validation check
  const checkForms = () => {
    const forms = $$('form');
    forms.forEach(form => {
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value && form.noValidate !== true) {
          console.warn('Required field empty:', field.name || field.id);
        }
      });
    });
  };

  // Performance audit
  const performanceAudit = () => {
    setTimeout(() => {
      const metrics = {
        scriptsCount: $$('script').length,
        stylesheetsCount: $$('link[rel="stylesheet"]').length,
        imagesCount: $$('img').length,
        totalElements: $$('*').length
      };

      console.group('Performance Audit');
      console.log('Page metrics:', metrics);

      if (metrics.scriptsCount > 10) {
        console.warn('High number of script tags detected');
      }
      if (metrics.imagesCount > 50) {
        console.warn('High number of images - consider lazy loading');
      }
      if (metrics.totalElements > 1000) {
        console.warn('High DOM complexity detected');
      }

      console.groupEnd();
    }, 3000);
  };

  if (window.location.hostname === 'localhost') {
    checkLinks();
    checkForms();
    performanceAudit();
  }
};

// ===== ENHANCED SMOOTH SCROLLING =====
const initSmoothScrolling = () => {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = $(targetId);

      if (target) {
        // Close mobile menu if open
        const navMenu = $('#nav-menu');
        const navToggle = $('#nav-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }

        // Custom smooth scroll with easing
        const headerHeight = 70;
        const targetPosition = target.offsetTop - headerHeight;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 second
        let start = null;

        // Custom easing function (ease-out cubic)
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const animation = (currentTime) => {
          if (start === null) start = currentTime;
          const timeElapsed = currentTime - start;
          const progress = Math.min(timeElapsed / duration, 1);
          const ease = easeOutCubic(progress);

          window.scrollTo(0, startPosition + distance * ease);

          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          } else {
            // Update active navigation state
            updateActiveNavigation(targetId);
          }
        };

        requestAnimationFrame(animation);
      }
    });
  });
};

// ===== ENHANCED MOBILE NAVIGATION =====
const initMobileNavigation = () => {
  const navToggle = $('#nav-toggle');
  const navMenu = $('#nav-menu');
  const navBackdrop = $('.nav__backdrop');
  const navLinks = $$('.nav__link');

  if (!navToggle || !navMenu) return;

  // Toggle mobile menu
  navToggle.addEventListener('click', () => {
    const isActive = navToggle.classList.contains('active');

    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  const openMenu = () => {
    navMenu.classList.add('active');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Focus management for accessibility
    const firstLink = navMenu.querySelector('.nav__link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 300);
    }
  };

  const closeMenu = () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Restore scroll

    // Return focus to toggle button
    navToggle.focus();
  };

  // Close menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeMenu, 150); // Small delay for better UX
    });
  });

  // Close menu when clicking backdrop
  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
};

// ===== SMART HEADER SCROLL EFFECT =====
const initHeaderScrollEffect = () => {
  const header = $('#header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  let scrollDirection = 'up';
  let scrollSpeed = 0;

  const updateHeader = () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    scrollSpeed = Math.abs(scrollDelta);

    // Determine scroll direction
    if (scrollDelta > 0) {
      scrollDirection = 'down';
    } else if (scrollDelta < 0) {
      scrollDirection = 'up';
    }

    // Add scrolled class for styling changes
    if (currentScrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    // Smart show/hide logic
    const shouldHide =
      scrollDirection === 'down' &&
      currentScrollY > 200 &&
      scrollSpeed > 5; // Only hide if scrolling fast enough

    const shouldShow =
      scrollDirection === 'up' ||
      currentScrollY <= 200;

    if (shouldHide) {
      header.classList.add('header--hidden');
    } else if (shouldShow) {
      header.classList.remove('header--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  const requestScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  };

  // Use passive listener for better performance
  window.addEventListener('scroll', requestScroll, { passive: true });

  // Show header when hovering near top
  let hoverTimeout;
  window.addEventListener('mousemove', (e) => {
    if (e.clientY < 100 && header.classList.contains('header--hidden')) {
      clearTimeout(hoverTimeout);
      header.classList.remove('header--hidden');

      hoverTimeout = setTimeout(() => {
        if (window.scrollY > 200 && scrollDirection === 'down') {
          header.classList.add('header--hidden');
        }
      }, 2000);
    }
  });
};

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Elements to animate
  const animatedElements = $$('.service__card, .portfolio__item, .stat, .section__header');

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
};

// ===== ENHANCED ACTIVE NAV HIGHLIGHTING =====
const initActiveNavHighlighting = () => {
  const navLinks = $$('.nav__link');
  const sections = $$('section[id]');

  if (!navLinks.length || !sections.length) return;

  const observerOptions = {
    threshold: [0.1, 0.3, 0.6],
    rootMargin: '-20% 0px -20% 0px'
  };

  let currentActiveSection = null;

  const observer = new IntersectionObserver((entries) => {
    // Sort entries by intersection ratio to find the most visible section
    const visibleEntries = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleEntries.length > 0) {
      const mostVisible = visibleEntries[0];
      const activeId = mostVisible.target.getAttribute('id');

      if (activeId !== currentActiveSection) {
        updateActiveNavigation(`#${activeId}`);
        currentActiveSection = activeId;
      }
    }
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // Handle initial page load
  const handleInitialState = () => {
    const hash = window.location.hash;
    if (hash) {
      updateActiveNavigation(hash);
    } else {
      updateActiveNavigation('#home');
    }
  };

  // Handle browser back/forward
  window.addEventListener('hashchange', () => {
    updateActiveNavigation(window.location.hash || '#home');
  });

  // Initialize
  handleInitialState();

  // Add keyboard navigation support
  initKeyboardNavigation();
};

// ===== KEYBOARD NAVIGATION =====
const initKeyboardNavigation = () => {
  const navLinks = $$('.nav__link');

  navLinks.forEach((link, index) => {
    link.addEventListener('keydown', (e) => {
      let targetIndex;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          targetIndex = (index + 1) % navLinks.length;
          navLinks[targetIndex].focus();
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          targetIndex = (index - 1 + navLinks.length) % navLinks.length;
          navLinks[targetIndex].focus();
          break;

        case 'Home':
          e.preventDefault();
          navLinks[0].focus();
          break;

        case 'End':
          e.preventDefault();
          navLinks[navLinks.length - 1].focus();
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          link.click();
          break;
      }
    });
  });
};

// ===== UPDATE ACTIVE NAVIGATION STATE =====
const updateActiveNavigation = (targetId) => {
  const navLinks = $$('.nav__link');

  // Remove active state from all links
  navLinks.forEach(link => {
    link.removeAttribute('aria-current');
    link.classList.remove('active');
  });

  // Add active state to current link
  const activeLink = $(`.nav__link[href="${targetId}"]`);
  if (activeLink) {
    activeLink.setAttribute('aria-current', 'page');
    activeLink.classList.add('active');

    // Update page title for better UX
    const sectionName = activeLink.textContent.trim();
    if (sectionName !== 'Home') {
      document.title = `${sectionName} - T9 Digital`;
    } else {
      document.title = 'T9 Digital - Creative Digital Marketing Agency';
    }
  }
};

// ===== FORM HANDLING =====
const initFormHandling = () => {
  const contactForm = $('.contact__form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Simple validation
    if (!data.name || !data.email || !data.service || !data.message) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate form submission
    const submitButton = contactForm.querySelector('.btn--primary');
    const originalText = submitButton.textContent;

    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
      showNotification('Thank you! Your message has been sent successfully.', 'success');
      contactForm.reset();
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 2000);
  });
};


// ===== ENHANCED HERO ANIMATIONS =====
const initEnhancedHeroAnimations = () => {
  // Initialize particle system
  initParticleSystem();

  // Initialize intersection observer for hero animations
  initHeroIntersectionObserver();

  // Initialize advanced scroll effects
  initHeroScrollEffects();
};

// ===== PARTICLE SYSTEM =====
const initParticleSystem = () => {
  const particlesContainer = $('#heroParticles');
  if (!particlesContainer) return;

  const particleCount = window.innerWidth < 768 ? 15 : window.innerWidth < 1024 ? 20 : 25;
  const particles = [];

  // Particle types and their properties
  const particleTypes = [
    { type: 'circle', size: () => Math.random() * 6 + 2 },
    { type: 'square', size: () => Math.random() * 8 + 3 },
    { type: 'triangle', size: () => Math.random() * 6 + 4 },
    { type: 'diamond', size: () => Math.random() * 5 + 3 }
  ];

  const createParticle = () => {
    const particle = document.createElement('div');
    const particleType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
    const size = particleType.size();

    particle.className = `particle ${particleType.type}`;

    // Set particle properties
    const startX = Math.random() * window.innerWidth;
    const animationDuration = 15 + Math.random() * 10; // 15-25 seconds
    const delay = Math.random() * 5; // 0-5 second delay

    if (particleType.type === 'circle' || particleType.type === 'square' || particleType.type === 'diamond') {
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
    }

    particle.style.left = `${startX}px`;
    particle.style.animationDuration = `${animationDuration}s`;
    particle.style.animationDelay = `${delay}s`;

    // Add random horizontal drift
    particle.style.setProperty('--drift', `${(Math.random() - 0.5) * 100}px`);

    // Random color variation
    const colorVariation = Math.random();
    if (colorVariation < 0.4) {
      particle.style.background = 'var(--primary-400)';
      particle.style.borderBottomColor = 'var(--primary-400)';
    } else if (colorVariation < 0.8) {
      particle.style.background = 'var(--secondary-400)';
      particle.style.borderBottomColor = 'var(--secondary-400)';
    } else {
      particle.style.background = 'var(--primary-300)';
      particle.style.borderBottomColor = 'var(--primary-300)';
    }

    return particle;
  };

  // Create initial particles
  for (let i = 0; i < particleCount; i++) {
    const particle = createParticle();
    particles.push(particle);
    particlesContainer.appendChild(particle);

    // Stagger initial animations
    setTimeout(() => {
      particle.style.animationPlayState = 'running';
    }, i * 200);
  }

  // Continuously spawn new particles
  const spawnInterval = setInterval(() => {
    if (particles.length < particleCount) {
      const particle = createParticle();
      particles.push(particle);
      particlesContainer.appendChild(particle);
    }

    // Remove old particles that have finished animating
    particles.forEach((particle, index) => {
      if (particle.offsetTop < -100) {
        particle.remove();
        particles.splice(index, 1);
      }
    });
  }, 2000);

  // Performance optimization: pause particles when not in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        particles.forEach(particle => {
          particle.style.animationPlayState = 'running';
        });
      } else {
        particles.forEach(particle => {
          particle.style.animationPlayState = 'paused';
        });
      }
    });
  });

  observer.observe(particlesContainer);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(spawnInterval);
    observer.disconnect();
  });
};

// ===== HERO INTERSECTION OBSERVER =====
const initHeroIntersectionObserver = () => {
  const heroSection = $('.hero');
  if (!heroSection) return;

  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -20% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger hero animations when in view
        heroSection.classList.add('hero--visible');

        // Trigger staggered word animations
        const words = $$('.hero__word');
        words.forEach((word, index) => {
          setTimeout(() => {
            word.style.animationPlayState = 'running';
          }, index * 150);
        });
      }
    });
  }, observerOptions);

  observer.observe(heroSection);
};

// ===== ENHANCED SCROLL EFFECTS =====
const initHeroScrollEffects = () => {
  const heroVisual = $('.hero__visual');
  const heroBackground = $('.hero__gradient-bg');

  if (!heroVisual || !heroBackground) return;

  let ticking = false;

  const updateHeroOnScroll = () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    const maxScroll = window.innerHeight;

    if (scrolled < maxScroll) {
      // Parallax effect for visual elements
      heroVisual.style.transform = `translateY(${rate * 0.3}px) scale(${1 + scrolled * 0.0001})`;

      // Dynamic background opacity
      const opacity = Math.max(0.3, 1 - scrolled / maxScroll);
      heroBackground.style.opacity = opacity;

      // Rotate hero graphic based on scroll
      const heroGraphic = $('.hero__graphic');
      if (heroGraphic) {
        heroGraphic.style.transform = `rotate(${scrolled * 0.1}deg)`;
      }
    }

    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (!ticking) {
      requestAnimationFrame(updateHeroOnScroll);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
};

// ===== ADVANCED BUTTON INTERACTIONS =====
const initAdvancedButtonEffects = () => {
  const ctaButtons = $$('.hero__cta-primary, .hero__cta-secondary');

  ctaButtons.forEach(button => {
    // Add ripple effect on click
    button.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('btn__ripple');

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });

    // Enhanced hover effects
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-4px) scale(1.02)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0) scale(1)';
    });
  });
};

// ===== PERFORMANCE OPTIMIZED ANIMATIONS =====
const initPerformanceOptimizations = () => {
  // Use will-change property for better performance
  const animatedElements = $$('.hero__word, .hero__graphic, .particle');

  animatedElements.forEach(element => {
    element.style.willChange = 'transform, opacity';
  });

  // Cleanup will-change after animations complete
  setTimeout(() => {
    animatedElements.forEach(element => {
      element.style.willChange = 'auto';
    });
  }, 5000);

  // Reduce motion for users who prefer it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-default', 'none');
    document.documentElement.style.setProperty('--transition-slow', 'none');

    // Disable particle system for reduced motion
    const particlesContainer = $('#heroParticles');
    if (particlesContainer) {
      particlesContainer.style.display = 'none';
    }
  }
};

// ===== PARALLAX EFFECT =====
const initParallaxEffect = () => {
  const heroSection = $('.hero');
  if (!heroSection) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    if (scrolled < window.innerHeight) {
      heroSection.style.transform = `translateY(${rate}px)`;
    }
  });
};

// ===== CURSOR TRAIL EFFECT =====
const initCursorTrail = () => {
  // Only add cursor trail on desktop
  if (window.innerWidth < 768) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor-trail';

  Object.assign(cursor.style, {
    position: 'fixed',
    width: '20px',
    height: '20px',
    background: 'radial-gradient(circle, rgba(0,212,255,0.8) 0%, rgba(57,255,20,0.4) 100%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: '9999',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.1s ease',
    opacity: '0'
  });

  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  // Smooth cursor follow
  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(animateCursor);
  };

  animateCursor();
};

// ===== PERFORMANCE OPTIMIZATION =====
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// ===== LOADING ANIMATION =====
const initLoadingAnimation = () => {
  // Add loading class to body
  document.body.classList.add('loading');

  // Create loading screen
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.innerHTML = `
    <div class="loader__content">
      <div class="loader__logo">T9 Digital</div>
      <div class="loader__bar">
        <div class="loader__progress"></div>
      </div>
    </div>
  `;

  // Add loader styles
  const loaderStyles = `
    .loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #0a0a0a;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      transition: opacity 0.5s ease;
    }
    .loader__content {
      text-align: center;
    }
    .loader__logo {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #00d4ff, #39ff14);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 2rem;
    }
    .loader__bar {
      width: 200px;
      height: 4px;
      background: #333;
      border-radius: 2px;
      overflow: hidden;
    }
    .loader__progress {
      width: 0%;
      height: 100%;
      background: linear-gradient(135deg, #00d4ff, #39ff14);
      border-radius: 2px;
      transition: width 0.3s ease;
    }
    body.loading {
      overflow: hidden;
    }
  `;

  const style = document.createElement('style');
  style.textContent = loaderStyles;
  document.head.appendChild(style);

  document.body.appendChild(loader);

  // Animate progress bar
  const progress = loader.querySelector('.loader__progress');
  let width = 0;

  const updateProgress = () => {
    width += Math.random() * 10;
    if (width > 100) width = 100;

    progress.style.width = width + '%';

    if (width < 100) {
      setTimeout(updateProgress, 100);
    } else {
      // Remove loader after loading is complete
      setTimeout(() => {
        loader.style.opacity = '0';
        document.body.classList.remove('loading');
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 500);
      }, 300);
    }
  };

  updateProgress();
};

// ===== INITIALIZE ALL FUNCTIONALITY =====
const init = () => {
  // Initialize loading animation first
  initLoadingAnimation();

  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initializeFeatures, 500);
    });
  } else {
    setTimeout(initializeFeatures, 500);
  }
};

const initializeFeatures = () => {
  // Core functionality
  initSmoothScrolling();
  initMobileNavigation();
  initHeaderScrollEffect();
  initScrollAnimations();
  initActiveNavHighlighting();
  initFormHandling();

  // Advanced features
  initEasterEggs();
  initCustomCursor();
  initScrollProgress();
  initReadingTimeEstimates();
  initPageTransitions();
  initMicroInteractions();
  initBrowserCompatibility();
  initQualityAssurance();

  // Enhanced animations and effects
  initEnhancedHeroAnimations();
  initAdvancedButtonEffects();
  initPerformanceOptimizations();
  initParallaxEffect();
  initCursorTrail();
  initPortfolioSystem();
  initComprehensiveAnimations();
  initAdvancedBackgroundEffects();
  initAboutAnimations();
  initContactForm();
  initContactMethodInteractions();
  initResourceDownloads();

  // Optimize scroll events with debouncing
  const debouncedScrollHandler = debounce(() => {
    // Additional scroll-based optimizations can go here
  }, 10);

  window.addEventListener('scroll', debouncedScrollHandler);

  // Add resize handler for responsive adjustments
  window.addEventListener('resize', debounce(() => {
    // Reinitialize cursor trail on resize
    const existingCursor = $('.cursor-trail');
    if (existingCursor) {
      existingCursor.remove();
    }
    initCursorTrail();

    // Reinitialize particle system with new count for new screen size
    const particlesContainer = $('#heroParticles');
    if (particlesContainer) {
      // Clear existing particles
      particlesContainer.innerHTML = '';
      // Reinitialize with proper count for new screen size
      setTimeout(initParticleSystem, 100);
    }
  }, 250));
};

// ===== ADVANCED BACKGROUND EFFECTS SYSTEM =====
const initAdvancedBackgroundEffects = () => {
  initAdvancedParticleSystem();
  initMouseInteraction();
  initAnimatedGradients();
  initGeometricPatterns();
  initDynamicLighting();
  initEnhancedCursorTrail();
  initHoverMagnetism();
  initPageTransitions();
  initEnhancedLoadingScreen();
  initPerformanceControls();
};

// ===== ADVANCED PARTICLE SYSTEM =====
const initAdvancedParticleSystem = () => {
  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Create canvas-based particle system
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Try to create background system or fall back to body
  let backgroundSystem = $('.background-system');
  if (!backgroundSystem) {
    backgroundSystem = document.createElement('div');
    backgroundSystem.className = 'background-system';
    document.body.appendChild(backgroundSystem);
  }
  backgroundSystem.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const particles = [];
  const maxParticles = window.innerWidth < 768 ? 30 : window.innerWidth < 1024 ? 50 : 80;

  // Particle class
  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 8 + 2;
      this.speed = Math.random() * 2 + 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.oscillation = Math.random() * 0.02 + 0.01;
      this.type = Math.floor(Math.random() * 4); // 0: circle, 1: triangle, 2: square, 3: diamond
      this.color = this.getColor();
      this.mouseDistance = 0;
      this.baseX = this.x;
    }

    getColor() {
      const colors = [
        'rgba(0, 212, 255, 0.6)',   // Primary blue
        'rgba(57, 255, 20, 0.5)',   // Secondary green
        'rgba(0, 212, 255, 0.3)',   // Primary blue (lighter)
        'rgba(57, 255, 20, 0.3)',   // Secondary green (lighter)
        'rgba(255, 255, 255, 0.2)'  // White
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    update(mouseX, mouseY) {
      // Move upward
      this.y -= this.speed;

      // Oscillate horizontally
      this.angle += this.oscillation;
      this.x = this.baseX + Math.sin(this.angle) * 30;

      // Mouse interaction
      if (mouseX !== undefined && mouseY !== undefined) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        this.mouseDistance = Math.sqrt(dx * dx + dy * dy);

        if (this.mouseDistance < 150) {
          const force = (150 - this.mouseDistance) / 150;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 20;
          this.y -= Math.sin(angle) * force * 20;
        }
      }

      // Reset if off screen
      if (this.y < -20) {
        this.reset();
      }

      // Keep particles in bounds
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;

      // Apply glow effect for nearby mouse
      if (this.mouseDistance < 100) {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
      }

      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;

      switch (this.type) {
        case 0: // Circle
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 1: // Triangle
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.size / 2);
          ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2);
          ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2);
          ctx.closePath();
          ctx.fill();
          break;

        case 2: // Square
          ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
          break;

        case 3: // Diamond
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
          ctx.restore();
          break;
      }

      ctx.restore();
    }
  }

  // Initialize particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  let mouseX, mouseY;
  let animationId;

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animation loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update(mouseX, mouseY);
      particle.draw(ctx);
    });

    animationId = requestAnimationFrame(animate);
  };

  animate();

  // Handle resize
  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', handleResize);

  // Cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
  };
};

// ===== MOUSE INTERACTION SYSTEM =====
const initMouseInteraction = () => {
  let mouseX = 0;
  let mouseY = 0;

  // Update CSS custom properties for mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;

    document.documentElement.style.setProperty('--mouse-x', `${mouseX}%`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseY}%`);
  });

  // Interactive elements response
  const interactiveElements = $$('button, a, .card, .portfolio__item, .service__card');

  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'translateY(-2px) scale(1.02)';
      document.body.style.cursor = 'none';
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
      document.body.style.cursor = '';
    });
  });
};

// ===== ANIMATED GRADIENTS =====
const initAnimatedGradients = () => {
  // Create gradient background if not exists
  let backgroundSystem = $('.background-system');
  if (!backgroundSystem) {
    backgroundSystem = document.createElement('div');
    backgroundSystem.className = 'background-system';
    document.body.appendChild(backgroundSystem);
  }

  const gradientBg = document.createElement('div');
  gradientBg.className = 'gradient-background';
  backgroundSystem.appendChild(gradientBg);

  // Dynamic color shifting based on scroll
  let currentHue = 200; // Start with blue
  const updateGradientColor = () => {
    const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
    currentHue = 200 + (scrollPercent * 60); // Shift from blue to green

    gradientBg.style.filter = `hue-rotate(${currentHue - 200}deg)`;
  };

  window.addEventListener('scroll', debounce(updateGradientColor, 16), { passive: true });
};

// ===== GEOMETRIC PATTERNS =====
const initGeometricPatterns = () => {
  let backgroundSystem = $('.background-system');
  if (!backgroundSystem) {
    backgroundSystem = document.createElement('div');
    backgroundSystem.className = 'background-system';
    document.body.appendChild(backgroundSystem);
  }

  // Add noise overlay
  const noiseOverlay = document.createElement('div');
  noiseOverlay.className = 'noise-overlay';
  backgroundSystem.appendChild(noiseOverlay);

  // Add geometric patterns
  const geometricPatterns = document.createElement('div');
  geometricPatterns.className = 'geometric-patterns';
  backgroundSystem.appendChild(geometricPatterns);

  // Scroll-responsive patterns
  const scrollPatterns = document.createElement('div');
  scrollPatterns.className = 'scroll-patterns';
  backgroundSystem.appendChild(scrollPatterns);

  // Create pattern elements
  for (let i = 0; i < 10; i++) {
    const pattern = document.createElement('div');
    pattern.className = 'scroll-pattern';
    pattern.style.left = Math.random() * 100 + '%';
    pattern.style.top = Math.random() * 100 + '%';
    pattern.style.animationDelay = Math.random() * 5 + 's';
    scrollPatterns.appendChild(pattern);
  }

  // Update patterns on scroll
  const updatePatterns = () => {
    const scrollY = window.pageYOffset;
    const patterns = $$('.scroll-pattern');

    patterns.forEach((pattern, index) => {
      const speed = 0.5 + (index % 3) * 0.2;
      const yOffset = scrollY * speed * 0.1;
      const rotation = scrollY * 0.05 + (index * 45);

      pattern.style.transform = `translateY(${yOffset}px) rotate(${rotation}deg)`;
    });
  };

  window.addEventListener('scroll', debounce(updatePatterns, 8), { passive: true });
};

// ===== DYNAMIC LIGHTING =====
const initDynamicLighting = () => {
  if (window.innerWidth < 768) return; // Skip on mobile for performance

  let backgroundSystem = $('.background-system');
  if (!backgroundSystem) {
    backgroundSystem = document.createElement('div');
    backgroundSystem.className = 'background-system';
    document.body.appendChild(backgroundSystem);
  }

  const lightingEffects = document.createElement('div');
  lightingEffects.className = 'lighting-effects';
  backgroundSystem.appendChild(lightingEffects);

  // Update lighting based on scroll and time
  const updateLighting = () => {
    const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
    const time = Date.now() * 0.001;

    // Create pulsing effect
    const pulseIntensity = Math.sin(time * 0.5) * 0.02 + 0.08;
    lightingEffects.style.opacity = pulseIntensity;

    // Shift position based on scroll
    const xShift = Math.sin(scrollPercent * Math.PI * 2) * 20 + 50;
    const yShift = scrollPercent * 100;

    lightingEffects.style.background = `radial-gradient(
      ellipse 800px 400px at ${xShift}% ${yShift}%,
      rgba(0, 212, 255, ${pulseIntensity}) 0%,
      rgba(57, 255, 20, ${pulseIntensity * 0.5}) 40%,
      transparent 70%
    )`;
  };

  const lightingInterval = setInterval(updateLighting, 50);

  // Cleanup
  window.addEventListener('beforeunload', () => {
    clearInterval(lightingInterval);
  });
};

// ===== ENHANCED CURSOR TRAIL =====
const initEnhancedCursorTrail = () => {
  if (window.innerWidth < 768) return; // Skip on mobile

  // Remove existing cursor trail
  const existingTrail = $('.cursor-trail');
  if (existingTrail) existingTrail.remove();

  const cursorTrail = document.createElement('div');
  cursorTrail.className = 'cursor-trail';
  document.body.appendChild(cursorTrail);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor following
  const updateCursor = () => {
    const speed = 0.15;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;

    cursorTrail.style.left = cursorX + 'px';
    cursorTrail.style.top = cursorY + 'px';

    requestAnimationFrame(updateCursor);
  };

  updateCursor();

  // Interactive elements
  const interactiveElements = $$('button, a, [role="button"], .card, .portfolio__item');

  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursorTrail.classList.add('active');
    });

    element.addEventListener('mouseleave', () => {
      cursorTrail.classList.remove('active');
    });
  });

  // Hide cursor trail when mouse leaves window
  document.addEventListener('mouseleave', () => {
    cursorTrail.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorTrail.style.opacity = '1';
  });
};

// ===== HOVER MAGNETISM =====
const initHoverMagnetism = () => {
  const magneticElements = $$('.btn, .portfolio__filter, .nav__link, .service__card');

  magneticElements.forEach(element => {
    element.classList.add('magnetic');

    element.addEventListener('mouseenter', () => {
      element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
    });

    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.15;
      const deltaY = (e.clientY - centerY) * 0.15;

      element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
    });
  });
};

// ===== PAGE TRANSITIONS =====
const initPageTransitions = () => {
  // Create transition overlay
  const pageTransition = document.createElement('div');
  pageTransition.className = 'page-transition';
  document.body.appendChild(pageTransition);

  // Handle internal link clicks
  const internalLinks = $$('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = $(link.getAttribute('href'));

      if (target) {
        // Trigger transition
        pageTransition.classList.add('active');

        setTimeout(() => {
          // Scroll to target
          target.scrollIntoView({ behavior: 'smooth' });

          // Remove transition
          setTimeout(() => {
            pageTransition.classList.remove('active');
          }, 300);
        }, 400);
      }
    });
  });
};

// ===== ENHANCED LOADING SCREEN =====
const initEnhancedLoadingScreen = () => {
  // Create loading screen
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading-screen';

  const loadingAnimation = document.createElement('div');
  loadingAnimation.className = 'loading-animation';

  const loadingLogo = document.createElement('div');
  loadingLogo.className = 'loading-logo';
  loadingLogo.textContent = 'T9';

  const loadingProgress = document.createElement('div');
  loadingProgress.className = 'loading-progress';

  const loadingBar = document.createElement('div');
  loadingBar.className = 'loading-bar';
  loadingProgress.appendChild(loadingBar);

  // Loading particles
  const loadingParticles = document.createElement('div');
  loadingParticles.className = 'loading-particles';

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.className = 'loading-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 3 + 's';
    loadingParticles.appendChild(particle);
  }

  loadingAnimation.appendChild(loadingLogo);
  loadingAnimation.appendChild(loadingProgress);
  loadingScreen.appendChild(loadingAnimation);
  loadingScreen.appendChild(loadingParticles);

  document.body.appendChild(loadingScreen);

  // Simulate loading progress
  setTimeout(() => {
    loadingScreen.classList.add('fade-out');

    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }, 2500);
};

// ===== PERFORMANCE CONTROLS =====
const initPerformanceControls = () => {
  // Detect device capabilities
  const isMobile = window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency <= 2;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Performance settings
  if (isMobile || isLowEnd || prefersReducedMotion) {
    // Disable heavy effects
    $$('.particle-canvas, .css-particles, .lighting-effects').forEach(el => {
      if (el) el.style.display = 'none';
    });

    // Reduce animation complexity
    document.documentElement.style.setProperty('--duration-fast', '0.1s');
    document.documentElement.style.setProperty('--duration-normal', '0.2s');

    // Disable morphing shapes
    $$('.morph-shape').forEach(el => {
      el.style.animation = 'none';
    });
  }

  // Memory cleanup
  const performCleanup = () => {
    // Clean up completed animations
    $$('.animate.complete').forEach(el => {
      el.style.willChange = 'auto';
    });

    // Garbage collection hint
    if (window.gc) {
      window.gc();
    }
  };

  setInterval(performCleanup, 10000); // Clean up every 10 seconds

  // Visibility API for performance
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause animations when tab is not visible
      $$('.gradient-background, .geometric-patterns').forEach(el => {
        el.style.animationPlayState = 'paused';
      });
    } else {
      // Resume animations
      $$('.gradient-background, .geometric-patterns').forEach(el => {
        el.style.animationPlayState = 'running';
      });
    }
  });
};

// ===== COMPREHENSIVE ANIMATION SYSTEM =====
const initComprehensiveAnimations = () => {
  initScrollTriggeredAnimations();
  initStaggerAnimations();
  initProgressBars();
  initSkillMeters();
  initParallaxSystem();
  initCounterAnimations();
  initFormAnimations();
  initMorphingShapes();
  initPerformanceOptimizations();
};

// ===== SCROLL-TRIGGERED ANIMATIONS =====
const initScrollTriggeredAnimations = () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Get all animated elements
  const animatedElements = document.querySelectorAll([
    '.animate',
    '.fade-in',
    '.fade-in-up',
    '.fade-in-down',
    '.fade-in-left',
    '.fade-in-right',
    '.scale-in',
    '.scale-in-center',
    '.scale-bounce',
    '.rotate-in',
    '.slide-in-up',
    '.slide-in-down',
    '.slide-in-left',
    '.slide-in-right',
    '.flip-in-x',
    '.flip-in-y',
    '.zoom-in',
    '.zoom-out',
    '.text-reveal',
    '[data-animate]'
  ].join(', '));

  if (!animatedElements.length) return;

  // Intersection Observer options
  const observerOptions = {
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    rootMargin: '0px 0px -50px 0px'
  };

  // Create intersection observer
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
        // Add performance optimization
        entry.target.classList.add('gpu-accelerated');

        // Apply animation
        setTimeout(() => {
          entry.target.classList.add('animated');

          // Remove will-change after animation completes
          setTimeout(() => {
            entry.target.classList.add('complete');
            entry.target.classList.remove('gpu-accelerated');
          }, 1000);
        }, getAnimationDelay(entry.target));

        // Stop observing this element
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  animatedElements.forEach(element => {
    // Add initial performance optimization
    element.classList.add('animate');
    animationObserver.observe(element);
  });
};

// ===== STAGGER ANIMATIONS =====
const initStaggerAnimations = () => {
  const staggerGroups = {
    '.service__card': { animation: 'fade-in-left', delay: 150 },
    '.portfolio__item': { animation: 'scale-in', delay: 200 },
    '.section__header': { animation: 'fade-in-up', delay: 100 },
    '.about__stat': { animation: 'scale-in', delay: 100 },
    '.about__value': { animation: 'fade-in-up', delay: 120 },
    '.about__skill': { animation: 'fade-in-left', delay: 100 },
    '.about__award': { animation: 'scale-in', delay: 150 },
    '.footer__link': { animation: 'fade-in-up', delay: 50 }
  };

  Object.entries(staggerGroups).forEach(([selector, config]) => {
    const elements = $$(selector);

    elements.forEach((element, index) => {
      // Add animation class
      element.classList.add(config.animation);

      // Add stagger delay
      const delay = index * config.delay;
      element.style.transitionDelay = `${delay}ms`;

      // Add data attribute for delay
      element.setAttribute('data-delay', delay.toString());
    });
  });
};

// ===== PROGRESS BARS =====
const initProgressBars = () => {
  const progressBars = $$('.progress-fill');

  if (!progressBars.length) return;

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const percentage = progressBar.dataset.progress || 100;

        setTimeout(() => {
          progressBar.style.transform = `translateX(-${100 - percentage}%)`;
          progressBar.classList.add('animated');
        }, 200);

        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => progressObserver.observe(bar));
};

// ===== SKILL METERS =====
const initSkillMeters = () => {
  const skillMeters = $$('.skill-progress');

  if (!skillMeters.length) return;

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillProgress = entry.target;
        const percentage = skillProgress.dataset.progress || 0;
        const circumference = 339.292; // 2π × 54
        const offset = circumference - (circumference * percentage / 100);

        setTimeout(() => {
          skillProgress.style.strokeDashoffset = offset;
          skillProgress.classList.add('animated');
        }, 300);

        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  skillMeters.forEach(meter => skillObserver.observe(meter));
};

// ===== PARALLAX SYSTEM =====
const initParallaxSystem = () => {
  const parallaxElements = $$('.parallax, .parallax-slow, .parallax-medium, .parallax-fast');

  if (!parallaxElements.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;

    parallaxElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementHeight = rect.height;

      // Calculate if element is in viewport
      if (rect.bottom >= 0 && rect.top <= windowHeight) {
        // Calculate parallax offset based on element position
        const scrollProgress = (scrollY + windowHeight - elementTop) / (windowHeight + elementHeight);
        let speed = 0.5; // Default speed

        // Adjust speed based on class
        if (element.classList.contains('parallax-slow')) speed = 0.2;
        else if (element.classList.contains('parallax-medium')) speed = 0.5;
        else if (element.classList.contains('parallax-fast')) speed = 0.8;

        const yPos = (scrollProgress - 0.5) * 100 * speed;
        element.style.transform = `translateY(${yPos}px)`;
      }
    });

    ticking = false;
  };

  const requestParallaxUpdate = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  // Throttled scroll event
  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
};

// ===== COUNTER ANIMATIONS =====
const initCounterAnimations = () => {
  const counters = $$('.counter[data-count]');

  if (!counters.length) return;

  const animateCounter = (element, target, duration = 2000) => {
    const isDecimal = target.toString().includes('.');
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += increment;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      // Format number based on type
      if (isDecimal) {
        element.textContent = current.toFixed(1);
      } else if (target >= 1000) {
        element.textContent = Math.floor(current).toLocaleString();
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const counter = entry.target;
        const target = parseFloat(counter.dataset.count);
        const duration = parseInt(counter.dataset.duration) || 2000;

        counter.dataset.animated = 'true';

        setTimeout(() => {
          animateCounter(counter, target, duration);
        }, 200);

        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
};

// ===== FORM ANIMATIONS =====
const initFormAnimations = () => {
  const formInputs = $$('.form-input');

  formInputs.forEach(input => {
    // Add focus animations
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });

    // Add typing effect
    input.addEventListener('input', debounce(() => {
      input.classList.add('typing');
      setTimeout(() => {
        input.classList.remove('typing');
      }, 300);
    }, 150));
  });
};

// ===== MORPHING SHAPES =====
const initMorphingShapes = () => {
  const morphShapes = $$('.morph-shape');

  if (!morphShapes.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    morphShapes.forEach(shape => {
      shape.style.animation = 'none';
    });
    return;
  }

  // Add random delays to create organic movement
  morphShapes.forEach((shape, index) => {
    const delay = Math.random() * 5000; // 0-5 seconds
    shape.style.animationDelay = `${delay}ms`;

    // Add mouse interaction
    shape.addEventListener('mouseenter', () => {
      shape.style.animationPlayState = 'paused';
    });

    shape.addEventListener('mouseleave', () => {
      shape.style.animationPlayState = 'running';
    });
  });
};

// ===== ADVANCED PERFORMANCE OPTIMIZATIONS =====
const initAdvancedPerformanceOptimizations = () => {
  // Optimize for high-refresh displays
  const isHighRefresh = window.screen && window.screen.refreshRate > 60;
  if (isHighRefresh) {
    document.documentElement.style.setProperty('--duration-fast', '0.15s');
    document.documentElement.style.setProperty('--duration-normal', '0.25s');
  }

  // Optimize for low-end devices
  const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
  if (isLowEndDevice) {
    document.documentElement.style.setProperty('--duration-fast', '0.1s');
    document.documentElement.style.setProperty('--duration-normal', '0.2s');

    // Disable complex animations on low-end devices
    $$('.morph-shape').forEach(shape => {
      shape.style.animation = 'none';
    });
  }

  // Memory management for completed animations
  const cleanupTimer = setInterval(() => {
    $$('.animate.complete').forEach(element => {
      element.style.willChange = 'auto';
    });
  }, 5000);

  // Clear timer when page unloads
  window.addEventListener('beforeunload', () => {
    clearInterval(cleanupTimer);
  });
};

// ===== ANIMATION UTILITIES =====
const getAnimationDelay = (element) => {
  const delayAttr = element.dataset.delay;
  const staggerClass = Array.from(element.classList).find(cls => cls.startsWith('stagger-'));

  if (delayAttr) return parseInt(delayAttr);
  if (staggerClass) {
    const staggerNumber = parseInt(staggerClass.split('-')[1]);
    return staggerNumber * 100;
  }

  return 0;
};

// ===== ENHANCED PORTFOLIO FUNCTIONALITY =====
const initPortfolioSystem = () => {
  initPortfolioFilters();
  initAnimatedCounters();
  initBeforeAfterToggles();
  initPortfolioModal();
  initParallaxEffects();
  initPortfolioAnimations();
  initPortfolioKeyboardNavigation();
};

// ===== PORTFOLIO FILTERS =====
const initPortfolioFilters = () => {
  const filterButtons = $$('.portfolio__filter');
  const portfolioItems = $$('.portfolio__item');

  if (!filterButtons.length || !portfolioItems.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      // Update active filter button
      filterButtons.forEach(btn => {
        btn.classList.remove('portfolio__filter--active');
        btn.setAttribute('aria-selected', 'false');
      });

      button.classList.add('portfolio__filter--active');
      button.setAttribute('aria-selected', 'true');

      // Filter portfolio items with stagger animation
      portfolioItems.forEach((item, index) => {
        const category = item.dataset.category;
        const shouldShow = filter === 'all' || category === filter;

        // Remove from view with stagger
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px) scale(0.95)';
        item.style.pointerEvents = 'none';

        setTimeout(() => {
          if (shouldShow) {
            item.style.display = 'flex';
            // Show with stagger animation
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
              item.style.pointerEvents = 'auto';
            }, index * 100);
          } else {
            item.style.display = 'none';
          }
        }, 150);
      });

      // Update filter counts
      updateFilterCounts();

      // Announce change to screen readers
      const activeItems = portfolioItems.filter(item => {
        const category = item.dataset.category;
        return filter === 'all' || category === filter;
      });

      const announcement = `Showing ${activeItems.length} ${filter === 'all' ? 'projects' : filter + ' projects'}`;
      announceToScreenReader(announcement);
    });

    // Keyboard support for filter buttons
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });
};

const updateFilterCounts = () => {
  const filterButtons = $$('.portfolio__filter');
  const portfolioItems = $$('.portfolio__item');

  filterButtons.forEach(button => {
    const filter = button.dataset.filter;
    const countElement = button.querySelector('.portfolio__filter-count');

    if (filter === 'all') {
      countElement.textContent = portfolioItems.length;
    } else {
      const count = portfolioItems.filter(item => item.dataset.category === filter).length;
      countElement.textContent = count;
    }
  });
};

// ===== ANIMATED COUNTERS =====
const initAnimatedCounters = () => {
  const counterElements = $$('.portfolio__metric-value[data-count]');

  if (!counterElements.length) return;

  const animateCounter = (element, target, duration = 2000) => {
    const isDecimal = target.toString().includes('.');
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += step;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      // Format number appropriately
      if (isDecimal) {
        element.textContent = current.toFixed(1);
      } else if (target >= 1000) {
        element.textContent = Math.floor(current).toLocaleString();
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  };

  // Initialize Intersection Observer for counters
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const target = parseFloat(entry.target.dataset.count);
        const duration = 2000 + Math.random() * 1000; // 2-3 seconds

        // Mark as animated to prevent re-triggering
        entry.target.dataset.animated = 'true';

        // Start animation with slight delay for stagger effect
        const delay = Array.from(counterElements).indexOf(entry.target) * 200;
        setTimeout(() => {
          animateCounter(entry.target, target, duration);
        }, delay);
      }
    });
  }, observerOptions);

  counterElements.forEach(element => {
    counterObserver.observe(element);
  });
};

// ===== BEFORE/AFTER IMAGE TOGGLES =====
const initBeforeAfterToggles = () => {
  const toggleButtons = $$('.portfolio__toggle');

  toggleButtons.forEach(button => {
    const container = button.closest('.portfolio__image-container');
    const beforeImage = container.querySelector('.portfolio__image--before');
    const afterImage = container.querySelector('.portfolio__image--after');

    let isShowingAfter = false;

    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering item click

      isShowingAfter = !isShowingAfter;

      if (isShowingAfter) {
        beforeImage.style.opacity = '0';
        afterImage.style.opacity = '1';
        button.setAttribute('aria-label', 'Show before image');
      } else {
        beforeImage.style.opacity = '1';
        afterImage.style.opacity = '0';
        button.setAttribute('aria-label', 'Show after image');
      }

      // Rotate button icon for visual feedback
      const icon = button.querySelector('svg');
      if (icon) {
        icon.style.transform = isShowingAfter ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });

    // Auto-toggle on hover for desktop
    const item = button.closest('.portfolio__item');
    if (window.innerWidth > 768) {
      item.addEventListener('mouseenter', () => {
        if (!isShowingAfter) {
          setTimeout(() => {
            afterImage.style.opacity = '1';
          }, 500); // Delay for hover effect
        }
      });

      item.addEventListener('mouseleave', () => {
        if (!isShowingAfter) {
          afterImage.style.opacity = '0';
        }
      });
    }
  });
};

// ===== PORTFOLIO MODAL SYSTEM =====
const initPortfolioModal = () => {
  const modal = $('#portfolioModal');
  const modalBackdrop = $('.portfolio__modal-backdrop');
  const modalClose = $('.portfolio__modal-close');
  const portfolioItems = $$('.portfolio__item');

  if (!modal || !portfolioItems.length) return;

  // Sample case study data
  const caseStudyData = {
    'TechVision Identity Redesign': {
      category: 'Brand Identity',
      date: 'March 2024',
      description: `Complete brand transformation project that took TechVision from an outdated corporate identity to a modern, tech-forward brand that resonates with millennial and Gen Z audiences. The project included comprehensive market research, competitor analysis, and brand strategy development.

The new identity system features a dynamic logo that adapts across digital and print mediums, a sophisticated color palette, and a comprehensive style guide that ensures consistent brand application across all touchpoints.`,
      metrics: [
        { label: 'Brand Recognition Increase', value: '78%' },
        { label: 'Customer Preference', value: '45%' },
        { label: 'Social Media Engagement', value: '156%' },
        { label: 'Website Traffic Increase', value: '89%' }
      ],
      timeline: [
        { phase: 'Research & Discovery', duration: '2 weeks', description: 'Market analysis and brand audit' },
        { phase: 'Strategy Development', duration: '1 week', description: 'Brand positioning and messaging' },
        { phase: 'Design Creation', duration: '3 weeks', description: 'Logo design and identity system' },
        { phase: 'Implementation', duration: '2 weeks', description: 'Style guide and brand rollout' }
      ]
    },
    // Add more case studies as needed...
  };

  const openModal = (title) => {
    const data = caseStudyData[title];
    if (!data) return;

    // Populate modal content
    $('#modalTitle').textContent = title;
    $('.portfolio__modal-category').textContent = data.category;
    $('.portfolio__modal-date').textContent = data.date;
    $('.portfolio__modal-description').textContent = data.description;

    // Populate metrics
    const metricsGrid = $('.portfolio__modal-metrics-grid');
    metricsGrid.innerHTML = data.metrics.map(metric => `
      <div class="portfolio__metric">
        <span class="portfolio__metric-value">${metric.value}</span>
        <span class="portfolio__metric-label">${metric.label}</span>
      </div>
    `).join('');

    // Populate timeline
    const timelineItems = $('.portfolio__modal-timeline-items');
    timelineItems.innerHTML = data.timeline.map(item => `
      <div class="portfolio__timeline-item">
        <strong>${item.phase}</strong> (${item.duration})
        <p>${item.description}</p>
      </div>
    `).join('');

    // Show modal
    modal.classList.add('portfolio__modal--active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus management
    modalClose.focus();

    // Announce to screen readers
    announceToScreenReader(`Opened case study for ${title}`);
  };

  const closeModal = () => {
    modal.classList.remove('portfolio__modal--active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Return focus to the triggering element
    const activeItem = $('.portfolio__item:focus');
    if (activeItem) {
      activeItem.focus();
    }

    announceToScreenReader('Case study modal closed');
  };

  // Open modal on item click
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.querySelector('.portfolio__title').textContent.trim();
      openModal(title);
    });

    // Keyboard support
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const title = item.querySelector('.portfolio__title').textContent.trim();
        openModal(title);
      }
    });
  });

  // Close modal events
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  // Keyboard navigation for modal
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }

    // Trap focus within modal
    if (e.key === 'Tab') {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
};

// ===== PARALLAX EFFECTS =====
const initParallaxEffects = () => {
  const parallaxLayers = $$('.portfolio__parallax-layer');

  if (!parallaxLayers.length) return;

  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.pageYOffset;

    parallaxLayers.forEach(layer => {
      const rect = layer.getBoundingClientRect();
      const speed = 0.5; // Parallax speed factor
      const yPos = -(scrollY * speed);

      layer.style.transform = `translateY(${yPos}px)`;
    });

    ticking = false;
  };

  const requestParallaxUpdate = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestParallaxUpdate);
};

// ===== PORTFOLIO SCROLL ANIMATIONS =====
const initPortfolioAnimations = () => {
  const portfolioItems = $$('.portfolio__item');
  const filterButtons = $$('.portfolio__filter');

  if (!portfolioItems.length) return;

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const portfolioObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation based on position
        const delay = index * 150;

        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.classList.add('portfolio__item--animated');
        }, delay);
      }
    });
  }, observerOptions);

  // Set initial state and observe
  portfolioItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    portfolioObserver.observe(item);
  });

  // Animate filter buttons
  filterButtons.forEach((button, index) => {
    button.style.opacity = '0';
    button.style.transform = 'translateY(20px)';
    button.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    setTimeout(() => {
      button.style.opacity = '1';
      button.style.transform = 'translateY(0)';
    }, index * 100);
  });
};

// ===== KEYBOARD NAVIGATION =====
const initPortfolioKeyboardNavigation = () => {
  const portfolioItems = $$('.portfolio__item');
  const filterButtons = $$('.portfolio__filter');

  if (!portfolioItems.length) return;

  // Make portfolio items focusable
  portfolioItems.forEach((item, index) => {
    item.setAttribute('tabindex', '0');

    item.addEventListener('keydown', (e) => {
      let targetIndex;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          targetIndex = (index + 1) % portfolioItems.length;
          portfolioItems[targetIndex].focus();
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          targetIndex = (index - 1 + portfolioItems.length) % portfolioItems.length;
          portfolioItems[targetIndex].focus();
          break;

        case 'Home':
          e.preventDefault();
          portfolioItems[0].focus();
          break;

        case 'End':
          e.preventDefault();
          portfolioItems[portfolioItems.length - 1].focus();
          break;
      }
    });
  });

  // Filter button keyboard navigation
  filterButtons.forEach((button, index) => {
    button.addEventListener('keydown', (e) => {
      let targetIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          targetIndex = (index + 1) % filterButtons.length;
          filterButtons[targetIndex].focus();
          break;

        case 'ArrowLeft':
          e.preventDefault();
          targetIndex = (index - 1 + filterButtons.length) % filterButtons.length;
          filterButtons[targetIndex].focus();
          break;

        case 'Home':
          e.preventDefault();
          filterButtons[0].focus();
          break;

        case 'End':
          e.preventDefault();
          filterButtons[filterButtons.length - 1].focus();
          break;
      }
    });
  });
};

// ===== ACCESSIBILITY HELPERS =====
const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// ===== ABOUT SECTION ANIMATIONS =====
const initAboutAnimations = () => {
  // Counter Animation
  const initCounterAnimations = () => {
    const counters = $$('.counter');

    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
      const increment = target / (duration / 16); // 60 FPS
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    };

    // Create intersection observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  };

  // Skill Bar Animation
  const initSkillBarAnimations = () => {
    const skillBars = $$('.about__skill-fill');

    const animateSkillBar = (skillBar) => {
      const targetWidth = skillBar.getAttribute('data-progress') + '%';
      skillBar.style.width = targetWidth;
    };

    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkillBar(entry.target);
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(skillBar => {
      skillObserver.observe(skillBar);
    });
  };

  // Timeline Animation
  const initTimelineAnimations = () => {
    const timelineItems = $$('.about__timeline-item');

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => {
      timelineObserver.observe(item);
    });
  };

  // Client Carousel
  const initClientCarousel = () => {
    const carousel = $('.about__client-track');
    if (!carousel) return;

    // Clone the logos for seamless loop
    const logos = $$('.about__client-logo');
    logos.forEach(logo => {
      const clone = logo.cloneNode(true);
      carousel.appendChild(clone);
    });

    // Pause animation on hover
    carousel.addEventListener('mouseenter', () => {
      carousel.style.animationPlayState = 'paused';
    });

    carousel.addEventListener('mouseleave', () => {
      carousel.style.animationPlayState = 'running';
    });
  };

  // Award Hover Effects
  const initAwardAnimations = () => {
    const awards = $$('.about__award');

    awards.forEach(award => {
      award.addEventListener('mouseenter', () => {
        award.classList.add('hover-active');
      });

      award.addEventListener('mouseleave', () => {
        award.classList.remove('hover-active');
      });
    });
  };

  // Value Icon Animations
  const initValueAnimations = () => {
    const values = $$('.about__value');

    const valueObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.5 });

    values.forEach(value => {
      valueObserver.observe(value);
    });
  };

  // Background Shape Animation
  const initBackgroundShapes = () => {
    const shapes = $$('.about__shape');

    shapes.forEach((shape, index) => {
      // Add random animation variations
      const duration = 15 + Math.random() * 10; // 15-25 seconds
      const delay = Math.random() * 5; // 0-5 seconds delay

      shape.style.animationDuration = `${duration}s`;
      shape.style.animationDelay = `${delay}s`;
    });
  };

  // Initialize all About animations
  initCounterAnimations();
  initSkillBarAnimations();
  initTimelineAnimations();
  initClientCarousel();
  initAwardAnimations();
  initValueAnimations();
  initBackgroundShapes();

  // Additional simple counter animation for basic About section
  const simpleCounters = $$('.counter');
  if (simpleCounters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-count'));
          let current = 0;
          const increment = target / 60; // 60 frames for smooth animation

          const updateCounter = () => {
            if (current < target) {
              current += increment;
              counter.textContent = Math.floor(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };

          updateCounter();
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    simpleCounters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }
};

// ===== CONTACT FORM SYSTEM =====
const initContactForm = () => {
  const form = $('#contactForm');
  const steps = $$('.form__step');
  const nextBtn = $('#nextBtn');
  const prevBtn = $('#prevBtn');
  const submitBtn = $('#submitBtn');
  const progressFill = $('#formProgress');
  const currentStepSpan = $('#currentStep');
  const totalStepsSpan = $('#totalSteps');
  const successMessage = $('#successMessage');

  if (!form) return;

  let currentStep = 1;
  const totalSteps = steps.length;
  let formData = {};

  // Initialize
  totalStepsSpan.textContent = totalSteps;
  updateProgress();

  // Form validation patterns
  const validationPatterns = {
    name: /^[a-zA-Z\s]{2,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    required: /^.+$/
  };

  // Real-time validation
  const validateField = (field) => {
    const value = field.value.trim();
    const validateType = field.getAttribute('data-validate');
    const errorElement = $(`#${field.name}Error`);

    if (!validateType) return true;

    let isValid = true;
    let errorMessage = '';

    if (field.required && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (value && validationPatterns[validateType] && !validationPatterns[validateType].test(value)) {
      isValid = false;
      switch (validateType) {
        case 'name':
          errorMessage = 'Please enter a valid name (2-50 characters, letters only)';
          break;
        case 'email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'phone':
          errorMessage = 'Please enter a valid phone number';
          break;
        case 'url':
          errorMessage = 'Please enter a valid URL (e.g., https://example.com)';
          break;
        default:
          errorMessage = 'Please enter a valid value';
      }
    }

    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.style.color = isValid ? 'var(--secondary-500)' : '#ff4757';
    }

    field.style.borderColor = isValid ?
      (value ? 'var(--secondary-500)' : 'var(--border-color)') :
      '#ff4757';

    return isValid;
  };

  // Add validation to all form inputs
  const formInputs = $$('.form__input, .form__textarea, .form__select');
  formInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      // Debounced validation
      clearTimeout(input.validationTimeout);
      input.validationTimeout = setTimeout(() => validateField(input), 300);
    });
  });

  // Character counter for textarea
  const messageTextarea = $('#message');
  const charCount = $('#charCount');
  if (messageTextarea && charCount) {
    messageTextarea.addEventListener('input', () => {
      const count = messageTextarea.value.length;
      charCount.textContent = count;
      charCount.style.color = count > 500 ? '#ff4757' : 'var(--text-secondary)';
    });
  }

  // Step navigation
  const updateProgress = () => {
    const progressPercentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    currentStepSpan.textContent = currentStep;

    // Update button visibility
    prevBtn.disabled = currentStep === 1;
    if (currentStep === totalSteps) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'flex';
    } else {
      nextBtn.style.display = 'flex';
      submitBtn.style.display = 'none';
    }

    // Update step visibility
    steps.forEach((step, index) => {
      step.classList.toggle('form__step--active', index + 1 === currentStep);
    });
  };

  const validateCurrentStep = () => {
    const currentStepElement = $(`.form__step[data-step="${currentStep}"]`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    const serviceCheckboxes = currentStepElement.querySelectorAll('input[name="services[]"]');

    let isValid = true;

    // Validate required fields
    requiredFields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    // Special validation for service selection step
    if (currentStep === 3 && serviceCheckboxes.length > 0) {
      const checkedServices = currentStepElement.querySelectorAll('input[name="services[]"]:checked');
      if (checkedServices.length === 0) {
        isValid = false;
        showNotification('Please select at least one service', 'error');
      }
    }

    // Special validation for budget step
    if (currentStep === 4) {
      const budgetRadios = currentStepElement.querySelectorAll('input[name="budget"]');
      const checkedBudget = currentStepElement.querySelector('input[name="budget"]:checked');
      if (budgetRadios.length > 0 && !checkedBudget) {
        isValid = false;
        showNotification('Please select a budget range', 'error');
      }
    }

    // Special validation for timeline step
    if (currentStep === 5) {
      const timelineRadios = currentStepElement.querySelectorAll('input[name="timeline"]');
      const checkedTimeline = currentStepElement.querySelector('input[name="timeline"]:checked');
      if (timelineRadios.length > 0 && !checkedTimeline) {
        isValid = false;
        showNotification('Please select a timeline', 'error');
      }
    }

    return isValid;
  };

  const saveFormData = () => {
    const currentStepElement = $(`.form__step[data-step="${currentStep}"]`);
    const fields = currentStepElement.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
      if (field.type === 'checkbox' || field.type === 'radio') {
        if (field.checked) {
          if (field.name.includes('[]')) {
            if (!formData[field.name]) formData[field.name] = [];
            formData[field.name].push(field.value);
          } else {
            formData[field.name] = field.value;
          }
        }
      } else {
        formData[field.name] = field.value;
      }
    });

    // Save to localStorage for draft recovery
    localStorage.setItem('contactFormDraft', JSON.stringify({
      data: formData,
      step: currentStep,
      timestamp: Date.now()
    }));
  };

  const loadFormDraft = () => {
    const draft = localStorage.getItem('contactFormDraft');
    if (!draft) return;

    try {
      const { data, step, timestamp } = JSON.parse(draft);

      // Only load if draft is less than 24 hours old
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        Object.keys(data).forEach(key => {
          const field = form.querySelector(`[name="${key}"]`);
          if (field) {
            if (field.type === 'checkbox' || field.type === 'radio') {
              if (Array.isArray(data[key])) {
                data[key].forEach(value => {
                  const checkbox = form.querySelector(`[name="${key}"][value="${value}"]`);
                  if (checkbox) checkbox.checked = true;
                });
              } else {
                field.checked = true;
              }
            } else {
              field.value = data[key];
            }
          }
        });

        formData = data;
        currentStep = step;
        updateProgress();
        showNotification('Form draft restored', 'success');
      }
    } catch (e) {
      console.error('Failed to load form draft:', e);
    }
  };

  // Load draft on initialization
  loadFormDraft();

  // Next button handler
  nextBtn.addEventListener('click', () => {
    if (validateCurrentStep()) {
      saveFormData();
      currentStep++;
      updateProgress();
      scrollToFormTop();
    }
  });

  // Previous button handler
  prevBtn.addEventListener('click', () => {
    saveFormData();
    currentStep--;
    updateProgress();
    scrollToFormTop();
  });

  const scrollToFormTop = () => {
    const formPanel = $('.contact__form-panel');
    if (formPanel) {
      formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateCurrentStep()) return;

    saveFormData();

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      // Simulate form submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success
      form.style.display = 'none';
      successMessage.style.display = 'block';

      // Clear draft
      localStorage.removeItem('contactFormDraft');

      // Trigger confetti animation
      createConfetti();

      // Send success notification
      showNotification('Message sent successfully!', 'success');

    } catch (error) {
      console.error('Form submission error:', error);
      showNotification('Failed to send message. Please try again.', 'error');

      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  // Newsletter form
  const newsletterForm = $('.contact__newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!validationPatterns.email.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }

      const btn = newsletterForm.querySelector('button');
      const originalText = btn.textContent;
      btn.textContent = 'Subscribing...';
      btn.disabled = true;

      try {
        // Simulate subscription
        await new Promise(resolve => setTimeout(resolve, 1000));
        emailInput.value = '';
        showNotification('Successfully subscribed to newsletter!', 'success');
      } catch (error) {
        showNotification('Subscription failed. Please try again.', 'error');
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }

  // Calendar booking buttons
  const calendarBtns = $$('.contact__calendar-btn');
  calendarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-calendar');
      showNotification(`Opening ${type} booking calendar...`, 'info');
      // Replace with actual calendar integration
      setTimeout(() => {
        window.open('#', '_blank'); // Replace with actual calendar URL
      }, 500);
    });
  });

  // Keyboard navigation
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (currentStep < totalSteps && validateCurrentStep()) {
        nextBtn.click();
      } else if (currentStep === totalSteps) {
        submitBtn.click();
      }
    }
  });
};

// Confetti animation
const createConfetti = () => {
  const colors = ['var(--primary-500)', 'var(--secondary-500)', '#ffd700', '#ff6b6b', '#4ecdc4'];
  const confettiContainer = document.createElement('div');
  confettiContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10000;
  `;
  document.body.appendChild(confettiContainer);

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 3 + 2;
    const opacity = Math.random() * 0.7 + 0.3;

    confetti.style.cssText = `
      position: absolute;
      top: -10px;
      left: ${left}%;
      width: 10px;
      height: 10px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      opacity: ${opacity};
      animation: confettiFall ${animationDuration}s linear forwards;
      transform: rotate(${Math.random() * 360}deg);
    `;

    confettiContainer.appendChild(confetti);
  }

  // Add confetti animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes confettiFall {
      to {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Clean up after animation
  setTimeout(() => {
    document.body.removeChild(confettiContainer);
    document.head.removeChild(style);
  }, 5000);
};

// Notification system
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  const bgColor = {
    success: 'var(--secondary-500)',
    error: '#ff4757',
    info: 'var(--primary-500)'
  }[type];

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 10001;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Animate out and remove
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
};

// Enhanced contact method interactions
const initContactMethodInteractions = () => {
  const methods = $$('.contact__method');
  methods.forEach(method => {
    method.addEventListener('click', () => {
      const link = method.querySelector('.contact__method-link');
      if (link && link.href) {
        window.open(link.href, '_blank');
      }
    });
  });

  // Social link animations
  const socialLinks = $$('.contact__social-link');
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-4px) scale(1.1)';
    });

    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateY(-2px) scale(1)';
    });
  });

  // Map interaction
  const mapPlaceholder = $('.contact__map-placeholder');
  if (mapPlaceholder) {
    mapPlaceholder.addEventListener('click', () => {
      showNotification('Opening map in new window...', 'info');
      // Replace with actual map URL or embed
      setTimeout(() => {
        window.open('https://maps.google.com/', '_blank');
      }, 500);
    });
  }
};

// Resource download tracking
const initResourceDownloads = () => {
  const resourceItems = $$('.contact__resource-item');
  resourceItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const resourceName = item.querySelector('.contact__resource-name').textContent;
      showNotification(`Downloading ${resourceName}...`, 'info');

      // Simulate download
      setTimeout(() => {
        showNotification(`${resourceName} downloaded successfully!`, 'success');
        // Here you would trigger the actual download
      }, 1000);
    });
  });
};

// ===== PERFORMANCE MONITORING & CORE WEB VITALS =====
const initPerformanceTracking = () => {
  // Core Web Vitals tracking
  const trackCoreWebVitals = () => {
    try {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        gtag('event', 'LCP', {
          event_category: 'Web Vitals',
          value: Math.round(lastEntry.startTime),
          custom_parameter: lastEntry.element ? lastEntry.element.tagName : 'unknown'
        });

        console.log('LCP:', Math.round(lastEntry.startTime), 'ms');
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // First Input Delay (FID)
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          gtag('event', 'FID', {
            event_category: 'Web Vitals',
            value: Math.round(entry.processingStart - entry.startTime),
            custom_parameter: entry.name
          });

          console.log('FID:', Math.round(entry.processingStart - entry.startTime), 'ms');
        });
      }).observe({ type: 'first-input', buffered: true });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        gtag('event', 'CLS', {
          event_category: 'Web Vitals',
          value: Math.round(clsValue * 1000),
          custom_parameter: 'cumulative'
        });

        console.log('CLS:', clsValue);
      }).observe({ type: 'layout-shift', buffered: true });

    } catch (error) {
      console.error('Performance monitoring error:', error);
    }
  };

  // Page load metrics
  const trackPageLoadMetrics = () => {
    window.addEventListener('load', () => {
      setTimeout(() => {
        try {
          const perfData = performance.getEntriesByType('navigation')[0];
          const paintData = performance.getEntriesByType('paint');

          // Basic timing metrics
          const metrics = {
            'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
            'TCP Connection': perfData.connectEnd - perfData.connectStart,
            'TLS Handshake': perfData.secureConnectionStart > 0 ? perfData.connectEnd - perfData.secureConnectionStart : 0,
            'Request': perfData.responseStart - perfData.requestStart,
            'Response': perfData.responseEnd - perfData.responseStart,
            'DOM Processing': perfData.domComplete - perfData.domLoading,
            'Load Event': perfData.loadEventEnd - perfData.loadEventStart,
            'Total Load Time': perfData.loadEventEnd - perfData.navigationStart
          };

          // Paint metrics
          paintData.forEach((paint) => {
            metrics[paint.name.toUpperCase()] = Math.round(paint.startTime);
          });

          // Log and track metrics
          console.log('Performance Metrics:', metrics);

          // Send to Analytics
          Object.entries(metrics).forEach(([name, value]) => {
            if (value > 0) {
              gtag('event', 'page_timing', {
                event_category: 'Performance',
                event_label: name,
                value: Math.round(value),
                custom_parameter: name.toLowerCase().replace(' ', '_')
              });
            }
          });

          // Performance score calculation
          const performanceScore = calculatePerformanceScore(metrics);
          gtag('event', 'performance_score', {
            event_category: 'Performance',
            value: performanceScore,
            custom_parameter: 'overall'
          });

        } catch (error) {
          console.error('Page load metrics error:', error);
        }
      }, 0);
    });
  };

  // Calculate performance score (0-100)
  const calculatePerformanceScore = (metrics) => {
    let score = 100;

    // Penalize based on load time
    if (metrics['Total Load Time'] > 3000) score -= 20;
    else if (metrics['Total Load Time'] > 2000) score -= 10;
    else if (metrics['Total Load Time'] > 1000) score -= 5;

    // Penalize based on FCP
    if (metrics['first-contentful-paint'] > 2000) score -= 15;
    else if (metrics['first-contentful-paint'] > 1500) score -= 10;
    else if (metrics['first-contentful-paint'] > 1000) score -= 5;

    return Math.max(0, score);
  };

  // Resource loading tracking
  const trackResourceLoading = () => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 1000) { // Track slow resources
          gtag('event', 'slow_resource', {
            event_category: 'Performance',
            event_label: entry.name,
            value: Math.round(entry.duration),
            custom_parameter: entry.initiatorType
          });

          console.warn('Slow resource detected:', entry.name, Math.round(entry.duration), 'ms');
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  };

  // Memory usage tracking
  const trackMemoryUsage = () => {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const memoryUsage = {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        };

        // Only track if usage is high
        if (memoryUsage.used > 50) {
          gtag('event', 'memory_usage', {
            event_category: 'Performance',
            value: memoryUsage.used,
            custom_parameter: 'js_heap_mb'
          });
        }

        console.log('Memory Usage:', memoryUsage);
      }, 30000); // Check every 30 seconds
    }
  };

  // Initialize all tracking
  trackCoreWebVitals();
  trackPageLoadMetrics();
  trackResourceLoading();
  trackMemoryUsage();
};

// ===== LAZY LOADING & IMAGE OPTIMIZATION =====
const initLazyLoading = () => {
  // Intersection Observer for lazy loading
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;

        // Load actual image
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }

        // Load srcset if available
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }

        // Add loaded class for fade-in effect
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });

        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  // Observe all lazy images
  const lazyImages = $$('img[data-src]');
  lazyImages.forEach(img => {
    img.classList.add('lazy');
    imageObserver.observe(img);
  });

  // Lazy load background images
  const lazyBackgrounds = $$('[data-bg]');
  const bgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        element.style.backgroundImage = `url(${element.dataset.bg})`;
        element.removeAttribute('data-bg');
        element.classList.add('bg-loaded');
        bgObserver.unobserve(element);
      }
    });
  });

  lazyBackgrounds.forEach(bg => bgObserver.observe(bg));
};

// ===== SERVICE WORKER REGISTRATION =====
const initServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update notification
              showNotification('New version available! Refresh to update.', 'info');
            }
          });
        });

        // Track installation
        gtag('event', 'sw_installed', {
          event_category: 'Service Worker',
          custom_parameter: 'success'
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
        gtag('event', 'sw_install_failed', {
          event_category: 'Service Worker',
          event_label: error.message
        });
      }
    });
  }
};

// ===== ANALYTICS EVENT TRACKING =====
const initAnalyticsTracking = () => {
  // Scroll depth tracking
  let maxScroll = 0;
  const scrollDepthMarkers = [25, 50, 75, 90, 100];
  let trackedMarkers = [];

  const trackScrollDepth = debounce(() => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    maxScroll = Math.max(maxScroll, scrollPercent);

    scrollDepthMarkers.forEach(marker => {
      if (maxScroll >= marker && !trackedMarkers.includes(marker)) {
        trackedMarkers.push(marker);
        gtag('event', 'scroll_depth', {
          event_category: 'Engagement',
          value: marker,
          custom_parameter: `${marker}_percent`
        });
      }
    });
  }, 100);

  window.addEventListener('scroll', trackScrollDepth);

  // Click tracking for important elements
  const trackClicks = () => {
    // CTA button clicks
    $$('.btn--primary').forEach(btn => {
      btn.addEventListener('click', () => {
        gtag('event', 'cta_click', {
          event_category: 'Conversion',
          event_label: btn.textContent.trim(),
          custom_parameter: 'primary_cta'
        });
      });
    });

    // Navigation clicks
    $$('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        gtag('event', 'navigation_click', {
          event_category: 'Navigation',
          event_label: link.textContent.trim(),
          custom_parameter: 'main_nav'
        });
      });
    });

    // Contact method clicks
    $$('.contact__method').forEach(method => {
      method.addEventListener('click', () => {
        const methodType = method.querySelector('.contact__method-title').textContent;
        gtag('event', 'contact_method_click', {
          event_category: 'Contact',
          event_label: methodType,
          custom_parameter: 'contact_interaction'
        });
      });
    });

    // Form interactions
    const contactForm = $('#contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', () => {
        gtag('event', 'form_submit', {
          event_category: 'Conversion',
          custom_parameter: 'contact_form'
        });
      });
    }
  };

  // Time on page tracking
  const trackTimeOnPage = () => {
    let startTime = Date.now();
    let lastActivity = Date.now();

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    ['scroll', 'mousemove', 'click', 'keypress'].forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    // Track engagement time when user leaves
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((lastActivity - startTime) / 1000);
      gtag('event', 'engagement_time', {
        event_category: 'Engagement',
        value: timeOnPage,
        custom_parameter: 'seconds_active'
      });
    });
  };

  trackClicks();
  trackTimeOnPage();
};

// Initialize all performance and tracking features
if ('performance' in window) {
  initPerformanceTracking();
}

initLazyLoading();
initServiceWorker();
initAnalyticsTracking();

// ===== START APPLICATION =====
init();