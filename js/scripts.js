// Main Navigation and Functionality
document.addEventListener('DOMContentLoaded', function() {
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
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', smoothScroll);
    anchor.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        smoothScroll(e);
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

  // Scroll-based Parallax Effect for Headers
  let lastScrollY = window.scrollY;
  const parallaxElements = document.querySelectorAll('.page-header, .about-header, .hero');
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    parallaxElements.forEach(element => {
      const speed = 0.5;
      const yOffset = (currentScrollY - lastScrollY) * speed;
      const currentBg = window.getComputedStyle(element).backgroundPosition;
      const [xPos, yPos] = currentBg.split(' ').map(pos => parseInt(pos));
      
      element.style.backgroundPositionY = `calc(${yPos}px + ${yOffset}px)`;
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
});

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