// ----- NAVIGATION BAR FUNCTION -----
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
        const targetId = link.getAttribute("href"); // Fixed: use link instead of this
        this.scrollToSection(targetId);
        this.closeMenu();
      });
    });
  }

  scrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      const headerHeight = this.navHeader?.offsetHeight || 80; // Updated to match new header height
      const targetPosition = targetSection.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }
}

// ----- SCROLL MANAGEMENT -----
class ScrollManager {
  constructor() {
    this.navHeader = document.getElementById("header");
    this.backToTopBtn = document.getElementById("backToTop");
    this.sections = document.querySelectorAll("section[id]");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollSpy();
  }

  setupEventListeners() {
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      // Throttle scroll events
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          this.handleHeaderShadow();
          this.toggleBackToTopButton();
          this.updateActiveNavLink();
          scrollTimeout = null;
        }, 10);
      }
    });

    // Back to top functionality
    if (this.backToTopBtn) {
      this.backToTopBtn.addEventListener("click", () => this.scrollToTop());
    }
  }

  handleHeaderShadow() {
    if (!this.navHeader) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
      this.navHeader.style.boxShadow = "var(--box-shadow)";
      this.navHeader.style.height = "70px";
      this.navHeader.style.lineHeight = "70px";
    } else {
      this.navHeader.style.boxShadow = "none";
      this.navHeader.style.height = "80px"; // Updated to match new header height
      this.navHeader.style.lineHeight = "80px";
    }
  }

  toggleBackToTopButton() {
    if (!this.backToTopBtn) return;

    if (window.pageYOffset > 300) {
      this.backToTopBtn.classList.add("visible");
    } else {
      this.backToTopBtn.classList.remove("visible");
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  setupScrollSpy() {
    let ticking = false;

    const updateActiveLink = () => {
      const scrollY = window.pageYOffset;
      const headerHeight = this.navHeader?.offsetHeight || 80;

      this.sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 50;
        const sectionId = section.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          this.setActiveNavLink(sectionId);
        }
      });

      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateActiveLink);
        ticking = true;
      }
    });
  }

  setActiveNavLink(sectionId) {
    // Remove active class from all links
    this.navLinks.forEach((link) => {
      link.classList.remove("active-link");
    });

    // Add active class to current link
    const activeLink = document.querySelector(
      `.nav-link[href="#${sectionId}"]`
    );
    if (activeLink) {
      activeLink.classList.add("active-link");
    }
  }

  updateActiveNavLink() {}
}

// ----- TYPING EFFECT -----
class TypingEffect {
  constructor() {
    this.typedTextElement = document.querySelector(".typedText");
    this.typingEffect = null;
    this.init();
  }

  init() {
    if (this.typedTextElement && typeof Typed !== "undefined") {
      this.typingEffect = new Typed(".typedText", {
        strings: [
          "Student",
          "Developer",
          "Programmer",
          "Tech Enthusiast",
          "Problem Solver",
        ],
        loop: true,
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 2000,
        startDelay: 500,
        smartBackspace: true,
        showCursor: true,
        cursorChar: "|",
      });
    } else if (this.typedTextElement) {
      this.typedTextElement.textContent = "Developer";
    }
  }

  destroy() {
    if (this.typingEffect) {
      this.typingEffect.destroy();
    }
  }
}

// ----- SKILLS ANIMATION -----
class SkillsAnimation {
  constructor() {
    this.skillsSection = document.getElementById("skills");
    this.hasAnimated = false;
    this.init();
  }

  init() {
    if (this.skillsSection) {
      this.setupIntersectionObserver();
    }
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.animateSkills();
            this.hasAnimated = true;
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(this.skillsSection);
  }

  animateSkills() {
    const skillProgresses = document.querySelectorAll(".skill-progress");

    skillProgresses.forEach((progress, index) => {
      const width = progress.getAttribute("data-width") || "0%";
      setTimeout(() => {
        progress.style.width = width;
      }, index * 150);
    });
  }

  reset() {
    this.hasAnimated = false;
  }
}

// ----- DARK MODE MANAGER -----
class DarkModeManager {
  constructor() {
    this.darkModeIcon = document.getElementById("darkModeIcon");
    this.DARK_MODE_CLASS = "dark-mode";
    this.LIGHT_THEME = "light";
    this.DARK_THEME = "dark";
    this.init();
  }

  init() {
    if (this.darkModeIcon) {
      this.setupEventListeners();
      this.setInitialTheme();
    }
  }

  setupEventListeners() {
    this.darkModeIcon.addEventListener("click", () => this.toggleTheme());

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          this.setTheme(e.matches);
        }
      });
  }

  setInitialTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDarkMode = savedTheme
      ? savedTheme === this.DARK_THEME
      : prefersDark;

    this.setTheme(isDarkMode);
    this.saveThemePreference(isDarkMode);
  }

  toggleTheme() {
    const isDarkMode = document.body.classList.toggle(this.DARK_MODE_CLASS);
    this.setTheme(isDarkMode);
    this.saveThemePreference(isDarkMode);
  }

  setTheme(isDarkMode) {
    if (isDarkMode) {
      document.body.classList.add(this.DARK_MODE_CLASS);
      this.updateIcon(true);
    } else {
      document.body.classList.remove(this.DARK_MODE_CLASS);
      this.updateIcon(false);
    }

    this.updateThemeColor(isDarkMode);
  }

  updateIcon(isDarkMode) {
    if (isDarkMode) {
      this.darkModeIcon.classList.remove("uil-moon");
      this.darkModeIcon.classList.add("uil-sun");
      this.darkModeIcon.style.color = "#ffd700";
      this.darkModeIcon.setAttribute("aria-label", "Switch to light mode");
    } else {
      this.darkModeIcon.classList.remove("uil-sun");
      this.darkModeIcon.classList.add("uil-moon");
      this.darkModeIcon.style.color = "";
      this.darkModeIcon.setAttribute("aria-label", "Switch to dark mode");
    }
  }

  updateThemeColor(isDarkMode) {
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", isDarkMode ? "#0a0a0a" : "#6429ef");
    }
  }

  saveThemePreference(isDarkMode) {
    localStorage.setItem(
      "theme",
      isDarkMode ? this.DARK_THEME : this.LIGHT_THEME
    );
  }
}

// ----- CONTACT FORM MANAGER -----
class ContactFormManager {
  constructor() {
    this.contactForm = document.getElementById("contact-form");
    this.init();
  }

  init() {
    if (this.contactForm) {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    this.contactForm.addEventListener("submit", (event) =>
      this.handleSubmit(event)
    );

    // Add input validation
    this.contactForm.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    switch (field.type) {
      case "email":
        if (!value) {
          isValid = false;
          errorMessage = "Email is required";
        } else if (!this.isValidEmail(value)) {
          isValid = false;
          errorMessage = "Please enter a valid email address";
        }
        break;
      case "text":
        if (!value) {
          isValid = false;
          errorMessage = "This field is required";
        } else if (field.id === "name" && value.length < 4) {
          isValid = false;
          errorMessage = "Name must be at least 4 characters long";
        }
        break;
      default:
        if (!value && field.required) {
          isValid = false;
          errorMessage = "This field is required";
        }
    }

    if (field.type === "textarea" && value.length < 12) {
      isValid = false;
      errorMessage = "Message must be at least 12 characters long";
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showFieldError(field, message) {
    this.clearFieldError(field);
    field.style.borderColor = "#ef4444";

    const errorElement = document.createElement("div");
    errorElement.className = "field-error";
    errorElement.style.color = "#ef4444";
    errorElement.style.fontSize = "0.875rem";
    errorElement.style.marginTop = "5px";
    errorElement.textContent = message;

    field.parentNode.appendChild(errorElement);
  }

  clearFieldError(field) {
    field.style.borderColor = "";
    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }
  }

  validateForm() {
    let isValid = true;
    const requiredFields = this.contactForm.querySelectorAll("[required]");

    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (!this.validateForm()) {
      this.showFormResponse("Please fix the errors above", "error");
      return;
    }

    const submitBtn = this.contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    this.setButtonLoading(submitBtn, true);

    try {
      const formData = new FormData(this.contactForm);

      await this.simulateFormSubmission(formData);

      this.showFormResponse(
        "Thank you! Your message has been sent successfully.",
        "success"
      );
      this.contactForm.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      this.showFormResponse(
        "Sorry! An error occurred while sending your message. Please try again later.",
        "error"
      );
    } finally {
      this.setButtonLoading(submitBtn, false, originalText);
    }
  }

  async simulateFormSubmission(formData) {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        const isSuccess = Math.random() > 0.2;
        if (isSuccess) {
          resolve({ status: "success" });
        } else {
          reject(new Error("Server error"));
        }
      }, 1500);
    });
  }

  setButtonLoading(button, isLoading, originalText = "") {
    if (isLoading) {
      button.innerHTML =
        'Sending... <i class="uil uil-spinner animation-spin"></i>';
      button.disabled = true;

      // Add spin animation CSS if not exists
      if (!document.querySelector("#spin-animation")) {
        const style = document.createElement("style");
        style.id = "spin-animation";
        style.textContent = `
          .animation-spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      button.innerHTML = originalText;
      button.disabled = false;
    }
  }

  showFormResponse(message, type) {
    const formResponse = document.getElementById("form-response");
    if (!formResponse) return;

    formResponse.textContent = message;
    formResponse.style.display = "block";

    // Remove existing classes
    formResponse.classList.remove("success", "error");

    // Add appropriate class
    formResponse.classList.add(type);

    // Hide response after 5 seconds
    setTimeout(() => {
      formResponse.style.display = "none";
    }, 5000);
  }
}

// ----- DOWNLOAD MANAGER -----
class DownloadManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add event listeners to all download buttons
    const downloadButtons = [
      "downloadCvButton",
      "downloadCvButtonFeatured",
      "downloadCvButtonAbout",
      "downloadCvButtonFooter",
    ];

    downloadButtons.forEach((buttonId) => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener("click", (e) => this.handleDownload(e));
      }
    });
  }

  handleDownload(event) {
    event.preventDefault();
    this.downloadCV();
  }

  downloadCV() {
    // Create a temporary link for download
    const link = document.createElement("a");
    link.href = "shekhar-bhatt-cv.pdf";
    link.download = "Shekhar-Bhatt-CV.pdf";
    link.target = "_blank";

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Log download event
    console.log("CV download initiated");
  }
}

// ----- SCROLL REVEAL ANIMATIONS -----
class ScrollRevealManager {
  constructor() {
    this.init();
  }

  init() {
    if (typeof ScrollReveal !== "undefined") {
      this.setupScrollReveal();
    } else {
      this.setupIntersectionObserver();
    }
  }

  setupScrollReveal() {
    const sr = ScrollReveal({
      origin: "top",
      distance: "40px",
      duration: 1000,
      delay: 150,
      reset: false,
      easing: "cubic-bezier(0.5, 0, 0, 1)",
      mobile: true,
      viewFactor: 0.1,
    });

    // Home section animations
    sr.reveal(".featured-badge", { delay: 100 });
    sr.reveal(".featured-name", { delay: 200 });
    sr.reveal(".featured-text-info", { delay: 300 });
    sr.reveal(".featured-text-btn", { delay: 400 });
    sr.reveal(".social-icons", { delay: 500 });
    sr.reveal(".featured-image", { delay: 600, origin: "right" });

    // About section animations
    sr.reveal(".about-info", { origin: "left", delay: 100 });
    sr.reveal(".about-stats", { origin: "right", delay: 200 });

    // Skills section animations
    sr.reveal(".skill-category", { interval: 150, delay: 100 });

    // Projects section animations
    sr.reveal(".project-card", { interval: 150, delay: 100 });

    // Contact section animations
    sr.reveal(".contact-info", { origin: "left", delay: 100 });
    sr.reveal(".modern-form", { origin: "right", delay: 200 });

    // Headings animations
    sr.reveal(".top-header", { delay: 100 });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observe all elements that would normally be revealed
    const elementsToReveal = document.querySelectorAll(
      ".featured-badge, .featured-name, .featured-text-info, .featured-text-btn, .social-icons, .featured-image, .about-info, .about-stats, .skill-category, .project-card, .contact-info, .modern-form, .top-header"
    );

    elementsToReveal.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
  }
}

// ----- PROJECT INTERACTIONS -----
class ProjectInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupProjectCardInteractions();
    this.setupFooterSmoothScroll();
  }

  setupProjectCardInteractions() {
    document.querySelectorAll(".project-card").forEach((card) => {
      // Remove existing inline transform styles
      card.style.transform = "";

      // Use CSS classes instead of inline styles for better performance
      card.addEventListener("mouseenter", () => {
        card.classList.add("project-card-hover");
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("project-card-hover");
      });

      // Touch devices support
      card.addEventListener("touchstart", () => {
        card.classList.add("project-card-touch");
      });

      card.addEventListener("touchend", () => {
        card.classList.remove("project-card-touch");
      });
    });
  }

  setupFooterSmoothScroll() {
    document.querySelectorAll('.footer-column a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          const headerHeight =
            document.getElementById("header")?.offsetHeight || 80;
          const targetPosition = targetSection.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }
}

// ----- PERFORMANCE OPTIMIZATIONS -----
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.setupPreloadCriticalResources();
  }

  setupLazyLoading() {
    // Use native lazy loading for images
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.loading) {
        img.loading = "lazy";
      }
    });
  }

  setupPreloadCriticalResources() {
    // Preload critical resources
    const criticalResources = [];

    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = resource;
      link.as = resource.includes(".css") ? "style" : "script";
      document.head.appendChild(link);
    });
  }
}

// ----- MAIN APPLICATION INITIALIZATION -----
class PortfolioApp {
  constructor() {
    this.modules = {};
    this.init();
  }

  init() {
    try {
      this.initializeModules();
      this.setupErrorHandling();
      this.logInitialization();
    } catch (error) {
      console.error("Failed to initialize portfolio app:", error);
    }
  }

  initializeModules() {
    // Initialize all modules
    this.modules = {
      navigation: new NavigationManager(),
      scroll: new ScrollManager(),
      typing: new TypingEffect(),
      skills: new SkillsAnimation(),
      darkMode: new DarkModeManager(),
      contactForm: new ContactFormManager(),
      download: new DownloadManager(),
      scrollReveal: new ScrollRevealManager(),
      projects: new ProjectInteractions(),
      performance: new PerformanceOptimizer(),
    };
  }

  setupErrorHandling() {
    window.addEventListener("error", (e) => {
      console.error("JavaScript Error:", e.error);
    });

    window.addEventListener("unhandledrejection", (e) => {
      console.error("Unhandled Promise Rejection:", e.reason);
      e.preventDefault();
    });
  }

  logInitialization() {
    console.log("🚀 Portfolio initialized successfully!");
    console.log("📱 Responsive Navigation: Active");
    console.log("🎨 Dark Mode: Ready");
    console.log("📜 Smooth Scrolling: Enabled");
    console.log("💫 Animations: Loaded");
  }

  getModule(moduleName) {
    return this.modules[moduleName];
  }
}

// Add CSS for project interactions
const projectInteractionStyles = `
  .project-card-hover {
    transform: translateY(-5px) !important;
    transition: transform 0.3s ease !important;
  }
  
  .project-card-touch {
    transform: translateY(-2px) !important;
    transition: transform 0.2s ease !important;
  }
  
  .form-response.success {
    color: #10b981;
    background: #ecfdf5;
    border: 1px solid #10b981;
  }
  
  .form-response.error {
    color: #ef4444;
    background: #fef2f2;
    border: 1px solid #ef4444;
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = projectInteractionStyles;
document.head.appendChild(styleSheet);

// ----- INITIALIZE APPLICATION -----
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the main application
  window.portfolioApp = new PortfolioApp();

  // Add loaded class to body for any post-load animations
  document.body.classList.add("loaded");

  // Remove preloader if exists
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = "0";
      setTimeout(() => preloader.remove(), 500);
    }, 500);
  }
});

// Add resize handler for responsive adjustments
window.addEventListener("resize", function () {
  if (window.portfolioApp && window.portfolioApp.getModule("skills")) {
    const skillsModule = window.portfolioApp.getModule("skills");
    if (skillsModule && skillsModule.hasAnimated) {
      skillsModule.reset();
    }
  }
});

console.log("✨ Portfolio JavaScript loaded successfully!");
