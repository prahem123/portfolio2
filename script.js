/* ==========================================================================
   Eprahem Eliem Portfolio - Main Javascript Interface
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initThemeToggle();
  initScrollReveal();
  initActiveNavTracker();
  initClipboardUtils();
  initProjectModal();
  initContactForm();
});

/* ==========================================================================
   Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking a link
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* ==========================================================================
   Light / Dark Mode Toggle
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    
    // Save state
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    
    // Smooth transition toggle effect feedback
    showToast(`Switched to ${currentTheme.toUpperCase()} theme`, 'info');
  });
}

/* ==========================================================================
   Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  if (reveals.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: stop observing once revealed to retain performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null, // viewport
    threshold: 0.15, // trigger when 15% visible
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   Active Navigation Tracker on Scroll
   ========================================================================== */
function initActiveNavTracker() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (sections.length === 0 || navLinks.length === 0) return;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    root: null,
    threshold: 0.4 // Trigger when 40% of section is visible
  });

  sections.forEach(section => sectionObserver.observe(section));
}

/* ==========================================================================
   Clipboard Copy Utility
   ========================================================================== */
function initClipboardUtils() {
  const emailCard = document.getElementById('emailCard');
  const phoneCard = document.getElementById('phoneCard');

  if (emailCard) {
    emailCard.addEventListener('click', () => {
      const email = emailCard.getAttribute('data-email');
      navigator.clipboard.writeText(email)
        .then(() => {
          showToast('Email address copied to clipboard!', 'success');
        })
        .catch(() => {
          showToast('Failed to copy email automatically.', 'info');
        });
    });
  }

  if (phoneCard) {
    phoneCard.addEventListener('click', () => {
      const phone = phoneCard.getAttribute('data-phone');
      navigator.clipboard.writeText(phone)
        .then(() => {
          showToast('Phone number copied to clipboard!', 'success');
        })
        .catch(() => {
          showToast('Failed to copy phone number automatically.', 'info');
        });
    });
  }
}

/* ==========================================================================
   Toast Notification Builder
   ========================================================================== */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Icon based on type
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
  } else {
    iconSvg = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation reflow
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Remove toast after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

/* ==========================================================================
   Project Modal - Video Editor Simulation Dashboard
   ========================================================================== */
function initProjectModal() {
  const modal = document.getElementById('videoModal');
  const projectCards = document.querySelectorAll('.project-card');
  const closeBtn = document.getElementById('modalCloseBtn');
  const closeDot = document.getElementById('modalCloseDot');
  
  // Player elements
  const modalTitle = document.getElementById('modalProjectTitle');
  const modalPlayerImg = document.getElementById('modalPlayerImage');
  const centerPlayTrigger = document.getElementById('centerPlayTrigger');
  const btnPlay = document.getElementById('btnPlay');
  const playBtnIcon = document.getElementById('playBtnIcon');
  const btnRewind = document.getElementById('btnRewind');
  const btnForward = document.getElementById('btnForward');
  const hudTimecode = document.getElementById('hudTimecode');
  const scrubTimecode = document.getElementById('scrubTimecode');
  const timelinePlayhead = document.getElementById('timelinePlayhead');

  if (!modal || projectCards.length === 0) return;

  // Mock videos dataset mapping (matching card images and tags)
  const projectData = [
    { title: "Source: YouTube Documentary Editing", image: "assets/project_documentary.png" },
    { title: "Source: Social Media Reels Collection", image: "assets/project_reels.png" },
    { title: "Source: Brand Promotional Video", image: "assets/project_promo.png" },
    { title: "Source: Podcast Video Editing", image: "assets/project_promo.png" }, // color adjusted in CSS
    { title: "Source: Educational Content Series", image: "assets/project_documentary.png" }, // color adjusted in CSS
    { title: "Source: Product Advertisement Videos", image: "assets/project_reels.png" }, // color adjusted in CSS
    { title: "Source: Personal Branding Content", image: "assets/about_me_visual.png" }
  ];

  let isPlaying = false;
  let playheadPercent = 0; // 0 to 100
  let playInterval = null;
  const mockDurationSeconds = 135; // 2 mins 15 secs

  // Open modal
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const index = parseInt(card.getAttribute('data-project'), 10);
      const data = projectData[index];

      if (data) {
        modalTitle.textContent = data.title;
        modalPlayerImg.src = data.image;
        
        // Reset styles for colored projects
        modalPlayerImg.style.filter = card.querySelector('.project-card-image img').style.filter;
        
        resetPlayback();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock main scroll
        
        showToast('Entering Interactive Timeline Monitor', 'info');
      }
    });
  });

  // Close modal
  const closeModalFunc = () => {
    pausePlayback();
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock main scroll
  };

  closeBtn.addEventListener('click', closeModalFunc);
  closeDot.addEventListener('click', closeModalFunc);
  
  // Close clicking outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
  });

  // Esc Key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModalFunc();
    }
  });

  // Playback Control Handlers
  centerPlayTrigger.addEventListener('click', togglePlayback);
  btnPlay.addEventListener('click', togglePlayback);
  
  btnRewind.addEventListener('click', () => {
    resetPlayback();
    showToast('Reset timeline keyframes', 'info');
  });

  btnForward.addEventListener('click', () => {
    playheadPercent = Math.min(playheadPercent + 20, 100);
    updatePlayheadUI();
    showToast('Fast Forwarded 30 seconds', 'info');
  });

  // Toggle playback status
  function togglePlayback() {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }

  // Start playback loops
  function startPlayback() {
    isPlaying = true;
    centerPlayTrigger.classList.add('playing');
    btnPlay.classList.add('active');
    // Change SVG path of playBtnIcon to Pause
    playBtnIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;

    // Timeline Scrub Animation Loop (runs at ~30 FPS mock rate)
    playInterval = setInterval(() => {
      // Advance by small amount (approx 1% per 100ms means 10s total scrub)
      playheadPercent += 0.5;

      if (playheadPercent >= 100) {
        playheadPercent = 0; // Loop timeline
      }

      updatePlayheadUI();
    }, 50);
  }

  // Pause playback
  function pausePlayback() {
    isPlaying = false;
    centerPlayTrigger.classList.remove('playing');
    btnPlay.classList.remove('active');
    // Change SVG path of playBtnIcon back to Play
    playBtnIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`;

    if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
    }
  }

  // Reset playback values
  function resetPlayback() {
    pausePlayback();
    playheadPercent = 0;
    updatePlayheadUI();
  }

  // Synchronize Playhead position & Timecode HUDs
  function updatePlayheadUI() {
    timelinePlayhead.style.left = `${playheadPercent}%`;
    
    // Time calculations
    const elapsedSeconds = Math.floor((playheadPercent / 100) * mockDurationSeconds);
    const m = Math.floor(elapsedSeconds / 60);
    const s = elapsedSeconds % 60;
    const frames = Math.floor((playheadPercent % 5) * 6); // Mock frame rates 0-29

    // Pad values
    const pad = (n) => String(n).padStart(2, '0');
    
    const timeString = `${pad(m)}:${pad(s)}`;
    const timecodeString = `00:${pad(m)}:${pad(s)}:${pad(frames)}`;

    scrubTimecode.textContent = timeString;
    hudTimecode.textContent = timecodeString;
  }
}

/* ==========================================================================
   HTML Contact Form Validator & simulated Submission Toast
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop normal post

    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const project = document.getElementById('formProject').value;
    const message = document.getElementById('formMessage').value.trim();

    // Secondary validation checking empty strings
    if (!name || !email || !project || !message) {
      showToast('Please fill in all form details.', 'info');
      return;
    }

    // Success response
    showToast(`Thanks, ${name}! Your request has been sent successfully.`, 'success');
    
    // Reset Form fields
    form.reset();
  });
}
