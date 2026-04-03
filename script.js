// ============================================
// PREMIUM PORTFOLIO JavaScript
// Advanced Interactivity & Animations
// ============================================

// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const canvas = document.getElementById('canvas');
const progressBar = document.getElementById('progressBar');
const body = document.body;

// Dynamic Background Colors - 10 vibrant colors for scrolling
const backgroundColors = [
    'linear-gradient(135deg, #ff6b9d 0%, #ff9ff3 100%)',      // Pink-Light Pink
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',      // Pink-Red
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',      // Pink-Yellow
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',      // Purple-Blue
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',      // Blue-Cyan
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',      // Green-Mint
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',      // Cyan-Purple
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',      // Teal-Pink
    'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',      // Orange-Pink
    'linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%)',      // Teal-Green
];
let currentColorIndex = 0;

// Theme Management
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

if (savedTheme === 'light') {
    body.classList.add('light-mode');
    updateThemeIcon();
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('light-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Hamburger Menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar Scroll Effect + Dynamic Background Color
window.addEventListener('scroll', () => {
    // Navbar background - white with varying opacity
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }

    // Dynamic background color based on scroll position
    if (!body.classList.contains('light-mode')) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollFraction = docHeight > 0 ? window.scrollY / docHeight : 0;
        const colorIndex = Math.floor(scrollFraction * backgroundColors.length) % backgroundColors.length;
        
        if (colorIndex !== currentColorIndex) {
            currentColorIndex = colorIndex;
            body.style.transition = 'background 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            body.style.background = backgroundColors[colorIndex];
        }
    }
});

// ============================================
// CANVAS PARTICLE ANIMATION
// ============================================

class Particle {
    constructor(x, y, ctx, canvas) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.canvas = canvas;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;
    }

    draw() {
        this.ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

let particles = [];

function initCanvas() {
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            ctx,
            canvas
        ));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(108, 92, 231, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();
}

window.addEventListener('resize', initCanvas);
initCanvas();

// ============================================
// PROGRESS BAR
// ============================================

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

// Observe all scroll-animate elements
document.querySelectorAll('.service-card, .portfolio-card, .stat-card, .contact-item').forEach(el => {
    el.classList.add('scroll-animate');
    observer.observe(el);
});

// ============================================
// SMOOTH SCROLL for anchor links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================
// CONTACT FORM
// ============================================

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Simulate form submission
        formStatus.textContent = 'Sending... Please wait';
        formStatus.classList.remove('success', 'error');

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message
            formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
            formStatus.classList.add('success');
            contactForm.reset();

            // Clear message after 5 seconds
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.classList.remove('success');
            }, 5000);
        } catch (error) {
            // Show error message
            formStatus.textContent = 'Error sending message. Please try again.';
            formStatus.classList.add('error');
        }
    });
}

// ============================================
// CTA BUTTON INTERACTION
// ============================================

const ctaBtn = document.getElementById('ctaBtn');
if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// ============================================
// CURSOR GLOW EFFECT (Optional)
// ============================================

document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    // Optional: Add glow effect to body
    if (!body.classList.contains('light-mode')) {
        document.documentElement.style.setProperty('--mouse-x', x + '%');
        document.documentElement.style.setProperty('--mouse-y', y + '%');
    }
});

// ============================================
// PREFERS REDUCED MOTION
// ============================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelectorAll('[style*="animation"]').forEach(el => {
        el.style.animation = 'none';
    });
}

// ============================================
// LOADING ANIMATION
// ============================================

window.addEventListener('load', () => {
    document.querySelectorAll('.title-word').forEach((word, index) => {
        word.style.animation = `fadeInUp 0.6s ease-out ${0.1 * (index + 1)}s both`;
    });
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    // Close mobile menu on escape
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

console.log('%c🚀 Premium Portfolio Loaded Successfully', 'color: #6c5ce7; font-size: 16px; font-weight: bold;');
