// ===== CLEAN WEBSITE JAVASCRIPT - NO ANIMATIONS ===== //

// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===== MOBILE NAVIGATION ===== //
const initMobileNavigation = () => {
  const navToggle = $('.nav__toggle');
  const navMenu = $('.nav__menu');

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded',
      navToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
    );
  });

  // Close menu when clicking on links (but allow navigation)
  const navLinks = $$('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Don't prevent default - allow normal link navigation
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
};

// ===== ACTIVE NAVIGATION HIGHLIGHTING ===== //
const initActiveNavHighlighting = () => {
  const navLinks = $$('.nav__link');
  const sections = $$('section[id]');

  if (!navLinks.length || !sections.length) return;

  const observerOptions = {
    threshold: 0.3,
    rootMargin: '-100px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.id;

        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to current section link
        const activeLink = $(`.nav__link[href="#${activeId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
};

// ===== COUNTER ANIMATIONS ===== //
const initCounterAnimations = () => {
  const counters = $$('.counter[data-count]');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    let current = 0;
    const increment = target / 100;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    // Start counter when element is visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        updateCounter();
        observer.unobserve(counter);
      }
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
};

// ===== SKILL BARS ===== //
const initSkillBars = () => {
  const skillFills = $$('.about__skill-fill[data-progress], .about__skill-fill[data-width]');

  skillFills.forEach(fill => {
    const progress = fill.dataset.progress || fill.dataset.width;
    if (progress) {
      // Set width immediately with smooth transition
      fill.style.width = '0%';
      setTimeout(() => {
        fill.style.width = progress + '%';
      }, 100);
    }
  });
};

// ===== FORM HANDLING ===== //
const initFormHandling = () => {
  const contactForm = $('#contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      // Simulate form submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      showNotification('Message sent successfully!', 'success');
      contactForm.reset();

    } catch (error) {
      showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // Form validation
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
};

// ===== FORM VALIDATION ===== //
const validateField = (field) => {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  // Clear previous errors
  clearFieldError(field);

  // Required field validation
  if (field.hasAttribute('required') && !value) {
    errorMessage = 'This field is required.';
    isValid = false;
  }

  // Email validation
  else if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errorMessage = 'Please enter a valid email address.';
      isValid = false;
    }
  }

  // Phone validation
  else if (field.type === 'tel' && value) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value) || value.length < 10) {
      errorMessage = 'Please enter a valid phone number.';
      isValid = false;
    }
  }

  if (!isValid) {
    showFieldError(field, errorMessage);
  }

  return isValid;
};

const showFieldError = (field, message) => {
  field.classList.add('error');

  let errorElement = field.parentElement.querySelector('.field-error');
  if (!errorElement) {
    errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.style.cssText = 'color: #e74c3c; font-size: 0.875rem; display: block; margin-top: 0.25rem;';
    field.parentElement.appendChild(errorElement);
  }

  errorElement.textContent = message;
};

const clearFieldError = (field) => {
  field.classList.remove('error');
  const errorElement = field.parentElement.querySelector('.field-error');
  if (errorElement) {
    errorElement.remove();
  }
};

// ===== NOTIFICATION SYSTEM ===== //
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
    color: white;
    padding: 16px 24px;
    border-radius: 5px;
    font-weight: 500;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      document.body.removeChild(notification);
    }
  }, 4000);
};

// ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== //
const initSmoothScrolling = () => {
  const anchorLinks = $$('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const target = $(href);

      if (target && href !== '#') {
        e.preventDefault();

        const navHeight = $('.nav')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
};

// ===== CONTACT METHOD INTERACTIONS ===== //
const initContactMethodInteractions = () => {
  const contactMethods = $$('.contact__method');

  contactMethods.forEach(method => {
    method.addEventListener('click', () => {
      const link = method.querySelector('a');
      if (link && link.href) {
        window.open(link.href, '_blank');
      }
    });

    // Add cursor pointer style
    method.style.cursor = 'pointer';
  });
};

// ===== MAIN INITIALIZATION ===== //
const initializeWebsite = () => {
  // Essential functionality only
  initMobileNavigation();
  initActiveNavHighlighting();
  initSmoothScrolling();
  initFormHandling();
  initCounterAnimations();
  initSkillBars();
  initContactMethodInteractions();

  console.log('T9 Digital website initialized successfully! 🚀');
};

// ===== DOM READY ===== //
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
  initializeWebsite();
}

// ===== KEYBOARD NAVIGATION ===== //
document.addEventListener('keydown', (e) => {
  // Enable keyboard navigation for interactive elements
  if (e.key === 'Escape') {
    // Close mobile menu if open
    const navMenu = $('.nav__menu');
    const navToggle = $('.nav__toggle');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }
});

// ===== PERFORMANCE MONITORING ===== //
window.addEventListener('load', () => {
  // Simple performance logging
  if (window.performance && window.performance.timing) {
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
  }
});