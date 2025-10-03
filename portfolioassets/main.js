// ----- MODERN PORTFOLIO MANAGER -----
class PortfolioApp {
  constructor() {
    this.modules = new Map();
    this.init();
  }

  init() {
    this.initializeModules();
    this.setupGlobalHandlers();
    console.log("🚀 Portfolio initialized");
  }

  initializeModules() {
    const modules = {
      navigation: NavigationManager,
      scroll: ScrollManager,
      theme: ThemeManager,
      animations: AnimationManager,
      contact: ContactManager,
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

    // Error boundary
    window.addEventListener("error", (e) => console.error("Global error:", e));
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

// ----- CONTACT MANAGER -----
class ContactManager {
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

    // Real-time validation
    this.form.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearError(input));
    });
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
          message = "Valid email required";
        }
        break;
      case "text":
        if (field.id === "name" && value.length < 2) {
          isValid = false;
          message = "Name too short";
        }
        break;
      default:
        if (!value && field.required) {
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

    const error = document.createElement("div");
    error.className = "field-error";
    error.textContent = message;
    field.parentNode.appendChild(error);
  }

  showSuccess(field) {
    this.clearStatus(field);
    field.classList.add("success");
  }

  clearStatus(field) {
    field.classList.remove("error", "success");
    field.parentNode.querySelector(".field-error")?.remove();
  }

  clearError(field) {
    if (field.value.trim()) this.clearStatus(field);
  }

  async handleSubmit(event) {
    event.preventDefault();

    const isValid = Array.from(this.form.elements)
      .filter((el) => el.tagName !== "BUTTON")
      .every((field) => this.validateField(field));

    if (!isValid) {
      this.showMessage("Please fix errors above", "error");
      return;
    }

    try {
      this.setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      this.showMessage("Message sent successfully!", "success");
      this.form.reset();
      this.clearAllStatuses();
    } catch (error) {
      this.showMessage("Failed to send message", "error");
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    const btn = this.form.querySelector('button[type="submit"]');
    if (!btn) return;

    btn.disabled = loading;
    btn.textContent = loading ? "Sending..." : "Send Message";
  }

  showMessage(text, type) {
    const existing = document.getElementById("form-response");
    existing?.remove();

    const message = document.createElement("div");
    message.id = "form-response";
    message.className = `form-response ${type}`;
    message.textContent = text;

    this.form.appendChild(message);
    setTimeout(() => message.remove(), 5000);
  }

  clearAllStatuses() {
    this.form.querySelectorAll("input, textarea").forEach((field) => {
      this.clearStatus(field);
    });
  }
}

// ----- ENHANCED STYLES -----
const modernStyles = `
  /* Modern interactions */
  .project-card {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .project-card:hover {
    transform: translateY(-8px) scale(1.02);
  }
  
  /* Form enhancements */
  .form-input.error {
    border-color: #ef4444;
    background: #fef2f2;
  }
  
  .form-input.success {
    border-color: #10b981;
    background: #f0fdf4;
  }
  
  .field-error {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
  
  .form-response {
    padding: 1rem;
    border-radius: 0.5rem;
    margin-top: 1rem;
    font-weight: 600;
  }
  
  .form-response.success {
    background: #ecfdf5;
    color: #10b981;
    border: 1px solid #10b981;
  }
  
  .form-response.error {
    background: #fef2f2;
    color: #ef4444;
    border: 1px solid #ef4444;
  }
  
  /* Smooth transitions */
  .theme-transition * {
    transition: background-color 0.3s ease, color 0.3s ease !important;
  }
  
  /* Skill animations */
  .skill-progress {
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Back to top button */
  #backToTop {
    transition: all 0.3s ease;
  }
  
  #backToTop.visible {
    opacity: 1;
    transform: scale(1);
  }
`;

// Inject styles
const style = document.createElement("style");
style.textContent = modernStyles;
document.head.appendChild(style);

// ----- INITIALIZATION -----
document.addEventListener("DOMContentLoaded", () => {
  window.portfolioApp = new PortfolioApp();

  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 100);
});

console.log("✨ Modern Portfolio JS loaded");
