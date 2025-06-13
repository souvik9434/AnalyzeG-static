document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animations with improved configuration
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false, // Changed to false to allow animations to occur every time element scrolls into view
    mirror: false,
    disable: 'mobile', // Disable animations on mobile for better performance
    startEvent: 'DOMContentLoaded',
    offset: 120 // Trigger animations earlier
  });
  
  // Add scroll event listener to refresh AOS on scroll
  window.addEventListener('scroll', function() {
    setTimeout(function() {
      AOS.refresh();
    }, 200);
  }, { passive: true });

  // Initialize mobile menu with improved accessibility
  initializeMobileMenu();
    // Initialize audience toggle
  initializeAudienceToggle();
  
  // Load saved audience preference
  const savedAudience = localStorage.getItem('selectedAudience');
  if (savedAudience && (savedAudience === 'reviewer' || savedAudience === 'brand')) {
    setTimeout(() => {
      setActiveAudience(savedAudience);
    }, 100);
  }
  
  // Add smooth scrolling functionality
  initializeSmoothScroll();

  // Initialize flowchart animations in "How It Works" section
  function initializeFlowchartAnimations() {
    // Get all flowchart nodes and arrows
    const flowNodes = document.querySelectorAll('.flow-node');
    const flowArrows = document.querySelectorAll('.flow-arrows path');
    const flowTexts = document.querySelectorAll('.flow-text');
    
    // Add animation classes with delays
    if (flowNodes.length > 0) {
      // First make sure all elements are visible by setting opacity to 1
      flowNodes.forEach(node => {
        node.style.opacity = "1";
      });
      
      // Then add animation classes with staggered delays
      setTimeout(() => {
        flowNodes.forEach((node, index) => {
          setTimeout(() => {
            node.classList.add('animate');
          }, index * 300);
        });
        
        flowArrows.forEach((arrow, index) => {
          setTimeout(() => {
            arrow.classList.add('animate');
          }, (index + 1) * 300 + 150);
        });
        
        flowTexts.forEach((text, index) => {
          setTimeout(() => {
            text.classList.add('animate');
          }, index * 300 + 100);
        });
      }, 500);
    }
  }
  
  // Initialize flowchart when scrolled into view
  const techFlowSection = document.querySelector('.tech-flow');
  if (techFlowSection) {
    // Create an intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initializeFlowchartAnimations();
          observer.unobserve(entry.target); // Only trigger once
        }
      });
    }, {
      threshold: 0.2 // Trigger when 20% of the element is visible
    });
    
    // Start observing the flowchart section
    observer.observe(techFlowSection);
    
    // Also initialize on page load if already visible
    if (isElementInViewport(techFlowSection)) {
      initializeFlowchartAnimations();
    }
  }

  // Helper function to check if element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // FAQ functionality (if present)
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
        
        // Close other FAQ items
        document.querySelectorAll('.faq-item.active').forEach(item => {
          if (item !== faqItem) {
            item.classList.remove('active');
          }
        });
      });
    });
  }
});

// Initialize audience toggle functionality
function initializeAudienceToggle() {
  const audienceToggles = document.querySelectorAll('.audience-toggle');
  
  audienceToggles.forEach(toggle => {
    const reviewerOption = toggle.querySelector('#reviewer-option');
    const brandOption = toggle.querySelector('#brand-option');
    const slider = toggle.querySelector('.audience-toggle-slider');
    
    if (reviewerOption && brandOption && slider) {
      // Initialize slider width and position
      setTimeout(() => {
        slider.style.width = `${reviewerOption.offsetWidth}px`;
      }, 100);
      
      reviewerOption.addEventListener('click', () => setActiveAudience('reviewer'));
      brandOption.addEventListener('click', () => setActiveAudience('brand'));
      
      // Add keyboard navigation
      reviewerOption.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActiveAudience('reviewer');
        }
      });
      
      brandOption.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActiveAudience('brand');
        }
      });
    }
  });
}

// Set active audience and update content
function setActiveAudience(audience) {
  const reviewerOption = document.getElementById('reviewer-option');
  const brandOption = document.getElementById('brand-option');
  const sliders = document.querySelectorAll('.audience-toggle-slider');
  
  // Update toggle states
  if (reviewerOption && brandOption) {
    if (audience === 'reviewer') {
      reviewerOption.classList.add('active');
      brandOption.classList.remove('active');
      reviewerOption.setAttribute('aria-selected', 'true');
      brandOption.setAttribute('aria-selected', 'false');
    } else {
      reviewerOption.classList.remove('active');
      brandOption.classList.add('active');
      reviewerOption.setAttribute('aria-selected', 'false');
      brandOption.setAttribute('aria-selected', 'true');
    }
  }
  
  // Update slider positions with animation
  sliders.forEach(slider => {
    if (audience === 'reviewer') {
      slider.style.transform = 'translateX(0)';
      setTimeout(() => {
        slider.style.width = `${reviewerOption.offsetWidth}px`;
      }, 50);
    } else {
      slider.style.transform = `translateX(${reviewerOption.offsetWidth}px)`;
      setTimeout(() => {
        slider.style.width = `${brandOption.offsetWidth}px`;
      }, 50);
    }
  });
    // Toggle visibility of audience-specific content sections
  document.querySelectorAll('[data-audience]').forEach(section => {
    if (section.getAttribute('data-audience') === audience) {
      section.classList.add('active');
      
      // Add a slight delay before refreshing AOS to ensure elements are visible
      setTimeout(() => {
        // Refresh AOS to animate newly visible elements
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      }, 100);
    } else {
      section.classList.remove('active');
    }
  });
  
  // Also handle sections without data-audience but with IDs (legacy support)
  const reviewerSections = document.querySelectorAll('#reviewer-content, #reviewer-cta, #reviewer-process');
  const brandSections = document.querySelectorAll('#brand-content, #brand-cta, #brand-process');
  
  if (audience === 'reviewer') {
    reviewerSections.forEach(section => section.classList.add('active'));
    brandSections.forEach(section => section.classList.remove('active'));
  } else {
    reviewerSections.forEach(section => section.classList.remove('active'));
    brandSections.forEach(section => section.classList.add('active'));
  }
  
  // Store audience preference
  localStorage.setItem('selectedAudience', audience);
}

// Initialize mobile menu
function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
      this.classList.toggle('active');
      mainNav.classList.toggle('active');
      mainNav.setAttribute('aria-hidden', expanded);
      
      if (!expanded) {
        trapFocus(mainNav);
      }
    });
  }
}

// Focus trap for accessibility
function trapFocus(element) {
  const focusableElements = element.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    } else if (e.key === 'Escape') {
      const menuBtn = document.querySelector('.mobile-menu-btn');
      if (menuBtn) {
        menuBtn.click();
        menuBtn.focus();
      }
    }
  });
  
  // Focus first element
  firstElement.focus();
}

// Initialize smooth scroll functionality
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calculate header height dynamically
        const headerHeight = document.querySelector('.navbar').offsetHeight;
        
        // Smooth scroll with header offset
        window.scrollTo({
          top: targetElement.offsetTop - headerHeight - 20,
          behavior: 'smooth'
        });
        
        // Update URL hash without jumping
        history.pushState(null, null, targetId);
        
        // Set focus to the target element for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
        // Remove the tabindex after focus
        setTimeout(() => targetElement.removeAttribute('tabindex'), 1000);
      }
    });
  });
}

// Function to handle animation completion and layout recalculation
function handleAnimationCompletion() {
  // Observer for animation completion events
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  // If IntersectionObserver is available
  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Once element is visible and animation started
          entry.target.addEventListener('transitionend', () => {
            // Force a reflow after animation completes
            requestAnimationFrame(() => {
              // Refresh AOS to ensure proper layout
              AOS.refresh();
            });
          }, { once: true });
          
          // Stop observing after first intersection
          animationObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Start observing all animated elements
    animatedElements.forEach(el => animationObserver.observe(el));
  }
  
  // Fallback for browsers without IntersectionObserver support
  else {
    window.addEventListener('scroll', debounce(() => {
      AOS.refresh();
    }, 200), { passive: true });
  }
}

// Debounce helper function to limit how often a function can run
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize animation completion handler
handleAnimationCompletion();