/* ----- NAVIGATION BAR FUNCTION ----- */
   function myMenuFunction() {
    var menuBtn = document.getElementById("myNavMenu");

    // Toggle the 'responsive' class to open/close the menu
    if (menuBtn.classList.contains("responsive")) {
        menuBtn.classList.remove("responsive");
    } else {
        menuBtn.classList.add("responsive");
    }
}

function closeMenuOnClick() {
    var menuBtn = document.getElementById("myNavMenu");
    menuBtn.classList.remove("responsive");
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); 
        const targetId = this.getAttribute('href'); // Get the target section ID (e.g., #contact)
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' }); 
        closeMenuOnClick(); 
    });
});


/* ----- ADD SHADOW ON NAVIGATION BAR WHILE SCROLLING ----- */
    window.onscroll = function() {headerShadow()};

    function headerShadow() {
      const navHeader =document.getElementById("header");

      if (document.body.scrollTop > 50 || document.documentElement.scrollTop >  50) {

        navHeader.style.boxShadow = "0 1px 6px rgba(0, 0, 0, 0.1)";
        navHeader.style.height = "70px";
        navHeader.style.lineHeight = "70px";

      } else {

        navHeader.style.boxShadow = "none";
        navHeader.style.height = "90px";
        navHeader.style.lineHeight = "90px";

      }
    }


/* ----- TYPING EFFECT ----- */
   var typingEffect = new Typed(".typedText",{
      strings : ["Future Engineer","Programmer","Future Developer"],
      loop : true,
      typeSpeed : 100, 
      backSpeed : 80,
      backDelay : 1000
   })


/* ----- ## -- SCROLL REVEAL ANIMATION -- ## ----- */
   const sr = ScrollReveal({
          origin: 'top',
          distance: '80px',
          duration: 2000,
          reset: true     
   })

  /* -- HOME -- */
  sr.reveal('.featured-text-card',{})
  sr.reveal('.featured-name',{delay: 100})
  sr.reveal('.featured-text-info',{delay: 200})
  sr.reveal('.featured-text-btn',{delay: 200})
  sr.reveal('.social-icons',{delay: 200})
  sr.reveal('.featured-image',{delay: 300})
  

  /* -- PROJECT BOX -- */
  sr.reveal('.project-box',{interval: 200})

  /* -- HEADINGS -- */
  sr.reveal('.top-header',{})

/* ----- ## -- SCROLL REVEAL LEFT_RIGHT ANIMATION -- ## ----- */

  /* -- ABOUT INFO & CONTACT INFO -- */
  const srLeft = ScrollReveal({
    origin: 'left',
    distance: '80px',
    duration: 2000,
    reset: true
  })
  
  srLeft.reveal('.about-info',{delay: 100})
  srLeft.reveal('.contact-info',{delay: 100})

  /* -- ABOUT SKILLS & FORM BOX -- */
  const srRight = ScrollReveal({
    origin: 'right',
    distance: '80px',
    duration: 2000,
    reset: true
  })
  
  srRight.reveal('.skills-box',{delay: 100})
  srRight.reveal('.form-control',{delay: 100})
  


/* ----- CHANGE ACTIVE LINK ----- */
  
  const sections = document.querySelectorAll('section[id]')

  function scrollActive() {
    const scrollY = window.scrollY;

    sections.forEach(current =>{
      const sectionHeight = current.offsetHeight,
          sectionTop = current.offsetTop - 50,
        sectionId = current.getAttribute('id')

      if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) { 

          document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active-link')

      }  else {

        document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active-link')

      }
    })
  }

  window.addEventListener('scroll', scrollActive);
const darkModeToggle = document.querySelector('.dark-mode-toggle');
// Theme toggle variables
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const darkModeIcon = document.getElementById('darkModeIcon');
const DARK_MODE_CLASS = 'dark-mode';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';
const MOON_ICON_CLASS = 'uil-moon';
const SUN_ICON_CLASS = 'uil-sun';

// Function to update the theme icon
function updateIcon(isDarkMode) {
    if (isDarkMode) {
        darkModeIcon.classList.replace(MOON_ICON_CLASS, SUN_ICON_CLASS);
    } else {
        darkModeIcon.classList.replace(SUN_ICON_CLASS, MOON_ICON_CLASS);
    }
}


function toggleTheme() {
    const isDarkMode = document.body.classList.toggle(DARK_MODE_CLASS);
    localStorage.setItem('theme', isDarkMode ? DARK_THEME : LIGHT_THEME);
    updateIcon(isDarkMode);
}


document.addEventListener('DOMContentLoaded', () => {
   
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === DARK_THEME;

    // Apply the saved theme right away
    if (isDarkMode) {
        document.body.classList.add(DARK_MODE_CLASS);
    } else {
        document.body.classList.remove(DARK_MODE_CLASS); 
    }

    updateIcon(isDarkMode);
});

// Event listener for the toggle button
darkModeToggle.addEventListener('click', toggleTheme);



    /* -- FORM-BUTTON SECTION-- */
  document.getElementById('contact-form').onsubmit = function(event) {
    event.preventDefault(); 
    
    const formData = new FormData(this);
    
    fetch('form.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            console.log("Fetch response error:", response.statusText);
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Response Data:', data);
        const formResponse = document.getElementById('form-response');
        formResponse.style.display = 'block';
        formResponse.textContent = data.message;
        formResponse.style.color = data.status === 'success' ? 'green' : 'red';
        if (data.status === 'success') {
            this.reset(); // Reset form on success
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        alert('Sorry ! An error occurred.');
    });
};

  /* -- DOWNLOAD CV SECTION -- */
  document.getElementById('downloadCvButton').addEventListener('click', function() {
    window.location.href = 'shekharbhatt-resume.pdf';
});

document.getElementById('downloadCvButtonFeatured').addEventListener('click', function() {
    window.location.href = 'shekharbhatt-resume.pdf';
});

document.getElementById('downloadCvButtonAbout').addEventListener('click', function() {
    window.location.href = 'shekharbhatt-resume.pdf';
});
