/**
 * Ajagbe Emmanuel Oluwatobi — Core Controller
 * Handles theme toggling, full-screen mobile menu overrides, 
 * smooth scrolling, and scroll reveal animations.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. PERSISTENT THEME SWITCHER (Light/Dark Mode Synchronization)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const rootElement = document.documentElement;
    
    // Select the font-awesome icon inside the toggle button
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Check active theme state on DOM completion
    const activeTheme = localStorage.getItem('theme') || 'dark';

    // Synchronize toggle icon shape on load
    if (activeTheme === 'light') {
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-sun';
        }
    } else {
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    // Toggle button event click responder
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isCurrentlyLight = rootElement.getAttribute('data-theme') === 'light';

            if (isCurrentlyLight) {
                // Shift to Dark Mode
                rootElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                if (themeIcon) {
                    themeIcon.className = 'fa-solid fa-moon';
                }
            } else {
                // Shift to Light Mode
                rootElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (themeIcon) {
                    themeIcon.className = 'fa-solid fa-sun';
                }
            }
        });
    }

    /* ==========================================================================
       2. MOBILE MENU OVERLAY & SCROLL LOCK
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const bodyElement = document.body;

    if (mobileToggle && navLinksContainer) {
        mobileToggle.addEventListener('click', () => {
            const isActive = mobileToggle.classList.toggle('is-active');
            navLinksContainer.classList.toggle('active');
            
            // Toggle body overflow to lock background scrolling while full screen overlay is open
            if (isActive) {
                bodyElement.style.overflow = 'hidden';
            } else {
                bodyElement.style.overflow = '';
            }
        });

        // Close menu immediately and release scroll lock when navigation link is clicked
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('is-active');
                navLinksContainer.classList.remove('active');
                bodyElement.style.overflow = '';
            });
        });
    }

    /* ==========================================================================
       3. SMOOTH SCROLL ACCURACY
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetHash = this.getAttribute('href');
            if (targetHash === '#' || targetHash === '') return;

            const targetElement = document.querySelector(targetHash);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ==========================================================================
       4. SCROLL-TRIGGERED REVEAL OBSERVER
       ========================================================================== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Unobserve so animation runs once per load
                revealObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.08, 
        rootMargin: '0px 0px -40px 0px' 
    });

    // Observe elements carrying reveal or reveal-group markup
    document.querySelectorAll('[data-reveal], [data-reveal-group]').forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       5. DYNAMIC PROCESS CARD OBSERVER
       ========================================================================== */
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                processObserver.unobserve(entry.target);

                // Apply idle oscillation after all entrance transitions complete
                const children = entry.target.querySelectorAll('.process-card');
                const totalDelay = children.length * 120 + 600; // stagger + transition duration
                setTimeout(() => {
                    children.forEach(card => {
                        card.classList.add('process-card--alive');
                    });
                }, totalDelay);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('[data-process-reveal]').forEach(element => {
        processObserver.observe(element);
    });

});

/* ==========================================================================
   5. AUTO DYNAMIC COPYRIGHT YEAR
   ========================================================================== */
const footerYear = document.getElementById('footer-year');
if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}