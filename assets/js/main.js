/**
 * AJAGBE EMMANUEL OLUWATOBI — PORTFOLIO CLIENT ENGINE
 * Concept: Physicist who builds the web. Mathematical precision & human warmth.
 * Mobile-First · Touch-Friendly Carousel · Smooth Transitions · Zero Layout Shifts
 */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------------------
     1. THEME TOGGLE (Night / Paper with smooth persistence)
     -------------------------------------------------------------------------- */
  function initTheme() {
    const savedTheme = localStorage.getItem("eo_theme") || "night";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const toggles = document.querySelectorAll(".theme-toggle-btn");
    toggles.forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "night";
        const next = current === "night" ? "paper" : "night";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("eo_theme", next);

        // Update button aria label
        btn.setAttribute("aria-label", `Switch to ${next === "night" ? "light" : "dark"} mode`);
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. AFRICA / LAGOS LIVE CLOCK
     -------------------------------------------------------------------------- */
  function initLagosClock() {
    const clockEls = document.querySelectorAll(".lagos-clock");
    if (!clockEls.length) return;

    function update() {
      try {
        const now = new Date();
        const options = {
          timeZone: "Africa/Lagos",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        };
        const formatter = new Intl.DateTimeFormat("en-GB", options);
        const timeStr = formatter.format(now);
        clockEls.forEach((el) => {
          el.textContent = `${timeStr} WAT`;
        });
      } catch (e) {
        // Fallback
        const now = new Date();
        clockEls.forEach((el) => {
          el.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")} WAT`;
        });
      }
    }

    update();
    setInterval(update, 1000);
  }

  /* --------------------------------------------------------------------------
     3. ROLE ROTATOR (Clean word transitions — NO character breaking)
     -------------------------------------------------------------------------- */
  function initRoleRotator() {
    const rotatorCell = document.querySelector(".rotator-cell");
    if (!rotatorCell) return;

    const words = rotatorCell.querySelectorAll(".rotator-word");
    if (words.length <= 1) return;

    let currentIndex = 0;
    const intervalMs = 2800;

    setInterval(() => {
      words[currentIndex].classList.remove("is-active");
      words[currentIndex].style.transform = "translateY(-100%)";
      words[currentIndex].style.opacity = "0";

      currentIndex = (currentIndex + 1) % words.length;

      words[currentIndex].classList.add("is-active");
      words[currentIndex].style.transform = "translateY(0%)";
      words[currentIndex].style.opacity = "1";

      // Reset others
      words.forEach((w, idx) => {
        if (idx !== currentIndex) {
          w.style.transform = "translateY(100%)";
          w.style.opacity = "0";
        }
      });
    }, intervalMs);
  }

  /* --------------------------------------------------------------------------
     4. SELECTED WORKS INTERACTIVE CAROUSEL (Smooth swipe/click, zero trap)
     -------------------------------------------------------------------------- */
  function initWorksCarousel() {
    const track = document.querySelector(".works-carousel-track");
    if (!track) return;

    const cards = track.querySelectorAll(".works-card");
    const prevBtn = document.querySelector(".carousel-prev-btn");
    const nextBtn = document.querySelector(".carousel-next-btn");
    const counterDisplay = document.querySelector(".carousel-index-display");
    const totalCount = cards.length;

    if (totalCount === 0) return;

    function getCardWidth() {
      const card = cards[0];
      const gap = parseInt(window.getComputedStyle(track).gap) || 24;
      return card.offsetWidth + gap;
    }

    function updateIndex() {
      const scrollLeft = track.scrollLeft;
      const cardWidth = getCardWidth();
      const activeIdx = Math.min(Math.round(scrollLeft / cardWidth), totalCount - 1);
      if (counterDisplay) {
        counterDisplay.textContent = `0${activeIdx + 1} / 0${totalCount}`;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const cardWidth = getCardWidth();
        track.scrollBy({ left: -cardWidth, behavior: "smooth" });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const cardWidth = getCardWidth();
        track.scrollBy({ left: cardWidth, behavior: "smooth" });
      });
    }

    track.addEventListener("scroll", updateIndex, { passive: true });
    updateIndex();
  }

  /* --------------------------------------------------------------------------
     5. MOBILE MENU DRAWER
     -------------------------------------------------------------------------- */
  function initMobileDrawer() {
    const menuBtn = document.querySelector(".menu-toggle-btn");
    const drawer = document.querySelector(".mobile-drawer");
    if (!menuBtn || !drawer) return;

    menuBtn.addEventListener("click", () => {
      const isOpen = drawer.classList.contains("is-open");
      if (isOpen) {
        drawer.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      } else {
        drawer.classList.add("is-open");
        menuBtn.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      }
    });

    const drawerLinks = drawer.querySelectorAll("a");
    drawerLinks.forEach((link) => {
      link.addEventListener("click", () => {
        drawer.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. MOBILE BOTTOM APP BAR (Syncs with scroll)
     -------------------------------------------------------------------------- */
  function initMobileAppBar() {
    const appItems = document.querySelectorAll(".mobile-app-item");
    if (!appItems.length) return;

    const sections = ["hero", "services", "work", "about", "contact"];

    function onScroll() {
      const scrollPos = window.scrollY + 200;
      let currentSection = "";

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            currentSection = id;
          }
        }
      }

      if (currentSection) {
        appItems.forEach((item) => {
          const href = item.getAttribute("href");
          if (href && href.includes(`#${currentSection}`)) {
            item.classList.add("is-active");
          } else {
            item.classList.remove("is-active");
          }
        });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --------------------------------------------------------------------------
     7. DYNAMIC FOOTER YEAR
     -------------------------------------------------------------------------- */
  function initFooterYear() {
    const yearEls = document.querySelectorAll("#footer-year, .current-year");
    const year = new Date().getFullYear();
    yearEls.forEach((el) => {
      el.textContent = year;
    });
  }

  /* --------------------------------------------------------------------------
     INITIALIZATION
     -------------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initLagosClock();
    initRoleRotator();
    initWorksCarousel();
    initMobileDrawer();
    initMobileAppBar();
    initFooterYear();
  });
})();
