/**
 * Portfolio Core Controller
 * Site: eoajagbe.name.ng
 * Features: High-Agency Motion, Interactive Project Slider, Animated Numbers,
 * Theme Switching, and Mobile Navigation.
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

  const savedTheme = localStorage.getItem('theme') || 'dark';
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
    if (window.scrollY > 50) {
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
     5. Animated Numbers Strip Counter
     -------------------------------------------------------------------------- */
  const numberValues = document.querySelectorAll('.number-value[data-counter]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated || !numberValues.length) return;
    countersAnimated = true;

    numberValues.forEach(el => {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400; // ms
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(easeOutQuad * target);
        el.textContent = current + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      };
      window.requestAnimationFrame(step);
    });
  };

  const numbersSection = document.querySelector('.numbers-strip');
  if (numbersSection && 'IntersectionObserver' in window) {
    const numbersObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          numbersObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    numbersObserver.observe(numbersSection);
  } else {
    animateCounters();
  }

  /* --------------------------------------------------------------------------
     6. Selected Works Interactive Carousel Slider (Touch + Drag + Arrows)
     -------------------------------------------------------------------------- */
  const track = document.getElementById('projects-track');
  const windowEl = document.getElementById('projects-window');
  const prevBtn = document.getElementById('projects-prev');
  const nextBtn = document.getElementById('projects-next');
  const dots = document.querySelectorAll('.slider-dot');
  const cards = document.querySelectorAll('.project-carousel-card');

  if (track && cards.length) {
    let currentIndex = 0;
    const totalCards = cards.length;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
    let animationID = 0;

    const updateSlider = (animate = true) => {
      if (!cards[0]) return;
      const cardRect = cards[0].getBoundingClientRect();
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 32;
      const step = cardRect.width + gap;

      const offset = -(currentIndex * step);
      currentTranslate = offset;
      prevTranslate = offset;

      if (animate) {
        track.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
      } else {
        track.style.transition = 'none';
      }
      track.style.transform = `translateX(${offset}px)`;

      // Update Controls
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex === totalCards - 1;

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider(true);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < totalCards - 1) {
          currentIndex++;
          updateSlider(true);
        }
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const slideIdx = parseInt(dot.getAttribute('data-slide'), 10);
        if (!isNaN(slideIdx) && slideIdx !== currentIndex) {
          currentIndex = slideIdx;
          updateSlider(true);
        }
      });
    });

    // Touch Support
    if (windowEl) {
      windowEl.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        track.style.transition = 'none';
      }, { passive: true });

      windowEl.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        track.style.transform = `translateX(${prevTranslate + diffX}px)`;
      }, { passive: true });

      windowEl.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (diffX < -50 && currentIndex < totalCards - 1) {
          currentIndex++;
        } else if (diffX > 50 && currentIndex > 0) {
          currentIndex--;
        }
        updateSlider(true);
      });

      // Mouse Drag Support on Desktop
      windowEl.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        track.style.transition = 'none';
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diffX = e.clientX - startX;
        track.style.transform = `translateX(${prevTranslate + diffX}px)`;
      });

      window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diffX = e.clientX - startX;

        if (diffX < -60 && currentIndex < totalCards - 1) {
          currentIndex++;
        } else if (diffX > 60 && currentIndex > 0) {
          currentIndex--;
        }
        updateSlider(true);
      });
    }

    window.addEventListener('resize', () => {
      updateSlider(false);
    }, { passive: true });

    updateSlider(false);
  }

  /* --------------------------------------------------------------------------
     7. Scroll-Triggered Entrance Reveals
     -------------------------------------------------------------------------- */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reducedMotion) {
    if (typeof Motion !== 'undefined') {
      // Hero entrance animations
      const heroLine1 = document.querySelector('.hero-line-1');
      const heroLine2 = document.querySelector('.hero-line-2');
      const heroLead = document.querySelector('.hero-lead');
      const heroCtas = document.querySelector('.hero-cta-group');
      const heroPhoto = document.querySelector('.hero-photo-frame');
      const statusPill = document.querySelector('.status-pill');

      if (statusPill) {
        Motion.animate(statusPill, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4, delay: 0.1 });
      }
      if (heroLine1) {
        Motion.animate(heroLine1, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, delay: 0.15, easing: [0.25, 1, 0.5, 1] });
      }
      if (heroLine2) {
        Motion.animate(heroLine2, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, delay: 0.25, easing: [0.25, 1, 0.5, 1] });
      }
      if (heroLead) {
        Motion.animate(heroLead, { opacity: [0, 1], y: [14, 0] }, { duration: 0.4, delay: 0.35 });
      }
      if (heroCtas) {
        Motion.animate(heroCtas, { opacity: [0, 1], y: [12, 0] }, { duration: 0.35, delay: 0.45 });
      }
      if (heroPhoto) {
        Motion.animate(heroPhoto, { opacity: [0, 1], x: [20, 0] }, { duration: 0.6, delay: 0.25, easing: [0.25, 1, 0.5, 1] });
      }
    }

    // Resilient Scroll In-View Observer
    const revealElements = document.querySelectorAll('.reveal-item, .card, .service-row, .testimonial-card, .project-showcase-row, .service-content-wrap, .skill-matrix-col, .timeline-item');
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('is-revealed'));
    }
  }

});