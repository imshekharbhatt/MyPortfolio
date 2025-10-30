// ----- PERFORMANCE MONITORING -----
class PerformanceMonitor {
  constructor() {
    this.loadTime = 0;
    this.init();
  }

  init() {
    this.trackLoadTime();
    this.trackCoreWebVitals();
  }

  trackLoadTime() {
    window.addEventListener("load", () => {
      this.loadTime = performance.now();
      const loadTimeElement = document.getElementById("load-time");
      if (loadTimeElement) {
        loadTimeElement.textContent = `Page loaded in ${Math.round(
          this.loadTime
        )}ms`;
      }

      // Track in analytics
      this.trackEvent("performance", "page_load", Math.round(this.loadTime));
    });
  }

  trackCoreWebVitals() {
    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.trackEvent(
        "performance",
        "lcp",
        Math.round(lastEntry.renderTime || lastEntry.loadTime)
      );
    });

    try {
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      console.log("LCP tracking not supported");
    }

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        this.trackEvent(
          "performance",
          "fid",
          Math.round(entry.processingStart - entry.startTime)
        );
      });
    });

    try {
      fidObserver.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      console.log("FID tracking not supported");
    }
  }

  trackEvent(category, action, value) {
    console.log(`Performance: ${category} - ${action} - ${value}ms`);

    // Google Analytics integration
    if (typeof gtag !== "undefined") {
      gtag("event", action, {
        event_category: category,
        event_label: "performance",
        value: value,
      });
    }
  }
}

// ----- ERROR BOUNDARY & MONITORING -----
class ErrorBoundary {
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener("error", this.handleError.bind(this));
    window.addEventListener(
      "unhandledrejection",
      this.handlePromiseRejection.bind(this)
    );
  }

  handleError(event) {
    console.error("Global error:", event.error);
    this.reportError(event.error);
  }

  handlePromiseRejection(event) {
    console.error("Unhandled promise rejection:", event.reason);
    this.reportError(event.reason);
  }

  reportError(error) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    // Send to analytics service
    if (typeof gtag !== "undefined") {
      gtag("event", "exception", {
        description: error.message,
        fatal: true,
      });
    }

    // Log to console for development
    if (process.env.NODE_ENV === "development") {
      console.error("Error captured:", errorInfo);
    }
  }
}

// ----- ANALYTICS MANAGER -----
class AnalyticsManager {
  constructor() {
    this.init();
  }

  init() {
    this.trackPageView();
    this.setupEventTracking();
  }

  trackPageView() {
    if (typeof gtag !== "undefined") {
      gtag("config", "GA_MEASUREMENT_ID", {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }

  setupEventTracking() {
    // Track social media clicks
    document.querySelectorAll(".social-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const platform = link.dataset.platform || "unknown";
        this.trackEvent("social", "click", platform);
      });
    });

    // Track project interactions
    document.querySelectorAll(".project-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const project = link.dataset.project || "unknown";
        this.trackEvent("projects", "click", project);
      });
    });

    // Track navigation
    document.querySelectorAll(".nav-link, .footer-nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const section = link.getAttribute("href").replace("#", "");
        this.trackEvent("navigation", "section_view", section);
      });
    });

    // Track downloads
    document.querySelectorAll('[id*="downloadCvButton"]').forEach((button) => {
      button.addEventListener("click", (e) => {
        this.trackEvent("download", "cv_download", "Shekhar_Bhatt_CV");
      });
    });
  }

  trackEvent(category, action, label) {
    console.log(`Analytics: ${category} - ${action} - ${label}`);

    if (typeof gtag !== "undefined") {
      gtag("event", action, {
        event_category: category,
        event_label: label,
      });
    }
  }
}

// ----- LAZY LOADING MANAGER -----
class LazyLoadingManager {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.lazyLoadImages();
  }

  setupIntersectionObserver() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "50px 0px",
          threshold: 0.1,
        }
      );
    }
  }

  lazyLoadImages() {
    const images = document.querySelectorAll("img[data-src]");

    images.forEach((img) => {
      if (this.observer) {
        this.observer.observe(img);
      } else {
        // Fallback: load all images immediately
        this.loadImage(img);
      }
    });
  }

  loadImage(img) {
    const src = img.getAttribute("data-src");
    if (!src) return;

    img.src = src;
    img.removeAttribute("data-src");
    img.classList.remove("image-loading");

    img.onload = () => {
      img.classList.add("loaded");
    };
  }
}

// ----- PROJECT FILTER MANAGER -----
class ProjectFilterManager {
  constructor() {
    this.filterButtons = document.querySelectorAll(".filter-btn");
    this.projectCards = document.querySelectorAll(".project-card");
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.handleFilterClick(e.target);
      });
    });
  }

  handleFilterClick(button) {
    const filter = button.dataset.filter;

    // Update active button
    this.filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Filter projects
    this.filterProjects(filter);

    // Track filter usage
    window.portfolioApp
      .getModule("analytics")
      ?.trackEvent("projects", "filter", filter);
  }

  filterProjects(filter) {
    this.projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");

      if (filter === "all" || categories.includes(filter)) {
        card.classList.remove("hidden");
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        }, 50);
      } else {
        card.style.opacity = "0";
        card.style.transform = "scale(0.8)";
        setTimeout(() => {
          card.classList.add("hidden");
        }, 300);
      }
    });
  }
}

// ----- MODAL MANAGER -----
class ModalManager {
  constructor() {
    this.modal = document.getElementById("project-modal");
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Quick view buttons
    document.querySelectorAll(".project-quick-view").forEach((button) => {
      button.addEventListener("click", (e) => {
        const project = e.target.dataset.project;
        this.openModal(project);
      });
    });

    // Close modal
    document.querySelector(".modal-close").addEventListener("click", () => {
      this.closeModal();
    });

    // Close on backdrop click
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("active")) {
        this.closeModal();
      }
    });
  }

  openModal(projectId) {
    const content = this.getModalContent(projectId);
    document.getElementById("modal-content").innerHTML = content;
    document.getElementById("modal-title").textContent =
      this.getProjectTitle(projectId);

    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Track modal view
    window.portfolioApp
      .getModule("analytics")
      ?.trackEvent("projects", "modal_view", projectId);
  }

  closeModal() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  getModalContent(projectId) {
    const content = {
      "elite-dental": `
        <div class="modal-project-info">
          <h4>Project Overview</h4>
          <p>A modern dental clinic website built with pure HTML5, CSS3, and JavaScript ES6+.</p>
          
          <h4>Key Features</h4>
          <ul>
            <li>Fully responsive design</li>
            <li>Service showcase with animations</li>
            <li>Contact form with validation</li>
            <li>Optimized for performance</li>
          </ul>
          
          <h4>Technologies Used</h4>
          <div class="tech-tags">
            <span class="tech-tag">HTML5</span>
            <span class="tech-tag">CSS3</span>
            <span class="tech-tag">JavaScript</span>
            <span class="tech-tag">Responsive Design</span>
          </div>
        </div>
      `,
      portfolio: `
        <div class="modal-project-info">
          <h4>Project Overview</h4>
          <p>A personal portfolio website showcasing skills, projects, and experience with modern web technologies.</p>
          
          <h4>Key Features</h4>
          <ul>
            <li>Dark/Light mode toggle</li>
            <li>Smooth animations and transitions</li>
            <li>Responsive design</li>
            <li>Contact form with validation</li>
            <li>Performance optimized</li>
          </ul>
          
          <h4>Technologies Used</h4>
          <div class="tech-tags">
            <span class="tech-tag">HTML5</span>
            <span class="tech-tag">CSS3</span>
            <span class="tech-tag">JavaScript ES6+</span>
            <span class="tech-tag">ScrollReveal</span>
            <span class="tech-tag">Typed.js</span>
          </div>
        </div>
      `,
      "face-attendance": `
        <div class="modal-project-info">
          <h4>Project Overview</h4>
          <p>A real-time face recognition-based attendance system using computer vision and web technologies.</p>
          
          <h4>Key Features</h4>
          <ul>
            <li>Real-time face detection and recognition</li>
            <li>Automated attendance logging</li>
            <li>Secure authentication system</li>
            <li>Web-based admin interface</li>
            <li>MySQL database integration</li>
          </ul>
          
          <h4>Technologies Used</h4>
          <div class="tech-tags">
            <span class="tech-tag">Python</span>
            <span class="tech-tag">Flask</span>
            <span class="tech-tag">OpenCV</span>
            <span class="tech-tag">MySQL</span>
            <span class="tech-tag">HTML/CSS/JavaScript</span>
          </div>
          
          <p><strong>Status:</strong> In Development</p>
        </div>
      `,
    };

    return content[projectId] || "<p>Project details not available.</p>";
  }

  getProjectTitle(projectId) {
    const titles = {
      "elite-dental": "Elite Dental Care",
      portfolio: "Shekhar Bhatt Portfolio",
      "face-attendance": "Face Attendance System",
    };

    return titles[projectId] || "Project Details";
  }
}

// ----- ENHANCED CONTACT MANAGER -----
class EnhancedContactManager {
  constructor() {
    this.form = document.getElementById("contact-form");
    this.init();
  }

  init() {
    if (this.form) {
      this.setupEventListeners();
      this.setupValidation();
    }
  }

  setupEventListeners() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Real-time validation with debouncing
    this.form.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener(
        "input",
        this.debounce(() => {
          this.clearError(input);
        }, 300)
      );
    });

    // Honeypot protection
    this.form.addEventListener("submit", (e) => {
      const honeypot = this.form.querySelector("#website");
      if (honeypot && honeypot.value) {
        e.preventDefault();
        this.showMessage(
          "Spam detection triggered. Please try again.",
          "error"
        );
        return false;
      }
    });
  }

  debounce(func, wait) {
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

  setupValidation() {
    this.form.setAttribute("novalidate", "true");
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = "";

    if (!field.required && !value) return true;

    switch (field.type) {
      case "email":
        if (!this.isValidEmail(value)) {
          isValid = false;
          message = "Please enter a valid email address";
        }
        break;
      case "text":
        if (field.id === "name" && value.length < 2) {
          isValid = false;
          message = "Name must be at least 2 characters long";
        } else if (field.id === "subject" && value.length < 5) {
          isValid = false;
          message = "Subject must be at least 5 characters long";
        }
        break;
      default:
        if (field.id === "message" && value.length < 10) {
          isValid = false;
          message = "Message must be at least 10 characters long";
        } else if (!value && field.required) {
          isValid = false;
          message = "This field is required";
        }
    }

    if (!isValid) {
      this.showError(field, message);
    } else {
      this.showSuccess(field);
    }

    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showError(field, message) {
    this.clearStatus(field);
    field.classList.add("error");

    const errorElement =
      field.parentNode.querySelector(".field-error") ||
      document.createElement("div");
    errorElement.className = "field-error show";
    errorElement.textContent = message;
    errorElement.id = `${field.id}-error`;

    if (!field.parentNode.querySelector(".field-error")) {
      field.parentNode.appendChild(errorElement);
    }
  }

  showSuccess(field) {
    this.clearStatus(field);
    field.classList.add("success");
  }

  clearStatus(field) {
    field.classList.remove("error", "success");
    const errorElement = field.parentNode.querySelector(".field-error");
    if (errorElement) {
      errorElement.classList.remove("show");
    }
  }

  clearError(field) {
    if (field.value.trim()) this.clearStatus(field);
  }

  async handleSubmit(event) {
    event.preventDefault();

    // Validate all fields
    const isValid = Array.from(this.form.elements)
      .filter((el) => el.tagName !== "BUTTON" && el.type !== "hidden")
      .every((field) => this.validateField(field));

    if (!isValid) {
      this.showMessage(
        "Please fix the errors above before submitting.",
        "error"
      );
      return;
    }

    try {
      this.setLoading(true);

      // Simulate API call with timeout
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure for demo
          Math.random() > 0.2 ? resolve() : reject(new Error("Server error"));
        }, 1500);
      });

      this.showMessage(
        "Message sent successfully! I'll get back to you soon.",
        "success"
      );
      this.form.reset();
      this.clearAllStatuses();

      // Track form submission
      window.portfolioApp
        .getModule("analytics")
        ?.trackEvent("contact", "form_submit", "success");
    } catch (error) {
      this.showMessage(
        "Failed to send message. Please try again later.",
        "error"
      );
      window.portfolioApp
        .getModule("analytics")
        ?.trackEvent("contact", "form_submit", "error");
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    const btn = this.form.querySelector('button[type="submit"]');
    if (!btn) return;

    btn.disabled = loading;

    const btnText = btn.querySelector(".btn-text");
    const btnLoading = btn.querySelector(".btn-loading");

    if (loading) {
      btnText.textContent = "Sending...";
      btn.classList.add("loading");
    } else {
      btnText.textContent = "Send Message";
      btn.classList.remove("loading");
    }
  }

  showMessage(text, type) {
    const existing = document.getElementById("form-response");
    if (existing) {
      existing.remove();
    }

    const message = document.createElement("div");
    message.id = "form-response";
    message.className = `form-response ${type}`;
    message.textContent = text;

    this.form.appendChild(message);

    // Auto-remove success messages
    if (type === "success") {
      setTimeout(() => message.remove(), 5000);
    }
  }

  clearAllStatuses() {
    this.form.querySelectorAll("input, textarea").forEach((field) => {
      this.clearStatus(field);
    });
  }
}

// ----- INTERACTIVE PARTICLES -----
class InteractiveParticles {
  constructor() {
    this.init();
  }

  init() {
    if (typeof particlesJS !== "undefined") {
      this.setupParticles();
      this.setupInteractions();
    }
  }

  setupParticles() {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#6429ef",
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.5,
          random: true,
        },
        size: {
          value: 3,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#6429ef",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
      },
      retina_detect: true,
    });
  }

  setupInteractions() {
    // Mouse move interaction for particles
    document.addEventListener("mousemove", (e) => {
      this.handleMouseMove(e);
    });
  }

  handleMouseMove(e) {
    // You can add custom particle interactions here
    // This is a basic implementation that can be extended
  }
}

// ----- ACCESSIBILITY MANAGER -----
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupReducedMotion();
  }

  setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      // Escape key closes modals and menus
      if (e.key === "Escape") {
        this.handleEscapeKey();
      }

      // Tab key navigation enhancement
      if (e.key === "Tab") {
        this.handleTabNavigation(e);
      }
    });
  }

  handleEscapeKey() {
    // Close mobile menu
    const navMenu = document.getElementById("myNavMenu");
    if (navMenu && navMenu.classList.contains("responsive")) {
      window.portfolioApp.getModule("navigation")?.closeMenu();
    }

    // Close modal
    const modal = document.getElementById("project-modal");
    if (modal && modal.classList.contains("active")) {
      window.portfolioApp.getModule("modal")?.closeModal();
    }
  }

  handleTabNavigation(e) {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  setupFocusManagement() {
    // Add focus styles for better accessibility
    document.addEventListener("focusin", (e) => {
      e.target.classList.add("focused");
    });

    document.addEventListener("focusout", (e) => {
      e.target.classList.remove("focused");
    });
  }

  setupReducedMotion() {
    // Check if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.style.setProperty("--transition-normal", "0.1s");
      document.documentElement.style.setProperty("--transition-slow", "0.1s");
    }
  }
}

// ----- DOWNLOAD MANAGER -----
class DownloadManager {
  constructor() {
    this.downloadButtons = [
      "downloadCvButton",
      "downloadCvButtonFeatured",
      "downloadCvButtonAbout",
      "downloadCvButtonFooter",
    ];
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.downloadButtons.forEach((buttonId) => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener("click", (e) => this.handleDownload(e));

        // Add keyboard support
        button.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.handleDownload(e);
          }
        });
      }
    });

    // Hire me button
    const hireMeButton = document.getElementById("hireMeButton");
    if (hireMeButton) {
      hireMeButton.addEventListener("click", () => {
        window.open("https://linkedin.com/in/imshekharbhatt", "_blank");
        window.portfolioApp
          .getModule("analytics")
          ?.trackEvent("engagement", "hire_me_click", "linkedin");
      });
    }
  }

  handleDownload(event) {
    event.preventDefault();
    this.downloadCV();

    // Track download event
    window.portfolioApp
      .getModule("analytics")
      ?.trackEvent("download", "cv_download", "Shekhar_Bhatt_CV");
  }

  downloadCV() {
    try {
      // Create a temporary link for download
      const link = document.createElement("a");
      link.href = "portfolioassets/documents/shekhar-bhatt-cv.pdf";
      link.download = "Shekhar-Bhatt-CV.pdf";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // Add link to DOM, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);

      // Fallback: Open in new tab
      window.open("portfolioassets/documents/shekhar-bhatt-cv.pdf", "_blank");
    }
  }
}

// ----- MODERN PORTFOLIO MANAGER -----
class PortfolioApp {
  constructor() {
    this.modules = new Map();
    this.init();
  }

  init() {
    this.initializeModules();
    this.setupGlobalHandlers();
    console.log("🚀 Enhanced Portfolio initialized");
  }

  initializeModules() {
    const modules = {
      navigation: NavigationManager,
      scroll: ScrollManager,
      theme: ThemeManager,
      animations: AnimationManager,
      contact: EnhancedContactManager,
      download: DownloadManager,
      analytics: AnalyticsManager,
      performance: PerformanceMonitor,
      errorBoundary: ErrorBoundary,
      lazyLoading: LazyLoadingManager,
      projectFilter: ProjectFilterManager,
      modal: ModalManager,
      particles: InteractiveParticles,
      accessibility: AccessibilityManager,
    };

    Object.entries(modules).forEach(([name, Module]) => {
      try {
        this.modules.set(name, new Module());
      } catch (error) {
        console.warn(`Module ${name} failed:`, error);
      }
    });
  }

  setupGlobalHandlers() {
    // Performance: passive scroll listeners
    const options = { passive: true, capture: true };

    window.addEventListener(
      "scroll",
      () => {
        this.modules.get("scroll")?.handleScroll();
      },
      options
    );

    window.addEventListener(
      "resize",
      () => {
        this.modules.get("navigation")?.handleResize();
      },
      options
    );

    // Service Worker Registration (for PWA)
    this.registerServiceWorker();
  }

  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("SW registered: ", registration);
      } catch (error) {
        console.log("SW registration failed: ", error);
      }
    }
  }

  getModule(name) {
    return this.modules.get(name);
  }
}

// ----- MODERN NAVIGATION -----
class NavigationManager {
  constructor() {
    this.menuBtn = document.getElementById("myNavMenu");
    this.mobileMenuToggle = document.getElementById("mobileMenuToggle");
    this.navHeader = document.getElementById("header");
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupSmoothScrolling();
  }

  setupEventListeners() {
    // Mobile menu toggle
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }

    // Close menu on window resize (if resized to desktop)
    window.addEventListener("resize", () => this.handleResize());

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeMenu();
    });
  }

  toggleMenu() {
    if (this.menuBtn.classList.contains("responsive")) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.menuBtn.classList.add("responsive");
    this.mobileMenuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";

    // Add event listener to close menu when clicking outside
    setTimeout(() => {
      document.addEventListener(
        "click",
        this.closeMenuOnClickOutside.bind(this)
      );
    }, 10);
  }

  closeMenu() {
    this.menuBtn.classList.remove("responsive");
    this.mobileMenuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.removeEventListener(
      "click",
      this.closeMenuOnClickOutside.bind(this)
    );
  }

  closeMenuOnClickOutside(event) {
    if (
      !this.menuBtn.contains(event.target) &&
      !this.mobileMenuToggle.contains(event.target)
    ) {
      this.closeMenu();
    }
  }

  handleResize() {
    if (window.innerWidth > 900) {
      this.closeMenu();
    }
  }

  setupSmoothScrolling() {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const targetId = link.getAttribute("href");
        this.scrollToSection(targetId);
        this.closeMenu();
      });
    });
  }

  scrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      const headerHeight = this.navHeader?.offsetHeight || 80;
      const targetPosition = targetSection.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }
}

// ----- SCROLL MANAGER -----
class ScrollManager {
  constructor() {
    this.header = document.getElementById("header");
    this.backToTop = document.getElementById("backToTop");
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollSpy();
    this.handleScroll(); // Initial call
  }

  setupEventListeners() {
    this.backToTop?.addEventListener("click", () => this.scrollToTop());
  }

  handleScroll() {
    this.updateHeader();
    this.toggleBackToTop();
    this.updateActiveSection();
  }

  updateHeader() {
    if (!this.header) return;

    const scrollY = window.scrollY;
    const shouldShrink = scrollY > 50;

    this.header.style.cssText = shouldShrink
      ? `box-shadow: var(--box-shadow); height: 70px; line-height: 70px; backdrop-filter: blur(20px)`
      : `box-shadow: none; height: 80px; line-height: 80px; backdrop-filter: blur(10px)`;
  }

  toggleBackToTop() {
    if (!this.backToTop) return;

    this.backToTop.classList.toggle("visible", window.scrollY > 300);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  setupScrollSpy() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.setActiveNavLink(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px" }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });
  }

  setActiveNavLink(sectionId) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.toggle(
        "active-link",
        link.getAttribute("href") === `#${sectionId}`
      );
    });
  }

  updateActiveSection() {
    // Additional scroll-based updates can go here
  }
}

// ----- THEME MANAGER -----
class ThemeManager {
  constructor() {
    this.toggle = document.getElementById("darkModeToggle");
    this.icon = document.getElementById("darkModeIcon");
    this.init();
  }

  init() {
    this.setInitialTheme();
    this.setupEventListeners();
  }

  setInitialTheme() {
    const saved = localStorage.getItem("portfolio-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = saved ? saved === "dark" : prefersDark;

    this.setTheme(isDark, false);
  }

  setupEventListeners() {
    this.toggle?.addEventListener("click", () => this.toggleTheme());

    // System theme change listener
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("portfolio-theme")) {
          this.setTheme(e.matches, true);
        }
      });
  }

  toggleTheme() {
    const isDark = !document.body.classList.contains("dark-mode");
    this.setTheme(isDark, true);

    // Track theme change
    window.portfolioApp
      .getModule("analytics")
      ?.trackEvent("preferences", "theme_toggle", isDark ? "dark" : "light");
  }

  setTheme(isDark, animate = true) {
    document.body.classList.toggle("dark-mode", isDark);

    if (animate) {
      document.body.style.transition = "all 0.3s ease";
      setTimeout(() => (document.body.style.transition = ""), 300);
    }

    this.updateIcon(isDark);
    this.updateMetaTheme(isDark);
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  }

  updateIcon(isDark) {
    if (!this.icon) return;

    this.icon.className = isDark ? "uil uil-sun" : "uil uil-moon";
    this.icon.style.color = isDark ? "#ffd700" : "";
  }

  updateMetaTheme(isDark) {
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = isDark ? "#0a0a0a" : "#6429ef";
    }
  }
}

// ----- ANIMATION MANAGER -----
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupTypingEffect();
    this.setupSkillsAnimation();
    this.setupScrollReveal();
  }

  setupTypingEffect() {
    const typedElement = document.querySelector(".typedText");
    if (!typedElement || typeof Typed === "undefined") return;

    new Typed(".typedText", {
      strings: [
        "Programmer",
        "Problem Solver",
        "Engineering Student",
        "Full-Stack Developer",
      ],
      typeSpeed: 70,
      backSpeed: 40,
      backDelay: 2500,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
  }

  setupSkillsAnimation() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateSkills();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const skillsSection = document.getElementById("skills");
    if (skillsSection) observer.observe(skillsSection);
  }

  animateSkills() {
    document.querySelectorAll(".skill-progress").forEach((progress, index) => {
      setTimeout(() => {
        progress.style.width = progress.dataset.width || "0%";
      }, index * 100);
    });
  }

  setupScrollReveal() {
    if (typeof ScrollReveal !== "undefined") {
      const sr = ScrollReveal({
        distance: "40px",
        duration: 800,
        easing: "cubic-bezier(0.5, 0, 0, 1)",
        mobile: true,
      });

      sr.reveal(".featured-badge, .featured-name", { delay: 100 });
      sr.reveal(".featured-text-info, .featured-text-btn", { delay: 200 });
      sr.reveal(".featured-image", { delay: 300, origin: "right" });
      sr.reveal(".about-info, .about-stats", { interval: 100 });
      sr.reveal(".skill-category, .project-card", { interval: 150 });
    }
  }
}

// ----- INITIALIZATION -----
document.addEventListener("DOMContentLoaded", () => {
  window.portfolioApp = new PortfolioApp();

  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 100);
});

console.log("✨ Enhanced Portfolio JS loaded");
