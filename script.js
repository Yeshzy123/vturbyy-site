// DOM Elements
const paletteToggle = document.querySelector('.palette-toggle');
const colorPalette = document.querySelector('.color-palette');
const colorOptions = document.querySelectorAll('.color-option');
const primaryInput = document.getElementById('primary-color');
const secondaryInput = document.getElementById('secondary-color');
const accentInput = document.getElementById('accent-color');

// Toggle color palette
paletteToggle.addEventListener('click', () => {
    colorPalette.classList.toggle('active');
});

// Apply preset color themes
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        const primary = option.dataset.primary;
        const secondary = option.dataset.secondary;
        const accent = option.dataset.accent;
        
        applyColors(primary, secondary, accent);
        updateColorInputs(primary, secondary, accent);
    });
});

// Apply custom colors
[primaryInput, secondaryInput, accentInput].forEach(input => {
    input.addEventListener('change', () => {
        applyColors(
            primaryInput.value,
            secondaryInput.value,
            accentInput.value
        );
    });
});

// Apply colors to CSS variables
function applyColors(primary, secondary, accent) {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
    document.documentElement.style.setProperty('--accent-color', accent);
}

// Update color inputs to match selected theme
function updateColorInputs(primary, secondary, accent) {
    primaryInput.value = primary;
    secondaryInput.value = secondary;
    accentInput.value = accent;
}

// Scroll-based animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.handle-card, .platform-card, .promo-content');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect for promo section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const promoSection = document.querySelector('.promo-section');
    if (promoSection) {
        promoSection.style.backgroundPosition = `50% ${rate}px`;
    }
});

// Mouse move effect for interactive elements
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.platform-card, .handle-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`;
    });
});

// Reset transform when mouse leaves cards
document.querySelectorAll('.platform-card, .handle-card').forEach(card => {
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Dynamic gradient background for hero section
function createGradientAnimation() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    let hue = 0;
    setInterval(() => {
        hue = (hue + 0.5) % 360;
        const gradient = `linear-gradient(${hue}deg, var(--primary-color), var(--secondary-color))`;
        hero.style.setProperty('--hero-gradient', gradient);
    }, 50);
}

// Initialize gradient animation
document.addEventListener('DOMContentLoaded', createGradientAnimation);

// Performance optimization - throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Throttled scroll handler
const throttledScroll = throttle(() => {
    // Handle scroll-dependent effects here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll);

// Preload fonts and assets
function preloadAssets() {
    // Preload critical fonts
    const fonts = new FontFace('Inter', 'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeAmM.woff2)');
    fonts.load().then(() => {
        document.fonts.add(fonts);
    }).catch(err => console.log('Font loading failed:', err));
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    preloadAssets();
    
    // Add loading animation completion
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Handle video background for mobile devices
function handleMobileVideo() {
    const videoBackground = document.querySelector('.video-background');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && videoBackground) {
        // Replace with static background on mobile for performance
        videoBackground.innerHTML = '<div class="mobile-bg-placeholder"></div>';
    }
}

// Initialize mobile handling
window.addEventListener('resize', handleMobileVideo);
handleMobileVideo();

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close color palette with ESC
        colorPalette.classList.remove('active');
    }
});

// Audio-Video Synchronization
function syncAudioVideo() {
    const video = document.getElementById('background-video');
    const audio = document.getElementById('background-audio');
    
    if (!video || !audio) return;
    
    // Sync audio with video playback
    video.addEventListener('play', () => {
        audio.play().catch(e => console.log('Audio play failed:', e));
    });
    
    video.addEventListener('pause', () => {
        audio.pause();
    });
    
    video.addEventListener('seeked', () => {
        audio.currentTime = video.currentTime;
    });
    
    video.addEventListener('timeupdate', () => {
        // Keep audio slightly behind to account for processing delay
        if (Math.abs(audio.currentTime - video.currentTime) > 0.1) {
            audio.currentTime = video.currentTime;
        }
    });
    
    // Handle volume control
    video.addEventListener('volumechange', () => {
        audio.volume = video.muted ? 0 : video.volume;
    });
}

// Initialize sync when DOM is loaded
document.addEventListener('DOMContentLoaded', syncAudioVideo);