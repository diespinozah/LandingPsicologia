/**
 * MenteSerena - Landing Page JavaScript
 * =====================================
 * Handles: Mobile menu, smooth scroll, animations, testimonial slider, form validation
 */

document.addEventListener('DOMContentLoaded', function() {
    // ================================
    // Mobile Menu Toggle
    // ================================
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    let isMenuOpen = false;

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            isMenuOpen = !isMenuOpen;
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');

            // Toggle hamburger to X icon
            if (isMenuOpen) {
                menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            } else {
                menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            }
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
                isMenuOpen = false;
                menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            });
        });
    }

    // ================================
    // Header Scroll Effect
    // ================================
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;

    function updateHeader() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Initial check

    // ================================
    // Smooth Scroll for Anchor Links
    // ================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================
    // Active Navigation Link
    // ================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial check

    // ================================
    // Fade-in Animation on Scroll
    // ================================
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // ================================
    // Testimonial Slider
    // ================================
    const testimonialTrack = document.getElementById('testimonialTrack');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentSlide = 0;
    const totalSlides = 3;
    let autoSlideInterval;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;

        currentSlide = index;
        testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dots
        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event listeners for slider
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    testimonialDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            goToSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (testimonialTrack) {
        testimonialTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, { passive: true });

        testimonialTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Start auto slide
    startAutoSlide();

    // Pause on hover
    const testimonialSlider = document.getElementById('testimonialSlider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', stopAutoSlide);
        testimonialSlider.addEventListener('mouseleave', startAutoSlide);
    }

    // ================================
    // Contact Form Handling
    // ================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
            `;

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success message
                    showFormMessage('success', '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
                    contactForm.reset();
                } else {
                    throw new Error('Error en el envío');
                }
            } catch (error) {
                // Error message
                showFormMessage('error', 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo o contáctanos directamente.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    function showFormMessage(type, message) {
        // Remove existing messages
        const existingMsg = contactForm.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        // Create message element
        const msgDiv = document.createElement('div');
        msgDiv.className = `form-message ${type === 'success' ? 'form-success' : 'form-error'}`;
        msgDiv.innerHTML = `
            <div class="flex items-center">
                ${type === 'success'
                    ? '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>'
                    : '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>'
                }
                <span>${message}</span>
            </div>
        `;

        contactForm.appendChild(msgDiv);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            msgDiv.remove();
        }, 5000);
    }

    // ================================
    // Form Validation Enhancement
    // ================================
    const formInputs = contactForm ? contactForm.querySelectorAll('input, textarea') : [];

    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        const isValid = field.checkValidity();

        if (!isValid && field.value) {
            field.classList.add('invalid');
        } else {
            field.classList.remove('invalid');
        }
    }

    // ================================
    // Accessibility: Escape key closes mobile menu
    // ================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
            isMenuOpen = false;
            menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            menuBtn.focus();
        }
    });

    // ================================
    // Performance: Debounce scroll events
    // ================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll handlers if needed for performance
    // (Currently using native scroll which is already optimized)

    // ================================
    // Console welcome message
    // ================================
    console.log('%c¡Bienvenido a MenteSerena! 🧠✨', 'color: #2D6A4F; font-size: 20px; font-weight: bold;');
    console.log('%cSi necesitas ayuda con el sitio web, contáctanos.', 'color: #40916C; font-size: 14px;');
});
