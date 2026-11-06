/**
 * AJAGBE EMMANUEL OLUWATOBI — PORTFOLIO CLIENT ENGINE
 * Concept: Physicist who builds the web. Precision as personality.
 * Stack: Pure Vanilla JavaScript + Motion (motion.dev CDN)
 * Motion Tokens: Emil Kowalski UI Polish & Spring Physics
 */

(function () {
  "use strict";

  /* --------------------------------------------------------------------------
     TIMELINE DATA FOR YEAR ROLLER (M7 — about.html)
     Strictly verified facts from Section 6.1
     -------------------------------------------------------------------------- */
  const TIMELINE = [
    {
      year: "2017",
      title: "Started client web development & founded Life Untold",
      detail: "Began building websites for local businesses and independent clients while establishing the Life Untold brand."
    },
    {
      year: "2021",
      title: "Admitted to University of Jos",
      detail: "Commenced study in Physics Education, applying rigorous analytical modeling and experimental discipline to software architecture."
    },
    {
      year: "2023",
      title: "+35% brand visibility at Heroes Publishing House",
      detail: "Directed technical content and brand architecture that grew organizational visibility by 35%."
    },
    {
      year: "2024",
      title: "Engineered and launched Nexus Market",
      detail: "Shipped an independent multi-vendor marketplace in Laravel and MySQL with live vendor payouts at nexusmkt.com.ng."
    },
    {
      year: "2026",
      title: "Editor in Chief, NAPS & Fullstack Practice",
      detail: "Leading national physics publications while delivering Laravel, WordPress, and React projects with a 20% average conversion lift."
    }
  ];

  /* Configuration Constants */
  const ENTER_FROM = "left"; // M5 rolling deck entry direction
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(hover: none) or (pointer: coarse)").matches;

  /* --------------------------------------------------------------------------
     1. THEME SWITCHER (M12 Circular View Transition & LocalStorage)
     -------------------------------------------------------------------------- */
  function initTheme() {
    const toggleBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    function getPreferredTheme() {
      const stored = localStorage.getItem("theme");
      if (stored) return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function applyTheme(theme, animateCircle = false, x = 0, y = 0) {
      const isDark = theme === "dark";

      if (animateCircle && document.startViewTransition && !prefersReduced) {
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
          if (isDark) {
            document.documentElement.setAttribute("data-theme", "dark");
          } else {
            document.documentElement.removeAttribute("data-theme");
          }
        });

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
              ]
            },
            {
              duration: 500,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              pseudoElement: "::view-transition-new(root)"
            }
          );
        });
      } else {
        if (isDark) {
          document.documentElement.setAttribute("data-theme", "dark");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
      }

      localStorage.setItem("theme", theme);
      if (themeIcon) {
        themeIcon.textContent = isDark ? "☼" : "☾";
      }
    }

    // Initialize state
    const currentTheme = getPreferredTheme();
    applyTheme(currentTheme, false);

    if (toggleBtn) {
      toggleBtn.addEventListener("click", (e) => {
        const nextTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        const rect = toggleBtn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        applyTheme(nextTheme, true, x, y);
      });
    }
  }

  /* --------------------------------------------------------------------------
     2. NAVIGATION & LIVE JOS CLOCK (M14, M15)
     -------------------------------------------------------------------------- */
  function initHeaderAndClock() {
    const header = document.querySelector(".site-header");
    const clockEl = document.getElementById("live-clock-wat");
    const progressBar = document.querySelector(".scroll-progress-fill");
    const sectionCounter = document.getElementById("section-counter-display");
    const sections = Array.from(document.querySelectorAll("main > section"));

    // M14 Live Clock: Africa/Lagos (WAT, UTC+1)
    function updateClock() {
      if (!clockEl) return;
      try {
        const formatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Africa/Lagos",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
        clockEl.textContent = `Jos ${formatter.format(new Date())} WAT`;
      } catch (err) {
        clockEl.textContent = "Jos WAT";
      }
    }
    updateClock();
    setInterval(updateClock, 30000);

    // M15 Scroll Progress & Header Hairline
    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }

      if (header) {
        if (scrollY > 60) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }

      // Section counter update
      if (sectionCounter && sections.length > 0) {
        let activeIdx = 0;
        const midPoint = scrollY + window.innerHeight * 0.4;
        sections.forEach((sec, idx) => {
          if (sec.offsetTop <= midPoint) {
            activeIdx = idx;
          }
        });
        const currentPad = String(activeIdx + 1).padStart(2, "0");
        const totalPad = String(sections.length).padStart(2, "0");
        sectionCounter.textContent = `${currentPad}/${totalPad}`;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Mobile Hamburger Overlay
    const menuBtn = document.querySelector(".menu-toggle-btn");
    const menuOverlay = document.querySelector(".mobile-menu-overlay");
    const menuCloseBtn = document.querySelector(".mobile-menu-close");
    const overlayLinks = document.querySelectorAll(".mobile-menu-link");

    function openMenu() {
      if (!menuOverlay) return;
      menuOverlay.classList.add("is-open");
      menuBtn?.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function closeMenu() {
      if (!menuOverlay) return;
      menuOverlay.classList.remove("is-open");
      menuBtn?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    if (menuBtn && menuOverlay) {
      menuBtn.addEventListener("click", () => {
        const isOpen = menuOverlay.classList.contains("is-open");
        if (isOpen) closeMenu();
        else openMenu();
      });

      menuCloseBtn?.addEventListener("click", closeMenu);
      overlayLinks.forEach((link) => link.addEventListener("click", closeMenu));

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menuOverlay.classList.contains("is-open")) {
          closeMenu();
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     3. SPLIT TEXT REVEAL & ROLE ROTATOR (M1, M2 — index.html Hero)
     -------------------------------------------------------------------------- */
  function initHeroKinetic() {
    const heroH1 = document.querySelector(".hero-title-interactive");
    if (!heroH1) return;

    // Full sentence preserved for screen readers
    const originalText = heroH1.textContent.trim();
    heroH1.setAttribute("aria-label", "I build the site and write the words on it.");

    if (prefersReduced) return;

    // Split chars for static text portions
    const splitNodes = heroH1.querySelectorAll(".split-reveal-word");
    splitNodes.forEach((node, wordIdx) => {
      const text = node.textContent;
      node.textContent = "";
      node.setAttribute("aria-hidden", "true");

      Array.from(text).forEach((char, charIdx) => {
        const mask = document.createElement("span");
        mask.className = "char-mask";
        const inner = document.createElement("span");
        inner.className = "char-inner";
        inner.textContent = char;
        inner.style.transitionDelay = `${(wordIdx * 4 + charIdx) * 25}ms`;
        mask.appendChild(inner);
        node.appendChild(mask);

        // Stagger slide up
        requestAnimationFrame(() => {
          setTimeout(() => inner.classList.add("is-visible"), 100);
        });
      });
    });

    // M2 Role Rotator (site -> store -> system -> platform)
    const rotator = document.querySelector(".rotator-cell");
    if (rotator) {
      const words = Array.from(rotator.querySelectorAll(".rotator-word"));
      let currentIndex = 0;
      let rotatorTimer = null;

      function cycleWord() {
        if (document.hidden) return;
        const current = words[currentIndex];
        currentIndex = (currentIndex + 1) % words.length;
        const next = words[currentIndex];

        current.classList.remove("is-active");
        current.classList.add("is-exiting");

        setTimeout(() => {
          current.classList.remove("is-exiting");
        }, 450);

        next.classList.add("is-active");
      }

      function startRotator() {
        if (!rotatorTimer) {
          rotatorTimer = setInterval(cycleWord, 2400);
        }
      }
      function stopRotator() {
        if (rotatorTimer) {
          clearInterval(rotatorTimer);
          rotatorTimer = null;
        }
      }

      startRotator();
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopRotator();
        else startRotator();
      });
    }
  }

  /* --------------------------------------------------------------------------
     4. MEASUREMENT CURSOR & COORDINATES HUD (M3 — Desktop Only)
     -------------------------------------------------------------------------- */
  function initMeasurementCursor() {
    if (isTouchDevice || prefersReduced) return;

    const cursorRing = document.createElement("div");
    cursorRing.className = "physics-cursor";
    const cursorLabel = document.createElement("span");
    cursorLabel.className = "physics-cursor-label";
    cursorLabel.textContent = "open";
    cursorRing.appendChild(cursorLabel);

    const hud = document.createElement("div");
    hud.className = "physics-coordinates-hud";
    hud.textContent = "X: 0 Y: 0";

    document.body.appendChild(cursorRing);
    document.body.appendChild(hud);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      hud.textContent = `X:${mouseX} Y:${mouseY}`;
      hud.style.left = `${mouseX}px`;
      hud.style.top = `${mouseY}px`;
    }, { passive: true });

    // Smooth spring lag interpolation
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover States
    const interactiveTargets = "a, button, input, select, textarea, .interactive-hover";
    document.addEventListener("mouseover", (e) => {
      const target = e.target.closest(interactiveTargets);
      const deckPanel = e.target.closest(".deck-panel");

      if (deckPanel && !target) {
        cursorRing.classList.add("is-deck");
      } else {
        cursorRing.classList.remove("is-deck");
      }

      if (target) {
        cursorRing.classList.add("is-hovering");
      } else {
        cursorRing.classList.remove("is-hovering");
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. VELOCITY MARQUEE (M4 — Smooth Horizontal Loop)
     -------------------------------------------------------------------------- */
  function initVelocityMarquee() {
    const marqueeTrack = document.querySelector(".marquee-track");
    if (!marqueeTrack || prefersReduced) return;

    let baseSpeed = 1.0;
    let currentSpeed = 1.0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let position = 0;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      scrollVelocity = Math.min(delta * 0.08, 3.0);
      lastScrollY = currentScrollY;
    }, { passive: true });

    function tickMarquee() {
      // Ease speed back to baseline
      currentSpeed += (baseSpeed + scrollVelocity - currentSpeed) * 0.08;
      scrollVelocity *= 0.92;

      position -= currentSpeed;
      const trackWidth = marqueeTrack.firstElementChild.getBoundingClientRect().width;
      if (Math.abs(position) >= trackWidth) {
        position = 0;
      }

      marqueeTrack.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(tickMarquee);
    }
    requestAnimationFrame(tickMarquee);
  }

  /* --------------------------------------------------------------------------
     6. ROLLING DECK MERRY-GO-ROUND (M5 Signature Component)
     -------------------------------------------------------------------------- */
  function initRollingDeck() {
    const deckSection = document.querySelector(".rolling-deck-section");
    if (!deckSection || prefersReduced) return;

    const panels = Array.from(deckSection.querySelectorAll(".deck-panel"));
    const ticks = Array.from(deckSection.querySelectorAll(".deck-tick"));
    const counterDisplay = deckSection.querySelector(".deck-index-display");
    const numPanels = panels.length;
    if (numPanels === 0) return;

    // Set height based on panel count: 100vh per panel + 100vh lead
    deckSection.style.height = `${(numPanels + 1) * 100}vh`;

    let activeIndex = -1;

    function onScrollDeck() {
      const rect = deckSection.getBoundingClientRect();
      const sectionTop = -rect.top;
      const scrollableDistance = rect.height - window.innerHeight;

      if (sectionTop < 0) {
        // Above section
        activatePanel(0);
        return;
      }
      if (sectionTop > scrollableDistance) {
        // Below section
        activatePanel(numPanels - 1);
        return;
      }

      // Calculate active panel based on progress
      const progress = Math.min(Math.max(sectionTop / scrollableDistance, 0), 0.999);
      const targetIndex = Math.floor(progress * numPanels);

      if (targetIndex !== activeIndex) {
        activatePanel(targetIndex);
      }
    }

    function activatePanel(newIndex) {
      if (newIndex === activeIndex) return;

      panels.forEach((panel, i) => {
        panel.classList.remove("is-active", "is-exited");
        if (i === newIndex) {
          panel.classList.add("is-active");
        } else if (i < newIndex) {
          panel.classList.add("is-exited");
        }
      });

      ticks.forEach((tick, i) => {
        if (i === newIndex) tick.classList.add("is-active");
        else tick.classList.remove("is-active");
      });

      if (counterDisplay) {
        const cur = String(newIndex + 1).padStart(2, "0");
        const tot = String(numPanels).padStart(2, "0");
        counterDisplay.textContent = `${cur}/${tot}`;
      }

      activeIndex = newIndex;
    }

    window.addEventListener("scroll", onScrollDeck, { passive: true });
    onScrollDeck();
  }

  /* --------------------------------------------------------------------------
     7. STICKY CARD STACK (M6 — services.html)
     -------------------------------------------------------------------------- */
  function initStickyCardStack() {
    const stackContainer = document.querySelector(".sticky-stack-container");
    if (!stackContainer || prefersReduced) return;

    const cards = Array.from(stackContainer.querySelectorAll(".sticky-service-card"));
    if (cards.length === 0) return;

    // Assign incremental sticky top offsets
    cards.forEach((card, i) => {
      card.style.top = `calc(var(--header-height) + 16px + ${i * 24}px)`;
    });

    function onScrollStack() {
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        const nextCard = cards[i + 1];
        const nextRect = nextCard.getBoundingClientRect();
        const currentRect = card.getBoundingClientRect();

        // When next card approaches, scale down and dim current card
        if (nextRect.top <= currentRect.top + 60) {
          const overlapProgress = Math.min(Math.max((currentRect.top + 60 - nextRect.top) / 120, 0), 1);
          const scale = 1 - overlapProgress * 0.06;
          const opacity = 1 - overlapProgress * 0.3;
          card.style.transform = `scale(${scale})`;
          card.style.opacity = `${opacity}`;
        } else {
          card.style.transform = "scale(1)";
          card.style.opacity = "1";
        }
      });
    }

    window.addEventListener("scroll", onScrollStack, { passive: true });
    onScrollStack();
  }

  /* --------------------------------------------------------------------------
     8. YEAR ROLLER ODOMETER (M7 — about.html)
     -------------------------------------------------------------------------- */
  function initYearRoller() {
    const rollerSection = document.querySelector(".odometer-pinned-section");
    if (!rollerSection || prefersReduced) return;

    const digitStrips = Array.from(rollerSection.querySelectorAll(".odometer-digit-strip"));
    const milestoneTitle = document.getElementById("milestone-title-display");
    const milestoneDetail = document.getElementById("milestone-detail-display");
    const totalMilestones = TIMELINE.length;

    rollerSection.style.height = `${(totalMilestones + 1) * 80}vh`;

    let activeYearIndex = -1;

    function onScrollRoller() {
      const rect = rollerSection.getBoundingClientRect();
      const sectionTop = -rect.top;
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance <= 0) return;

      const progress = Math.min(Math.max(sectionTop / scrollableDistance, 0), 0.999);
      const targetIndex = Math.floor(progress * totalMilestones);

      if (targetIndex !== activeYearIndex && TIMELINE[targetIndex]) {
        activeYearIndex = targetIndex;
        const entry = TIMELINE[targetIndex];

        // Update 4 digits
        const yearStr = entry.year;
        digitStrips.forEach((strip, stripIdx) => {
          const digit = parseInt(yearStr[stripIdx], 10);
          strip.style.transform = `translateY(-${digit * 1.1}em)`;
        });

        // Update text with crossfade
        if (milestoneTitle && milestoneDetail) {
          milestoneTitle.style.opacity = "0";
          milestoneDetail.style.opacity = "0";

          setTimeout(() => {
            milestoneTitle.textContent = entry.title;
            milestoneDetail.textContent = entry.detail;
            milestoneTitle.style.opacity = "1";
            milestoneDetail.style.opacity = "1";
          }, 180);
        }
      }
    }

    window.addEventListener("scroll", onScrollRoller, { passive: true });
    onScrollRoller();
  }

  /* --------------------------------------------------------------------------
     9. SCROLL-LIT STATEMENT (M8)
     -------------------------------------------------------------------------- */
  function initScrollLit() {
    const paragraph = document.querySelector(".scroll-lit-p");
    if (!paragraph || prefersReduced) return;

    const words = paragraph.textContent.trim().split(/\s+/);
    paragraph.textContent = "";

    const spanList = words.map((w) => {
      const span = document.createElement("span");
      span.className = "lit-word";
      span.textContent = w + " ";
      paragraph.appendChild(span);
      return span;
    });

    function onScrollLit() {
      const rect = paragraph.getBoundingClientRect();
      const windowH = window.innerHeight;
      const enter = windowH * 0.85;
      const exit = windowH * 0.25;

      const progress = Math.min(Math.max((enter - rect.top) / (enter - exit), 0), 1);
      const litCount = Math.floor(progress * spanList.length);

      spanList.forEach((span, idx) => {
        if (idx <= litCount) span.classList.add("is-lit");
        else span.classList.remove("is-lit");
      });
    }

    window.addEventListener("scroll", onScrollLit, { passive: true });
    onScrollLit();
  }

  /* --------------------------------------------------------------------------
     10. MAGNETIC BUTTONS (M9 — Desktop Only)
     -------------------------------------------------------------------------- */
  function initMagneticButtons() {
    if (isTouchDevice || prefersReduced) return;

    const magneticElements = document.querySelectorAll(".btn-primary, .btn-outline");
    magneticElements.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const deltaX = e.clientX - btnCenterX;
        const deltaY = e.clientY - btnCenterY;

        // Pull toward pointer up to 8px
        const moveX = (deltaX / (rect.width / 2)) * 8;
        const moveY = (deltaY / (rect.height / 2)) * 8;
        btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0px, 0px)";
      });
    });
  }

  /* --------------------------------------------------------------------------
     11. REVEALS & DRAW LINES (M10, M11)
     -------------------------------------------------------------------------- */
  function initVisualReveals() {
    // M10 Clip-Path Image Reveals
    const revealImages = document.querySelectorAll(".reveal-clip");
    if (revealImages.length > 0) {
      const imgObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              imgObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealImages.forEach((img) => imgObserver.observe(img));
    }

    // M11 Hairline Draw Under Service Rows
    const drawLines = document.querySelectorAll(".service-row-draw-line");
    if (drawLines.length > 0) {
      const lineObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-drawn");
              lineObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      drawLines.forEach((line) => lineObserver.observe(line));
    }
  }

  /* --------------------------------------------------------------------------
     12. PROJECT ROW HOVER PREVIEWS (projects.html)
     -------------------------------------------------------------------------- */
  function initProjectHoverPreviews() {
    if (isTouchDevice || prefersReduced) return;

    const projectRows = document.querySelectorAll(".project-row-interactive");
    const previewBox = document.querySelector(".floating-preview-thumbnail");
    const previewImg = document.getElementById("preview-floating-img");
    if (!projectRows.length || !previewBox || !previewImg) return;

    let targetX = 0;
    let targetY = 0;

    window.addEventListener("mousemove", (e) => {
      targetX = e.clientX + 160;
      targetY = e.clientY;
      previewBox.style.left = `${targetX}px`;
      previewBox.style.top = `${targetY}px`;
    }, { passive: true });

    projectRows.forEach((row) => {
      row.addEventListener("mouseenter", () => {
        const imgSrc = row.getAttribute("data-preview-src");
        if (imgSrc) {
          previewImg.src = imgSrc;
          previewBox.classList.add("is-visible");
        }
      });
      row.addEventListener("mouseleave", () => {
        previewBox.classList.remove("is-visible");
      });
    });
  }

  /* --------------------------------------------------------------------------
     13. COPY EMAIL TO CLIPBOARD
     -------------------------------------------------------------------------- */
  function initCopyEmail() {
    const copyLink = document.querySelector(".copy-email-link");
    const toast = document.querySelector(".copy-feedback-toast");
    if (!copyLink) return;

    copyLink.addEventListener("click", (e) => {
      e.preventDefault();
      const email = copyLink.getAttribute("data-email") || "emmanuelajagbe6@gmail.com";

      navigator.clipboard.writeText(email).then(() => {
        if (toast) {
          toast.classList.add("is-active");
          setTimeout(() => {
            toast.classList.remove("is-active");
          }, 1600);
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     14. CONTACT FORM HANDLING (contact.html)
     -------------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.querySelector(".contact-form");
    const submitBtn = document.getElementById("form-submit-btn");
    const successBox = document.getElementById("form-success-box");
    const errorBox = document.getElementById("form-error-box");
    if (!form || !submitBtn) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      if (successBox) successBox.classList.remove("is-shown");
      if (errorBox) errorBox.classList.remove("is-shown");

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        if (response.ok) {
          form.style.display = "none";
          if (successBox) successBox.classList.add("is-shown");
        } else {
          throw new Error("Form submission error");
        }
      } catch (err) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        if (errorBox) errorBox.classList.add("is-shown");
      }
    });
  }

  /* --------------------------------------------------------------------------
     15. FOOTER DYNAMIC YEAR
     -------------------------------------------------------------------------- */
  function initFooterYear() {
    const yearSpan = document.getElementById("footer-year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  /* --------------------------------------------------------------------------
     GLOBAL BOOTSTRAP
     -------------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initHeaderAndClock();
    initHeroKinetic();
    initMeasurementCursor();
    initVelocityMarquee();
    initRollingDeck();
    initStickyCardStack();
    initYearRoller();
    initScrollLit();
    initMagneticButtons();
    initVisualReveals();
    initProjectHoverPreviews();
    initCopyEmail();
    initContactForm();
    initFooterYear();
  });
})();
