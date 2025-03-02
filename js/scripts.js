document.addEventListener('DOMContentLoaded', function() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768;
  
  // Initialize AOS with device-specific settings
  AOS.init({
    // Disable animations if user prefers reduced motion
    disable: prefersReducedMotion,
    // Adjust duration based on device
    duration: isMobile ? 600 : 800,
    // Enable animations only when elements are fully in view
    offset: isMobile ? 40 : 120,
    // Optimize performance
    delay: 0,
    throttleDelay: 99,
    once: true,
    mirror: false,
    // Use CSS transform for better performance
    anchorPlacement: 'top-bottom'
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      mainNav.setAttribute('aria-hidden', isExpanded);
    });
  }

  // Audience Toggle Functionality with accessibility enhancements
  const toggleContainer = document.querySelector('.audience-toggle');
  const reviewerOption = document.getElementById('reviewer-option');
  const brandOption = document.getElementById('brand-option');
  const reviewerContent = document.getElementById('reviewer-content');
  const brandContent = document.getElementById('brand-content');
  const slider = document.querySelector('.audience-toggle-slider');
  
  if (toggleContainer) {
    // Set initial state and ARIA attributes
    document.body.setAttribute('data-audience', 'reviewer');
    initializeToggle();
    
    // Event listeners with debouncing for performance
    let toggleTimeout;
    const handleToggleClick = (audience) => {
      clearTimeout(toggleTimeout);
      toggleTimeout = setTimeout(() => setActiveAudience(audience), 50);
    };

    reviewerOption.addEventListener('click', () => handleToggleClick('reviewer'));
    brandOption.addEventListener('click', () => handleToggleClick('brand'));
    
    // Enhanced keyboard navigation
    const handleKeydown = (e, audience) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleToggleClick(audience);
      }
    };

    reviewerOption.addEventListener('keydown', e => handleKeydown(e, 'reviewer'));
    brandOption.addEventListener('keydown', e => handleKeydown(e, 'brand'));
    
    // Initialize toggle state
    function initializeToggle() {
      // Set initial ARIA states
      toggleContainer.setAttribute('role', 'tablist');
      reviewerOption.setAttribute('role', 'tab');
      brandOption.setAttribute('role', 'tab');
      reviewerContent.setAttribute('role', 'tabpanel');
      brandContent.setAttribute('role', 'tabpanel');
      
      // Set initial tab selection
      reviewerOption.setAttribute('aria-selected', 'true');
      brandOption.setAttribute('aria-selected', 'false');
      
      // Set content relationships
      reviewerOption.setAttribute('aria-controls', 'reviewer-content');
      brandOption.setAttribute('aria-controls', 'brand-content');
      reviewerContent.setAttribute('aria-labelledby', 'reviewer-option');
      brandContent.setAttribute('aria-labelledby', 'brand-option');
      
      // Ensure proper focus management
      [reviewerOption, brandOption].forEach(option => {
        option.setAttribute('tabindex', '0');
      });
    }

    // Enhanced toggle functionality with smooth animations
    function setActiveAudience(audience) {
      const isReviewer = audience === 'reviewer';
      const activeOption = isReviewer ? reviewerOption : brandOption;
      const inactiveOption = isReviewer ? brandOption : reviewerOption;
      const activeContent = isReviewer ? reviewerContent : brandContent;
      const inactiveContent = isReviewer ? brandContent : reviewerContent;
      
      // Update button states
      activeOption.classList.add('active');
      inactiveOption.classList.remove('active');
      activeOption.setAttribute('aria-selected', 'true');
      inactiveOption.setAttribute('aria-selected', 'false');
      
      // Update slider position with GPU acceleration
      if (slider) {
        requestAnimationFrame(() => {
          const containerPadding = parseInt(window.getComputedStyle(toggleContainer).paddingLeft);
          const position = isReviewer ? containerPadding : reviewerOption.offsetWidth + containerPadding;
          
          slider.style.transform = `translate3d(${position}px, 0, 0)`;
          slider.style.width = `${activeOption.offsetWidth - 12}px`;
        });
      }
      
      // Update content visibility with transitions
      activeContent.classList.add('active');
      inactiveContent.classList.remove('active');
      
      // Update data attribute and trigger content updates
      document.body.setAttribute('data-audience', audience);
      updateAudienceContent(audience);
      
      // Announce change to screen readers
      announceAudienceChange(audience);

      // Toggle How It Works sections
      const reviewerProcess = document.getElementById('reviewer-process');
      const brandProcess = document.getElementById('brand-process');
      
      if (reviewerProcess && brandProcess) {
        if (isReviewer) {
          reviewerProcess.classList.add('active');
          brandProcess.classList.remove('active');
        } else {
          brandProcess.classList.add('active');
          reviewerProcess.classList.remove('active');
        }
      }
      
      // Update all audience sections
      document.querySelectorAll('.audience-section').forEach(section => {
        const isReviewerSection = section.id.includes('reviewer');
        const isBrandSection = section.id.includes('brand');
        
        if ((isReviewer && isReviewerSection) || (!isReviewer && isBrandSection)) {
          section.classList.add('active');
        } else if ((isReviewer && isBrandSection) || (!isReviewer && isReviewerSection)) {
          section.classList.remove('active');
        }
      });
    }
    
    // Screen reader announcements
    function announceAudienceChange(audience) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `Showing content for ${audience}s`;
      document.body.appendChild(announcement);
      
      setTimeout(() => announcement.remove(), 1000);
    }
  }

  // Performance-optimized content updates
  function updateAudienceContent(audience) {
    const audienceBlocks = document.querySelectorAll('.audience-specific');
    
    audienceBlocks.forEach(block => {
      const allContent = block.querySelectorAll('div');
      const activeContent = block.querySelector(`.for-${audience}`);
      
      // Batch DOM updates
      requestAnimationFrame(() => {
        allContent.forEach(div => {
          div.style.display = 'none';
          div.setAttribute('aria-hidden', 'true');
        });
        
        if (activeContent) {
          activeContent.style.display = 'block';
          activeContent.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  // Mobile menu optimization
  initializeMobileMenu();

  // Enhanced flowchart animations with performance optimization
  if (!prefersReducedMotion) {
    initFlowchartAnimations();
  }

  // Initialize FAQ accordion
  initializeFAQAccordion();
});

// Mobile menu initialization with improved accessibility
function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.getElementById('main-nav');
  
  if (!mobileMenuBtn || !nav) return;

  let isMenuOpen = false;
  
  mobileMenuBtn.addEventListener('click', toggleMenu);
  mobileMenuBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    // Batch updates using requestAnimationFrame
    requestAnimationFrame(() => {
      mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);
      mobileMenuBtn.classList.toggle('active', isMenuOpen);
      nav.classList.toggle('active', isMenuOpen);
      document.body.classList.toggle('menu-open', isMenuOpen);
      nav.setAttribute('aria-hidden', !isMenuOpen);
      
      if (isMenuOpen) {
        trapFocus(nav);
        document.addEventListener('keydown', handleEscapeKey);
      } else {
        document.removeEventListener('keydown', handleEscapeKey);
        mobileMenuBtn.focus();
      }
    });
  }

  function handleEscapeKey(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      toggleMenu();
    }
  }
}

// Focus trap for improved accessibility
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href]:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  requestAnimationFrame(() => firstFocusable.focus());
  
  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
}

// Initialize flowchart with performance optimizations
function initFlowchartAnimations() {
  const flowchart = document.querySelector('.flowchart-container');
  if (!flowchart) return;

  const nodes = flowchart.querySelectorAll('.flow-node');
  const arrows = flowchart.querySelectorAll('.flow-arrow');
  const texts = flowchart.querySelectorAll('.flow-text');
  
  // Pre-optimize elements for animations
  const animatedElements = [...nodes, ...arrows, ...texts];
  animatedElements.forEach(el => {
    el.style.transform = 'translate3d(0,0,0)';
    el.style.backfaceVisibility = 'hidden';
    el.style.willChange = 'transform, opacity';
  });

  // Create intersection observer for performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateFlowchart(nodes, arrows, texts);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '50px'
  });

  observer.observe(flowchart);
}

// Optimized flowchart animation sequence
function animateFlowchart(nodes, arrows, texts) {
  const animationFrame = requestAnimationFrame(() => {
    nodes.forEach((node, index) => {
      setTimeout(() => {
        node.classList.add('animate');
        if (texts[index]) texts[index].classList.add('animate');
        if (arrows[index]) {
          setTimeout(() => arrows[index].classList.add('animate'), 300);
        }
      }, index * 400);
    });
  });

  // Cleanup
  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    nodes.forEach(node => {
      node.style.willChange = 'auto';
    });
  }, (nodes.length * 400) + 300);
}

// FAQ Accordion functionality
function initializeFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (!question || !answer) return;
    
    // Set initial ARIA attributes
    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('aria-controls', `faq-answer-${Math.random().toString(36).substr(2, 9)}`);
    answer.setAttribute('id', question.getAttribute('aria-controls'));
    answer.setAttribute('role', 'region');
    answer.setAttribute('aria-hidden', 'true');
    
    // Handle click events
    question.addEventListener('click', () => toggleFAQ(item));
    
    // Keyboard navigation
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ(item);
      }
    });
  });
  
  function toggleFAQ(item) {
    const isExpanded = item.classList.contains('active');
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    // Close other open items
    faqItems.forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        const otherQuestion = otherItem.querySelector('.faq-question');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        
        otherItem.classList.remove('active');
        otherQuestion.setAttribute('aria-expanded', 'false');
        otherAnswer.setAttribute('aria-hidden', 'true');
      }
    });
    
    // Toggle current item
    item.classList.toggle('active');
    question.setAttribute('aria-expanded', !isExpanded);
    answer.setAttribute('aria-hidden', isExpanded);
    
    // Announce to screen readers
    announceAccordionState(question, !isExpanded);
  }
  
  function announceAccordionState(question, isExpanded) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `${question.textContent} is now ${isExpanded ? 'expanded' : 'collapsed'}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 1000);
  }
}

// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true
  });
});

// Flowchart Animation
function initFlowchartAnimation() {
  const flowNodes = document.querySelectorAll('.flow-node');
  const flowArrows = document.querySelectorAll('.flow-arrows path');
  
  // Animate nodes and arrows when they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'none';
        entry.target.offsetHeight; // Trigger reflow
        entry.target.classList.add('animate');
      }
    });
  }, {
    threshold: 0.5
  });

  flowNodes.forEach(node => observer.observe(node));
  flowArrows.forEach(arrow => observer.observe(arrow));
}

// Floating Background Objects Animation
function initFloatingObjects() {
  const objects = document.querySelectorAll('.bg-object');
  
  objects.forEach(obj => {
    // Randomize initial positions
    obj.style.top = `${Math.random() * 100}%`;
    obj.style.left = `${Math.random() * 100}%`;
    
    // Start animation
    obj.style.animation = 'floatAnimation 20s infinite';
  });
}

// Initialize everything
window.addEventListener('load', () => {
  initFlowchartAnimation();
  initFloatingObjects();
});

// Reinitialize on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initFloatingObjects();
  }, 250);
});

// Initialize AOS library
AOS.init({
  duration: 800,
  easing: 'ease-out',
  once: true
});

// DOM Elements
const reviewerOption = document.getElementById('reviewer-option');
const brandOption = document.getElementById('brand-option');
const slider = document.querySelector('.audience-toggle-slider');
const reviewerSections = document.querySelectorAll('[data-audience="reviewer"]');
const brandSections = document.querySelectorAll('[data-audience="brand"]');

// Toggle functionality
function setActiveAudience(audience) {
  const isReviewer = audience === 'reviewer';
  const activeOption = isReviewer ? reviewerOption : brandOption;
  const inactiveOption = isReviewer ? brandOption : reviewerOption;
  
  // Update button states
  activeOption.classList.add('active');
  inactiveOption.classList.remove('active');
  activeOption.setAttribute('aria-selected', 'true');
  inactiveOption.setAttribute('aria-selected', 'false');
  
  // Update slider position
  if (slider) {
    requestAnimationFrame(() => {
      const position = isReviewer ? 0 : reviewerOption.offsetWidth;
      slider.style.transform = `translate3d(${position}px, 0, 0)`;
      slider.style.width = `${activeOption.offsetWidth}px`;
    });
  }
  
  // Toggle sections
  reviewerSections.forEach(section => {
    section.classList.toggle('active', isReviewer);
  });
  
  brandSections.forEach(section => {
    section.classList.toggle('active', !isReviewer);
  });

  // Update data-attribute on body for global state
  document.body.setAttribute('data-audience', audience);

  // Announce change to screen readers
  announceAudienceChange(audience);
}

// Accessibility: Announce audience change to screen readers
function announceAudienceChange(audience) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = `Showing content for ${audience}s`;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// Event Listeners
reviewerOption.addEventListener('click', () => setActiveAudience('reviewer'));
brandOption.addEventListener('click', () => setActiveAudience('brand'));

// Keyboard navigation
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

// Initialize the flow chart animation
function initFlowChartAnimation() {
  const flowNodes = document.querySelectorAll('.flow-node');
  const flowArrows = document.querySelectorAll('.flow-arrows path');
  const flowTexts = document.querySelectorAll('.flow-text');
  
  // Animate nodes with delay
  flowNodes.forEach((node, index) => {
    setTimeout(() => {
      node.classList.add('animate');
    }, index * 300);
  });
  
  // Animate arrows after nodes
  setTimeout(() => {
    flowArrows.forEach(arrow => {
      arrow.classList.add('animate');
    });
  }, flowNodes.length * 300);
  
  // Animate texts last
  setTimeout(() => {
    flowTexts.forEach(text => {
      text.classList.add('animate');
    });
  }, (flowNodes.length * 300) + 500);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set initial state
  setActiveAudience('reviewer');
  
  // Initialize flow chart animation when the section becomes visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initFlowChartAnimation();
        observer.disconnect();
      }
    });
  });
  
  const flowChart = document.querySelector('.flowchart-container');
  if (flowChart) {
    observer.observe(flowChart);
  }

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if(targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});