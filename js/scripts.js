// Main Navigation and Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    AOS.init({
      duration: prefersReducedMotion ? 0 : 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      disable: prefersReducedMotion
    });
  }

  // Mobile Menu Toggle with Keyboard Support
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('nav ul li a');
  const menuItems = document.querySelectorAll('nav ul li');
  
  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', toggleMenu);
    mobileMenuBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  function toggleMenu() {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenuBtn.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    if (nav.classList.contains('active')) {
      trapFocus(nav);
      menuItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, 100 * index);
      });
    } else {
      menuItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(50px)';
      });
    }
  }

  // Keyboard Navigation
  function trapFocus(element) {
    const focusableEls = element.querySelectorAll('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];

    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableEl) {
            e.preventDefault();
            lastFocusableEl.focus();
          }
        } else {
          if (document.activeElement === lastFocusableEl) {
            e.preventDefault();
            firstFocusableEl.focus();
          }
        }
      }
      if (e.key === 'Escape') {
        toggleMenu();
      }
    });
  }

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenuBtn.classList.remove('active');
      nav.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (nav.classList.contains('active') && 
        !nav.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
      toggleMenu();
    }
  });

  // Audience toggle functionality
  const reviewerOption = document.getElementById('reviewer-option');
  const brandOption = document.getElementById('brand-option');
  const reviewerContent = document.getElementById('reviewer-content');
  const brandContent = document.getElementById('brand-content');
  const slider = document.querySelector('.audience-toggle-slider');
  
  if (reviewerOption && brandOption && slider) {
    // Set default audience
    document.body.setAttribute('data-audience', 'reviewer');
    
    reviewerOption.addEventListener('click', function() {
      setActiveAudience('reviewer');
    });
    
    brandOption.addEventListener('click', function() {
      setActiveAudience('brand');
    });
    
    // Keyboard support for toggle
    reviewerOption.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveAudience('reviewer');
      }
    });
    
    brandOption.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveAudience('brand');
      }
    });
    
    function setActiveAudience(audience) {
      // Update toggle state
      if (audience === 'reviewer') {
        reviewerOption.classList.add('active');
        brandOption.classList.remove('active');
        reviewerOption.setAttribute('aria-selected', 'true');
        brandOption.setAttribute('aria-selected', 'false');
        slider.style.transform = 'translateX(0)';
        
        // Show reviewer content
        reviewerContent.classList.add('active');
        brandContent.classList.remove('active');
        
        // Update body attribute for audience-specific content
        document.body.setAttribute('data-audience', 'reviewer');
      } else {
        reviewerOption.classList.remove('active');
        brandOption.classList.add('active');
        reviewerOption.setAttribute('aria-selected', 'false');
        brandOption.setAttribute('aria-selected', 'true');
        slider.style.transform = 'translateX(100%)';
        
        // Show brand content
        reviewerContent.classList.remove('active');
        brandContent.classList.add('active');
        
        // Update body attribute for audience-specific content
        document.body.setAttribute('data-audience', 'brand');
      }
      
      // Update audience-specific content in all sections
      updateAudienceContent(audience);
    }
    
    function updateAudienceContent(audience) {
      const audienceBlocks = document.querySelectorAll('.audience-specific');
      audienceBlocks.forEach(block => {
        // Hide all audience-specific content first
        block.querySelectorAll('div').forEach(div => {
          div.style.display = 'none';
        });
        
        // Show content for current audience
        const contentToShow = block.querySelector(`.for-${audience}`);
        if (contentToShow) {
          contentToShow.style.display = 'block';
        }
      });
    }
    
    // Initialize audience-specific content
    updateAudienceContent('reviewer');
  }

  // Enhanced Feature Animations with Reduced Motion Support
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
      feature.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px) translateY(-5px)';
        const heading = this.querySelector('h2, h3');
        if (heading) {
          heading.style.transform = 'translateX(8px)';
          heading.style.color = '#2563EB';
        }
      });

      feature.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0) translateY(0)';
        const heading = this.querySelector('h2, h3');
        if (heading) {
          heading.style.transform = 'translateX(0)';
          heading.style.color = '';
        }
      });

      // Accessible click handling
      feature.addEventListener('click', handleFeatureClick);
      feature.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFeatureClick.call(this, e);
        }
      });
    });
  }

  function handleFeatureClick(e) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    this.appendChild(ripple);
    
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = (e.clientX || e.pageX) - rect.left - size/2;
    const y = (e.clientY || e.pageY) - rect.top - size/2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    setTimeout(() => ripple.remove(), 600);
  }

  // Smooth Scroll with Keyboard Support
  document.querySelectorAll('a[href^="#"], .smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', smoothScroll);
    anchor.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        smoothScroll.call(this, e);
      }
    });
  });

  function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
      
      // Update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  }

  // Fixed Parallax Effect for Headers - Improved to handle different background position formats
  let lastScrollY = window.scrollY;
  const parallaxElements = document.querySelectorAll('.page-header, .about-header, .hero');
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    parallaxElements.forEach(element => {
      const speed = 0.5;
      const yOffset = (currentScrollY - lastScrollY) * speed;
      
      try {
        const currentBg = window.getComputedStyle(element).backgroundPosition;
        const values = currentBg.split(' ');
        
        // Handle different format possibilities (px, %, etc)
        let yPos = 0;
        if (values.length > 1) {
          const yValue = values[1];
          yPos = parseInt(yValue) || 0; // Default to 0 if parsing fails
        }
        
        element.style.backgroundPositionY = `calc(${yPos}px + ${yOffset}px)`;
      } catch (e) {
        // Fallback if there's an error parsing background position
        element.style.backgroundPositionY = `calc(${yOffset}px)`;
      }
    });
    
    lastScrollY = currentScrollY;
  }, { passive: true });

  // Initialize AOS with reduced motion support
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: prefersReducedMotion ? 0 : 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      disable: prefersReducedMotion
    });
  }

  // Initialize ripple effect
  initRippleEffect();

  // Enhanced Feature Animations with Flowchart
  initFeatureAnimations();
  initFlowchartAnimations();
});

function initFeatureAnimations() {
  const features = document.querySelectorAll('.feature-item');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  features.forEach(feature => {
    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion) return;
    
    feature.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      const img = this.querySelector('img');
      if (img) {
        img.style.transform = 'scale(1.1)';
      }
      const heading = this.querySelector('h3');
      if (heading) {
        heading.style.color = '#2563EB';
      }
    });

    feature.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      const img = this.querySelector('img');
      if (img) {
        img.style.transform = 'scale(1)';
      }
      const heading = this.querySelector('h3');
      if (heading) {
        heading.style.color = '';
      }
    });

    // Keyboard accessibility
    feature.addEventListener('focus', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.2)';
    });

    feature.addEventListener('blur', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });
  });
}

function initFlowchartAnimations() {
  const flowchart = document.querySelector('.flowchart-animation');
  if (!flowchart) return;

  const nodes = flowchart.querySelectorAll('.flow-node');
  const arrows = flowchart.querySelectorAll('.flow-arrow');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show everything immediately if reduced motion is preferred
    nodes.forEach(node => node.style.opacity = '1');
    arrows.forEach(arrow => {
      arrow.style.strokeDasharray = 'none';
      arrow.style.strokeDashoffset = '0';
    });
    return;
  }

  // Animate nodes and arrows sequentially
  nodes.forEach((node, index) => {
    node.style.opacity = '0';
    setTimeout(() => {
      node.style.opacity = '1';
      node.style.animation = 'pulse 2s infinite';
    }, index * 300);
  });

  arrows.forEach((arrow, index) => {
    const length = arrow.getTotalLength();
    arrow.style.strokeDasharray = length;
    arrow.style.strokeDashoffset = length;

    setTimeout(() => {
      arrow.style.transition = 'stroke-dashoffset 1s ease-in-out';
      arrow.style.strokeDashoffset = '0';
    }, (index + nodes.length) * 300);
  });
}

// Intersection Observer for triggering animations
const observerOptions = {
  root: null,
  threshold: 0.1,
  rootMargin: '0px'
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      animationObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements with animations
document.querySelectorAll('.feature-item, .tech-security-points li, .flowchart-container')
  .forEach(element => animationObserver.observe(element));

// Add ripple effect to buttons and interactive elements
function initRippleEffect() {
  const interactiveElements = document.querySelectorAll('.btn-primary, .feature');
  
  interactiveElements.forEach(element => {
    element.addEventListener('click', function(e) {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      element.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}