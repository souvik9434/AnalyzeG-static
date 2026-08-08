/**
 * AnalyzeG App URL Configuration
 * ─────────────────────────────────────────────────
 * CURRENT:  https://analyzeg.netlify.app  (Netlify free domain)
 * FUTURE:   https://app.analyzeg.co.in    (custom subdomain)
 *
 * When the subdomain is activated, change ONLY the line below.
 * All nav CTA, hero buttons, footer links, and CTA sections
 * reference this constant via data-app-href attributes.
 */
const ANALYZEG_APP_BASE = "https://analyzeg.netlify.app";

// Global error handler for production
window.addEventListener("error", function (event) {
  console.error("Global error caught:", event.error);
  // Prevent default browser error handling
  event.preventDefault();
});

// Unhandled promise rejection handler
window.addEventListener("unhandledrejection", function (event) {
  console.error("Unhandled promise rejection:", event.reason);
  event.preventDefault();
});

document.addEventListener("DOMContentLoaded", function () {
  try {
    const refreshAOSSafe = debounce(() => {
      try {
        if (typeof AOS !== "undefined") {
          AOS.refreshHard();
        }
      } catch (error) {
        console.error("Error refreshing AOS:", error);
      }
    }, 180);

    // Initialize AOS animations with improved configuration
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        mirror: false,
        disable: () =>
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        startEvent: "DOMContentLoaded",
        offset: 120,
      });

      // Refresh only on true layout changes; avoid per-scroll refresh thrash.
      window.addEventListener("resize", refreshAOSSafe, { passive: true });
      window.addEventListener("orientationchange", refreshAOSSafe, {
        passive: true,
      });
    }

    // Initialize mobile menu with improved accessibility
    initializeMobileMenu();

    // NOTE: Audience toggle is now handled by the React AudienceSwitch component.
    // Legacy initializeAudienceToggle() and setActiveAudience() removed to prevent
    // conflict between vanilla JS localStorage state and React state.

    // Add smooth scrolling functionality
    initializeSmoothScroll();

    // Initialize flowchart animations in "How It Works" section
    function initializeFlowchartAnimations() {
      try {
        // Get all flowchart nodes and arrows
        const flowNodes = document.querySelectorAll(".flow-node");
        const flowArrows = document.querySelectorAll(".flow-arrows path");
        const flowTexts = document.querySelectorAll(".flow-text");

        // Add animation classes with delays
        if (flowNodes.length > 0) {
          // First make sure all elements are visible by setting opacity to 1
          flowNodes.forEach((node) => {
            if (node) node.style.opacity = "1";
          });

          // Then add animation classes with staggered delays
          setTimeout(() => {
            flowNodes.forEach((node, index) => {
              if (node) {
                setTimeout(() => {
                  node.classList.add("animate");
                }, index * 300);
              }
            });

            flowArrows.forEach((arrow, index) => {
              if (arrow) {
                setTimeout(
                  () => {
                    arrow.classList.add("animate");
                  },
                  (index + 1) * 300 + 150,
                );
              }
            });

            flowTexts.forEach((text, index) => {
              if (text) {
                setTimeout(
                  () => {
                    text.classList.add("animate");
                  },
                  index * 300 + 100,
                );
              }
            });
          }, 500);
        }
      } catch (error) {
        console.error("Error initializing flowchart animations:", error);
      }
    }

    // Initialize flowchart when scrolled into view
    const techFlowSection = document.querySelector(".tech-flow");
    if (techFlowSection) {
      try {
        // Create an intersection observer
        const observer = new IntersectionObserver(
          (entries) => {
            try {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  initializeFlowchartAnimations();
                  observer.unobserve(entry.target);
                }
              });
            } catch (error) {
              console.error("Error in intersection observer callback:", error);
            }
          },
          {
            threshold: 0.2,
          },
        );

        // Start observing the flowchart section
        observer.observe(techFlowSection);

        // Also initialize on page load if already visible
        if (isElementInViewport(techFlowSection)) {
          initializeFlowchartAnimations();
        }
      } catch (error) {
        console.error("Error setting up flowchart observer:", error);
        // Fallback: initialize immediately
        initializeFlowchartAnimations();
      }
    }

    // FAQ functionality (if present)
    const faqQuestions = document.querySelectorAll(".faq-question");
    if (faqQuestions.length > 0) {
      faqQuestions.forEach((question) => {
        try {
          question.addEventListener("click", () => {
            try {
              const faqItem = question.parentElement;
              if (faqItem) {
                faqItem.classList.toggle("active");
                const isExpanded = faqItem.classList.contains("active");
                question.setAttribute("aria-expanded", isExpanded.toString());

                // Close other FAQ items
                document
                  .querySelectorAll(".faq-item.active")
                  .forEach((item) => {
                    if (item !== faqItem) {
                      item.classList.remove("active");
                    }
                  });
              }
            } catch (error) {
              console.error("Error toggling FAQ item:", error);
            }
          });
        } catch (error) {
          console.error("Error adding FAQ event listener:", error);
        }
      });
    }
  } catch (error) {
    console.error("Critical error in DOMContentLoaded handler:", error);
  }
});

// Helper function to check if element is in viewport
function isElementInViewport(el) {
  try {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  } catch (error) {
    console.error("Error checking viewport:", error);
    return false;
  }
}

// Initialize mobile menu
function initializeMobileMenu() {
  try {
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const mainNav = document.getElementById("main-nav");

    if (mobileMenuBtn && mainNav) {
      mobileMenuBtn.addEventListener("click", function () {
        try {
          const expanded =
            this.getAttribute("aria-expanded") === "true" || false;
          this.setAttribute("aria-expanded", !expanded);
          this.classList.toggle("active");
          mainNav.classList.toggle("active");
          mainNav.setAttribute("aria-hidden", expanded);

          if (!expanded) {
            trapFocus(mainNav);
          }
        } catch (error) {
          console.error("Error toggling mobile menu:", error);
        }
      });
    }
  } catch (error) {
    console.error("Error initializing mobile menu:", error);
  }
}

// Focus trap for accessibility
function trapFocus(element) {
  try {
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener("keydown", function (e) {
      try {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        } else if (e.key === "Escape") {
          const menuBtn = document.querySelector(".mobile-menu-btn");
          if (menuBtn) {
            menuBtn.click();
            menuBtn.focus();
          }
        }
      } catch (error) {
        console.error("Error in focus trap:", error);
      }
    });

    // Focus first element
    if (firstElement && firstElement.focus) {
      firstElement.focus();
    }
  } catch (error) {
    console.error("Error setting up focus trap:", error);
  }
}

// Initialize smooth scroll functionality
function initializeSmoothScroll() {
  try {
    document
      .querySelectorAll('a[href^="#"]:not([href="#"])')
      .forEach((anchor) => {
        try {
          anchor.addEventListener("click", function (e) {
            try {
              e.preventDefault();
              const targetId = this.getAttribute("href");
              const targetElement = document.querySelector(targetId);

              if (targetElement) {
                // Calculate header height dynamically
                const navbar = document.querySelector(".navbar");
                const headerHeight = navbar ? navbar.offsetHeight : 0;

                // Smooth scroll with header offset
                try {
                  window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - 20,
                    behavior: "smooth",
                  });
                } catch (error) {
                  // Fallback for older browsers
                  window.scrollTo(
                    0,
                    targetElement.offsetTop - headerHeight - 20,
                  );
                }

                // Update URL hash without jumping
                try {
                  history.pushState(null, null, targetId);
                } catch (error) {
                  console.error("Error updating URL hash:", error);
                }

                // Set focus to the target element for accessibility
                try {
                  targetElement.setAttribute("tabindex", "-1");
                  targetElement.focus();
                  // Remove the tabindex after focus
                  setTimeout(
                    () => targetElement.removeAttribute("tabindex"),
                    1000,
                  );
                } catch (error) {
                  console.error("Error setting focus:", error);
                }
              }
            } catch (error) {
              console.error("Error in smooth scroll handler:", error);
            }
          });
        } catch (error) {
          console.error("Error adding smooth scroll listener:", error);
        }
      });
  } catch (error) {
    console.error("Error initializing smooth scroll:", error);
  }
}

// Function to handle animation completion and layout recalculation
function handleAnimationCompletion() {
  try {
    // Observer for animation completion events
    const animatedElements = document.querySelectorAll("[data-aos]");

    // If IntersectionObserver is available
    if ("IntersectionObserver" in window) {
      try {
        const animationObserver = new IntersectionObserver(
          (entries) => {
            try {
              entries.forEach((entry) => {
                try {
                  if (entry.isIntersecting) {
                    // Once element is visible and animation started
                    entry.target.addEventListener(
                      "transitionend",
                      () => {
                        try {
                          // Force a reflow after animation completes
                          requestAnimationFrame(() => {
                            try {
                              // Refresh AOS to ensure proper layout
                              if (typeof AOS !== "undefined") {
                                AOS.refresh();
                              }
                            } catch (error) {
                              console.error(
                                "Error refreshing AOS in animation completion:",
                                error,
                              );
                            }
                          });
                        } catch (error) {
                          console.error(
                            "Error in requestAnimationFrame:",
                            error,
                          );
                        }
                      },
                      { once: true },
                    );

                    // Stop observing after first intersection
                    animationObserver.unobserve(entry.target);
                  }
                } catch (error) {
                  console.error("Error processing intersection entry:", error);
                }
              });
            } catch (error) {
              console.error("Error in animation observer callback:", error);
            }
          },
          { threshold: 0.1 },
        );

        // Start observing all animated elements
        animatedElements.forEach((el) => {
          try {
            animationObserver.observe(el);
          } catch (error) {
            console.error("Error observing element:", error);
          }
        });
      } catch (error) {
        console.error("Error setting up animation observer:", error);
      }
    }
    // Fallback for browsers without IntersectionObserver support
    else {
      window.addEventListener(
        "scroll",
        debounce(() => {
          try {
            if (typeof AOS !== "undefined") {
              AOS.refresh();
            }
          } catch (error) {
            console.error("Error in scroll fallback:", error);
          }
        }, 200),
        { passive: true },
      );
    }
  } catch (error) {
    console.error("Critical error in handleAnimationCompletion:", error);
  }
}

// Debounce helper function to limit how often a function can run
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    try {
      const later = () => {
        try {
          clearTimeout(timeout);
          func(...args);
        } catch (error) {
          console.error("Error in debounced function execution:", error);
        }
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    } catch (error) {
      console.error("Error in debounce:", error);
    }
  };
}

// Initialize animation completion handler
try {
  handleAnimationCompletion();
} catch (error) {
  console.error("Error initializing animation completion handler:", error);
}

/**
 * App URL Resolver
 * Finds all elements with data-app-href and sets their href
 * to ANALYZEG_APP_BASE + the path in data-app-href.
 * This ensures a ONE-LINE change when switching to app.analyzeg.co.in.
 */
document.addEventListener("DOMContentLoaded", function () {
  try {
    document.querySelectorAll("[data-app-href]").forEach(function (el) {
      var path = el.getAttribute("data-app-href");
      if (path && typeof ANALYZEG_APP_BASE !== "undefined") {
        el.setAttribute("href", ANALYZEG_APP_BASE + path);
      }
    });
  } catch (error) {
    console.error("Error resolving app URLs:", error);
  }
});
