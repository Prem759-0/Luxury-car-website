// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

// Stop scrolling initially
lenis.stop();

// Handle Anchor Links (Header Options) with Lenis
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#explore') {
            lenis.scrollTo(targetId, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});

// Color Card Click to Scroll
document.querySelectorAll('.color-card').forEach(card => {
    card.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        if (targetId) {
            lenis.scrollTo(targetId, {
                duration: 2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});

// Engineering Section Interactive Labels
document.querySelectorAll('.eng-label').forEach(label => {
    label.addEventListener('mouseenter', function() {
        document.querySelectorAll('.eng-label').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
if (cursor && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .color-card, .stat-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Navigation style on scroll
const nav = document.getElementById('nav')
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled')
    } else {
        nav.classList.remove('scrolled')
    }
})

// Parallax for Hero Static
gsap.to('.hero-bg', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
})

gsap.to('.hero-content', {
    y: 50,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
})

// Configuration for sequences
const frameCount = 240;
const canvasWidth = 1920;
const canvasHeight = 1080;

const sequences = [
    {
        id: 'white',
        path: 'white-car-frame/frame-',
        sectionId: '#white-sequence',
        canvasId: 'white-canvas',
        images: [],
        obj: { frame: 0 }
    },
    {
        id: 'red',
        path: 'Koenigsegg_red-car-frames/frame-',
        sectionId: '#red-sequence',
        canvasId: 'red-canvas',
        images: [],
        obj: { frame: 0 }
    },
    {
        id: 'black',
        path: 'Koenigsegg-car-black-frames/frame-',
        sectionId: '#black-sequence',
        canvasId: 'black-canvas',
        images: [],
        obj: { frame: 0 }
    }
];

// Setup sequences
const totalFrames = frameCount * sequences.length;
let framesLoaded = 0;
const loader = document.getElementById('loader');
const loaderBar = document.querySelector('.loader-bar');
const loaderPercentage = document.querySelector('.loader-percentage');

sequences.forEach(seq => {
    const canvas = document.getElementById(seq.canvasId);
    if (!canvas) return;
    
    const context = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const render = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const img = seq.images[seq.obj.frame];
        if (img && img.complete) {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
    };

    // Load images
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.onload = () => {
            framesLoaded++;
            if(loaderBar) loaderBar.style.width = `${(framesLoaded / totalFrames) * 100}%`;
            if(loaderPercentage) loaderPercentage.innerText = `${Math.round((framesLoaded / totalFrames) * 100)}%`;

            if (framesLoaded === totalFrames) {
                // Try to play audio just in case autoplay fails
                const bgMusic = document.getElementById('bg-music');
                if (bgMusic) {
                    bgMusic.play().catch(e => console.log('Autoplay blocked by browser:', e));
                }

                // All loaded, fade out loader
                gsap.to(loader, {
                    opacity: 0,
                    duration: 1.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        loader.style.display = 'none';
                        lenis.start();
                        
                        // Animate Hero Text
                        gsap.fromTo('.hero-title, .hero-desc, .hero-actions, .hero-label', 
                            { y: 50, opacity: 0 },
                            { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "power3.out" }
                        );
                    }
                });
            }
        };
        img.src = `${seq.path}${(i + 1).toString().padStart(4, '0')}.jpg`;
        seq.images.push(img);
    }

    // Render first frame when loaded
    seq.images[0].addEventListener('load', render);

    // Setup GSAP ScrollTrigger for the sequence
    gsap.to(seq.obj, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: seq.sectionId,
            start: "top top",
            end: "bottom bottom", // Scrubs through the 300vh height
            scrub: 0.5,
            onUpdate: render
        }
    });

    // Fade in text overlay early in the sequence
    const content = document.querySelector(`${seq.sectionId} .seq-content`);
    if (content) {
        gsap.to(content, {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
                trigger: seq.sectionId,
                start: "0% top",
                end: "10% top",
                scrub: true
            }
        });
        
        // Fade out text overlay very quickly so user can see frames without text
        gsap.to(content, {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
                trigger: seq.sectionId,
                start: "20% top",
                end: "30% top",
                scrub: true
            }
        });
    }
});


// Parallax for generic panel backgrounds
gsap.utils.toArray('.collection-bg, .final-bg, .eng-visualization').forEach(bg => {
    gsap.to(bg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
            trigger: bg.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    })
})

// Text reveal animations
const titles = gsap.utils.toArray('.tech-title, .final-title')
titles.forEach(title => {
    gsap.from(title, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: title,
            start: 'top 85%',
        }
    })
})

// Performance Counters
const counters = document.querySelectorAll('.counter')
counters.forEach(counter => {
    const target = +counter.getAttribute('data-target')
    
    gsap.to(counter, {
        innerHTML: target,
        duration: 2,
        ease: 'power2.out',
        snap: { innerHTML: 1 },
        scrollTrigger: {
            trigger: '#performance',
            start: 'top 75%'
        }
    })
})

// Horizontal Scroll Gallery with Parallax
const scrollContainer = document.querySelector('.horizontal-scroll-container');
if (scrollContainer) {
    const totalScroll = scrollContainer.scrollWidth - window.innerWidth;
    
    gsap.to(scrollContainer, {
        x: () => -totalScroll,
        ease: "none",
        scrollTrigger: {
            trigger: ".horizontal-scroll-wrapper",
            pin: true,
            scrub: 1,
            end: () => "+=" + totalScroll
        }
    });

    // Image Parallax Effect
    gsap.utils.toArray('.parallax-img').forEach(img => {
        gsap.to(img, {
            x: '15%',
            ease: "none",
            scrollTrigger: {
                trigger: ".horizontal-scroll-wrapper",
                scrub: 1,
                end: () => "+=" + totalScroll
            }
        });
    });
}

// Magnetic Buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(this, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    btn.addEventListener('mouseleave', function() {
        gsap.to(this, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// Performance Modal Logic
const modal = document.getElementById('performance-modal');
const closeBtn = document.querySelector('.close-modal');
const modalBg = document.querySelector('.modal-bg');

function openModal() {
    modal.classList.add('active');
    lenis.stop(); // Prevent scrolling while modal is open
    // Animate bars
    setTimeout(() => {
        document.querySelectorAll('.bar-fill').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
        });
    }, 100);
}

function closeModal() {
    modal.classList.remove('active');
    lenis.start();
    // Reset bars
    document.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = '0';
    });
}

document.querySelectorAll('.btn:contains("PERFORMANCE"), .btn:contains("EXPLORE")').forEach(btn => {
    btn.addEventListener('click', openModal);
});

// Since :contains isn't standard, bind manually to secondary btn
const viewPerfBtn = document.querySelector('.hero-actions .secondary');
if (viewPerfBtn) viewPerfBtn.addEventListener('click', openModal);

if(closeBtn) closeBtn.addEventListener('click', closeModal);
if(modalBg) modalBg.addEventListener('click', closeModal);

// Sound Toggle Logic
const soundToggle = document.getElementById('sound-toggle');
const bgMusic = document.getElementById('bg-music');
let isMuted = false;

if (soundToggle && bgMusic) {
    soundToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        bgMusic.muted = isMuted;
        soundToggle.style.opacity = isMuted ? '0.5' : '1';
        
        if(isMuted) {
            soundToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M23 9l-6 6"></path><path d="M17 9l6 6"></path></svg>';
        } else {
            soundToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
        }
    });
}

// Fullscreen Menu Logic
const fullMenu = document.getElementById('full-menu');
const menuBtn = document.getElementById('menu-btn');
const closeMenuBtn = document.querySelector('.close-menu');
const menuLinks = document.querySelectorAll('.menu-link');

function openFullMenu() {
    fullMenu.classList.add('active');
    lenis.stop();
    gsap.fromTo(menuLinks, 
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.2 }
    );
}

function closeFullMenu() {
    fullMenu.classList.remove('active');
    lenis.start();
}

if(menuBtn) menuBtn.addEventListener('click', (e) => { e.preventDefault(); openFullMenu(); });
if(closeMenuBtn) closeMenuBtn.addEventListener('click', closeFullMenu);

menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        closeFullMenu();
        setTimeout(() => {
            lenis.scrollTo(targetId, { duration: 2, ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        }, 500);
    });
});
