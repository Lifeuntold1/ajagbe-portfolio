document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DARK/LIGHT MODE LOGIC ---
    const toggleButton = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const icon = toggleButton.querySelector('svg');

    // Check Local Storage for saved preference
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        htmlElement.setAttribute('data-theme', currentTheme);
    }

    toggleButton.addEventListener('click', () => {
        const hasLightTheme = htmlElement.getAttribute('data-theme') === 'light';

        if (hasLightTheme) {
            // Switch to Dark
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            // Switch to Light
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });


    // --- 2. MOBILE MENU LOGIC ---
    const hamburger = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('is-active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('is-active');
        });
    });

    // --- 3. SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Avoid errors on empty links

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});