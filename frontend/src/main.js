// src/main.js
import './style.css'

// ====================================================================
// === MAIN JAVASCRIPT LOGIC
// ====================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins (removed SplitText dependency)
  gsap.registerPlugin(ScrollTrigger);
  
  // Initialize systems
  initCursor();
  initLenis();
  
  // Start the loader animation
  const loaderTl = initLoaderKauStyle();
  
  // Init navigation active states
  initActiveNavigation();
  
  // Init scroll animations for sections
  initScrollAnimations();
  
  // Chain hero animations to run after loader
  loaderTl.then(initHeroAnimations);
  
  // Play the loader sequence
  loaderTl.play();
});

// --- Custom Cursor ---
function initCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  if(!cursorDot || !cursorOutline) return;

  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: 'forwards' });
  });

  // Hover effects
  const interactiveElements = document.querySelectorAll('a, button, .btn, .media-content, .tech-item, .rl-concept');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.style.width = '60px';
      cursorOutline.style.height = '60px';
      cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
      cursorOutline.style.width = '40px';
      cursorOutline.style.height = '40px';
      cursorOutline.style.backgroundColor = 'transparent';
    });
  });
}

// --- Lenis Smooth Scroll ---
function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time)=>{
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Make anchor links work with Lenis
  document.querySelectorAll('a[href^="#"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const href = el.getAttribute("href");
      const target = document.querySelector(href);
      if(target) {
        lenis.scrollTo(target);
      }
    });
  });
}

// --- Active Navigation ---
function initActiveNavigation() {
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('nav a');

  function updateActiveLink() {
    let current = 'project'; 
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 300) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); 
}

// --- Loader Animation ---
function initLoaderKauStyle() { 
  const tl = gsap.timeline();
  const percentageEl = document.querySelector('.loading__percentage');
  
  // Initial States
  tl.set(".loading-container", { autoAlpha: 1 })
    .set([".loading__border-top", ".loading__border-right", ".loading__border-bottom", ".loading__border-left"], 
         { scaleX: 0, scaleY: 0 })
    .set(percentageEl, { textContent: "0" })
    .set(".loading-screen", { scale: 0.9, autoAlpha: 0 });

  // Fade in loading text
  tl.to(".loading-screen", { scale: 1, autoAlpha: 1, duration: 0.8, ease: "power2.out" });

  const loadingDuration = 2.5;

  // Animate Borders
  tl.to([".loading__border-top", ".loading__border-right", ".loading__border-bottom", ".loading__border-left"], {
    keyframes: [
      { scaleX: 0.25, scaleY: 0.25, duration: loadingDuration * 0.25 },
      { scaleX: 0.5, scaleY: 0.5, duration: loadingDuration * 0.25 },
      { scaleX: 0.75, scaleY: 0.75, duration: loadingDuration * 0.25 },
      { scaleX: 1, scaleY: 1, duration: loadingDuration * 0.25 }
    ],
    ease: "power2.inOut"
  }, 0);

  // Animate Percentage
  tl.to(percentageEl, {
    textContent: 100,
    duration: loadingDuration,
    snap: { textContent: 1 },
    ease: "none"
  }, 0);

  // Exit Animation
  tl.to(".loading-screen", {
    scale: 1.1,
    autoAlpha: 0,
    duration: 0.5,
    ease: "power2.in"
  })
  .to(".loading-container", {
    yPercent: -100,
    duration: 0.8,
    ease: "power2.inOut"
  }, "-=0.2");

  return tl;
}

// --- Scroll Animations ---
function initScrollAnimations() {
  // Select all sections except Hero
  const animatedSections = document.querySelectorAll('.content-section:not(.hero-section)');
  
  animatedSections.forEach((section) => {
    // 1. Headings (Simple Fade In instead of SplitText)
    const heading = section.querySelector(".animated-heading");
    if (heading) {
      gsap.fromTo(heading, 
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out"
        }
      );
    }

    // 2. Fade In Elements
    const fades = section.querySelectorAll(".fade-in");
    if(fades.length > 0) {
      gsap.to(fades, {
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });
    }
  });
}

// --- Hero Animation ---
function initHeroAnimations() {
  const heroTl = gsap.timeline();
  
  const title = document.querySelector(".hero-title");
  if(title) {
    // Replaced SplitText with a simple scale/fade animation
    // This is safer and doesn't require premium plugins
    heroTl.fromTo(title, 
      { y: 50, opacity: 0, scale: 0.95 }, 
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 1.2,
        ease: "power4.out"
      }
    );
  }

  const heroFades = document.querySelectorAll(".hero-section .fade-in");
  if(heroFades.length > 0) {
    heroTl.to(heroFades, {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.8");
  }
}