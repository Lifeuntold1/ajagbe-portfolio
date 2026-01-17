document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. THEME SWITCHER LOGIC --- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const rootElement = document.documentElement; // Targets <html> tag
    const icon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // 1a. Check Local Storage on Load
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        rootElement.setAttribute('data-theme', 'light');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // 1b. Toggle Event Listener
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = rootElement.getAttribute('data-theme') === 'light';

            if (isLight) {
                // Switch to Dark Mode
                rootElement.removeAttribute('data-theme'); // Removes 'light', falls back to default :root (Dark)
                localStorage.setItem('theme', 'dark');
                if (icon) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            } else {
                // Switch to Light Mode
                rootElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        });
    }

    /* --- 2. MOBILE MENU LOGIC --- */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links'); // Matches your CSS class

    if (mobileToggle && navLinksContainer) {
        mobileToggle.addEventListener('click', () => {
            // Toggles the "X" animation on the hamburger
            mobileToggle.classList.toggle('is-active');
            // Slides the menu in/out
            navLinksContainer.classList.toggle('active');
        });

        // Auto-close menu when a link is clicked
        const pageLinks = document.querySelectorAll('.nav-links a');
        pageLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('is-active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    /* --- 3. SMOOTH SCROLL --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});