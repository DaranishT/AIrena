// src/main.js
import './style.css'

// ====================================================================
// === YOUR UI ENHANCEMENT CODE
// ====================================================================

/**
 * Initializes Lenis for smooth scrolling
 */
function initLenis() {
  const lenis = new Lenis();
  // Make Lenis work with GSAP's ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time)=>{
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

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

/**
 * Updates active navigation link based on scroll position
 */
function initActiveNavigation() {
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('nav a');

  function updateActiveLink() {
    let current = 'project'; // Default to 'project'
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      // 200px offset to trigger link change a bit early
      if (window.scrollY >= sectionTop - 200) {
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
  updateActiveLink(); // Initial check
}

/**
 * Initializes the custom "difference" cursor
 */
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    left: 0px;
    top: 0px;
    width: 75px;
    height: 75px;
    border: 1px solid #fff;
    border-radius: 50%;
    pointer-events: none;
    mix-blend-mode: difference;
    z-index: 9999;
    display: none;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease;
  `;
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  const speed = 0.1;
  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
      cursor.style.display = 'block';
      mouseX = e.clientX;
      mouseY = e.clientY;
    } else {
      cursor.style.display = 'none';
    }
  });
  function updateCursor() {
    if (cursor.style.display !== 'none') {
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Apply cursor interactions
  document.querySelectorAll('a, button, .btn, nav a, .logo a, .logo p, canvas').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '15px';
      cursor.style.height = '15px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '75px';
      cursor.style.height = '75px';
    });
  });
}

/**
 * Loading animation with full border fill synced with percentage
 */
function initLoaderKauStyle() { 
  // Create a main timeline
  const tl = gsap.timeline();
  // Get the percentage element
  const percentageEl = document.querySelector('.loading__percentage');
  
  // STARTING STATE - Hide everything initially
  tl.set(".loading-container", { autoAlpha: 1 })
    .set([
      ".loading__border-top", 
      ".loading__border-right", 
      ".loading__border-bottom", 
      ".loading__border-left"
    ], { 
      scaleX: 0, 
      scaleY: 0 
    })
    .set(".loading__percentage", { textContent: "0" })
    .set(".loading-screen", { scale: 0.9, autoAlpha: 0 });

  // Fade in the loading content
  tl.to(".loading-screen", { 
    scale: 1, 
    autoAlpha: 1, 
    duration: 0.8, 
    ease: "power2.out" 
  });

  // Animate all borders simultaneously with percentage
  const loadingDuration = 3; // Total loading duration in seconds
  
  // Animate borders to fill based on percentage
  tl.to([
    ".loading__border-top", 
    ".loading__border-right", 
    ".loading__border-bottom", 
    ".loading__border-left"
  ], {
    keyframes: [
      { scaleX: 0.25, scaleY: 0.25, duration: loadingDuration * 0.25 },
      { scaleX: 0.5, scaleY: 0.5, duration: loadingDuration * 0.25 },
      { scaleX: 0.75, scaleY: 0.75, duration: loadingDuration * 0.25 },
      { scaleX: 1, scaleY: 1, duration: loadingDuration * 0.25 }
    ],
    ease: "power2.inOut"
  }, 0);

  // Update percentage counter in sync with borders
  tl.to(percentageEl, {
    textContent: 100,
    duration: loadingDuration,
    snap: { textContent: 1 },
    modifiers: {
      textContent: function(value) {
        return Math.round(value) + "";
      }
    },
    ease: "none"
  }, 0);

  // Add a subtle pulse animation to the percentage
  tl.to(percentageEl, {
    scale: 1.05,
    duration: 0.2,
    repeat: 3,
    yoyo: true,
    ease: "power2.inOut"
  }, `+=0.3`);

  // EXIT ANIMATION
  tl.to(".loading-screen", {
    scale: 1.1,
    autoAlpha: 0,
    duration: 0.6,
    ease: "power2.in"
  })
  .to(".loading-container", {
    autoAlpha: 0,
    duration: 0.4,
    ease: "power2.in"
  }, "-=0.3")
  .set(".loading-container", { display: "none" });

  // Return the timeline so we can chain animations
  return tl;
}

/**
 * Finds and animates all elements with .animated-heading or .fade-in
 * --- MODIFIED to exclude hero section ---
 */
function initScrollAnimations() {
  // Animate elements in each section *except* the hero
  document.querySelectorAll('.content-section:not(.hero-section)').forEach((section) => {
    
    // 1. Animate Headings (word by word)
    const headings = section.querySelectorAll(".animated-heading");
    if (headings.length > 0) {
      let mySplitText = new SplitText(headings, { type: "words, chars" });
      let chars = mySplitText.chars;

      gsap.set(headings, { visibility: "visible" });
      gsap.set(chars, { autoAlpha: 0, y: 20 });

      gsap.to(chars, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.02,
        ease: "power2.out",
        scrollTrigger: {
            trigger: section, 
            start: "top 70%", 
            toggleActions: "play none none none"
        }
      });
    }

    // 2. Animate Simple Fade-ins
    const elementsToFade = section.querySelectorAll(".fade-in");
    if (elementsToFade.length > 0) {
      gsap.to(elementsToFade, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: section, 
            start: "top 70%",
            toggleActions: "play none none none"
        }
      });
    }
  });
}

/**
 * === NEW FUNCTION TO ANIMATE HERO ===
 * Animates the hero title, subtitle, and buttons after the loader.
 */
function initHeroAnimations() {
  const heroTl = gsap.timeline();
  
  // 1. Animate Hero Title
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    let mySplitText = new SplitText(heroTitle, { type: "words, chars" });
    let chars = mySplitText.chars;
    gsap.set(heroTitle, { visibility: "visible" });
    heroTl.to(chars, { 
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.02,
      ease: "power2.out"
    });
  }

  // 2. Animate Subtitle and Buttons (fade in)
  // We select *only* the fade-in elements in the hero section
  const heroFades = document.querySelectorAll(".hero-section .fade-in");
  if (heroFades.length > 0) {
     // Manually set them to their "before" state
     gsap.set(heroFades, { autoAlpha: 0, y: 20 });
     
     heroTl.to(heroFades, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
     }, "-=0.5"); // Overlap with title
  }
}

// === INITIALIZE EVERYTHING ONCE THE PAGE LOADS ===
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  initLenis();
  initCustomCursor();
  
  // Run the loader and get its timeline
  const loaderTl = initLoaderKauStyle();
  
  initActiveNavigation();
  
  // Set up scroll animations for *other* sections
  initScrollAnimations(); 
  
  // Chain the hero animations to the *end* of the loader
  loaderTl.then(initHeroAnimations);

  // Play the loader
  loaderTl.play(); 
});