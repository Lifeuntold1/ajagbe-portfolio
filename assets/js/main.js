/**
 * Portfolio Core Controller
 * Site: eoajagbe.name.ng
 * Stack: HTML5 · CSS3 · Vanilla JS · Emil Kowalski motion library
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Theme Toggle & Persistence
     -------------------------------------------------------------------------- */
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  const updateThemeUI = (theme) => {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☀';
    } else {
      root.removeAttribute('data-theme');
      if (themeIcon) themeIcon.textContent = '☾';
    }
  };

  const savedTheme = localStorage.getItem('theme') || 'light';
  updateThemeUI(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      updateThemeUI(nextTheme);
    });
  }

  /* --------------------------------------------------------------------------
     2. Nav Scroll Behavior
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Overlay
     -------------------------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  const closeMobileMenu = () => {
    document.body.classList.remove('nav-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  };

  const openMobileMenu = () => {
    document.body.classList.add('nav-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = document.body.classList.contains('nav-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeMobileMenu();
    }
  });

  /* --------------------------------------------------------------------------
     4. Dynamic Footer Year
     -------------------------------------------------------------------------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     5. Motion Animations (Guarded for Reduced Motion)
     -------------------------------------------------------------------------- */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reducedMotion && typeof Motion !== 'undefined') {

    // --- Hero Entrance Animation (Homepage) ---
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      const line1 = document.querySelector('.hero-line-1');
      const line2 = document.querySelector('.hero-line-2');
      const lead = document.querySelector('.hero-lead');
      const ctas = document.querySelector('.hero-cta-group');
      const photo = document.querySelector('.hero-photo-frame');
      const dotGrid = document.querySelector('.hero-dot-grid');

      if (dotGrid) {
        Motion.animate(dotGrid, { opacity: [0, 1] }, { duration: 0.8, delay: 0 });
      }

      if (line1) {
        Motion.animate(line1, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, easing: [0.25, 1, 0.5, 1] });
      }

      if (line2) {
        Motion.animate(line2, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, delay: 0.1, easing: [0.25, 1, 0.5, 1] });
      }

      if (photo) {
        Motion.animate(photo, { opacity: [0, 1], x: [20, 0] }, { duration: 0.6, delay: 0.2 });
      }

      if (lead) {
        Motion.animate(lead, { opacity: [0, 1], y: [16, 0] }, { duration: 0.4, delay: 0.3 });
      }

      if (ctas) {
        Motion.animate(ctas, { opacity: [0, 1], y: [12, 0] }, { duration: 0.3, delay: 0.5 });
      }
    }

    // --- Subtle Section Reveals ---
    const revealItems = document.querySelectorAll('.reveal-item');
    revealItems.forEach(el => {
      Motion.inView(el, (info) => {
        Motion.animate(info.target, { opacity: [0, 1], y: [12, 0] }, { duration: 0.6, easing: [0.25, 1, 0.5, 1] });
      }, { margin: "-10% 0px" });
    });

    // --- Service Area Rows Reveal (Sequential) ---
    const serviceRowsWrap = document.querySelector('.services-rows');
    if (serviceRowsWrap) {
      const rows = serviceRowsWrap.querySelectorAll('.service-row');
      Motion.inView(serviceRowsWrap, () => {
        rows.forEach((row, i) => {
          Motion.animate(row, { opacity: [0, 1], y: [8, 0] }, { duration: 0.4, delay: i * 0.08, easing: [0.25, 1, 0.5, 1] });
        });
      }, { margin: "-10% 0px" });
    }

    // --- Statement Section Reveal ---
    const statementSection = document.querySelector('.statement-section');
    if (statementSection) {
      const quote = statementSection.querySelector('.statement-quote');
      const footnote = statementSection.querySelector('.statement-footnote');

      Motion.inView(statementSection, () => {
        if (quote) {
          Motion.animate(quote, { opacity: [0, 1], y: [12, 0] }, { duration: 0.6, easing: [0.25, 1, 0.5, 1] });
        }
        if (footnote) {
          Motion.animate(footnote, { opacity: [0, 1] }, { duration: 0.5, delay: 0.2 });
        }
      }, { margin: "-10% 0px" });
    }

    // --- Project Card Stagger on Mobile / Projects Page ---
    const projectCards = document.querySelectorAll('.project-showcase-row, .testimonial-card');
    projectCards.forEach((card, index) => {
      Motion.inView(card, (info) => {
        Motion.animate(info.target, { opacity: [0, 1], y: [16, 0] }, { duration: 0.5, delay: (index % 3) * 0.1 });
      }, { margin: "-5% 0px" });
    });

  }

  /* --------------------------------------------------------------------------
     6. Homepage Project Merry-Go-Round Carousel (Motion.scroll)
     -------------------------------------------------------------------------- */
  const projectsSection = document.querySelector('.projects-section');
  const projectsTrack = document.querySelector('.projects-track');
  let scrollUnsubscribe = null;

  function setupProjectsCarousel() {
    if (scrollUnsubscribe) {
      scrollUnsubscribe();
      scrollUnsubscribe = null;
    }

    if (!projectsSection || !projectsTrack) return;

    if (window.innerWidth < 769 || reducedMotion || typeof Motion === 'undefined') {
      projectsTrack.style.transform = '';
      return;
    }

    scrollUnsubscribe = Motion.scroll(
      ({ y }) => {
        const progress = y.progress;
        const maxTranslate = -(projectsTrack.scrollWidth - window.innerWidth + 80);
        projectsTrack.style.transform = `translateX(${progress * maxTranslate}px)`;
      },
      { target: projectsSection, offset: ["start start", "end end"] }
    );
  }

  setupProjectsCarousel();
  window.addEventListener('resize', () => {
    setupProjectsCarousel();
  }, { passive: true });

});