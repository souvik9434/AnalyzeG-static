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
    // Initialize AOS animations with improved configuration
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: false,
        mirror: false,
        disable: "mobile",
        startEvent: "DOMContentLoaded",
        offset: 120,
      });

      // Add scroll event listener to refresh AOS on scroll
      window.addEventListener(
        "scroll",
        function () {
          try {
            setTimeout(function () {
              if (typeof AOS !== "undefined") {
                AOS.refresh();
              }
            }, 200);
          } catch (error) {
            console.error("Error refreshing AOS:", error);
          }
        },
        { passive: true },
      );
    }

    // Initialize mobile menu with improved accessibility
    initializeMobileMenu();

    // Initialize audience toggle
    initializeAudienceToggle();

    // Load saved audience preference
    try {
      const savedAudience = localStorage.getItem("selectedAudience");
      if (
        savedAudience &&
        (savedAudience === "reviewer" || savedAudience === "brand")
      ) {
        setTimeout(() => {
          setActiveAudience(savedAudience);
        }, 100);
      }
    } catch (error) {
      console.error("Error loading saved audience preference:", error);
    }

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

// Initialize audience toggle functionality
function initializeAudienceToggle() {
  try {
    const audienceToggles = document.querySelectorAll(".audience-toggle");

    audienceToggles.forEach((toggle) => {
      try {
        const reviewerOption = toggle.querySelector("#reviewer-option");
        const brandOption = toggle.querySelector("#brand-option");
        const slider = toggle.querySelector(".audience-toggle-slider");

        if (reviewerOption && brandOption && slider) {
          // Initialize slider width and position with error handling
          setTimeout(() => {
            try {
              slider.style.width = `${reviewerOption.offsetWidth}px`;
            } catch (error) {
              console.error("Error setting slider width:", error);
            }
          }, 100);

          reviewerOption.addEventListener("click", () => {
            try {
              setActiveAudience("reviewer");
            } catch (error) {
              console.error("Error setting reviewer audience:", error);
            }
          });

          brandOption.addEventListener("click", () => {
            try {
              setActiveAudience("brand");
            } catch (error) {
              console.error("Error setting brand audience:", error);
            }
          });

          // Add keyboard navigation
          reviewerOption.addEventListener("keydown", (e) => {
            try {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveAudience("reviewer");
              }
            } catch (error) {
              console.error("Error in reviewer keydown handler:", error);
            }
          });

          brandOption.addEventListener("keydown", (e) => {
            try {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveAudience("brand");
              }
            } catch (error) {
              console.error("Error in brand keydown handler:", error);
            }
          });
        }
      } catch (error) {
        console.error("Error initializing audience toggle:", error);
      }
    });
  } catch (error) {
    console.error("Critical error in initializeAudienceToggle:", error);
  }
}

// Set active audience and update content
function setActiveAudience(audience) {
  try {
    const reviewerOption = document.getElementById("reviewer-option");
    const brandOption = document.getElementById("brand-option");
    const sliders = document.querySelectorAll(".audience-toggle-slider");

    // Update toggle states
    if (reviewerOption && brandOption) {
      if (audience === "reviewer") {
        reviewerOption.classList.add("active");
        brandOption.classList.remove("active");
        reviewerOption.setAttribute("aria-selected", "true");
        brandOption.setAttribute("aria-selected", "false");
      } else {
        reviewerOption.classList.remove("active");
        brandOption.classList.add("active");
        reviewerOption.setAttribute("aria-selected", "false");
        brandOption.setAttribute("aria-selected", "true");

        // FIX: Auto-scroll to top when switching to B2B to prevent content being cut off
        // B2B has 4 process steps vs B2C's 3 steps, causing extra height
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
          // Fallback for older browsers
          window.scrollTo(0, 0);
        }
      }
    }

    // Update slider positions with animation
    sliders.forEach((slider) => {
      try {
        if (audience === "reviewer") {
          slider.style.transform = "translateX(0)";
          setTimeout(() => {
            try {
              slider.style.width = `${reviewerOption.offsetWidth}px`;
            } catch (error) {
              console.error("Error setting slider width:", error);
            }
          }, 50);
        } else {
          slider.style.transform = `translateX(${reviewerOption.offsetWidth}px)`;
          setTimeout(() => {
            try {
              slider.style.width = `${brandOption.offsetWidth}px`;
            } catch (error) {
              console.error("Error setting slider width:", error);
            }
          }, 50);
        }
      } catch (error) {
        console.error("Error updating slider position:", error);
      }
    });

    // Toggle visibility of audience-specific content sections
    try {
      document.querySelectorAll("[data-audience]").forEach((section) => {
        try {
          if (section.getAttribute("data-audience") === audience) {
            section.classList.add("active");

            // Add a slight delay before refreshing AOS to ensure elements are visible
            setTimeout(() => {
              try {
                // Refresh AOS to animate newly visible elements
                if (typeof AOS !== "undefined") {
                  AOS.refresh();
                }
              } catch (error) {
                console.error("Error refreshing AOS:", error);
              }
            }, 100);
          } else {
            section.classList.remove("active");
          }
        } catch (error) {
          console.error("Error toggling section visibility:", error);
        }
      });
    } catch (error) {
      console.error("Error updating audience sections:", error);
    }

    // Also handle sections without data-audience but with IDs (legacy support)
    try {
      const reviewerSections = document.querySelectorAll(
        "#reviewer-content, #reviewer-cta, #reviewer-process",
      );
      const brandSections = document.querySelectorAll(
        "#brand-content, #brand-cta, #brand-process",
      );

      if (audience === "reviewer") {
        reviewerSections.forEach((section) => {
          if (section) section.classList.add("active");
        });
        brandSections.forEach((section) => {
          if (section) section.classList.remove("active");
        });
      } else {
        reviewerSections.forEach((section) => {
          if (section) section.classList.remove("active");
        });
        brandSections.forEach((section) => {
          if (section) section.classList.add("active");
        });
      }
    } catch (error) {
      console.error("Error updating legacy sections:", error);
    }

    // Store audience preference
    try {
      localStorage.setItem("selectedAudience", audience);
    } catch (error) {
      console.error("Error saving audience preference:", error);
    }
  } catch (error) {
    console.error("Critical error in setActiveAudience:", error);
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
