// script.js - Complete JavaScript for Elite Dental

// ===== DOM CONTENT LOADED =====
document.addEventListener("DOMContentLoaded", function () {
  initializeWebsite();
});

// ===== INITIALIZATION FUNCTION =====
function initializeWebsite() {
  // Hide loading screen after page loads
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.classList.add("fade-out");
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }
  }, 1000);

  // Initialize all components
  initMobileMenu();
  initSmoothScrolling();
  initBackToTop();
  initTestimonials();
  initServiceModals();
  initAppointmentForm();
  initCookieConsent();
  initScrollAnimations();
  setMinDateForAppointment();
}

// ===== MOBILE MENU FUNCTIONALITY =====
function initMobileMenu() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");
      mobileMenu.classList.toggle("hidden");

      // Update aria-expanded attribute
      const isExpanded = mobileMenu.classList.contains("active");
      mobileMenuButton.setAttribute("aria-expanded", isExpanded);

      // Change icon based on menu state
      const icon = mobileMenuButton.querySelector("i");
      if (icon) {
        icon.className = isExpanded
          ? "fas fa-times text-2xl"
          : "fas fa-bars text-2xl";
      }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        mobileMenu.classList.add("hidden");
        mobileMenuButton.setAttribute("aria-expanded", "false");
        const icon = mobileMenuButton.querySelector("i");
        if (icon) {
          icon.className = "fas fa-bars text-2xl";
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !mobileMenu.contains(event.target) &&
        !mobileMenuButton.contains(event.target) &&
        mobileMenu.classList.contains("active")
      ) {
        mobileMenu.classList.remove("active");
        mobileMenu.classList.add("hidden");
        mobileMenuButton.setAttribute("aria-expanded", "false");
        const icon = mobileMenuButton.querySelector("i");
        if (icon) {
          icon.className = "fas fa-bars text-2xl";
        }
      }
    });
  }
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Skip if it's a button or has a specific class that should prevent scrolling
      if (this.tagName === "BUTTON" || this.classList.contains("no-scroll"))
        return;

      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Close mobile menu if open
        const mobileMenu = document.getElementById("mobile-menu");
        const mobileMenuButton = document.getElementById("mobile-menu-button");
        if (mobileMenu && mobileMenu.classList.contains("active")) {
          mobileMenu.classList.remove("active");
          mobileMenu.classList.add("hidden");
          mobileMenuButton.setAttribute("aria-expanded", "false");
          const icon = mobileMenuButton.querySelector("i");
          if (icon) {
            icon.className = "fas fa-bars text-2xl";
          }
        }
      }
    });
  });
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
  const backToTopButton = document.getElementById("back-to-top");

  if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("visible");
        backToTopButton.classList.remove("hidden");
      } else {
        backToTopButton.classList.remove("visible");
        backToTopButton.classList.add("hidden");
      }
    });

    // Scroll to top when clicked
    backToTopButton.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// ===== TESTIMONIALS CAROUSEL =====
function initTestimonials() {
  // Testimonial data
  const testimonials = [
    {
      name: "Jennifer Martinez",
      role: "Patient for 5 years",
      content:
        "Elite Dental transformed my smile and my confidence. The team is incredibly professional and makes every visit comfortable. I actually look forward to my dental appointments now!",
      rating: 5,
    },
    {
      name: "Robert Chen",
      role: "New Patient",
      content:
        "As someone with dental anxiety, I was nervous about my first visit. The staff was so understanding and gentle. They explained everything step by step. Highly recommend!",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      role: "Family Patient",
      content:
        "We bring our entire family here. The kids love the friendly environment, and we appreciate the thorough care. The dental store is a bonus - we get all our oral care products here.",
      rating: 5,
    },
    {
      name: "Michael Thompson",
      role: "Emergency Patient",
      content:
        "When I had a dental emergency on a weekend, Elite Dental accommodated me immediately. The care was exceptional and relieved my pain quickly. Thank you!",
      rating: 5,
    },
    {
      name: "Emily Wilson",
      role: "Cosmetic Patient",
      content:
        "I'm thrilled with my smile makeover! The cosmetic dentistry results exceeded my expectations. The team listened to my goals and delivered beautiful, natural-looking results.",
      rating: 5,
    },
  ];

  // Initialize mobile testimonial slider
  initMobileTestimonialSlider(testimonials);
}

function initMobileTestimonialSlider(testimonials) {
  const track = document.getElementById("testimonial-track");
  const dotsContainer = document.getElementById("testimonial-dots");
  const prevBtn = document.getElementById("testimonial-prev");
  const nextBtn = document.getElementById("testimonial-next");

  if (!track || !dotsContainer) return;

  // Clear existing content
  track.innerHTML = "";
  dotsContainer.innerHTML = "";

  let currentSlide = 0;

  // Create slides
  testimonials.forEach((testimonial, index) => {
    // Create slide
    const slide = document.createElement("div");
    slide.className = "testimonial-slide flex-shrink-0 w-full";
    slide.innerHTML = createTestimonialHTML(testimonial);
    track.appendChild(slide);

    // Create dot
    const dot = document.createElement("button");
    dot.className = `testimonial-dot ${index === 0 ? "active" : ""}`;
    dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const slides = track.querySelectorAll(".testimonial-slide");
  const dots = dotsContainer.querySelectorAll(".testimonial-dot");

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });
  }

  // Navigation
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentSlide =
        (currentSlide - 1 + testimonials.length) % testimonials.length;
      goToSlide(currentSlide);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % testimonials.length;
      goToSlide(currentSlide);
    });
  }

  // Auto-advance
  let autoSlide = setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonials.length;
    goToSlide(currentSlide);
  }, 5000);

  // Pause on hover
  if (track) {
    track.addEventListener("mouseenter", () => clearInterval(autoSlide));
    track.addEventListener("mouseleave", () => {
      autoSlide = setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        goToSlide(currentSlide);
      }, 5000);
    });
  }

  // Show first testimonial
  goToSlide(0);
}

function createTestimonialHTML(testimonial) {
  let stars = "";
  for (let i = 0; i < testimonial.rating; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  return `
        <div class="text-center h-full flex flex-col p-6">
            <div class="text-teal-600 text-3xl mb-4">
                <i class="fas fa-quote-left opacity-50"></i>
            </div>
            <p class="text-gray-600 mb-6 leading-relaxed flex-grow">"${testimonial.content}"</p>
            <div class="flex text-yellow-400 text-lg mb-3 justify-center">
                ${stars}
            </div>
            <div class="mt-auto">
                <h4 class="font-semibold text-teal-800 text-lg">${testimonial.name}</h4>
                <p class="text-gray-500 text-sm mt-1">${testimonial.role}</p>
            </div>
        </div>
    `;
}

// ===== SERVICE MODALS =====
function initServiceModals() {
  const modal = document.getElementById("service-modal");
  const modalContent = document.getElementById("service-modal-content");
  const closeButton = document.getElementById("close-service-modal");
  const learnMoreButtons = document.querySelectorAll(".learn-more-btn");

  if (!modal || !modalContent || !closeButton) return;

  // Service content data
  const serviceContent = {
    preventive: `
            <h3 class="text-2xl font-semibold text-teal-800 mb-4">Preventive Care</h3>
            <p class="text-gray-600 mb-4">Regular dental check-ups and cleanings are essential for maintaining optimal oral health and preventing future dental problems.</p>
            <ul class="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>Comprehensive oral examinations</li>
                <li>Professional teeth cleaning</li>
                <li>Digital X-rays for accurate diagnosis</li>
                <li>Oral cancer screening</li>
                <li>Fluoride treatment to strengthen enamel</li>
                <li>Dental sealants for cavity prevention</li>
                <li>Personalized oral hygiene instruction</li>
            </ul>
            <p class="text-gray-600 mb-6">Our preventive care services help detect issues early, saving you time, money, and discomfort in the long run.</p>
            <div class="bg-teal-50 p-4 rounded-lg">
                <h4 class="font-semibold text-teal-800 mb-2">Recommended For:</h4>
                <p class="text-gray-600">Everyone - children, adults, and seniors. We recommend visits every 6 months for optimal oral health.</p>
            </div>
        `,
    cosmetic: `
            <h3 class="text-2xl font-semibold text-teal-800 mb-4">Cosmetic Dentistry</h3>
            <p class="text-gray-600 mb-4">Enhance your smile and boost your confidence with our comprehensive cosmetic dentistry services.</p>
            <ul class="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>Professional teeth whitening for a brighter smile</li>
                <li>Dental veneers to correct imperfections</li>
                <li>Composite bonding for minor repairs</li>
                <li>Invisalign clear aligners for discreet straightening</li>
                <li>Dental crowns to restore damaged teeth</li>
                <li>Gum contouring for balanced aesthetics</li>
                <li>Complete smile makeovers</li>
            </ul>
            <p class="text-gray-600 mb-6">We offer personalized treatment plans to help you achieve the beautiful, natural-looking smile you deserve.</p>
            <div class="bg-teal-50 p-4 rounded-lg">
                <h4 class="font-semibold text-teal-800 mb-2">Recommended For:</h4>
                <p class="text-gray-600">Anyone looking to improve the appearance of their smile, correct discoloration, chips, gaps, or misalignment.</p>
            </div>
        `,
    restorative: `
            <h3 class="text-2xl font-semibold text-teal-800 mb-4">Restorative Services</h3>
            <p class="text-gray-600 mb-4">Restore function and appearance to damaged or missing teeth with our advanced restorative treatments.</p>
            <ul class="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>Tooth-colored dental fillings</li>
                <li>Crowns and bridges for damaged or missing teeth</li>
                <li>Dental implants as permanent tooth replacements</li>
                <li>Root canal therapy to save infected teeth</li>
                <li>Dentures and partials for multiple missing teeth</li>
                <li>Dental inlays and onlays for moderate damage</li>
                <li>Full mouth reconstruction for comprehensive restoration</li>
            </ul>
            <p class="text-gray-600 mb-6">Our restorative services use the latest materials and techniques to ensure durable, natural-looking results that restore your ability to eat, speak, and smile with confidence.</p>
            <div class="bg-teal-50 p-4 rounded-lg">
                <h4 class="font-semibold text-teal-800 mb-2">Recommended For:</h4>
                <p class="text-gray-600">Patients with damaged, decayed, or missing teeth who want to restore function and aesthetics.</p>
            </div>
        `,
  };

  // Open modal when Learn More is clicked
  learnMoreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const service = this.getAttribute("data-service");
      if (serviceContent[service]) {
        modalContent.innerHTML = serviceContent[service];
        modal.classList.remove("hidden");
        modal.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      }
    });
  });

  // Close modal when X is clicked
  closeButton.addEventListener("click", closeModal);

  // Close modal when clicking outside content
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove("active");
    modal.classList.add("hidden");
    document.body.style.overflow = ""; // Restore scrolling
  }
}

// ===== APPOINTMENT FORM =====
function initAppointmentForm() {
  const form = document.getElementById("appointment-form");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      service: document.getElementById("service").value,
      date: document.getElementById("appointment-date").value,
      time: document.getElementById("appointment-time").value,
      message: document.getElementById("message").value,
    };

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      showNotification("Please fill in all required fields.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      showNotification("Please enter a valid phone number.", "error");
      return;
    }

    // Simulate form submission
    simulateFormSubmission(formData);
  });

  // Format phone number as user types
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 0) {
        value = value.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !value[2]
          ? value[1]
          : "(" + value[1] + ") " + value[2] + (value[3] ? "-" + value[3] : "");
      }
    });
  }
}

function simulateFormSubmission(formData) {
  // Show loading state
  const submitButton = document.querySelector(
    '#appointment-form button[type="submit"]'
  );
  const originalText = submitButton.textContent;
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
  submitButton.disabled = true;

  // Simulate API call
  setTimeout(() => {
    // Show success message
    showNotification(
      "Thank you! Your appointment request has been sent. We will contact you shortly to confirm.",
      "success"
    );

    // Reset form
    document.getElementById("appointment-form").reset();
    setMinDateForAppointment();

    // Restore button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;

    // For demo purposes, log the form data
    console.log("Appointment Request:", formData);
  }, 2000);
}

function setMinDateForAppointment() {
  const dateInput = document.getElementById("appointment-date");
  if (dateInput) {
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];
    dateInput.setAttribute("min", minDate);

    // Set default to tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];
    dateInput.value = tomorrowFormatted;
  }
}

// ===== COOKIE CONSENT =====
function initCookieConsent() {
  const cookieBanner = document.getElementById("cookie-consent");
  const acceptButton = document.getElementById("accept-cookies");

  // Check if user has already accepted cookies
  if (getCookie("cookies-accepted") !== "true") {
    // Show banner after a short delay
    setTimeout(() => {
      if (cookieBanner) {
        cookieBanner.classList.remove("hidden");
        cookieBanner.classList.add("visible");
      }
    }, 2000);
  }

  if (acceptButton) {
    acceptButton.addEventListener("click", function () {
      // Set cookie expiry to 1 year from now
      setCookie("cookies-accepted", "true", 365);

      if (cookieBanner) {
        cookieBanner.classList.remove("visible");
        setTimeout(() => {
          cookieBanner.classList.add("hidden");
        }, 300);
      }

      showNotification("Cookie preferences saved.", "success");
    });
  }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  // Add scroll-triggered animations to elements
  const animatedElements = document.querySelectorAll(
    ".service-card, .team-card, .stat-card"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Header scroll effect
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300 ${
    type === "success"
      ? "bg-green-500 text-white"
      : type === "error"
      ? "bg-red-500 text-white"
      : "bg-blue-500 text-white"
  }`;

  notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
              type === "success"
                ? "fa-check-circle"
                : type === "error"
                ? "fa-exclamation-circle"
                : "fa-info-circle"
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove("translate-x-full");
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// ===== UTILITY FUNCTIONS =====
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// ===== ENHANCE USER EXPERIENCE =====
// Add subtle animation to service cards on hover
document.addEventListener("DOMContentLoaded", function () {
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Add animation to team cards
  const teamCards = document.querySelectorAll(".team-card");

  teamCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const image = this.querySelector('div[class*="h-64"]');
      if (image) {
        image.style.transform = "scale(1.05)";
      }
    });

    card.addEventListener("mouseleave", function () {
      const image = this.querySelector('div[class*="h-64"]');
      if (image) {
        image.style.transform = "scale(1)";
      }
    });
  });
});

// ===== EMERGENCY BANNER PULSE EFFECT =====
document.addEventListener("DOMContentLoaded", function () {
  const emergencyBanner = document.querySelector(".emergency-banner");
  if (emergencyBanner) {
    setInterval(() => {
      emergencyBanner.style.animation = "none";
      setTimeout(() => {
        emergencyBanner.style.animation = "pulse 2s infinite";
      }, 10);
    }, 4000);
  }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images that are not in viewport
document.addEventListener("DOMContentLoaded", function () {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Add keyboard navigation to all interactive elements
document.addEventListener("DOMContentLoaded", function () {
  // Make all buttons and links focusable with keyboard
  const interactiveElements = document.querySelectorAll(
    "button, a, input, select, textarea"
  );

  interactiveElements.forEach((element) => {
    element.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });
});

// ===== FORM ENHANCEMENTS =====
// Add real-time validation to form fields
document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  if (nameInput) {
    nameInput.addEventListener("blur", function () {
      if (this.value.length < 2) {
        this.classList.add("border-red-500");
        showNotification("Please enter your full name", "error");
      } else {
        this.classList.remove("border-red-500");
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.value)) {
        this.classList.add("border-red-500");
        showNotification("Please enter a valid email address", "error");
      } else {
        this.classList.remove("border-red-500");
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("blur", function () {
      const cleanPhone = this.value.replace(/\D/g, "");
      if (cleanPhone.length < 10) {
        this.classList.add("border-red-500");
        showNotification("Please enter a valid phone number", "error");
      } else {
        this.classList.remove("border-red-500");
      }
    });
  }
});

// ===== OFFLINE DETECTION =====
window.addEventListener("online", function () {
  showNotification("Connection restored", "success");
});

window.addEventListener("offline", function () {
  showNotification(
    "You are currently offline. Some features may not work.",
    "error"
  );
});

// ===== PRINT STYLES =====
window.addEventListener("beforeprint", function () {
  // Hide elements that shouldn't be printed
  document
    .querySelectorAll(
      ".theme-selector, #back-to-top, #cookie-consent, .emergency-banner"
    )
    .forEach((el) => {
      el.style.display = "none";
    });
});

window.addEventListener("afterprint", function () {
  // Restore elements after printing
  document
    .querySelectorAll(
      ".theme-selector, #back-to-top, #cookie-consent, .emergency-banner"
    )
    .forEach((el) => {
      el.style.display = "";
    });
});

// Export functions for potential use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initializeWebsite,
    changeTheme,
    showNotification,
  };
}
