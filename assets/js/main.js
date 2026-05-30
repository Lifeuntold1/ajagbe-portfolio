/**
 * Ajagbe Emmanuel Oluwatobi — Core Controller
 * Features custom Apple-style Spring Physics, Staggered Grid reveals,
 * and high-performance native View Transitions SPA pipeline.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       0. SPRING PHYSICS MOTION SYSTEM
       ========================================================================== */
    class Spring {
        constructor(stiffness = 220, damping = 18, mass = 1) {
            this.stiffness = stiffness;
            this.damping = damping;
            this.mass = mass;
            this.current = 0;
            this.velocity = 0;
            this.target = 0;
        }

        update(dt) {
            const fSpring = -this.stiffness * (this.current - this.target);
            const fDamping = -this.damping * this.velocity;
            const acceleration = (fSpring + fDamping) / this.mass;
            this.velocity += acceleration * dt;
            this.current += this.velocity * dt;
            return this.current;
        }
    }

    /* ==========================================================================
       1. PERSISTENT THEME SWITCHER
       ========================================================================== */
    const initThemeSwitcher = () => {
        const themeToggleBtn = document.getElementById('theme-toggle');
        const rootElement = document.documentElement;
        if (!themeToggleBtn) return;
        
        const themeIcon = themeToggleBtn.querySelector('i');
        const activeTheme = localStorage.getItem('theme') || 'dark';

        if (activeTheme === 'light') {
            rootElement.setAttribute('data-theme', 'light');
            if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
        } else {
            rootElement.removeAttribute('data-theme');
            if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
        }

        // Clean existing listeners to avoid duplicates
        const newToggleBtn = themeToggleBtn.cloneNode(true);
        themeToggleBtn.parentNode.replaceChild(newToggleBtn, themeToggleBtn);

        newToggleBtn.addEventListener('click', () => {
            const isCurrentlyLight = rootElement.getAttribute('data-theme') === 'light';
            const icon = newToggleBtn.querySelector('i');

            if (isCurrentlyLight) {
                rootElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                if (icon) icon.className = 'fa-solid fa-moon';
            } else {
                rootElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (icon) icon.className = 'fa-solid fa-sun';
            }
        });
    };

    /* ==========================================================================
       2. MOBILE MENU OVERLAY & SCROLL LOCK
       ========================================================================== */
    const initMobileMenu = () => {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinksContainer = document.querySelector('.nav-links');
        const bodyElement = document.body;

        if (!mobileToggle || !navLinksContainer) return;

        // Clean duplicate listeners
        const newToggle = mobileToggle.cloneNode(true);
        mobileToggle.parentNode.replaceChild(newToggle, mobileToggle);

        newToggle.addEventListener('click', () => {
            const isActive = newToggle.classList.toggle('is-active');
            navLinksContainer.classList.toggle('active');
            
            if (isActive) {
                bodyElement.style.overflow = 'hidden';
            } else {
                bodyElement.style.overflow = '';
            }
        });

        const navLinks = navLinksContainer.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                newToggle.classList.remove('is-active');
                navLinksContainer.classList.remove('active');
                bodyElement.style.overflow = '';
            });
        });
    };

    /* ==========================================================================
       3. SMOOTH SCROLL ACCURACY
       ========================================================================== */
    const initSmoothScroll = () => {
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
    };

    /* ==========================================================================
       4. SCROLL OBSERVER WITH SPRING ENTRANCE REVEALS
       ========================================================================== */
    const initScrollReveals = () => {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    revealObserver.unobserve(el);

                    // Physics reveal cascade
                    const springY = new Spring(140, 16, 1.2);
                    const springOpacity = new Spring(120, 15, 1);
                    
                    const revealType = el.getAttribute('data-reveal') || 'up';
                    
                    let startY = 32;
                    let startX = 0;
                    if (revealType === 'left') startX = -32;
                    if (revealType === 'right') startX = 32;
                    if (revealType === 'scale') {
                        startY = 0;
                        el.style.transform = 'scale(0.95)';
                    } else {
                        el.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;
                    }
                    
                    el.style.opacity = '0';
                    el.style.visibility = 'visible';

                    springY.current = revealType === 'scale' ? 0.95 : startY || startX;
                    springY.target = revealType === 'scale' ? 1.0 : 0.0;
                    springOpacity.current = 0;
                    springOpacity.target = 1.0;

                    let animating = true;
                    const tick = () => {
                        const dt = 0.016;
                        const pos = springY.update(dt);
                        const opacity = springOpacity.update(dt);

                        el.style.opacity = opacity;
                        if (revealType === 'scale') {
                            el.style.transform = `scale(${pos})`;
                        } else if (revealType === 'left' || revealType === 'right') {
                            el.style.transform = `translate3d(${pos}px, 0, 0)`;
                        } else {
                            el.style.transform = `translate3d(0, ${pos}px, 0)`;
                        }

                        const deltaY = Math.abs(springY.current - springY.target);
                        const deltaOpacity = Math.abs(springOpacity.current - springOpacity.target);

                        if (deltaY > 0.01 || deltaOpacity > 0.01) {
                            requestAnimationFrame(tick);
                        } else {
                            animating = false;
                            el.style.transform = '';
                            el.style.opacity = '';
                            el.style.visibility = '';
                            el.classList.add('is-visible');
                        }
                    };
                    requestAnimationFrame(tick);
                }
            });
        }, { 
            threshold: 0.05, 
            rootMargin: '0px 0px -20px 0px' 
        });

        document.querySelectorAll('[data-reveal]').forEach(element => {
            // Prevent conflict by skipping elements inside stagger grid containers
            if (element.closest('[data-reveal-group], .projects-asymmetric-grid, .bento-grid, .grid-4, .grid-3, .grid-2')) {
                return;
            }
            element.style.opacity = '0';
            element.style.visibility = 'hidden';
            revealObserver.observe(element);
        });
    };

    /* ==========================================================================
       5. SPRING-BASED STAGGERED GRID REVEALS (staggerChildren)
       ========================================================================== */
    const initGridStaggers = () => {
        const containers = document.querySelectorAll('[data-reveal-group], .projects-asymmetric-grid, .bento-grid, .grid-4, .grid-3, .grid-2');
        
        containers.forEach(container => {
            const children = Array.from(container.children);
            if (children.length === 0) return;
            
            // Mark the container as visible immediately so children fall back to opacity: 1 stylesheet states when the spring clears
            container.classList.add('is-visible');
            
            children.forEach(child => {
                child.style.opacity = '0';
                child.style.transform = 'translate3d(0, 24px, 0) scale(0.97)';
                child.style.transition = 'none';
            });
            
            // Run the stagger animation immediately on mount to guarantee absolute visibility and prevent IntersectionObserver quirks
            children.forEach((child, index) => {
                const delay = index * 40; // Strict Apple 40ms stagger timing
                setTimeout(() => {
                    animateStaggerEntrance(child);
                }, delay);
            });
        });
    };

    const animateStaggerEntrance = (el) => {
        const springY = new Spring(140, 16, 1.2);
        const springScale = new Spring(180, 18, 1);
        const springOpacity = new Spring(120, 15, 1);
        
        springY.current = 24;
        springY.target = 0;
        springScale.current = 0.97;
        springScale.target = 1.0;
        springOpacity.current = 0;
        springOpacity.target = 1.0;
        
        const tick = () => {
            const dt = 0.016;
            const y = springY.update(dt);
            const s = springScale.update(dt);
            const o = springOpacity.update(dt);
            
            el.style.transform = `translate3d(0, ${y}px, 0) scale(${s})`;
            el.style.opacity = o;
            
            const deltaY = Math.abs(springY.current - springY.target);
            const deltaScale = Math.abs(springScale.current - springScale.target);
            const deltaOpacity = Math.abs(springOpacity.current - springOpacity.target);
            
            if (deltaY > 0.02 || deltaScale > 0.002 || deltaOpacity > 0.01) {
                requestAnimationFrame(tick);
            } else {
                el.style.transform = '';
                el.style.opacity = '';
                el.style.transition = ''; // Restore native dynamic hover states
                el.classList.add('is-visible');
            }
        };
        requestAnimationFrame(tick);
    };

    /* ==========================================================================
       6. 3D SPRING PHYSICS TILT & TACTILE HOVER ACTIONS
       ========================================================================== */
    const initSpringCardPhysics = () => {
        const targets = document.querySelectorAll('.process-card, .card, .project-media, .bento-card, .project-card-preview');
        
        targets.forEach(el => {
            const springX = new Spring(220, 18, 1);
            const springY = new Spring(220, 18, 1);
            const springScale = new Spring(280, 20, 1);
            
            springScale.current = 1;
            springScale.target = 1;

            let animating = false;
            
            const tick = () => {
                const dt = 0.016;
                const x = springX.update(dt);
                const y = springY.update(dt);
                const s = springScale.update(dt);
                
                el.style.transform = `perspective(1000px) scale(${s}) rotateX(${y}deg) rotateY(${x}deg)`;
                
                const deltaX = Math.abs(springX.current - springX.target);
                const deltaY = Math.abs(springY.current - springY.target);
                const deltaScale = Math.abs(springScale.current - springScale.target);
                
                if (deltaX > 0.01 || deltaY > 0.01 || deltaScale > 0.001) {
                    requestAnimationFrame(tick);
                } else {
                    animating = false;
                    el.style.transform = `perspective(1000px) scale(${springScale.target}) rotateX(${springY.target}deg) rotateY(${springX.target}deg)`;
                }
            };

            const triggerTick = () => {
                if (!animating) {
                    animating = true;
                    requestAnimationFrame(tick);
                }
            };

            el.addEventListener('mouseenter', () => {
                springScale.target = 1.02;
                triggerTick();
            });

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const w = rect.width;
                const h = rect.height;
                const cx = rect.left + w / 2;
                const cy = rect.top + h / 2;
                
                springX.target = ((e.clientX - cx) / (w / 2)) * 4.0;
                springY.target = -((e.clientY - cy) / (h / 2)) * 4.0;
                
                const glow = el.querySelector('.bento-glow');
                if (glow) {
                    const gx = e.clientX - rect.left - 60;
                    const gy = e.clientY - rect.top - 60;
                    glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
                }
                
                triggerTick();
            });

            el.addEventListener('mouseleave', () => {
                springX.target = 0;
                springY.target = 0;
                springScale.target = 1;
                triggerTick();
            });

            el.addEventListener('mousedown', () => {
                springScale.target = 0.98;
                triggerTick();
            });

            el.addEventListener('mouseup', () => {
                springScale.target = 1.02;
                triggerTick();
            });
        });
    };

    /* ==========================================================================
       7. VIEW TRANSITIONS SPA PIPELINE (Framer Motion layoutId emulation)
       ========================================================================== */
    const initViewTransitions = () => {
        // Intercept all internal page links to perform seamless SPA navigation
        document.body.addEventListener('click', (e) => {
            const anchor = e.target.closest('a');
            if (!anchor) return;
            
            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || anchor.getAttribute('target') === '_blank') return;
            
            // Check if origin matches
            const url = new URL(href, window.location.href);
            if (url.origin !== window.location.origin) return;
            
            // Allow standalone project prototypes to load natively
            const isPrototype = url.pathname.includes('/projects/') && !url.pathname.endsWith('projects.html');
            if (isPrototype) return;
            
            e.preventDefault();
            
            // Shared image matching (Dynamic layoutId emulation)
            const parentCard = anchor.closest('.project-row, .project-card-preview');
            let clickedImage = null;
            if (parentCard) {
                clickedImage = parentCard.querySelector('.project-media img, img');
                if (clickedImage) {
                    clickedImage.style.viewTransitionName = 'shared-project-image';
                }
            }
            
            navigateToPage(url.pathname + url.search + url.hash, clickedImage);
        });

        window.addEventListener('popstate', () => {
            navigateToPage(window.location.pathname + window.location.search + window.location.hash, null, true);
        });
    };

    const navigateToPage = async (path, clickedImage, isPopstate = false) => {
        if (!document.startViewTransition) {
            // Fallback for unsupported browsers
            window.location.href = path;
            return;
        }
        
        try {
            const response = await fetch(path);
            const html = await response.text();
            
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            
            const transition = document.startViewTransition(() => {
                // Swap main site content
                const currentMain = document.querySelector('main');
                const newMain = newDoc.querySelector('main');
                if (currentMain && newMain) {
                    currentMain.innerHTML = newMain.innerHTML;
                }
                
                // Update navigation links active state
                const currentNav = document.querySelector('.nav-links');
                const newNav = newDoc.querySelector('.nav-links');
                if (currentNav && newNav) {
                    currentNav.innerHTML = newNav.innerHTML;
                }
                
                // Update Page Title
                document.title = newDoc.title;
                
                // On incoming page, find matching hero image and bind transition name
                const incomingHeroImage = document.querySelector('.story-img img, .case-study-hero img, .project-hero img, .hero img');
                if (incomingHeroImage) {
                    incomingHeroImage.style.viewTransitionName = 'shared-project-image';
                }
            });
            
            await transition.finished;
            
            // Push layout state
            if (!isPopstate) {
                history.pushState({}, '', path);
            }
            
            // Scroll safely to top
            window.scrollTo(0, 0);
            
            // Clean up transition name after sequence finishes
            if (clickedImage) {
                clickedImage.style.viewTransitionName = '';
            }
            
            // Re-initialize core components on new DOM structure
            reinitializeSiteScripts();
            
        } catch (error) {
            console.warn('Navigation transition aborted, falling back:', error);
            window.location.href = path;
        }
    };

    const reinitializeSiteScripts = () => {
        initThemeSwitcher();
        initMobileMenu();
        initSmoothScroll();
        initScrollReveals();
        initGridStaggers();
        initConversionAnalytics();
        
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            initSpringCardPhysics();
        }
        
        // Auto-update footer year if present
        const footerYear = document.getElementById('footer-year');
        if (footerYear) {
            footerYear.textContent = new Date().getFullYear();
        }
    };

    /* ==========================================================================
       7. PULSE ORGANIC CONVERSION TRACKER
       ========================================================================== */
    const dispatchOrganicConversionEvent = (category, action, label = '') => {
        console.log(
            `%c[Pulse Analytics]%c Event Dispatched: %c${category} %c-> %c${action} %c${label ? `(${label})` : ''}`,
            'color: #00E676; font-weight: bold; background: rgba(0, 230, 118, 0.1); padding: 2px 6px; border-radius: 4px;',
            'color: var(--color-text);',
            'color: #00E676; font-weight: bold;',
            'color: var(--color-muted);',
            'color: var(--color-text); font-weight: bold;',
            'color: var(--color-muted); font-style: italic;'
        );
    };

    const initConversionAnalytics = () => {
        // Track CTA button clicks
        document.querySelectorAll('a.btn-primary, a.btn-secondary, a.cta-button, .card__cta, [data-analytics-click]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const label = btn.textContent.trim() || btn.getAttribute('aria-label') || 'unnamed';
                const destination = btn.getAttribute('href') || 'none';
                dispatchOrganicConversionEvent('Click', 'CTA Interaction', `${label} (Dest: ${destination})`);
            });
        });

        // Track social profile clicks
        document.querySelectorAll('.footer-social-links a, .hero-socials a').forEach(social => {
            social.addEventListener('click', () => {
                const platform = social.textContent.trim() || 'Social Link';
                dispatchOrganicConversionEvent('Click', 'Social Navigation', platform);
            });
        });

        // Track contact form submissions
        const contactForm = document.querySelector('form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                const nameInput = contactForm.querySelector('input[name="name"]') || contactForm.querySelector('#name');
                const emailInput = contactForm.querySelector('input[name="email"]') || contactForm.querySelector('#email');
                const categoryInput = contactForm.querySelector('select[name="category"]') || contactForm.querySelector('select');
                
                const name = nameInput ? nameInput.value : 'Anonymous';
                const email = emailInput ? emailInput.value : 'None';
                const service = categoryInput ? categoryInput.value : 'Inquiry';

                dispatchOrganicConversionEvent('FormSubmit', 'Contact Conversion', `Name: ${name} | Email: ${email} | Service: ${service}`);
            });
        }
    };

    /* ==========================================================================
       8. INITIALIZE ALL PIPELINES
       ========================================================================== */
    reinitializeSiteScripts();
    initViewTransitions();
});